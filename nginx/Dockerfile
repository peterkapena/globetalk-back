# ./nginx/Dockerfile
FROM nginx:alpine

# Install certbot and the nginx plugin
RUN apk add --no-cache certbot certbot-nginx nano

# Copy custom nginx configurations
COPY conf.d/default.conf /etc/nginx/conf.d/default.conf

# Expose HTTP and HTTPS ports
EXPOSE 80 443

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Command to run the entrypoint script
CMD ["/entrypoint.sh"]

# git pull && docker compose up --build -d && docker ps -a
# git pull && docker compose up -d --no-deps --build globetalk-front globetalk-back && docker compose restart
# sudo  git pull && docker compose up -d --no-deps --build -d && docker compose restart
