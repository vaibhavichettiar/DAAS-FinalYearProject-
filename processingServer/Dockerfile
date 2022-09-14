FROM ruslanmv/pyspark-notebook:3.1.2

USER root

RUN wget https://repo1.maven.org/maven2/com/amazonaws/aws-java-sdk-sts/1.11.375/aws-java-sdk-sts-1.11.375.jar -P $SPARK_HOME/jars/
RUN wget https://repo1.maven.org/maven2/com/amazonaws/aws-java-sdk-s3/1.11.375/aws-java-sdk-s3-1.11.375.jar -P $SPARK_HOME/jars/
RUN wget https://repo1.maven.org/maven2/com/amazonaws/aws-java-sdk-dynamodb/1.11.375/aws-java-sdk-dynamodb-1.11.375.jar -P $SPARK_HOME/jars/
RUN wget https://repo1.maven.org/maven2/com/amazonaws/aws-java-sdk/1.11.375/aws-java-sdk-1.11.375.jar -P $SPARK_HOME/jars/
RUN wget https://repo1.maven.org/maven2/com/amazonaws/aws-java-sdk-core/1.11.375/aws-java-sdk-core-1.11.375.jar -P $SPARK_HOME/jars/
RUN wget https://repo1.maven.org/maven2/org/apache/hadoop/hadoop-aws/3.1.2/hadoop-aws-3.1.2.jar -P $SPARK_HOME/jars/

WORKDIR /home/jovyan/295B/processingServer

COPY ./requirements.txt .

RUN pip install -r requirements.txt

COPY . .

ENTRYPOINT [ "python"]

CMD ["run.py"]