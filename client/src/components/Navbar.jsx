import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser } from '../features/authSlice';
import { BookOpen, Bell, LogOut, User, Settings, ChevronDown } from 'lucide-react'; // Importing icons from lucide-react
import ThemeToggle from './ThemeToggle';
import Avatar from './Avatar';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16
                    bg-primary dark:bg-gray-950 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center
                          group-hover:scale-110 transition-transform duration-200">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            Study<span className="text-accent-light">Buddy</span>
          </span>
        </Link>

        {/* Right section */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {user && (
            <>
              {/* Notifications placeholder */}
             {/* <button className="relative w-10 h-10 rounded-xl flex items-center justify-center
                                 bg-white/10 hover:bg-white/20 transition-all duration-200">
                <Bell className="w-5 h-5 text-white" /> 
              </button>
              *}

              {/* User menu */}
              <div className="relative">
                <button
                  id="user-menu-btn"
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl
                             bg-white/10 hover:bg-white/20 transition-all duration-200"
                >
                  <Avatar name={user.name} size="xs" />
                  <span className="text-white text-sm font-medium hidden sm:block max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-white/70 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-12 w-48 card shadow-card py-1.5 z-50 animate-fade-in">
                    <Link
                      to={`/profile/${user._id}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700
                                 dark:text-gray-300 hover:bg-secondary/10 hover:text-secondary transition-colors"
                    >
                      <User className="w-4 h-4" /> My Profile
                    </Link>
                    <Link
                      to="/edit-profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700
                                 dark:text-gray-300 hover:bg-secondary/10 hover:text-secondary transition-colors"
                    >
                      <Settings className="w-4 h-4" /> Edit Profile
                    </Link>
                    <div className="border-t border-gray-100 dark:border-gray-800 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500
                                 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
