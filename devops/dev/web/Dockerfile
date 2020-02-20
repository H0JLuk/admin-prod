FROM nginx
RUN apt-get update
RUN apt-get install -y mc vim nano
RUN rm /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/
COPY default.conf /etc/nginx/conf.d/
WORKDIR /opt/distributor-web
COPY maven/build/ .
RUN cp -r * /usr/share/nginx/html/
