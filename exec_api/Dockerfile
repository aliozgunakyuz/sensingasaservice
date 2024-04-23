FROM python:slim
RUN mkdir -p /applets
RUN mkdir -p /data
WORKDIR /app
COPY . .
RUN apt-get update && apt-get install -y python3-opencv
RUN pip install -r requirements.txt
EXPOSE 5003
CMD python app.py