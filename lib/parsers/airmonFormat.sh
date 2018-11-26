#!/bin/bash
#Call Airodump
interface=$1
OUT_FILE=/tmp/airout
airodump-ng -w $OUT_FILE --output-format csv $interface

https://www.cyberciti.biz/faq/unix-linux-bash-read-comma-separated-cvsfile/
#Parse Output
INPUT=/tmp/airout.csv
OLDIFS=$IFS
IFS=,
[ ! -f $INPUT ] && { echo "$INPUT file not found"; exit 99; }
while read bssid fs ls channel speed privacy cipher authentication pow beacons iv lip len essid key
do
	printf "%s*%s*%s*%s*%s*" //ADD ARGS
done < $INPUT
	
IFS=$OLDIFS
