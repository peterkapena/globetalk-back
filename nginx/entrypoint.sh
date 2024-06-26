#!/bin/sh

# Start nginx in the background
nginx -g 'daemon off;' &

# Wait for nginx to start up
sleep 10

# Certificates directory
CERT_DIR="/etc/letsencrypt"

# Check if the certificates already exist and request them if not
if [ ! -d "$CERT_DIR/live" ]; then
  certbot --nginx \
    -n --agree-tos --email peterkapenapeter@gmail.com \
    --domains api.globetalk.peterkapena.com,io.globetalk.peterkapena.com,globetalk.peterkapena.com
fi

# Loop to keep the container running and renew certificates
while :; do
    certbot renew --quiet
    sleep 12h
done
