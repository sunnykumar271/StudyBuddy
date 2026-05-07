import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser, selectToken } from '../features/authSlice';

export const useAuth = () => {
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const navigate = useNavigate();

  const requireAuth = () => {
    if (!token) navigate('/login');
  };

  return {
    user,
    token,
    isAuthenticated: !!token,
    requireAuth,
  };
};
