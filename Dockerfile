FROM node:alpine as build

WORKDIR /app

COPY package.json ./
RUN yarn install
COPY . ./
RUN yarn run build

FROM trafex/php-nginx:3.6.0

USER root
RUN apk add --no-cache ssmtp
RUN echo -e "\
mailhub=smtp.gmail.com:465\n\
UseTLS=Yes\n\
UseSTARTTLS=No\n\
AuthUser=atlasrise.mailer@gmail.com\n\
AuthPass=oosonrthvvipjtao\n\
AuthMethod=LOGIN\n\
\n" > /etc/ssmtp/ssmtp.conf

#RUN mkdir /etc/nginx/conf.d
RUN echo -e "\
client_max_body_size 100M;\n\
\n" > /etc/nginx/conf.d/server.conf

RUN echo -e "\
[PHP]\n\
upload_max_filesize = 32M\n\
post_max_size = 40M\n\
\n\
[mail function]\n\
sendmail_path = /usr/sbin/ssmtp -t\n\
\n\n" > /etc/php83/conf.d/99-settings.ini

USER nobody
RUN mkdir /var/www/html/files && chown nobody:nobody /var/www/html/files
COPY --from=build /app/dist/ /var/www/html/

# Configure a healthcheck to validate that everything is up&running
HEALTHCHECK --timeout=5s --interval=10s CMD curl --silent --fail http://127.0.0.1:8080/fpm-ping
