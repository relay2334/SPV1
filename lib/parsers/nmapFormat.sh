#!/bin/bash
#Call Nmap Scan
target=$1
NMAP_FILE=/tmp/output.grep
nmap -v --reason -sV -oG $NMAP_FILE -T 5 -p- $target 

#Parse Output
egrep -v "^#|Status: Up" $NMAP_FILE | cut -d' ' -f2,4- | \
sed -n -e 's/Ignored.*//p' | \
awk -F, '{split($0,a," "); printf "%s*%d\n" , a[1], NF}' \
| sort -k 5 -g
