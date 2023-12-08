FROM python:3.9.7

# set a directory for the app
WORKDIR /Users/sermetozgu/Desktop/ENS491/demoproject/Yolo/app

# copy all the files to the container
COPY . .

# install dependencies

RUN apt-get update && apt-get install -y libgl1-mesa-glx
RUN python -m pip install --upgrade pip

RUN pip install --no-cache-dir -r requirements.txt

# tell the port number the container should expose
EXPOSE 5001

# run the command
CMD ["python", "./main.py"]