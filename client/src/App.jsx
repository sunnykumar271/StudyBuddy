import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectToken, selectUser } from './features/authSlice';


// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOtp from './pages/verifyOtp';
import ResetPassword from './pages/resetPassword';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Groups from './pages/Groups';
import Group from './pages/Group';
import MyGroups from './pages/MyGroups';
import CreateGroup from './pages/CreateGroup';
import UsersPage from './pages/Users';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const token = useSelector(selectToken);
  return token ? children : <Navigate to="/login" replace />;
};

// Public route (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const token = useSelector(selectToken);
  return !token ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <>
      

      <Routes>
        {/* Public routes */}
        <Route element={<MainLayout />}>
          <Route
            path="/login"
            element={<PublicRoute><Login /></PublicRoute>}
          />
          <Route
            path="/signup"
            element={<PublicRoute><Signup /></PublicRoute>}
          />
          <Route
            path="/forgot-password"
            element={<PublicRoute><ForgotPassword /></PublicRoute>}
          />
          <Route
            path="/verify-otp"
            element={<VerifyOtp />} 
          />
          <Route
            path="/reset-password"
            element={<PublicRoute><ResetPassword /></PublicRoute>}
          />
        </Route>

        {/* Onboarding — standalone */}
        <Route
          path="/onboarding"
          element={<ProtectedRoute><Onboarding /></ProtectedRoute>}
        />

        {/* Protected dashboard routes */}
        <Route
          element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/group/:id" element={<Group />} />
          <Route path="/my-groups" element={<MyGroups />} />
          <Route path="/create-group" element={<CreateGroup />} />
          <Route path="/users" element={<UsersPage />} />
        </Route>

        {/* Default redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
