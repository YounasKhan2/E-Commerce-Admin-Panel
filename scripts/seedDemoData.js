/**
 * Demo Data Seeding Script
 * Populates the database with realistic e-commerce data for marketing videos
 * 
 * Run with: node scripts/seedDemoData.js
 */

const { Client, Databases, ID } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

// Configuration
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = 'ecommerce_main';

// Demo Data
const categories = [
  { name: 'Electronics', description: 'Latest gadgets and electronics', slug: 'electronics' },
  { name: 'Clothing', description: 'Fashion and apparel', slug: 'clothing' },
  { name: 'Home & Garden', description: 'Home decor and garden supplies', slug: 'home-garden' },
  { name: 'Sports & Outdoors', description: 'Sports equipment and outdoor gear', slug: 'sports-outdoors' },
  { name: 'Books', description: 'Books and educational materials', slug: 'books' },
  { name: 'Toys & Games', description: 'Toys and games for all ages', slug: 'toys-games' },
  { name: 'Beauty & Health', description: 'Beauty and health products', slug: 'beauty-health' },
  { name: 'Automotive', description: 'Car accessories and parts', slug: 'automotive' },
];

const products = [
  // Electronics
  { name: 'Wireless Bluetooth Headphones', price: 79.99, sku: 'WBH-001', inventory: 150, category: 'Electronics', description: 'Premium noise-cancelling wireless headphones with 30-hour battery life' },
  { name: 'Smart Watch Pro', price: 299.99, sku: 'SWP-002', inventory: 85, category: 'Electronics', description: 'Advanced fitness tracking with heart rate monitor and GPS' },
  { name: '4K Ultra HD Webcam', price: 129.99, sku: 'WC4K-003', inventory: 120, category: 'Electronics', description: 'Professional webcam for streaming and video calls' },
  { name: 'Portable Power Bank 20000mAh', price: 49.99, sku: 'PPB-004', inventory: 200, category: 'Electronics', description: 'Fast charging power bank with dual USB ports' },
  { name: 'Wireless Gaming Mouse', price: 59.99, sku: 'WGM-005', inventory: 175, category: 'Electronics', description: 'RGB gaming mouse with 16000 DPI sensor' },
  
  // Clothing
  { name: 'Premium Cotton T-Shirt', price: 24.99, sku: 'PCT-101', inventory: 500, category: 'Clothing', description: 'Comfortable 100% organic cotton t-shirt' },
  { name: 'Slim Fit Jeans', price: 69.99, sku: 'SFJ-102', inventory: 300, category: 'Clothing', description: 'Classic slim fit denim jeans' },
  { name: 'Winter Jacket', price: 149.99, sku: 'WJ-103', inventory: 80, category: 'Clothing', description: 'Waterproof winter jacket with thermal insulation' },
  { name: 'Running Shoes', price: 89.99, sku: 'RS-104', inventory: 250, category: 'Clothing', description: 'Lightweight running shoes with cushioned sole' },
  { name: 'Leather Wallet', price: 39.99, sku: 'LW-105', inventory: 400, category: 'Clothing', description: 'Genuine leather bifold wallet' },
  
  // Home & Garden
  { name: 'Smart LED Light Bulbs (4-Pack)', price: 34.99, sku: 'SLB-201', inventory: 300, category: 'Home & Garden', description: 'WiFi-enabled color-changing LED bulbs' },
  { name: 'Ceramic Plant Pots Set', price: 29.99, sku: 'CPP-202', inventory: 150, category: 'Home & Garden', description: 'Set of 3 decorative ceramic plant pots' },
  { name: 'Memory Foam Pillow', price: 44.99, sku: 'MFP-203', inventory: 200, category: 'Home & Garden', description: 'Ergonomic memory foam pillow for better sleep' },
  { name: 'Stainless Steel Cookware Set', price: 199.99, sku: 'SSC-204', inventory: 60, category: 'Home & Garden', description: '10-piece professional cookware set' },
  
  // Sports & Outdoors
  { name: 'Yoga Mat Premium', price: 39.99, sku: 'YMP-301', inventory: 180, category: 'Sports & Outdoors', description: 'Non-slip yoga mat with carrying strap' },
  { name: 'Camping Tent 4-Person', price: 159.99, sku: 'CT4-302', inventory: 45, category: 'Sports & Outdoors', description: 'Waterproof camping tent with easy setup' },
  { name: 'Adjustable Dumbbells Set', price: 249.99, sku: 'ADS-303', inventory: 70, category: 'Sports & Outdoors', description: 'Space-saving adjustable dumbbell set 5-52.5 lbs' },
  { name: 'Mountain Bike Helmet', price: 54.99, sku: 'MBH-304', inventory: 120, category: 'Sports & Outdoors', description: 'Lightweight bike helmet with ventilation' },
  
  // Books
  { name: 'The Art of Programming', price: 49.99, sku: 'TAP-401', inventory: 200, category: 'Books', description: 'Comprehensive guide to modern programming' },
  { name: 'Mindfulness for Beginners', price: 19.99, sku: 'MFB-402', inventory: 350, category: 'Books', description: 'Introduction to mindfulness and meditation' },
  { name: 'Cookbook: Healthy Meals', price: 29.99, sku: 'CHM-403', inventory: 180, category: 'Books', description: '100+ healthy and delicious recipes' },
  
  // Toys & Games
  { name: 'Building Blocks Set 500pcs', price: 44.99, sku: 'BBS-501', inventory: 150, category: 'Toys & Games', description: 'Creative building blocks for kids' },
  { name: 'Board Game: Strategy Master', price: 39.99, sku: 'BGS-502', inventory: 100, category: 'Toys & Games', description: 'Family board game for 2-6 players' },
  { name: 'Remote Control Car', price: 69.99, sku: 'RCC-503', inventory: 90, category: 'Toys & Games', description: 'High-speed RC car with rechargeable battery' },
  
  // Beauty & Health
  { name: 'Organic Face Cream', price: 34.99, sku: 'OFC-601', inventory: 220, category: 'Beauty & Health', description: 'Natural anti-aging face cream' },
  { name: 'Essential Oils Set', price: 49.99, sku: 'EOS-602', inventory: 160, category: 'Beauty & Health', description: 'Set of 6 pure essential oils' },
  { name: 'Electric Toothbrush', price: 79.99, sku: 'ETB-603', inventory: 140, category: 'Beauty & Health', description: 'Sonic electric toothbrush with 5 modes' },
  
  // Automotive
  { name: 'Car Phone Mount', price: 19.99, sku: 'CPM-701', inventory: 300, category: 'Automotive', description: 'Universal car phone holder' },
  { name: 'Dash Cam HD', price: 89.99, sku: 'DCH-702', inventory: 110, category: 'Automotive', description: '1080p dash camera with night vision' },
  { name: 'Car Vacuum Cleaner', price: 44.99, sku: 'CVC-703', inventory: 130, category: 'Automotive', description: 'Portable car vacuum with strong suction' },
];

const customers = [
  { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@email.com', phone: '+1-555-0101', city: 'New York' },
  { firstName: 'Michael', lastName: 'Chen', email: 'michael.chen@email.com', phone: '+1-555-0102', city: 'San Francisco' },
  { firstName: 'Emily', lastName: 'Rodriguez', email: 'emily.rodriguez@email.com', phone: '+1-555-0103', city: 'Los Angeles' },
  { firstName: 'David', lastName: 'Williams', email: 'david.williams@email.com', phone: '+1-555-0104', city: 'Chicago' },
  { firstName: 'Jessica', lastName: 'Brown', email: 'jessica.brown@email.com', phone: '+1-555-0105', city: 'Houston' },
  { firstName: 'James', lastName: 'Davis', email: 'james.davis@email.com', phone: '+1-555-0106', city: 'Phoenix' },
  { firstName: 'Lisa', lastName: 'Martinez', email: 'lisa.martinez@email.com', phone: '+1-555-0107', city: 'Philadelphia' },
  { firstName: 'Robert', lastName: 'Garcia', email: 'robert.garcia@email.com', phone: '+1-555-0108', city: 'San Antonio' },
  { firstName: 'Jennifer', lastName: 'Wilson', email: 'jennifer.wilson@email.com', phone: '+1-555-0109', city: 'San Diego' },
  { firstName: 'William', lastName: 'Anderson', email: 'william.anderson@email.com', phone: '+1-555-0110', city: 'Dallas' },
  { firstName: 'Amanda', lastName: 'Taylor', email: 'amanda.taylor@email.com', phone: '+1-555-0111', city: 'San Jose' },
  { firstName: 'Christopher', lastName: 'Thomas', email: 'christopher.thomas@email.com', phone: '+1-555-0112', city: 'Austin' },
  { firstName: 'Michelle', lastName: 'Moore', email: 'michelle.moore@email.com', phone: '+1-555-0113', city: 'Jacksonville' },
  { firstName: 'Daniel', lastName: 'Jackson', email: 'daniel.jackson@email.com', phone: '+1-555-0114', city: 'Fort Worth' },
  { firstName: 'Ashley', lastName: 'White', email: 'ashley.white@email.com', phone: '+1-555-0115', city: 'Columbus' },
];

const orderStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const paymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
const fulfillmentStatuses = ['unfulfilled', 'partially_fulfilled', 'fulfilled'];

// Helper functions
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Seeding functions
async function seedCategories() {
  console.log('Seeding categories...');
  const createdCategories = [];
  
  for (const category of categories) {
    try {
      const doc = await databases.createDocument(
        DATABASE_ID,
        'categories',
        ID.unique(),
        {
          name: category.name,
          description: category.description,
          isActive: true
        }
      );
      createdCategories.push(doc);
      console.log(`✓ Created category: ${category.name}`);
    } catch (error) {
      console.error(`✗ Error creating category ${category.name}:`, error.message);
    }
  }
  
  return createdCategories;
}

async function seedProducts(categoryMap) {
  console.log('\nSeeding products...');
  const createdProducts = [];
  
  for (const product of products) {
    try {
      const categoryId = categoryMap[product.category];
      const doc = await databases.createDocument(
        DATABASE_ID,
        'products',
        ID.unique(),
        {
          name: product.name,
          description: product.description,
          price: product.price,
          compareAtPrice: product.price * 1.2, // 20% higher compare price
          sku: product.sku,
          barcode: `BAR${product.sku}`,
          categoryId: categoryId,
          inventory: product.inventory,
          lowStockThreshold: 20,
          tags: [product.category.toLowerCase(), 'featured'],
          weight: randomNumber(100, 5000) / 100, // Random weight in kg
          hasVariants: false,
          images: []
        }
      );
      createdProducts.push(doc);
      console.log(`✓ Created product: ${product.name}`);
    } catch (error) {
      console.error(`✗ Error creating product ${product.name}:`, error.message);
    }
  }
  
  return createdProducts;
}

async function seedCustomers() {
  console.log('\nSeeding customers...');
  const createdCustomers = [];
  
  for (const customer of customers) {
    try {
      const doc = await databases.createDocument(
        DATABASE_ID,
        'customers',
        ID.unique(),
        {
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          addresses: JSON.stringify([{
            street: `${randomNumber(100, 9999)} Main Street`,
            city: customer.city,
            state: 'CA',
            zipCode: `${randomNumber(10000, 99999)}`,
            country: 'USA',
            isDefault: true
          }]),
          tags: ['retail', 'active'],
          notes: `Customer since ${new Date().getFullYear()}`,
          totalSpent: 0,
          orderCount: 0
        }
      );
      createdCustomers.push(doc);
      console.log(`✓ Created customer: ${customer.firstName} ${customer.lastName}`);
    } catch (error) {
      console.error(`✗ Error creating customer ${customer.firstName}:`, error.message);
    }
  }
  
  return createdCustomers;
}

async function seedOrders(customerList, productList) {
  console.log('\nSeeding orders...');
  const createdOrders = [];
  const startDate = new Date();
  startDate.setMonth(startDate.setMonth() - 3); // Last 3 months
  
  // Create 50 orders
  for (let i = 0; i < 50; i++) {
    try {
      const customer = randomElement(customerList);
      const orderDate = randomDate(startDate, new Date());
      const numItems = randomNumber(1, 5);
      let subtotal = 0;
      
      // Calculate order totals first
      const selectedProducts = [];
      for (let j = 0; j < numItems; j++) {
        const product = randomElement(productList);
        const quantity = randomNumber(1, 3);
        const price = product.price;
        
        selectedProducts.push({
          product: product,
          quantity: quantity,
          price: price
        });
        
        subtotal += price * quantity;
      }
      
      const taxAmount = subtotal * 0.08; // 8% tax
      const shippingAmount = subtotal > 100 ? 0 : 9.99;
      const totalAmount = subtotal + taxAmount + shippingAmount;
      
      const status = randomElement(orderStatuses);
      const paymentStatus = status === 'cancelled' ? 'refunded' : (status === 'pending' ? 'pending' : 'paid');
      const fulfillmentStatus = status === 'delivered' ? 'fulfilled' : (status === 'shipped' ? 'partially_fulfilled' : 'unfulfilled');
      
      // Create the order first
      const orderDoc = await databases.createDocument(
        DATABASE_ID,
        'orders',
        ID.unique(),
        {
          orderNumber: `ORD-${String(10000 + i).padStart(5, '0')}`,
          customerId: customer.$id,
          status: status,
          paymentStatus: paymentStatus,
          fulfillmentStatus: fulfillmentStatus,
          subtotalAmount: subtotal,
          taxAmount: taxAmount,
          shippingAmount: shippingAmount,
          discountAmount: 0,
          totalAmount: totalAmount,
          shippingAddress: JSON.stringify({
            name: `${customer.firstName} ${customer.lastName}`,
            street: `${randomNumber(100, 9999)} Main Street`,
            city: 'San Francisco',
            state: 'CA',
            zipCode: '94102',
            country: 'USA'
          }),
          billingAddress: JSON.stringify({
            name: `${customer.firstName} ${customer.lastName}`,
            street: `${randomNumber(100, 9999)} Main Street`,
            city: 'San Francisco',
            state: 'CA',
            zipCode: '94102',
            country: 'USA'
          }),
          notes: '',
          trackingNumber: '',
          shippingCarrier: '',
          shippingLabelUrl: '',
          invoiceUrl: ''
        }
      );
      
      // Create order items in separate collection
      for (const item of selectedProducts) {
        try {
          await databases.createDocument(
            DATABASE_ID,
            'order_items',
            ID.unique(),
            {
              orderId: orderDoc.$id,
              productId: item.product.$id,
              productName: item.product.name,
              sku: item.product.sku,
              quantity: item.quantity,
              price: item.price,
              total: item.price * item.quantity
            }
          );
        } catch (itemError) {
          console.error(`  ✗ Error creating order item:`, itemError.message);
        }
      }
      
      createdOrders.push(orderDoc);
      console.log(`✓ Created order: ${orderDoc.orderNumber} with ${selectedProducts.length} items`);
    } catch (error) {
      console.error(`✗ Error creating order:`, error.message);
    }
  }
  
  return createdOrders;
}

// Main seeding function
async function seedAll() {
  console.log('🌱 Starting demo data seeding...\n');
  console.log('='.repeat(50));
  
  try {
    // Seed categories
    const categoryDocs = await seedCategories();
    const categoryMap = {};
    categoryDocs.forEach(cat => {
      const matchingCategory = categories.find(c => c.name === cat.name);
      if (matchingCategory) {
        categoryMap[matchingCategory.name] = cat.$id;
      }
    });
    
    // Seed products
    const productDocs = await seedProducts(categoryMap);
    
    // Seed customers
    const customerDocs = await seedCustomers();
    
    // Fetch existing products and customers if seeding failed (already exist)
    let allProducts = productDocs;
    let allCustomers = customerDocs;
    
    if (productDocs.length === 0) {
      console.log('\n⚠️  No new products created. Fetching existing products...');
      try {
        const response = await databases.listDocuments(DATABASE_ID, 'products');
        allProducts = response.documents;
        console.log(`✓ Found ${allProducts.length} existing products`);
      } catch (error) {
        console.error('✗ Error fetching existing products:', error.message);
      }
    }
    
    if (customerDocs.length === 0) {
      console.log('\n⚠️  No new customers created. Fetching existing customers...');
      try {
        const response = await databases.listDocuments(DATABASE_ID, 'customers');
        allCustomers = response.documents;
        console.log(`✓ Found ${allCustomers.length} existing customers`);
      } catch (error) {
        console.error('✗ Error fetching existing customers:', error.message);
      }
    }
    
    // Seed orders only if we have products and customers
    let orderDocs = [];
    if (allProducts.length > 0 && allCustomers.length > 0) {
      orderDocs = await seedOrders(allCustomers, allProducts);
    } else {
      console.log('\n⚠️  Skipping order creation - need products and customers first');
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ Demo data seeding completed successfully!');
    console.log(`\nSummary:`);
    console.log(`  Categories: ${categoryDocs.length} new`);
    console.log(`  Products: ${productDocs.length} new (${allProducts.length} total)`);
    console.log(`  Customers: ${customerDocs.length} new (${allCustomers.length} total)`);
    console.log(`  Orders: ${orderDocs.length} new`);
    console.log('\n🎬 Your database is now ready for the marketing video!');
    
  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
    process.exit(1);
  }
}

// Run the seeding
seedAll();
