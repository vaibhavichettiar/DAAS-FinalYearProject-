# Cluster base image
ARG debian_buster_image_tag=11-jre-slim
FROM openjdk:${debian_buster_image_tag} AS cluster-base

# -- Layer: OS + Python 3.9

ARG shared_workspace=/opt/workspace

RUN mkdir -p ${shared_workspace} && \
    apt-get update -y && \
    apt-get install -y python3 && \
    ln -s /usr/bin/python3 /usr/bin/python && \
    rm -rf /var/lib/apt/lists/*

ENV SHARED_WORKSPACE=${shared_workspace}

# -- Runtime

#VOLUME ${shared_workspace}
CMD ["bash"]

# Spark-base image 

FROM cluster-base AS spark-base

# -- Layer: Apache Spark

ARG spark_version=3.1.2
ARG hadoop_version=3.2
ARG shared_workspace=/opt/workspace

RUN apt-get update -y && \
    apt-get install -y curl && \
    apt-get install -y wget && \
    curl https://archive.apache.org/dist/spark/spark-${spark_version}/spark-${spark_version}-bin-hadoop${hadoop_version}.tgz -o spark.tgz && \
    tar -xf spark.tgz && \
    mv spark-${spark_version}-bin-hadoop${hadoop_version} /usr/bin/ && \
    mkdir /usr/bin/spark-${spark_version}-bin-hadoop${hadoop_version}/logs && \
    rm spark.tgz

ENV SHARED_WORKSPACE=${shared_workspace}
ENV SPARK_HOME /usr/bin/spark-${spark_version}-bin-hadoop${hadoop_version}
ENV SPARK_MASTER_HOST spark-master
ENV SPARK_MASTER_PORT 7077
ENV PYSPARK_PYTHON python3
ENV JUPYTER_PORT 8888

RUN mkdir -p ${SHARED_WORKSPACE}/certs

COPY ./cassandra_truststore.jks ${SHARED_WORKSPACE}/certs

RUN wget https://repo1.maven.org/maven2/com/amazonaws/aws-java-sdk-sts/1.11.375/aws-java-sdk-sts-1.11.375.jar -P $SPARK_HOME/jars/
RUN wget https://repo1.maven.org/maven2/com/amazonaws/aws-java-sdk-s3/1.11.375/aws-java-sdk-s3-1.11.375.jar -P $SPARK_HOME/jars/
RUN wget https://repo1.maven.org/maven2/com/amazonaws/aws-java-sdk-dynamodb/1.11.375/aws-java-sdk-dynamodb-1.11.375.jar -P $SPARK_HOME/jars/
RUN wget https://repo1.maven.org/maven2/com/amazonaws/aws-java-sdk/1.11.375/aws-java-sdk-1.11.375.jar -P $SPARK_HOME/jars/
RUN wget https://repo1.maven.org/maven2/com/amazonaws/aws-java-sdk-core/1.11.375/aws-java-sdk-core-1.11.375.jar -P $SPARK_HOME/jars/
RUN wget https://repo1.maven.org/maven2/org/apache/hadoop/hadoop-aws/3.2.0/hadoop-aws-3.2.0.jar -P $SPARK_HOME/jars/
RUN wget https://repo1.maven.org/maven2/net/java/dev/jets3t/jets3t/0.9.4/jets3t-0.9.4.jar -P $SPARK_HOME/jars/

# -- Runtime

WORKDIR ${SPARK_HOME}
CMD ["bash"]

# Spark - master image 
FROM spark-base as spark-master

#CMD bin/spark-class org.apache.spark.deploy.master.Master >> logs/spark-master.out;jupyter lab --ip=0.0.0.0 --port=8888 #--notebook-dir=${SPARK_HOME} --no-browser --allow-root --NotebookApp.token=;echo TEST-----

# -- Runtime

ARG spark_master_web_ui=8080

EXPOSE ${spark_master_web_ui} ${SPARK_MASTER_PORT}
CMD bin/spark-class org.apache.spark.deploy.master.Master >> logs/spark-master.out

# Spark-worked image 
FROM spark-base as spark-worker

# -- Runtime

ARG spark_worker_web_ui=8081

EXPOSE ${spark_worker_web_ui}
CMD bin/spark-class org.apache.spark.deploy.worker.Worker spark://${SPARK_MASTER_HOST}:${SPARK_MASTER_PORT} >> logs/spark-worker.out

# Processing server image 
FROM spark-base as flask-server

# -- Layer: flask

RUN apt-get update -y && \
    apt-get install -y python3-pip

# -- Runtime

EXPOSE 5000
WORKDIR ${SPARK_HOME}/295B/processingServer

COPY ./requirements.txt .

RUN pip install -r requirements.txt

COPY . .

ENTRYPOINT [ "python"]

CMD ["run.py"]