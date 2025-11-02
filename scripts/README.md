# Demo Data Seeding Script

This script populates your Appwrite database with realistic e-commerce data perfect for marketing videos and demonstrations.

## What Gets Created

### 📦 Categories (8)
- Electronics
- Clothing
- Home & Garden
- Sports & Outdoors
- Books
- Toys & Games
- Beauty & Health
- Automotive

### 🛍️ Products (30)
Realistic products across all categories with:
- Product names and descriptions
- SKUs and barcodes
- Prices (ranging from $19.99 to $299.99)
- Inventory levels
- Categories and tags

### 👥 Customers (15)
Diverse customer profiles with:
- First and last names
- Email addresses
- Phone numbers
- Shipping addresses
- Different cities across the USA

### 📋 Orders (50)
Realistic orders from the last 3 months with:
- Order numbers (ORD-10000 to ORD-10049)
- Various statuses (pending, confirmed, processing, shipped, delivered, cancelled)
- Payment statuses (pending, paid, failed, refunded)
- Fulfillment statuses
- 1-5 items per order
- Realistic pricing with tax and shipping
- Customer information

## Prerequisites

1. **Appwrite API Key**: You need an API key with full permissions
   - Go to Appwrite Console → Your Project → Settings → API Keys
   - Create a new API key with all scopes
   - Copy the key

2. **Node.js**: Ensure Node.js is installed (v18+)

3. **Appwrite SDK**: Install the Node.js SDK
   ```bash
   npm install node-appwrite
   ```

## Setup

1. **Set Environment Variables**

   Create a `.env` file in the root directory or set these variables:

   ```bash
   # Windows (PowerShell)
   $env:NEXT_PUBLIC_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
   $env:NEXT_PUBLIC_APPWRITE_PROJECT_ID="your_project_id"
   $env:APPWRITE_API_KEY="your_api_key_here"

   # Linux/Mac
   export NEXT_PUBLIC_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
   export NEXT_PUBLIC_APPWRITE_PROJECT_ID="your_project_id"
   export APPWRITE_API_KEY="your_api_key_here"
   ```

2. **Ensure Collections Exist**

   Make sure these collections are created in your Appwrite database:
   - `categories`
   - `products`
   - `customers`
   - `orders`

## Running the Script

```bash
# From the ecommerce-admin directory
node scripts/seedDemoData.js
```

## Expected Output

```
🌱 Starting demo data seeding...

==================================================
Seeding categories...
✓ Created category: Electronics
✓ Created category: Clothing
✓ Created category: Home & Garden
...

Seeding products...
✓ Created product: Wireless Bluetooth Headphones
✓ Created product: Smart Watch Pro
...

Seeding customers...
✓ Created customer: Sarah Johnson
✓ Created customer: Michael Chen
...

Seeding orders...
✓ Created order: ORD-10000
✓ Created order: ORD-10001
...

==================================================
✅ Demo data seeding completed successfully!

Summary:
  Categories: 8
  Products: 30
  Customers: 15
  Orders: 50

🎬 Your database is now ready for the marketing video!
```

## Data Highlights

### Product Variety
- **Electronics**: Headphones, smartwatches, webcams, power banks, gaming mice
- **Clothing**: T-shirts, jeans, jackets, shoes, wallets
- **Home & Garden**: Smart bulbs, plant pots, pillows, cookware
- **Sports**: Yoga mats, camping tents, dumbbells, bike helmets
- **Books**: Programming, mindfulness, cookbooks
- **Toys**: Building blocks, board games, RC cars
- **Beauty**: Face cream, essential oils, electric toothbrush
- **Automotive**: Phone mounts, dash cams, vacuum cleaners

### Order Distribution
- **Statuses**: Mix of pending, confirmed, processing, shipped, delivered, and cancelled
- **Values**: Orders range from ~$20 to $500+
- **Dates**: Spread across the last 3 months
- **Items**: 1-5 products per order

### Customer Diversity
- Names from various backgrounds
- Different cities across the USA
- Realistic email addresses and phone numbers
- Complete shipping addresses

## Cleaning Up

To remove all demo data, you can:

1. **Delete from Appwrite Console**:
   - Go to each collection
   - Select all documents
   - Delete them

2. **Or create a cleanup script** (optional):
   ```javascript
   // scripts/cleanupDemoData.js
   // Delete all documents from collections
   ```

## Tips for Marketing Videos

1. **Dashboard View**: Shows impressive metrics with 50 orders
2. **Product Catalog**: 30 diverse products across 8 categories
3. **Order Management**: Various order statuses to demonstrate workflow
4. **Customer Profiles**: 15 customers with complete information
5. **Analytics**: Enough data to show meaningful charts and graphs

## Troubleshooting

### Error: "Invalid API key"
- Ensure your API key has all necessary permissions
- Check that the API key is correctly set in environment variables

### Error: "Collection not found"
- Verify all collections are created in Appwrite Console
- Check collection IDs match the script

### Error: "Document already exists"
- The script uses `ID.unique()` so this shouldn't happen
- If it does, check for duplicate data

### Slow Performance
- The script creates 103 documents total
- Should complete in 1-3 minutes depending on connection
- Each document is created sequentially for reliability

## Customization

You can modify the script to:
- Add more products
- Create more orders
- Add more customers
- Change product prices
- Modify order date ranges
- Add custom categories

Simply edit `scripts/seedDemoData.js` and adjust the data arrays.

## Support

If you encounter issues:
1. Check Appwrite Console for error logs
2. Verify environment variables are set correctly
3. Ensure API key has proper permissions
4. Check network connectivity to Appwrite

---

**Ready to create your marketing video!** 🎬

Your admin panel will now have realistic data that looks professional and engaging.
