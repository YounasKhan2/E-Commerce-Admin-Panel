'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
  { name: 'Orders', href: '/orders', icon: 'shopping_cart' },
  { name: 'Products', href: '/products', icon: 'inventory_2' },
  { name: 'Categories', href: '/categories', icon: 'category' },
  { name: 'Customers', href: '/customers', icon: 'group' },
  { name: 'Analytics', href: '/analytics', icon: 'bar_chart' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const isActive = (href) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside className="flex h-screen flex-col justify-between bg-sidebar p-4 sticky top-0 w-64">
      {/* Top Section */}
      <div className="flex flex-col gap-4">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="bg-primary rounded-full size-10 flex items-center justify-center">
            <span className="material-symbols-outlined fill text-white text-xl">
              storefront
            </span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-white text-base font-medium leading-normal">
              Metrix Commerce
            </h1>
            <p className="text-slate-400 text-sm font-normal leading-normal">
              Admin Panel
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2 mt-4">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  active
                    ? 'bg-primary'
                    : 'hover:bg-white/10'
                }`}
              >
                <span className={`material-symbols-outlined text-white ${active ? 'fill' : ''}`}>
                  {item.icon}
                </span>
                <p className="text-white text-sm font-medium leading-normal">
                  {item.name}
                </p>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
        >
          <span className="material-symbols-outlined text-white">settings</span>
          <p className="text-white text-sm font-medium leading-normal">
            Settings
          </p>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors duration-200 w-full text-left"
        >
          <span className="material-symbols-outlined text-white">logout</span>
          <p className="text-white text-sm font-medium leading-normal">
            Log out
          </p>
        </button>
      </div>
    </aside>
  );
}
