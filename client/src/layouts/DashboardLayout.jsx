import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-surface-light dark:bg-gray-950">
      <Navbar />
      <Sidebar />
      {/* Main content — offset for navbar (top-16) and sidebar (left-60 on lg) */}
      <main className="pt-16 lg:pl-60 min-h-screen">
        <div className="p-6 max-w-6xl mx-auto animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
