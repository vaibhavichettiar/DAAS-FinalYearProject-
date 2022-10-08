CREATE KEYSPACE IF NOT EXISTS daas_ks
  WITH REPLICATION = {
   'class' : 'SimpleStrategy',
   'replication_factor' : 1
  };

CREATE KEYSPACE IF NOT EXISTS daas_data
  WITH REPLICATION = {
   'class' : 'SimpleStrategy',
   'replication_factor' : 1
  };