#!/bin/bash

echo "🚀 Starting Shopify Hydrogen tunnel setup..."

# Check and handle Shopify CLI authentication
echo "🔐 Checking Shopify CLI authentication..."
if ! shopify auth status &> /dev/null; then
    echo "⚠️  Shopify CLI not authenticated"
    echo "🔑 Starting Shopify authentication..."
    echo ""
    
    # Run shopify auth login
    if shopify auth login; then
        echo "✅ Shopify authentication successful!"
    else
        echo "❌ Shopify authentication failed"
        echo "   Please run 'shopify auth login' manually"
        exit 1
    fi
else
    echo "✅ Shopify CLI already authenticated"
fi
echo ""

echo "📡 Starting ngrok tunnel for Hydrogen development..."

# Start ngrok in background
ngrok http 3000 &
NGROK_PID=$!

# Wait for ngrok to start
echo "⏳ Waiting for ngrok to start..."
sleep 5

# Get the tunnel URL
TUNNEL_URL=$(curl -s http://localhost:4040/api/tunnels | node -e "
const data = JSON.parse(require('fs').readFileSync(0, 'utf8'));
console.log(data.tunnels?.[0]?.public_url || '');
")

if [ -z "$TUNNEL_URL" ]; then
    echo "❌ Failed to get tunnel URL"
    kill $NGROK_PID
    exit 1
fi

echo "🔗 Tunnel URL: $TUNNEL_URL"

# Configure Shopify Customer Account API
echo "⚙️  Configuring Shopify Customer Account API..."
shopify hydrogen customer-account-push --dev-origin $TUNNEL_URL

if [ $? -eq 0 ]; then
    echo "✅ Tunnel configured successfully!"
    echo "🌐 Access your app at: $TUNNEL_URL"
    echo "📝 Keep this terminal open to maintain the tunnel"
    echo "🛑 Press Ctrl+C to stop the tunnel"
    
    # Keep the script running
    wait $NGROK_PID
else
    echo "❌ Failed to configure tunnel"
    kill $NGROK_PID
    exit 1
fi
