# Run.js

Run.js is a CLI tool that manages and daemonizes your node.js processes.
It monitors running applications, collects logs and makes sure they are always running.
Run.js is developed by and used on a production environment to monitor all services by [Cloud9 IDE](https://c9.io).

## First use

When using run.js, please use the [stable](https://github.com/c9/runjs/tree/stable) branch.

```sh
# clone the repo
$ git clone git://github.com/c9/runjs.git
# checkout stable branch
$ git checkout stable
# compile the binary on your platform
$ ./runjs

# link the runjs folder in your PATH or symlink in your own project folder
# $ ln -s $PWD/runjs /usr/local/bin/runjs
```

## Control your application

Runjs works with tag names, that you refer to in your commands.

```sh
# list all managed processes (+ state)
runjs

# start a node script
runjs start -t:TAGNAME /path/to/nodejs/file.js -other -command -line -options

# view logs
runjs tail TAGNAME

# restart process
runjs restart TAGNAME

# stop process
runjs stop TAGNAME

# panic, kill all runjs monitored processes
runjs panic
```