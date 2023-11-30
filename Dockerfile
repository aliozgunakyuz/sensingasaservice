FROM python:3.9.7

# set a directory for the app
WORKDIR /Users/sermetozgu/Desktop/ENS491/yolo-trial/app

# copy all the files to the container
COPY . .


# install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# tell the port number the container should expose
EXPOSE 8000

# run the command
CMD ["python", "./main.py"]