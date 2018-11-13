#!/bin/bash
#Call Nmap Scan
target=$1
path="/tmp/nmapSheep1.txt"
nmap -v --reason -oG $path -p- $target

#Parse Output
NMAP_FILE=$path
egrep -v "^#|Status: Up" $NMAP_FILE | cut -d' ' -f2 -f4- | \
sed -n -e 's/Ignored.*//p' | \
awk -F, '{split($0,a," "); printf "Host: %s*%d\n" , a[1], NF}' \
| sort -k 5 -g 
#Maybe get rid of sort?
