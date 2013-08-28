# Cloud9 IDE

Cloud9 is an open source IDE built with [Node.JS](http://nodejs.org/) on the back-end and JavaScript/HTML5 on the client. The version available here includes all packages and runs on your local system.

For more information, [refer Cloud9's original authours](https://github.com/ajaxorg/cloud9) :-) 


## Installation and Usage

Requirements:

  * NodeJS `>= 0.6.16` but not more than `>0.7.xx` ;-)
  * NPM `>= 1.1.16`

Install:
Follow steps [gisted here](https://gist.github.com/ashwin-kumar/6333792)

Or

Follow the steps below:
#####Step 1:
Install latest updates on you machine. 

_Ubuntu_ or _Linux Mint_:
`sudo apt-get -y update`

_CentOS_ or _RHEL_ or _Fedora_: `sudo yum -y update`

#####Step 2:
Install package dependencies:

 _Ubuntu_ or _Linux Mint_: `sudo apt-get -y install libssl-dev git-core pkg-config pkgconfig build-essential curl gcc g++ libxml2-dev`
 
_CentOS_ or _RHEL_ or _Fedora_: `sudo yum -y install libssl-dev git-core pkg-config pkgconfig build-essential curl gcc g++ libxml2-dev`

#####Step 3:
Install nvm (Node version manager) and node v0.6.19

`git clone git://github.com/creationix/nvm.git ~/.nvm
echo '. ~/.nvm/nvm.sh' >> ~/.bashrc && . ~/.bashrc
nvm install v0.6.19
nvm use v0.6.19`

#####Step 4:
Clone Cloud9 Repo

`git clone git://github.com/ashwin-kumar/Cloud9.git ~/.cloud9`

#####Step 5:
Add alias to .bashrc ;-), a trick!!

`echo 'alias cloud9=~/.nvm/v0.6.19/bin/node ~/.cloud9/server.js -w' >> ~/.bashrc && . ~/.bashrc`

#####Step 6:
Install, if any, missing node modules

`cd ~/.cloud9 && npm install`

###and you are done... ;-) 


After installation, start IDE by running 

`cloud9 ./` in your project directory

Optionally, you may specify the directory you'd like to work on:

`cloud9 -w ~/git/workspace/myproject`

Well, Cloud9 will be started as a web server on port `-p 3131`, you can access it by
pointing your browser to: [http://localhost:3131](http://localhost:3131)

By default Cloud9 will only listen to localhost.
To listen to a different IP or hostname, use the `-l HOSTNAME` flag.
If you want to listen to all IP's:

`cloud9 -l 0.0.0.0`


If you are listening to all IPs it is adviced to add authentication to the IDE.
You can either do this by adding a reverse proxy in front of Cloud9,
or use the built in basic authentication through the `--username` and `--password` flags.

`cloud9 --username node --password express`

## Contributing
Cloud9 wouldn't be where it is now without contributions. Feel free to [fork and improve/enhance Cloud9](https://github.com/ajaxorg/cloud9) in any way your want. If you feel that the Cloud9 community will benefit from your changes, please open a pull request. 

#Happy coding ;-) 
P.S: Sharing this repo to make installing and using Cloud9 easy. I spent hours getting Cloud9 locally working on different machines. I have tested this working on Linux Mint, CentOS 6.3, and Ubuntu 12.04. If something is broken please create an issue and will try to work on it. 