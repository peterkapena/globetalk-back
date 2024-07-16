#!/bin/sh

# Start nginx in the background
nginx -g 'daemon off;' &

# Wait for nginx to start up
sleep 10

certbot --nginx \
  -n --agree-tos --email peterkapenapeter@gmail.com \
  --domains api.globetalk.peterkapena.com,io.globetalk.peterkapena.com,globetalk.peterkapena.com,api.mtm.peterkapena.com,mtm.peterkapena.com

# Loop to keep the container running and renew certificates
while :; do
    certbot renew --quiet --deploy-hook "nginx -s reload"
    sleep 12h
done
