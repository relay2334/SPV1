#!/bin/bash
#Call Airodump
interface=$1
delay=$2
OUT_FILE=/tmp/airout
tmux new -d
tmux send -Rt 0 airodump-ng SPACE -w SPACE $OUT_FILE SPACE --output-format SPACE csv SPACE $interface ENTER
sleep $delay
tmux send -Rt 0 CONTROL C

#Parse Output
INPUT=/tmp/airout.csv
OLDIFS=$IFS
IFS=,
[ ! -f $INPUT ] && { echo "$INPUT file not found"; exit 99; }
while read bssid fs ls channel speed privacy cipher authentication pow beacons iv lip len essid key
do
	printf "%s*%s*%s*%s*%s*" $essid $authentication $bssid $channel $pow
done < $INPUT
printf "%s*%s*%s*%s*%s*" $essid $authentication $bssid $channel $pow

IFS=$OLDIFS
