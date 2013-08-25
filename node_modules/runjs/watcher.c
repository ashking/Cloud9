
#include <errno.h>
#include <fcntl.h>
#include <netdb.h>
#include <signal.h>
#include <stdarg.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include <sys/select.h>
#include <sys/socket.h>
#include <sys/time.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>
#include <time.h>

/* Kill the process when it doesn't output anything on its stdout for more */
/* than N seconds. */
#define READ_TIMEOUT 10

/* Make sure at least N seconds elapse before restarting a process. */
#define RESPAWN_MIN_INTERVAL 10

/* When fork() fails, retry after N seconds. */
#define FORK_RETRY_INTERVAL 10

/* the maximum number of log fds */
#define MAX_LOG_FDS 8

/* Errors and output of the child process are written to these FDs. */
static int num_log_fds = 0;
static int log_fds[MAX_LOG_FDS];

/* The PIDs of monitor and child processes are written to these FDs. */
int mon_pid_fd = -1, child_pid_fd = -1;

static int err_pipe_fds[2] = { -1, -1 };
static int alive_fd = -1;

/* Until the root process exits, errors are also sent to err_fd. */
static int err_fd = STDERR_FILENO;

/* The command that the user specified */
static char* const* command = NULL;

/* Whether setsid() should be called or not. */
static int no_setsid = 0;

/* This is nonzero if a SIGCHLD signal is caught. */
static volatile sig_atomic_t child_exited = 0;


/* Sets the CLOEXEC flag on a file descriptor. Returns 0 on success, and -1 */
/* on failure. */
static int set_cloexec(int fd) {
  int flags;

  if ((flags = fcntl(fd, F_GETFD)) < 0)
    return -1;

  flags |= FD_CLOEXEC;

  if (fcntl(fd, F_SETFD, flags) < 0)
    return -1;

  return 0;
}


/* Writes a number of characters to all the log FDs and the err_fd. */
static int logwrite(const char* message, int count) {
  int rv = 0, i;
  for (i = 0; i < num_log_fds; i++) {
    if (write(log_fds[i], message, count) < 0)
      rv = -1;
  }
  return rv;
}


static int errwrite(const char* message, int count) {
  if (err_fd >= 0)
    return write(err_fd, message, count);
  return 0;
}


#define SPRINTF_TO_BUF                                  \
    char buf[1024];                                     \
    int count;                                          \
    va_list argp;                                       \
                                                        \
    va_start(argp, format);                             \
    count = vsnprintf(buf, sizeof buf, format, argp);   \
    va_end(argp);                                       \
                                                        \
    if (count <= 0)                                     \
      return -1;


/* Like fprintf, but writes to all the log FDs. */
static int logprintf(char* format, ...) {
  SPRINTF_TO_BUF
  return logwrite(buf, count);
}


/* Like fprintf, but writes to all the log FDs. */
static int errprintf(const char* format, ...) {
  SPRINTF_TO_BUF
  int rv = 0;
  if (logwrite(buf, count) < 0)
    rv = -1;
  if (errwrite(buf, count) < 0)
    rv = -1;
  return rv;
}


/* Like fprintf, but takes a file descriptor instead of a FILE struct. */
static int fdprintf(int fd, const char* format, ...) {
  SPRINTF_TO_BUF
  return write(fd, buf, count);
}


/* Exits the process due to a fatal error. Prints a custom message and an */
/* error message describing the current value of `errno`. */
static void fatal_error(const char* syscall) {
  char* errmsg = strerror(errno);
  errprintf("Error: (%s) %s\n", syscall, errmsg);
  exit(1);
}


static int write_pid_file(int fd, int pid) {
  char buf[33];
  int rv = 0;
  int count;

  count = snprintf(buf, sizeof buf, "%d", pid);
  if (count < 0)
    return -1;
  if (lseek(fd, 0, SEEK_SET) < 0)
    rv = -1;
  if (ftruncate(fd, 0) < 0)
    rv = -1;
  if (write(fd, buf, count) < 0)
    rv = -1;

  return rv;
}


static void invalid_args(void) {
  fdprintf(err_fd,
           "\n"
           "Usage: watcher [options] [--] command\n"
           "\n"
           "Options:\n"
           "\n"
           "  -f <file>             Log diagnostic output to the specified file.\n"
           "                        It is possible to specify -f multiple times.\n"
           "\n"
           "  -u [<host>:]<port>    Send diagnostic output to an UDP endpoint.\n"
           "                        If <host> is not specified, the loopback address will be used.\n"
           "                        It is possible to specify -u multiple times.\n"
           "\n"
           "  -cp <file>            Write the child pid to the specified file.\n"
           "\n"
           "  -mp <file>            Write the monitor pid to the specified file.\n"
           "\n"
           "  --no-setsid           Do not make the monitor process session leader.\n"
           "\n");
  exit(1);
}


static void sigchld_handler(int signal) {
  child_exited = ~0;
  (void) signal;
}

static void block_sigchld(void) {
  sigset_t s;
  sigemptyset(&s);
  sigaddset(&s, SIGUSR1);
  sigprocmask(SIG_BLOCK, &s, NULL);
}


static ssize_t atomic_recv(int fd,
                           void *buf,
                           size_t size,
                           volatile sig_atomic_t* flag) {
  sigset_t sigmask;
  fd_set readfds;
  struct timespec timeout;
  int r;

  /* Unblock SIGCHLD for the duration of the pselect() syscall. */
  sigprocmask(SIG_BLOCK, NULL, &sigmask);
  sigdelset(&sigmask, SIGCHLD);
  FD_ZERO(&readfds);
  FD_SET(fd, &readfds);

  memset(&timeout, 0, sizeof timeout);
  timeout.tv_sec = READ_TIMEOUT;

  r = pselect(fd + 1, &readfds, NULL, NULL, &timeout, &sigmask);

  if (r == -1) {
    /* If the syscall got interrupted by a signal and the signal flag is set,
     * it means we received an expected signal. Otherwise, it's an error.
     */
    if (errno == EINTR && flag && *flag)
      return 0;
    else
      return r;
  }

  if (r == 0) {
    /* Timeout. */
    return 0;
  }

  /* Safe to call now. We know there's pending data so the call won't block. */
  return recv(fd, buf, size, 0);
}


static int run_child(int is_first_attempt) {
  signal(SIGPIPE, SIG_DFL);
  signal(SIGCHLD, SIG_DFL);

  logprintf("Starting `%s` (first time: %s)\n", command[0], is_first_attempt ? "yes" : "no");

  execvp(command[0], command);

  /* If we get here, execvp() failed. */
  if (is_first_attempt) {
    errprintf("Error: (execvp) %s\n", strerror(errno));
    return 0;
  } else {
    fatal_error("execvp");
    return -0x7f;
  }
}


static int run_monitor(void) {
  pid_t child_pid;
  struct sigaction chld_action;
  int old_err_fd;
  int r;

  logprintf("Setting up monitor process\n");

  /* Use the monitor end of err_pipe_fds as the new err_fd. */
  old_err_fd = err_fd;
  err_fd = err_pipe_fds[1];

  /* Write the pid file for the monitor process. */
  if (mon_pid_fd >= 0 && write_pid_file(mon_pid_fd, getpid()) < 0)
    fatal_error("write_pid_file");

  /* Close the root process end of the err pipe, and the original err_fd. */
  if (close(err_pipe_fds[0]) < 0)
    fatal_error("close");
  if (close(old_err_fd) < 0)
    fatal_error("close");
  if (mon_pid_fd >= 0 && close(mon_pid_fd) < 0)
    fatal_error("close");

  /* Make the monitor daemon session group leader. This can fail only if */
  /* this process already is the session group leader, so ignore any error. */
  if (!no_setsid)
    setsid();

  /* Install a SIGCHLD handler. It should not restart any syscalls. */
  child_exited = 0;
  chld_action.sa_handler = sigchld_handler;
  sigemptyset (&chld_action.sa_mask);
  chld_action.sa_flags = SA_NOCLDSTOP;
  sigaction(SIGCHLD, &chld_action, NULL);

  /* Block sigchld, or it could interrupt syscalls. It will be unblocked */
  /* just before recv() is called. */
  block_sigchld();

  logprintf("Forking the child process (first time: yes)\n");

  /* Try to spawn for the first time. */
  child_pid = fork();
  if (child_pid < 0) {
    fatal_error("fork");
  } else if (child_pid == 0) {
    return run_child(1);
  }

  time_t last_start_time = time(NULL);

  logprintf("Forked the child process. (PID: %d)\n", child_pid);
  if (child_pid_fd >= 0 && write_pid_file(child_pid_fd, child_pid) < 0) {
    kill(child_pid, SIGKILL);
    fatal_error("write_pid_file");
  }

  r = close(err_fd);

  /* Ignore EINTR. close() is interruptible but a retry will fail with EBADF. */
  if (r == -1 && errno != EINTR) {
    kill(child_pid, SIGKILL);
    fatal_error("close");
  }
  err_fd = -1;

  /* Run the main probe loop. */
  for (;;) {
    char buf[512];
    int r, status, did_kill, need_newline;

    logprintf("Start reading output from `%s`.\n", command[0]);

    need_newline = 0;
    do {
      /* recv() that unblocks SIGCHLD atomically. */
      r = atomic_recv(alive_fd, buf, sizeof buf, &child_exited);

      /* Output whatever data was read to the log. */
      if (r > 0) {
        logwrite(buf, r);
        need_newline = (buf[r - 1] != '\n');
      }
    } while (r > 0 && !child_exited);

    /* If the last pipe data didn't end with a newline, add one. */
    if (need_newline) {
      logwrite("\n", 1);
    }

    if (!child_exited) {
      logprintf("`%s` did not output anything for more than %d seconds. It's being killed.", command[0], READ_TIMEOUT);
      kill(child_pid, SIGKILL);
      did_kill = 1;
    } else {
      did_kill = 0;
    }

    do {
      r = waitpid(child_pid, &status, 0);
    } while (r == -1 && errno == EINTR);

    if (r == -1) {
      /* Major fuckup. Exit. */
      logprintf("waitpid() failed unexpectedly. The monitor process has been stopped.\n");
      return 1;
    }

    /* Check if the process actually exited with a good reason. */
    if (!did_kill &&
        (WIFSIGNALED(status) && (WTERMSIG(status) == SIGKILL ||
                                 WTERMSIG(status) == SIGINT ||
                                 WTERMSIG(status) == SIGHUP))) {
      logprintf("`%s` was signaled with SIGKILL, SIGINT or SIGHUP. It will not be restarted.\n", command[0]);
      return 0;
    } else if (!did_kill &&  WIFEXITED(status) && WEXITSTATUS(status) == 0) {
      logprintf("`%s` exited cleanly with exit code 0. It will not be restarted.\n", command[0]);
      return 0;
    } else if (WIFSIGNALED(status)) {
      logprintf("`%s` was killed with a signal. It will be restarted.\n", command[0]);
    } else if (WIFEXITED(status)) {
      logprintf("`%s` exited uncleanly with exit status %d. It will be restarted.\n", command[0], WEXITSTATUS(status));
    } else {
      logprintf("`%s` exited for an unknown reason. It will be restarted.\n", command[0]);
    }

    /* If the previous child process exited too quickly, wait. */
    time_t delta = time(NULL) - last_start_time;
    if (delta >= 0 && delta < RESPAWN_MIN_INTERVAL) {
      int respawn_after = RESPAWN_MIN_INTERVAL - delta;
      logprintf("`%s` exited too quickly. Waiting %d seconds before attempting respawn.\n", command[0], respawn_after);
      sleep(RESPAWN_MIN_INTERVAL - delta);
    } else {
      logprintf("`%s` exited after %u seconds.\n", command[0], (unsigned int) delta);
    }

    /* Restart the child process. */
    child_exited = 0;

    logprintf("Forking the child process (first time: no)\n");

    while ((child_pid = fork()) < 0) {
      /* On fork failure, retry after 10 seconds. */
      logprintf("fork() failed with error `%s`. Retrying after \n", RESPAWN_MIN_INTERVAL);
      sleep(FORK_RETRY_INTERVAL);
    }

    if (child_pid == 0) {
      return run_child(0);
    }

    last_start_time = time(NULL);

    logprintf("Forked the child process. (PID: %d)\n", child_pid);
    if (child_pid_fd >= 0)
      write_pid_file(child_pid_fd, child_pid);
  }
}


int main(int argc, char* const argv[]) {
  int null_fd;
  pid_t monitor_pid;
  int temp_fds[2];
  int i;

  /* Parse arguments. */
  for (i = 1; i < argc; i++) {
    const char* arg = argv[i];
    int len = strlen(arg);

    if (len == 0)
      continue;

    if (arg[0] == '-') {
      if (strcmp(arg, "--") == 0) {
        /* The command starts after this. */
        i++;
        break;

     } else if (strcmp(arg, "-u") == 0) {
        /* Log to UDP host:port */
        if (++i >= argc)
          invalid_args();
        if (num_log_fds >= MAX_LOG_FDS)
          invalid_args();

        /* Break up the next argument into a host and a port. They should */
        /* be separated by a colon. */
        char *address = strdup(argv[i]);
        char *colon = strchr(address, ':');
        const char *host = NULL, *port = NULL;

        if (colon) {
          *colon = '\0';
          host = address;
          port = colon + 1;
        } else {
          /* If no colon was specified, assume only a port was given. */
          host = "127.0.0.1";
          port = address;
        }

        struct addrinfo* addr;
        struct addrinfo hints;

        memset(&hints, 0, sizeof hints);
        hints.ai_family = AF_INET;
        hints.ai_socktype = SOCK_DGRAM;
        hints.ai_protocol = IPPROTO_UDP;

        int error = getaddrinfo(host, port, &hints, &addr);
        if (error != 0 || addr == NULL) {
          fdprintf(err_fd,
                   "Error: getaddrinfo lookup for %s failed (%s)\n",
                   argv[i],
                   gai_strerror(error));
          return 1;
        }

        int fd = socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP);
        if (fd < 0)
          fatal_error("socket");
        if (set_cloexec(fd))
          fatal_error("set_cloexec");

        if (connect(fd, addr->ai_addr, addr->ai_addrlen) < 0)
          fatal_error("connect");

        log_fds[num_log_fds++] = fd;

        freeaddrinfo(addr);

      } else if (strcmp(arg, "-f") == 0) {
        /* Log to file */
        int fd;
        if (++i >= argc)
          invalid_args();
        if (num_log_fds >= MAX_LOG_FDS)
          invalid_args();

        if ((fd = open(argv[i], O_CREAT | O_APPEND | O_WRONLY, 0660)) < 0)
          fatal_error("open");
        if (set_cloexec(fd))
          fatal_error("set_cloexec");

        log_fds[num_log_fds++] = fd;

      } else if (strcmp(arg, "-mp") == 0) {
        /* Write monitor pid to file <file> */
        if (++i >= argc)
          invalid_args();
        if (mon_pid_fd != -1)
          invalid_args();

        if ((mon_pid_fd = open(argv[i], O_CREAT | O_TRUNC | O_WRONLY, 0660)) < 0)
          fatal_error("open");
        if (set_cloexec(mon_pid_fd))
          fatal_error("set_cloexec");

      } else if (strcmp(arg, "-cp") == 0) {
        /* Write child PIDs to file <file> */
        if (++i >= argc)
          invalid_args();
        if (child_pid_fd != -1)
          invalid_args();

        if ((child_pid_fd = open(argv[i], O_CREAT | O_TRUNC | O_WRONLY, 0660)) < 0)
          fatal_error("open");
        if (set_cloexec(child_pid_fd))
          fatal_error("set_cloexec");

      } else if (strcmp(arg, "--no-setsid") == 0) {
        /* Disable setsid */
        no_setsid = 1;

      } else {
        invalid_args();
      }
    } else {
      /* Anything that doesn't start with a dash is assumed to be the command. */
      break;
    }
  }

  /* Get the command out of there. */
  if (i >= argc) {
    invalid_args();
  }

  command = &argv[i];

  /* Make sure we don't get blown up by SIGPIPE. */
  signal(SIGPIPE, SIG_IGN);

  /* Duplicate stderr so we can replace the original STDERR_FILENO. */
  err_fd = dup(err_fd);
  if (err_fd < 0)
    fatal_error("dup");
  if (set_cloexec(err_fd) < 0)
    fatal_error("set_cloexec");

  /* Dup /dev/null to stdin */
  null_fd = open("/dev/null", O_RDWR);
  if (null_fd < 0)
    fatal_error("open");
  if (dup2(null_fd, STDIN_FILENO) < 0)
    fatal_error("dup2");
  if (close(null_fd) < 0)
    fatal_error("close");

  /* Create a socket pair that will be supplied to the child process. The */
  /* child process is supposed to write something to its stderr at least once */
  /* every second, or it will be killed and restarted. */
  if (socketpair(AF_UNIX, SOCK_STREAM, 0, temp_fds) < 0)
    fatal_error("socketpair");
  if (set_cloexec(temp_fds[0]) < 0)
    fatal_error("set_cloexec");
  if (dup2(temp_fds[1], STDOUT_FILENO) < 0)
    fatal_error("dup2");
  if (dup2(temp_fds[1], STDERR_FILENO) < 0)
    fatal_error("dup2");
  if (close(temp_fds[1]) < 0)
    fatal_error("close");
  alive_fd = temp_fds[0];

  /* Create a pipe that the forks will use to write errors to. The root */
  /* process will wait until the pipe breaks. If no output appears on the */
  /* end of the err pipe and the pipe breaks, the root process knows that */
  /* execvp() succeeded at least once and the monitor is now running. */
  if (pipe(err_pipe_fds) < 0)
    fatal_error("pipe");
  if (set_cloexec(err_pipe_fds[1]) < 0 || set_cloexec(err_pipe_fds[0]) < 0)
    fatal_error("set_cloexec");

  logprintf("Forking monitor process\n");

  /* Fork for the first time. This splits off the root process from the */
  /* monitor daemon. */
  monitor_pid = fork();
  if (monitor_pid < 0) {
    /* Fork failure. */
    fatal_error("fork");

  } else if (monitor_pid == 0) {
    /* Monitor daemon. */
    return run_monitor();
  }

  logprintf("Forked the monitor process. (PID: %d)\n", monitor_pid);

  /* Root process. */
  int r, had_error;
  char buf[512];

  /* We are the main process. Close the monitor end of the pipe. */
  if (close(err_pipe_fds[1]) < 0)
    fatal_error("close");

  /* Wait for the monitor process to close its end of the pipe. It will be */
  /* reported by read() returning 0 or EPIPE. If the monitor wrote anything */
  /* to it, an error must have happened. */
  had_error = 0;
  do {
    r = read(err_pipe_fds[0], buf, sizeof buf);
    if (r > 0) {
      had_error = 1;
      errwrite(buf, r);
    }
  } while (r > 0);

  if (r < 0 && errno != EPIPE)
    fatal_error("read");

  if (had_error) {
    errprintf("The monitor process encountered a problem, or it was unable "
              "to start the child process for the first time. The monitor "
              "is not running.\n");
    return 1;
  }

  /* Test if the monitor is still there. */
  if (kill(monitor_pid, 0) != 0) {
    errprintf("The monitor process did not start correctly.\n");
    return 1;
  }

  /* If we get here, the monitor daemon was started succesfully and it */
  /* successfully exec'ed once. */
  errprintf("The monitor was started (PID: %d), and `%s` was successfully started once.\n", monitor_pid, command[0]);
  return 0;
}
