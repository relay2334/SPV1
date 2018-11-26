#!/bin/bash
#Call Airodump
interface=$1
OUT_FILE=/tmp/airout.#FORMAT
airodump-ng -i $interface -oC $OUT_FILE 

https://www.cyberciti.biz/faq/unix-linux-bash-read-comma-separated-cvsfile/
#Parse Output
INPUT=data.cvs
OLDIFS=$IFS
IFS=,
[ ! -f $INPUT ] && { echo "$INPUT file not found"; exit 99; }
while read flname dob ssn tel status
do
	echo "Name : $flname"
	echo "DOB : $dob"
	echo "SSN : $ssn"
	echo "Telephone : $tel"
	echo "Status : $status"
done < $INPUT
IFS=$OLDIFS
