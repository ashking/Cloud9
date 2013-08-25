CFLAGS	=-Wall -Wextra
LDFLAGS	=

BUILDTYPE	?= Release

ifeq ($(BUILDTYPE),Release)
	CFLAGS	+= -Os
	LDFLAGS	+= -s
else
	CFLAGS	+= -O0 -g
endif

B = out/$(BUILDTYPE)

.PHONY:	all clean

all:	$(B)/watcher

clean:
	@rm -fr out/

$(B)/watcher:	watcher.c
	@mkdir -p $(B)
	$(CC) $(CFLAGS) -o $@ $^ $(LDFLAGS)
