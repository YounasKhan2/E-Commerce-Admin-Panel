# Metrix Commerce - E-Commerce Admin Panel

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-18-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![Appwrite](https://img.shields.io/badge/Appwrite-Backend-f02e65)
![Deployment](https://img.shields.io/badge/Deploy-Ready-success)

A comprehensive, production-ready admin dashboard for managing e-commerce operations including products, orders, customers, analytics, and support tickets. Built with Next.js 14 and powered by Appwrite backend.

**🚀 [Deploy to Vercel](https://vercel.com/new)** | [Features](#-features) • [Installation](#-installation) • [Documentation](#-documentation) • [Deployment](#-deployment)

</div>

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [Core Features](#-core-features)
- [UI Components](#-ui-components)
- [API Integration](#-api-integration)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Performance](#-performance)
- [Security](#-security)
- [Contributing](#-contributing)
- [Documentation](#-documentation)
- [License](#-license)

---

## 🚀 Features

### Product Management
- ✅ Complete CRUD operations for products
- ✅ Multi-image upload with drag-and-drop
- ✅ Product variants (size, color, etc.)
- ✅ Inventory tracking with low stock alerts
- ✅ Category management
- ✅ SKU generation and validation
- ✅ Bulk operations support

### Order Management
- ✅ Order listing with advanced filters
- ✅ Order status tracking (pending, confirmed, shipped, delivered)
- ✅ Payment status management
- ✅ Fulfillment workflow
- ✅ Invoice generation (PDF)
- ✅ Shipping tracking integration
- ✅ Order timeline and history

### Customer Management
- ✅ Customer profiles with complete information
- ✅ Order history per customer
- ✅ Customer segmentation
- ✅ Address management
- ✅ Customer tags and notes
- ✅ Lifetime value tracking
- ✅ Customer search and filtering

### Support System
- ✅ Support ticket management
- ✅ Priority levels (low, medium, high, urgent)
- ✅ Status tracking (open, in progress, resolved, closed)
- ✅ Message threading
- ✅ File attachments
- ✅ Assignment to team members
- ✅ Response time tracking

### Analytics & Reporting
- ✅ Revenue tracking and trends
- ✅ Order statistics
- ✅ Product performance metrics
- ✅ Sales by category
- ✅ Payment status distribution
- ✅ Date range filtering
- ✅ CSV export functionality
- ✅ Real-time dashboard metrics

### UI/UX Features
- ✅ Dark theme optimized design
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Smooth transitions and animations
- ✅ Loading states and skeleton loaders
- ✅ Toast notifications
- ✅ Error handling and validation
- ✅ Keyboard navigation support
- ✅ Accessible components (WCAG AA)

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3.4 with custom theme
- **Icons**: Material Symbols Outlined
- **Typography**: Inter font family
- **State Management**: React Context API + Custom Hooks
- **Data Fetching**: Native fetch with custom hooks
- **Form Handling**: Controlled components with validation
- **Charts**: Recharts (for analytics)

### Backend
- **BaaS**: Appwrite Cloud
- **Database**: Appwrite Database (NoSQL)
- **Storage**: Appwrite Storage (for images and files)
- **Functions**: Appwrite Functions (serverless)
- **Authentication**: Appwrite Auth

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Code Formatting**: Prettier (recommended)
- **Version Control**: Git

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.0 or higher
- **npm**: Version 9.0 or higher (comes with Node.js)
- **Appwrite Account**: Sign up at [appwrite.io](https://appwrite.io)
- **Git**: For version control

### System Requirements
- **OS**: Windows, macOS, or Linux
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: 500MB for dependencies

---

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ecommerce-admin
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- next
- react
- react-dom
- tailwindcss
- appwrite
- recharts
- and more...

### 3. Configure Environment Variables

Create or update `.env.local` in the root directory:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here

# Optional: Custom Configuration
NEXT_PUBLIC_APP_NAME=Metrix Commerce
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set Up Appwrite Backend

#### Create Database
1. Log in to your Appwrite Console
2. Create a new database named `ecommerce_main`
3. Create the following collections (see [Database Schema](#database-schema))

#### Create Storage Buckets
1. Create bucket: `product-images` (max file size: 10MB)
2. Create bucket: `invoices` (max file size: 5MB)
3. Create bucket: `documents` (max file size: 10MB)

#### Deploy Functions
1. Deploy `generateInvoice` function
2. Deploy `processOrder` function
3. Deploy `calculateAnalytics` function

See [Appwrite Setup Guide](#appwrite-setup-guide) for detailed instructions.

### 5. Run Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### 6. Build for Production

```bash
npm run build
npm start
```

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_APPWRITE_ENDPOINT` | Appwrite API endpoint | Yes | - |
| `NEXT_PUBLIC_APPWRITE_PROJECT_ID` | Your Appwrite project ID | Yes | - |
| `NEXT_PUBLIC_APP_NAME` | Application name | No | Metrix Commerce |
| `NEXT_PUBLIC_APP_URL` | Application URL | No | http://localhost:3000 |

### Tailwind Configuration

Custom theme configuration in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#1173d4',
      'background-dark': '#101922',
      sidebar: '#192734',
      positive: '#0bda5b',
      negative: '#fa6238',
    },
    fontFamily: {
      display: ['var(--font-display)', 'Inter', 'sans-serif'],
    },
  },
}
```

---

## 📁 Project Structure

```
ecommerce-admin/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Authentication routes
│   │   └── login/               # Login page
│   ├── (dashboard)/             # Protected dashboard routes
│   │   ├── dashboard/           # Main dashboard
│   │   ├── products/            # Product management
│   │   ├── orders/              # Order management
│   │   ├── customers/           # Customer management
│   │   ├── categories/          # Category management
│   │   ├── segments/            # Customer segments
│   │   ├── support/             # Support tickets
│   │   ├── analytics/           # Analytics dashboard
│   │   ├── test-crud/           # CRUD testing page
│   │   └── ui-demo/             # UI components demo
│   ├── layout.js                # Root layout
│   ├── page.js                  # Home page (redirects)
│   └── globals.css              # Global styles
│
├── components/                   # React components
│   ├── ui/                      # Reusable UI components
│   │   ├── Button.js            # Button component
│   │   ├── Input.js             # Input component
│   │   ├── Modal.js             # Modal component
│   │   ├── Table.js             # Table component
│   │   ├── Alert.js             # Alert component
│   │   ├── Badge.js             # Badge component
│   │   ├── Card.js              # Card component
│   │   ├── Toast.js             # Toast notifications
│   │   ├── LoadingIndicator.js  # Loading spinners
│   │   ├── LoadingSkeleton.js   # Skeleton loaders
│   │   └── ErrorMessage.js      # Error display
│   ├── layout/                  # Layout components
│   │   ├── Sidebar.js           # Navigation sidebar
│   │   ├── PageHeader.js        # Page header
│   │   └── PageTransition.js    # Page transitions
│   ├── auth/                    # Authentication components
│   │   └── ProtectedRoute.js    # Route protection
│   ├── products/                # Product components
│   │   ├── ProductForm.js       # Product form
│   │   └── ImageUpload.js       # Image uploader
│   ├── orders/                  # Order components
│   │   └── InvoiceButton.js     # Invoice generator
│   ├── customers/               # Customer components
│   │   └── CustomerCard.js      # Customer card
│   ├── analytics/               # Analytics components
│   │   ├── MetricCard.js        # Metric display
│   │   ├── RevenueChart.js      # Revenue chart
│   │   ├── OrderChart.js        # Order chart
│   │   ├── TopProducts.js       # Top products
│   │   ├── DateRangeSelector.js # Date picker
│   │   ├── CategorySalesChart.js
│   │   ├── PaymentStatusChart.js
│   │   └── ProductPerformanceTable.js
│   ├── alerts/                  # Alert components
│   │   └── AlertList.js         # Alert list
│   └── ErrorBoundary.js         # Error boundary
│
├── lib/                         # Utilities and helpers
│   ├── appwrite/               # Appwrite integration
│   │   ├── client.js           # Appwrite client setup
│   │   ├── database.js         # Database operations
│   │   ├── storage.js          # Storage operations
│   │   └── functions.js        # Function calls
│   ├── hooks/                  # Custom React hooks
│   │   ├── useProducts.js      # Product operations
│   │   ├── useOrders.js        # Order operations
│   │   ├── useCustomers.js     # Customer operations
│   │   ├── useAnalytics.js     # Analytics data
│   │   └── useLoadingState.js  # Loading state manager
│   └── utils/                  # Utility functions
│       ├── formatters.js       # Data formatters
│       ├── validators.js       # Input validators
│       ├── constants.js        # App constants
│       ├── alerts.js           # Alert utilities
│       └── csvExport.js        # CSV export
│
├── contexts/                    # React contexts
│   └── AuthContext.js          # Authentication context
│
├── public/                      # Static assets
│
├── .env.local                   # Environment variables
├── .gitignore                   # Git ignore rules
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind configuration
├── package.json                 # Dependencies
├── README.md                    # This file
├── TESTING_GUIDE.md            # Testing documentation
└── UI_DESIGN_SYSTEM.md         # Design system docs
```

---

## 🏗️ Architecture

### Application Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Next.js App Router                   │
│  ┌────────────────────────────────────────────────────┐ │
│  │              Client Components (RSC)                │ │
│  │  ┌──────────────────────────────────────────────┐  │ │
│  │  │         React Context (Auth, Toast)          │  │ │
│  │  └──────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────┐  │ │
│  │  │          Custom Hooks (Data Layer)           │  │ │
│  │  └──────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────┐  │ │
│  │  │         Appwrite SDK (API Layer)             │  │ │
│  │  └──────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   Appwrite Backend                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Database   │  │   Storage    │  │  Functions   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Interaction** → Component
2. **Component** → Custom Hook
3. **Custom Hook** → Appwrite SDK
4. **Appwrite SDK** → Appwrite Backend
5. **Backend Response** → Hook → Component
6. **Component** → UI Update

### State Management

- **Global State**: React Context (Auth, Toast)
- **Server State**: Custom hooks with local caching
- **UI State**: Component-level useState
- **Form State**: Controlled components

---

## 🎯 Core Features

### Authentication

**Location**: `app/(auth)/login/page.js`, `contexts/AuthContext.js`

```javascript
// Login
const { login } = useAuth();
await login(email, password);

// Logout
const { logout } = useAuth();
await logout();

// Get current user
const { user, loading } = useAuth();
```

**Features**:
- Email/password authentication
- Session persistence
- Protected routes
- Auto-redirect on auth state change

### Product Management

**Location**: `app/(dashboard)/products/`

**Operations**:
- Create product with images
- Update product details
- Delete product
- Manage variants
- Track inventory
- Low stock alerts

**Example**:
```javascript
const { products, loading, createProduct, updateProduct, deleteProduct } = useProducts();

// Create product
await createProduct({
  name: 'Product Name',
  price: 99.99,
  sku: 'SKU-001',
  inventory: 100,
  // ... more fields
});
```

### Order Management

**Location**: `app/(dashboard)/orders/`

**Features**:
- Order listing with filters
- Order detail view
- Status updates
- Fulfillment tracking
- Invoice generation

**Order Statuses**:
- `pending` - Order placed
- `confirmed` - Order confirmed
- `processing` - Being prepared
- `shipped` - In transit
- `delivered` - Completed
- `cancelled` - Cancelled

### Customer Management

**Location**: `app/(dashboard)/customers/`

**Features**:
- Customer profiles
- Order history
- Address management
- Customer segmentation
- Tags and notes

### Analytics

**Location**: `app/(dashboard)/analytics/`

**Metrics**:
- Total Revenue
- Order Count
- Average Order Value
- Sales by Category
- Product Performance
- Payment Status Distribution

**Export**: CSV export for all analytics data

---

## 🎨 UI Components

### Button Component

```javascript
import Button from '@/components/ui/Button';

<Button 
  variant="primary"  // primary, secondary, danger, ghost
  size="md"          // sm, md, lg
  icon="add"         // Material icon name
  loading={false}    // Show loading state
  onClick={handleClick}
>
  Click Me
</Button>
```

### Input Component

```javascript
import Input from '@/components/ui/Input';

<Input
  label="Email"
  type="email"
  icon="email"
  error={errors.email}
  helperText="Enter your email"
  required
  {...register('email')}
/>
```

### Table Component

```javascript
import Table from '@/components/ui/Table';

<Table
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'price', label: 'Price', render: (val) => formatCurrency(val) }
  ]}
  data={products}
  loading={loading}
  onRowClick={(row) => router.push(`/products/${row.$id}`)}
  pagination={{
    page: 1,
    pageSize: 25,
    total: 100
  }}
  onPageChange={setPage}
/>
```

### Modal Component

```javascript
import Modal from '@/components/ui/Modal';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Delete"
  size="md"  // sm, md, lg, xl
  footer={
    <>
      <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
      <Button variant="danger" onClick={handleDelete}>Delete</Button>
    </>
  }
>
  Are you sure you want to delete this item?
</Modal>
```

### Toast Notifications

```javascript
import { useToast } from '@/components/ui/Toast';

const toast = useToast();

// Show notifications
toast.success('Product created successfully!');
toast.error('Failed to save changes');
toast.warning('Low stock alert');
toast.info('New order received');
```

### Loading States

```javascript
import { LoadingSpinner, InlineLoader, LoadingOverlay } from '@/components/ui/LoadingIndicator';
import { TableSkeleton, CardSkeleton } from '@/components/ui/LoadingSkeleton';

// Spinner
<LoadingSpinner size="md" />

// Inline loader
<InlineLoader text="Loading products..." />

// Full page overlay
<LoadingOverlay message="Processing..." />

// Skeleton loaders
<TableSkeleton rows={5} columns={4} />
<CardSkeleton count={4} />
```

---

## 🔌 API Integration

### Database Operations

```javascript
import { 
  listDocuments, 
  getDocument, 
  createDocument, 
  updateDocument, 
  deleteDocument,
  COLLECTIONS 
} from '@/lib/appwrite/database';

// List documents
const products = await listDocuments(
  COLLECTIONS.PRODUCTS,
  [Query.equal('status', 'active')],
  page,
  pageSize
);

// Get single document
const product = await getDocument(COLLECTIONS.PRODUCTS, productId);

// Create document
const newProduct = await createDocument(COLLECTIONS.PRODUCTS, data);

// Update document
const updated = await updateDocument(COLLECTIONS.PRODUCTS, productId, data);

// Delete document
await deleteDocument(COLLECTIONS.PRODUCTS, productId);
```

### Storage Operations

```javascript
import { uploadFile, getFileUrl, deleteFile } from '@/lib/appwrite/storage';

// Upload file
const file = await uploadFile('product-images', file, fileId);

// Get file URL
const url = getFileUrl('product-images', fileId);

// Delete file
await deleteFile('product-images', fileId);
```

### Function Calls

```javascript
import { executeFunction } from '@/lib/appwrite/functions';

// Generate invoice
const invoice = await executeFunction('generateInvoice', { orderId });

// Process order
await executeFunction('processOrder', { orderId, action: 'ship' });
```

---

## 🧪 Testing

### Manual Testing

**Quick Test**:
1. Navigate to `/test-crud`
2. Click "Run All Tests"
3. Verify all CRUD operations pass

### Test Coverage

- ✅ Authentication flow
- ✅ Product CRUD operations
- ✅ Order CRUD operations
- ✅ Customer CRUD operations
- ✅ Navigation and routing
- ✅ Responsive design
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states

### UI Component Demo

Navigate to `/ui-demo` to test:
- Toast notifications
- Lo
ading indicators
- Skeleton loaders
- Button states
- Transitions and animations

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Add environment variables
   - Deploy

3. **Configure Environment**
   - Add all `NEXT_PUBLIC_*` variables
   - Update `NEXT_PUBLIC_APP_URL` to your domain

### Other Platforms

- **Netlify**: Similar to Vercel
- **AWS Amplify**: Full AWS integration
- **Docker**: Use provided Dockerfile (if available)

### Build Command

```bash
npm run build
```

### Start Command

```bash
npm start
```

---

## ⚡ Performance

### Optimization Techniques

- **Code Splitting**: Automatic with Next.js App Router
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: Dynamic imports for heavy components
- **Caching**: SWR for data caching
- **Bundle Size**: Tree shaking with ES modules

### Performance Metrics

Target metrics:
- **FCP** (First Contentful Paint): < 1.8s
- **LCP** (Largest Contentful Paint): < 2.5s
- **TTI** (Time to Interactive): < 3.8s
- **CLS** (Cumulative Layout Shift): < 0.1
- **FID** (First Input Delay): < 100ms

### Monitoring

Use Vercel Analytics or Google Lighthouse for monitoring.

---

## 🔒 Security

### Best Practices

- ✅ Environment variables for sensitive data
- ✅ Protected routes with authentication
- ✅ Input validation and sanitization
- ✅ CSRF protection (Next.js built-in)
- ✅ XSS prevention (React built-in)
- ✅ Secure headers configuration
- ✅ API key rotation policy

### Appwrite Security

- Row-level security on collections
- Role-based access control
- API key restrictions
- Rate limiting
- File upload validation

---

## 🤝 Contributing

### Development Workflow

1. Create a feature branch
   ```bash
   git checkout -b feature/your-feature
   ```

2. Make changes and commit
   ```bash
   git add .
   git commit -m "Add your feature"
   ```

3. Push and create PR
   ```bash
   git push origin feature/your-feature
   ```

### Code Style

- Use ESLint configuration
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic

---

## 📚 Documentation

### Additional Resources

- **[UI_DESIGN_SYSTEM.md](./UI_DESIGN_SYSTEM.md)** - Design system documentation
- **[Appwrite Docs](https://appwrite.io/docs)** - Appwrite documentation
- **[Next.js Docs](https://nextjs.org/docs)** - Next.js documentation
- **[Tailwind Docs](https://tailwindcss.com/docs)** - Tailwind CSS documentation

### Database Schema

See refer to:
- `lib/appwrite/client.js` for collection IDs

---

## 📝 License

This project is private and proprietary.

---

## 👥 Support

For issues, questions, orntributions:
- Create an issue in the repository
- Contact the development team
- Refer to documentation files

---

## 🎉 Acknowledgments

Built with:
- Next.js by Vercel
- Appwrite by Appwrite Team
- Tailwind CSS by Tailwind Labs
- Material Symbols by Google
- Inter font by Rasmus Andersson

---

lign="center">

**Metrix Commerce Admin Panel** - Built for modern e-commerce management

Made with ❤️ using Next.js and Appwrite

</div>