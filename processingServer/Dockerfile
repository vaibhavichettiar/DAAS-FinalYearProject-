FROM ruslanmv/pyspark-notebook:3.1.2

WORKDIR /home/jovyan/295B/processingServer

COPY ./requirements.txt .

RUN pip install -r requirements.txt

COPY . .

ENTRYPOINT [ "python"]

CMD ["app.py"]