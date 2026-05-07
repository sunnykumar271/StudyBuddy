import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-surface-light dark:bg-gray-950 flex items-center justify-center p-4">
      <Outlet />
    </div>
  );
};

export default MainLayout;
