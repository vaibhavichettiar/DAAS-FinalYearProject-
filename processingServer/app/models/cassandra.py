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
        flag = True
        while flag:
            if(cassConn == None):
                try :
                    node_ips = [os.environ['CASSANDRA_HOST']]
                    auth_provider = PlainTextAuthProvider(username='cassandra', password= os.environ['CASSANDRA_PASSWORD'])
                    cluster = Cluster(node_ips, port = 9042, protocol_version=4, auth_provider=auth_provider)
                    cassConn = cluster.connect()
                    cassConn.execute(""" CREATE KEYSPACE IF NOT EXISTS %s WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 };
                    """ % KEYSPACE)
                    cassConn = cluster.connect(keyspace=KEYSPACE)
                    cassandraConnection.createTable(cassandraConnection.generateProcessingTableQuery())
                    cassandraConnection.createTable(cassandraConnection.generateModelingTableQuery())
                    flag = False
                except Exception as Argument:
                    logger.error("Not able to connect to cassandra server. Reason: %s", Argument)

        
        return cassConn

    @staticmethod
    def generateProcessingTableQuery():
        return "CREATE TABLE IF NOT EXISTS " + KEYSPACE + ".processIds(id UUID PRIMARY KEY, tablename text);"

    @staticmethod
    def generateModelingTableQuery():
        return "CREATE TABLE IF NOT EXISTS " + KEYSPACE + ".models(id UUID, productid int, filename text, PRIMARY KEY (id, productid));"

    @staticmethod
    def createTable(createTableQuery):
        try:
            cassConn.execute(createTableQuery)
            logger.info("Table created suceessfully for query: %s" , createTableQuery)
        except:
            logger.error("Unable to create table: %s", createTableQuery)

