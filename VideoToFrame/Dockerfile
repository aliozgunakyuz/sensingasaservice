FROM python:3.9.7

# Set the working directory in the container
WORKDIR /Users/ozgun/Desktop/sensingasaservice/VideoToFrame/app

# Copy the current directory contents into the container at /app
COPY . .

# Install dependencies
RUN apt-get update && \
    apt-get install -y libgl1-mesa-glx && \
    python -m pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# No need to expose a port unless this service needs to be accessible from the network
# EXPOSE 5001 is omitted since this container does not serve a Flask application

# Command to run the script
CMD ["python", "./main.py"]
