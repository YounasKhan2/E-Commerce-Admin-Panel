# Metrix Commerce - E-Commerce Admin Panel

A comprehensive admin dashboard for managing products, orders, customers, and analytics. Built with Next.js 14 and integrated with Appwrite backend.

## 🚀 Features

- **Product Management** - Full CRUD operations with image uploads and inventory tracking
- **Order Processing** - Complete order workflow with status tracking and fulfillment
- **Customer Management** - Customer profiles, segmentation, and support tickets
- **Analytics & Reporting** - Sales reports, product performance, and key metrics
- **Dark Theme UI** - Professional compact design based on Google Stitch

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, JavaScript
- **Styling**: Tailwind CSS with custom theme
- **Backend**: Appwrite (Database, Storage, Functions)
- **State Management**: React Context + Custom Hooks
- **Forms**: React Hook Form
- **Data Fetching**: SWR
- **Icons**: Material Symbols Outlined
- **Font**: Inter

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Appwrite account with configured backend

## 🔧 Installation

1. **Clone and navigate to the project**
   ```bash
   cd ecommerce-admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Update `.env.local` with your Appwrite credentials:
   ```env
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Design System

- **Primary Color**: `#1173d4`
- **Background**: `#101922`
- **Sidebar**: `#192734`
- **Success**: `#0bda5b`
- **Error**: `#fa6238`
- **Font**: Inter (400, 500, 600, 700, 800, 900)
- **Icons**: Material Symbols Outlined

## 📁 Project Structure

```
ecommerce-admin/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Dashboard routes
│   ├── layout.js          # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components
│   ├── products/         # Product components
│   ├── orders/           # Order components
│   └── customers/        # Customer components
├── lib/                  # Utilities and helpers
│   ├── appwrite/        # Appwrite client & operations
│   ├── hooks/           # Custom React hooks
│   └── utils/           # Utility functions
└── contexts/            # React contexts
```

## 🗄️ Appwrite Backend

### Database: `ecommerce_main`
- categories
- products
- product_variants
- customers
- orders
- order_items
- alerts
- support_tickets
- ticket_messages
- customer_segments

### Storage Buckets
- product-images
- invoices
- documents

### Functions
- generateInvoice
- processOrder
- calculateAnalytics

## 🚦 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 📝 License

This project is private and proprietary.

## 👥 Team

Built for e-commerce business owners and administrators.
