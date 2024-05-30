#!/bin/bash
# creating the envars.sh file

mkdir ~/secure # Make a directory for storing secure data
chmod 700 ~/secure # Make the directory only accessible by the logged in user
touch ~/secure/envars.sh # create a file for storing the environment variable
chmod +x ~/secure/envars.sh # make the file executable