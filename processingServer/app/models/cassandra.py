import os
import logging
from cassandra.io.libevreactor import LibevConnection
from cassandra.cluster import Cluster
from cassandra.policies import DCAwareRoundRobinPolicy
from cassandra.auth import PlainTextAuthProvider

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

KEYSPACE = "salesdata"
cassConn = None
class cassandraConnection:
    @staticmethod
    def initCassandraConnection():
        global cassConn
        if(cassConn == None):
            try :
                node_ips = [os.environ['CASSANDRA_HOST']]
                auth_provider = PlainTextAuthProvider(username='cassandra', password= os.environ['CASSANDRA_PASSWORD'])
                cluster = Cluster(node_ips, port = 9042, protocol_version=4, auth_provider=auth_provider)
                cassConn = cluster.connect()
                cassConn.execute(""" CREATE KEYSPACE IF NOT EXISTS %s WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 };
                """ % KEYSPACE)
                cassConn = cluster.connect(keyspace=KEYSPACE)
            except:
                logger.error("Not able to connect to cassandra server")

        
        return cassConn


