#!/bin/bash
source ~/secure/envars.sh # Set the environment variables for the current bash session
python3 compliant01.py # Run the script requiring the secured variable
rm ~/secure/envars.sh # Remove the file