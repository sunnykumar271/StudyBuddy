import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, MessageSquare, UserCircle, PlusSquare, Layers,
  Menu, X,
} from 'lucide-react';

const navLinks = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard'     },
  { to: '/groups',        icon: Layers,          label: 'Browse Groups' },
  { to: '/my-groups',     icon: MessageSquare,   label: 'My Groups'     },
  { to: '/create-group',  icon: PlusSquare,      label: 'Create Group'  },
  { to: '/users',         icon: Users,           label: 'Find Students' },
];

const Sidebar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer on resize to lg+
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setDrawerOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  return (
    <>
      {/* ─── Desktop Sidebar (lg+) ─────────────────────────────────────── */}
      <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-60
                        bg-white dark:bg-gray-900
                        border-r border-gray-100 dark:border-gray-800
                        flex-col py-6 px-3 z-40
                        hidden lg:flex">
        <DesktopNav />
      </aside>

      {/* ─── Mobile / Tablet: Hamburger button (hidden on lg+) ─────────── */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="fixed top-3 left-3 z-50 p-2 rounded-lg
                   bg-white dark:bg-gray-900
                   border border-gray-200 dark:border-gray-700
                   shadow-sm text-gray-600 dark:text-gray-300
                   hover:bg-gray-50 dark:hover:bg-gray-800
                   transition-colors lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* ─── Drawer Overlay ────────────────────────────────────────────── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation drawer"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer panel */}
          <aside className="absolute left-0 top-0 h-full w-64
                            bg-white dark:bg-gray-900
                            border-r border-gray-100 dark:border-gray-800
                            flex flex-col py-6 px-3
                            shadow-xl
                            animate-slide-in-left">
            {/* Close button */}
            <button
              onClick={() => setDrawerOpen(false)}
              className="self-end mb-4 mr-1 p-1.5 rounded-lg
                         text-gray-400 hover:text-gray-600
                         dark:text-gray-500 dark:hover:text-gray-300
                         hover:bg-gray-100 dark:hover:bg-gray-800
                         transition-colors"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>

            <DesktopNav onLinkClick={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}

      {/* ─── Mobile Bottom Nav (sm only, hidden md+) ───────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40
                      bg-white dark:bg-gray-900
                      border-t border-gray-100 dark:border-gray-800
                      flex items-center justify-around
                      px-2 py-2 safe-area-pb
                      md:hidden">
        {navLinks.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg
               text-xs font-medium transition-colors min-w-0
               ${isActive
                 ? 'text-blue-600 dark:text-blue-400'
                 : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
               }`
            }
            aria-label={label}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="truncate w-full text-center leading-tight">
              {label.split(' ')[0]}
            </span>
          </NavLink>
        ))}
      </nav>
    </>
  );
};

/* Shared nav list used in both desktop sidebar and drawer */
const DesktopNav = ({ onLinkClick }) => (
  <div className="flex flex-col flex-1 overflow-y-auto">
    <nav className="flex-1 flex flex-col gap-1">
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-600
                    uppercase tracking-wider px-4 mb-2">
        Navigation
      </p>
      {navLinks.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          id={`sidebar-${label.toLowerCase().replace(/ /g, '-')}`}
          onClick={onLinkClick}
          className={({ isActive }) =>
            isActive ? 'nav-item-active' : 'nav-item'
          }
        >
          <Icon className="w-5 h-5 flex-shrink-0" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>

    <div className="px-4 pt-4 border-t border-gray-100 dark:border-gray-800">
      <p className="text-xs text-gray-400 dark:text-gray-600">StudyBuddy v1.0</p>
    </div>
  </div>
);

export default Sidebar;
