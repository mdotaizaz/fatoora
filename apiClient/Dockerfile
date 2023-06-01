# Use Node 18 Alpine image as the base
FROM node:18-alpine

# Set the working directory
WORKDIR /apiClient
COPY . /apiClient
COPY ./zatca-envoice-sdk-203.zip /apiClient

#Install bash on linux
RUN apk add --no-cache bash

# Install JDK (latest version before JDK 15)
RUN apk --no-cache add openjdk11-jdk

# Install wget and unzip
RUN apk --no-cache add wget unzip jq

# Unzip the Fatoora SDK file
RUN unzip zatca-envoice-sdk-203.zip && rm zatca-envoice-sdk-203.zip

# Set the Envirnment variables
ENV FATOORA_HOME=/apiClient/zatca-envoice-sdk-203
ENV PATH=$PATH:$FATOORA_HOME/Apps
ENV SDK_CONFIG=$FATOORA_HOME/Configuration/config.json
ENV FATOORA_HOME=$FATOORA_HOME/Apps

# Set the Permissions
RUN chmod 777 -R /apiClient 

# Set the working directory to the Fatoora SDK folder
WORKDIR /apiClient/zatca-envoice-sdk-203

# Expose port 80 for Node.js
EXPOSE 80

# Set the entry point to run the Node.js application
CMD ["sh", "-c", " source install.sh && cd /apiClient && node index.js"]