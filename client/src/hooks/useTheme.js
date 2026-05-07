import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme, selectTheme } from '../features/themeSlice';

export const useTheme = () => {
  const dispatch = useDispatch();
  const mode = useSelector(selectTheme);

  return {
    mode,
    isDark: mode === 'dark',
    toggle: () => dispatch(toggleTheme()),
  };
};
