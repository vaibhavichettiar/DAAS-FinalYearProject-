import os

SECRET_KEY = os.urandom(32)

# Grabs the folder where the script runs.
basedir = os.path.abspath(os.path.dirname(__file__))

# Enable debug mode.
DEBUG = True

# Connect to the s3 database
AWS_ACCESS_KEY = 'AKIA6DPURG2BEWYV3L2Y'
AWS_SECRET_ACCESS_KEY = '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'