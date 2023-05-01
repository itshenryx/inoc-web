FROM python:3.10.8
COPY ./DiseasePrediction_Cloud.py /deploy/
COPY ./requirements.txt /deploy/
COPY model_dtree.pickle /deploy/
COPY model_randfor.pickle /deploy/
COPY model_gnb.pickle /deploy/
WORKDIR /deploy/
RUN pip install -r requirements.txt
EXPOSE 80
ENTRYPOINT ["python", "DiseasePrediction_Cloud.py"]