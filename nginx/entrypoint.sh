#!/bin/sh

# Start nginx in the background
nginx -g 'daemon off;' &

# Wait for nginx to start up
sleep 10

# Certificates directory
CERT_DIR="/etc/letsencrypt/live"

# Check if the certificates already exist and request them if not
if [ ! -d "$CERT_DIR" ]; then
  certbot --nginx \
    -n --agree-tos --email peterkapenapeter@gmail.com \
    --domains api.globetalk.peterkapena.com,io.globetalk.peterkapena.com,globetalk.peterkapena.com,api.mtm.peterkapena.com,mtm.peterkapena.com
else
  echo "Certificates found. Configuring Nginx with existing certificates..."

  # Deploy hook to reconfigure Nginx
  certbot renew --deploy-hook "nginx -s reload"
fi

# Loop to keep the container running and renew certificates
while :; do
    certbot renew --quiet --deploy-hook "nginx -s reload"
    sleep 12h
done
