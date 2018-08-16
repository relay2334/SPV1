# Wall of Sheep

## Introduction

This version of the "Wall of Sheep" is based off of Steve McGrath's DoFler (Dashboard Of Fail). The Dofler is Node.js front-end web server displaying data from multiple different network sniffing and analysis tools.

## Installation

Although you can enable and disable all tools from the config file, by default it uses the folllowing tools:

* ngrep
* ettercap 
* tshark
* driftnet

The DoFler Setup is also able to utilize Tenable's PVS via API calls, but it is disabled by default as it connects to a external service.

## Quick Start

Although the Wall of Sheep can be installed on most Linux systems, this tutorial will cover its installation on Ubuntu.

First install the primary tools used to gather information:

````
sudo apt-get install ngrep ettercap-text-only tshark
````
Installing driftnet is a more complicated. Instead of installing the version from your package manager, install driftnet from a different fork. You will need to build this version yourself from source using:

````
sudo apt-get install libpng-dev libjpeg-dev libgif-dev libpcap-dev build-essential
sudo /usr/src 
git clone https://github.com/bldewolf/driftnet.git 
cd driftnet 
nano Makefile 
# You will want to look for the "-DNO_DISPLAY_WINDOW"
# cflag.  Uncomment this flag in the make file.
make 
cp driftnet /usr/local/bin;cp driftnet.1 /usr/local/share/man/man1
````


For the database backend, DoFler supports MySQL, and Postgres.  For the purposes of this guide, we will cover MariaDB on Ubuntu.

````
# Install the binaries
sudo apt-get install mariadb-client mariadb-server

# Run the initial conifguration 
mysql_secure_installation
# Create a new root password

# Create the database 
mysqladmin -uroot -p create dofler 
# When prompted enter the root password you created above

# Create the MySQL dofler user 
mysql -uroot -p
# When prompted enter the root password you created above
# Replace NEW_PASSWORD with the password for your dofler user
# By Default it is 'dofler' in the config file
> GRANT ALL PRIVILEGES ON dofler.* TO 'dofler'@'localhost' IDENTIFIED BY 'NEW_PASSWORD';
> exit 
````

I would recommend installing Node.js as root because the server will need to be run as root to capture packets. Install Node.js using the tutorial that Digital Ocean provides [HERE](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-an-ubuntu-14-04-server#how-to-install-using-nvm).

Once you have Node.JS installed and the pre-requisites, you simply need to download the repository and then run npm to install the needed libraries to get dofler into a runnable state.

````
cd /opt 
git clone https://github.com/electroman5/WallOfSheep.git
cd dofler 
npm install ./
````

As we are using MySQL/MariaDB, we do have to install the appropriate Node.JS database interface library.  To do so, we will do this: 

````
npm install mysql 
````

Lastly, change the config file located at config/default.json using:
````
sudo nano config/default.json
````
The values that need to be changed are:

* The Database URI: 

     Change ````"mysql://dofler:dofler@localhost/dofler"```` to ````"mysql://dofler:dofler@localhost/*Dofler Password*",````

* The Monitering interface:

    Change ````"interface": "eth1",```` to ````"interface": "*Monitering Interface*",````


At this point the server should be ready to run. Start the server using the commands:
````
./server.js 
````

You should see the console output of the network sniffers and web server starting. The default port the Wall of Sheep listens on is port 3000, so connect your browser to http://localhost:3000 and you should be good to go!

