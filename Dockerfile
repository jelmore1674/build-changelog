FROM node:22-alpine@sha256:6e80991f69cc7722c561e5d14d5e72ab47c0d6b6cfb3ae50fb9cf9a7b30fdf97

# Update the package list and install Node.js and npm
RUN apk add --update nodejs npm git jq

COPY dist/index.js /usr/bin/bcl
COPY dist/templates /usr/bin/templates

ENV PATH="/usr/local/bin:${PATH}"
RUN echo "export PATH=$PATH" > /etc/environment

