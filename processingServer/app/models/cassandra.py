import os
import logging
import time
from cassandra.cluster import Cluster
from cassandra.policies import DCAwareRoundRobinPolicy
from cassandra.auth import PlainTextAuthProvider
from app.settings.setting import KEYSPACE
from ssl import SSLContext, PROTOCOL_TLSv1_2 , CERT_REQUIRED
import boto3
from cassandra_sigv4.auth import SigV4AuthProvider
from app.exception.processingException import ProcessingException
from cassandra import ConsistencyLevel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

cassConn = None
class cassandraConnection:
    @staticmethod
    def initCassandraConnection():
        global cassConn
        if(cassConn == None):
            try :
                ssl_context = SSLContext(PROTOCOL_TLSv1_2)
                certificate_file_path = os.getcwd() + '/sf-class2-root.crt'
                ssl_context.load_verify_locations(certificate_file_path)
                ssl_context.verify_mode = CERT_REQUIRED
                boto_session = boto3.Session(
                    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
                    region_name=os.getenv('AWS_REGION'))
                auth_provider = SigV4AuthProvider(boto_session)
                cassandra_host = "cassandra." + os.getenv('AWS_REGION') + ".amazonaws.com"
                node_ips = [cassandra_host]
                cluster = Cluster(node_ips, port = 9142, ssl_context=ssl_context, auth_provider=auth_provider)
                cassConn = cluster.connect(keyspace=KEYSPACE)
                flag = False
            except Exception as Argument:
                logger.error(Argument)
                logger.error("Not able to connect to cassandra server. Retrying after 10s. Reason: %s", Argument)

        
        return cassConn

    @staticmethod
    def createTable(createTableQuery):
        try:
            cassConn.execute(createTableQuery)
            logger.info("Table created suceessfully for query: %s" , createTableQuery)
        except:
            logger.error("Unable to create table: %s", createTableQuery)
            raise Exception("Unable to create table: " + createTableQuery)

    @staticmethod
    def getCassConn():
        if cassConn == None:
            cassandraConnection.initCassandraConnection()
        return cassConn

    @staticmethod
    def getSelectQueryResults(selectQuery, paramList):
        try:
            logger.info("Querying to the data: %s", selectQuery)
            stmt = cassConn.prepare(selectQuery)
            results = cassConn.execute(stmt, paramList)
            return results
        except Exception as e:
            logger.exception(e)
            logger.error("Unable to fetch data for query: %s" , selectQuery)
            raise ProcessingException("Unable to fetch data for query: " + selectQuery, status_code=404)

    @staticmethod
    def updateTableQuery(insertQuery, paramList):
        try:
            stmt = cassConn.prepare(insertQuery)
            stmt.consistency_level = ConsistencyLevel.LOCAL_QUORUM
            results = cassConn.execute(stmt, paramList)
            return results
        except Exception as e:
            logger.exception(e)
            logger.error("Unable toexecute update query: %s" , insertQuery)
            raise ProcessingException("Unable toexecute update query: " + insertQuery + " Message: " + str(e), status_code=404)

    @staticmethod
    def isTableExist(tableName):
        try:
            query = "SELECT * FROM system_schema. tables WHERE keyspace_name = '" +  KEYSPACE + "' AND table_name = '" + tableName + "';"
            results = cassConn.execute(query)
            logger.info(results)
            if results is not None and results.one() is not None:
                return True
            return False
        except Exception as e:
            logger.exception(e)
            logger.error("Unable to find the table : %s" , tableName)
            raise ProcessingException("Unable to find the table: " + tableName + " Message: " + str(e), status_code=404)
   
        



