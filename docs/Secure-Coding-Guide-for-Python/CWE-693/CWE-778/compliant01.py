""" Compliant Code Example """
 
import logging
 
try:
    result = 10 / 0
except ZeroDivisionError as e:
    logging.critical("Error occurred: Division by zero")
#Continues to execute