# Use the official Nginx Alpine image
FROM nginx:alpine

# Copy the custom Nginx config file into the image
COPY nginx.default.conf /etc/nginx/conf.d/default.conf

# Expose ports (if not done in Docker Compose)
EXPOSE 80 443

# Start Nginx using the default command from the Nginx image
CMD ["nginx", "-g", "daemon off;"]
