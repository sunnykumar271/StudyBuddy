import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, MessageSquare, UserCircle, PlusSquare, Layers,
} from 'lucide-react';

const navLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/groups', icon: Layers, label: 'Browse Groups' },
  { to: '/my-groups', icon: MessageSquare, label: 'My Groups' },
  { to: '/create-group', icon: PlusSquare, label: 'Create Group' },
  { to: '/users', icon: Users, label: 'Find Students' },
];

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-60 
                      bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800
                      flex flex-col py-6 px-3 z-40 hidden lg:flex">
      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider px-4 mb-2">
          Navigation
        </p>
        {navLinks.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            id={`sidebar-${label.toLowerCase().replace(/ /g, '-')}`}
            className={({ isActive }) =>
              isActive ? 'nav-item-active' : 'nav-item'
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-400 dark:text-gray-600">StudyBuddy v1.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;
