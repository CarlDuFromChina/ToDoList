FROM nginx:1.15.2-alpine

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./dist/ /usr/share/nginx/html
EXPOSE 80 443
ENTRYPOINT ["nginx", "-g", "daemon off;"]