FROM node:22-alpine

# Update the package list and install Node.js and npm
RUN apk add --update nodejs npm git jq

COPY dist/index.js /usr/bin/bcl
COPY dist/templates /usr/bin/templates

ENV PATH="/usr/local/bin:${PATH}"
RUN echo "export PATH=$PATH" > /etc/environment

