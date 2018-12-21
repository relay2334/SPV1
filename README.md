# Shepards Pi




## Introduction

Shepards Pi is a spin off of the Wall of Sheep project to create a localized wireless sniffing tool.

## Interface

The proper implementation of Shepards Pi is to connect the to the network you want to sniff over ethernet, sniff wireless networks with a external wireless adaptor and connect to the web interface through the hotspot created with the onboard card.

## Sniffing Tools

Although you can enable and disable all tools from the config file, by default it uses the folllowing tools:

* ngrep
* ettercap 
* tshark
* driftnet
* Airodump-ng

## Quick Start

Shepards Pi is built to be installed onto a Raspberry Pi for portable deployment, hence the name Shepards Pi. This will cover the installation process.

First install the primary tools used to gather information:

````
sudo apt-get install ngrep ettercap-text-only tshark aircrack-ng
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


For the database backend, Shepards Pi supports MySQL, and Postgres.  For the purposes of this guide, we will cover MariaDB.

````
# Install the binaries
sudo apt-get install mariadb-client mariadb-server

# Run the initial conifguration 
mysql_secure_installation
# Create a new root password

# Create the database 
mysqladmin -uroot -p create sheep 
# When prompted enter the root password you created above

# Create the MySQL sheep user 
mysql -uroot -p
# When prompted enter the root password you created above

# Replace NEW_PASSWORD with the password for your sheep user
# By Default it is 'sheep' in the config file
> GRANT ALL PRIVILEGES ON sheep.* TO 'sheep'@'localhost' IDENTIFIED BY 'NEW_PASSWORD';
> exit 
````

I would recommend installing Node.js as root because the server will need to be run as root to capture packets. Install Node.js using the tutorial that Digital Ocean provides [HERE](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-an-ubuntu-14-04-server#how-to-install-using-nvm).

Once you have Node.JS installed and the pre-requisites, you simply need to download the repository and then run npm to install the needed libraries to get Shepards Pi into a runnable state.

````
cd /opt 
git clone https://github.com/relay2334/ShepardsPi.git
cd ShepardsPi
npm install ./
chmod 777 lib/parsers/nmapFormat.sh
````

Install the appropriate Node.JS database interface library: 

````
npm install mysql 
````

Lastly, change the config file located at config/default.json using:
````
sudo nano config/default.json
````
The values that need to be changed are:

* The Database URI: 

     Change ````"mysql://sheep:sheep@localhost/sheep"```` to ````"mysql://sheep:sheep@localhost/*sheep_Password*",````

* The Monitering interface:

    Change ````"interface": "eth1",```` to ````"interface": "*Monitering Interface*",````


At this point the server should be ready to run. Start the server using the commands:
````
./server.js 
````

You should see the console output of the network sniffers and web server starting. The default port Shepards Pi listens on is port 3000, so connect your browser to http://localhost:3000 and you should be good to go!
