import PageHeader from '@/components/layout/PageHeader';
import AlertList from '@/components/alerts/AlertList';

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Welcome to your e-commerce admin panel"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Placeholder metric cards */}
        {[
          { label: 'Total Revenue', value: '$0.00', icon: 'payments' },
          { label: 'Total Orders', value: '0', icon: 'shopping_cart' },
          { label: 'Customers', value: '0', icon: 'group' },
          { label: 'Products', value: '0', icon: 'inventory_2' },
        ].map((metric) => (
          <div
            key={metric.label}
            className="bg-sidebar border border-slate-700 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="material-symbols-outlined text-primary text-3xl">
                {metric.icon}
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-1">{metric.label}</p>
            <p className="text-white text-2xl font-bold">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Low Stock Alerts Section */}
      <div className="mt-8 bg-sidebar border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-xl font-semibold">
            Low Stock Alerts
          </h2>
          <span className="material-symbols-outlined text-slate-400">
            notifications
          </span>
        </div>
        <AlertList limit={5} />
      </div>

      <div className="mt-8 bg-sidebar border border-slate-700 rounded-xl p-6">
        <h2 className="text-white text-xl font-semibold mb-4">
          Getting Started
        </h2>
        <div className="space-y-3 text-slate-300 text-sm">
          <p>✅ Authentication system is ready</p>
          <p>✅ Navigation and layout are set up</p>
          <p>✅ Appwrite backend is connected</p>
          <p className="text-primary font-medium mt-4">
            Next: Build the UI components and start managing your store!
          </p>
        </div>
      </div>
    </>
  );
}
