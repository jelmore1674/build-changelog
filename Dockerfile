FROM node:20-alpine@sha256:426f843809ae05f324883afceebaa2b9cab9cb697097dbb1a2a7a41c5701de72

# Update the package list and install Node.js and npm
RUN apk add --update nodejs npm git jq

COPY dist/index.js /usr/bin/bcl
COPY dist/templates /usr/bin/templates

ENV PATH="/usr/local/bin:${PATH}"
RUN echo "export PATH=$PATH" > /etc/environment

