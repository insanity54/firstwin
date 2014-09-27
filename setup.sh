#!/bin/bash

echo "Please enter your riot games app API key: "
echo "(obtained from https://developer.riotgames.com/)"
read apikey

echo -e "\
{\n
   \"RIOTKEY\": \"$apikey\"\n
}" > config.json

