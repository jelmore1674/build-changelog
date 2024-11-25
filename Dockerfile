FROM alpine:latest

COPY dist/index.js /usr/bin/bcl
COPY dist/templates /usr/bin/templates

ENV PATH="/usr/local/bin:${PATH}"

# Update the package list and install Node.js and npm
RUN apk add --update nodejs npm git
RUN apk add --no-cache libc6-compat bash
RUN echo "export PATH=$PATH" > /etc/environment

