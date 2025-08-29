#!/bin/sh

# Replace environment variables in built files
# This allows runtime configuration of the frontend

echo "Starting frontend container..."

# If environment variables are provided, replace them in the built files
if [ ! -z "$VITE_API_URL" ]; then
    echo "Setting API URL to: $VITE_API_URL"
    find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|__VITE_API_URL__|$VITE_API_URL|g" {} \;
fi

if [ ! -z "$VITE_CLOUDINARY_CLOUD_NAME" ]; then
    echo "Setting Cloudinary cloud name to: $VITE_CLOUDINARY_CLOUD_NAME"
    find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|__VITE_CLOUDINARY_CLOUD_NAME__|$VITE_CLOUDINARY_CLOUD_NAME|g" {} \;
fi

# Execute the main command
exec "$@"
