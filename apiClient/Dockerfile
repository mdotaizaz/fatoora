# Use Node 18 Alpine image as the base
FROM node:18-alpine

# Set the working directory
WORKDIR /apiClient

# Install JDK (latest version before JDK 15)
RUN apk --no-cache add openjdk11-jdk

# Install wget and unzip
RUN apk --no-cache add wget unzip

COPY ./zatca-envoice-sdk-203.zip /apiClient

# Unzip the Fatoora SDK file
RUN unzip zatca-envoice-sdk-203.zip && rm zatca-envoice-sdk-203.zip

# Set the working directory to the Fatoora SDK folder
WORKDIR /apiClient/zatca-envoice-sdk-203

# Run the install.sh script
RUN chmod +x install.sh \
    && ./install.sh

# Set the working directory back to apiClient 
WORKDIR /apiClient

# Copy the source files to the container
COPY ./apiClient /apiClient

# Expose port 80 for Node.js
EXPOSE 80

# Set the entry point to run the Node.js application
CMD ["node", "index.js"]