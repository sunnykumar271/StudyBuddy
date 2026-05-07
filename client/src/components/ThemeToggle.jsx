import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme, selectTheme } from '../features/themeSlice';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const mode = useSelector(selectTheme);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      aria-label="Toggle theme"
      className="relative w-10 h-10 rounded-xl flex items-center justify-center
                 bg-gray-100 dark:bg-gray-800 hover:bg-secondary/10 dark:hover:bg-secondary/20
                 transition-all duration-200 group"
    >
      <Sun
        className={`absolute w-5 h-5 text-amber-500 transition-all duration-300
                   ${mode === 'light' ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 rotate-90'}`}
      />
      <Moon
        className={`absolute w-5 h-5 text-secondary transition-all duration-300
                   ${mode === 'dark' ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'}`}
      />
    </button>
  );
};

export default ThemeToggle;
