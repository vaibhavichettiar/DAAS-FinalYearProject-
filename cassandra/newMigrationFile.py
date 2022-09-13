import sys
import os
import calendar;
import time;

gmt = time.gmtime()
ts = calendar.timegm(gmt)
path = "migrations/"
filename = path + str(ts) + "__" + sys.argv[1]
temp = open(filename+".cql",'w')
temp.close()
