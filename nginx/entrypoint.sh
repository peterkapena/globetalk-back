#!/bin/sh

# Start nginx in the background
nginx -g 'daemon off;' &

# Wait for nginx to start up
sleep 10

# Certificates directory
CERT_DIR="/etc/letsencrypt/live"

# List of domains
DOMAINS="api.globetalk.peterkapena.com io.globetalk.peterkapena.com globetalk.peterkapena.com"

# Function to check if a certificate exists for a given domain
check_cert() {
  DOMAIN=$1
  if [ ! -d "$CERT_DIR/$DOMAIN" ]; then
    certbot --nginx \
      -n --agree-tos --email peterkapenapeter@gmail.com \
      --domains $DOMAIN
  fi
}

# Loop through each domain and request certificates if they don't exist
for DOMAIN in $DOMAINS; do
  check_cert $DOMAIN
done

# Loop to keep the container running and renew certificates
while :; do
    certbot renew --quiet
    sleep 12h
done
