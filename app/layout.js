import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata = {
  title: {
    default: "Metrix Commerce - Admin Panel",
    template: "%s | Metrix Commerce"
  },
  description: "E-commerce admin dashboard for managing products, orders, customers, and analytics",
  keywords: ["ecommerce", "admin", "dashboard", "products", "orders", "customers", "analytics"],
  authors: [{ name: "Metrix Commerce" }],
  creator: "Metrix Commerce",
  publisher: "Metrix Commerce",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: "Metrix Commerce - Admin Panel",
    description: "E-commerce admin dashboard for managing products, orders, customers, and analytics",
    type: "website",
    locale: "en_US",
    siteName: "Metrix Commerce",
  },
  twitter: {
    card: "summary_large_image",
    title: "Metrix Commerce - Admin Panel",
    description: "E-commerce admin dashboard for managing products, orders, customers, and analytics",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.svg', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-display antialiased`}>
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
