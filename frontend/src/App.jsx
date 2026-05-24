import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute   from './components/PrivateRoute';
import AppLayout      from './components/layout/AppLayout';

import Login       from './pages/Login';
import Dashboard   from './pages/Dashboard';
import Events      from './pages/Events';
import EventDetail from './pages/EventDetail';
import Users       from './pages/Users';
import NotFound    from './pages/NotFound';
import Register      from './pages/Register';
import Notifications from './pages/Notifications';


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard"      element={<Dashboard />} />
              <Route path="/events"         element={<Events />} />
              <Route path="/events/:id"     element={<EventDetail />} />
              <Route path="/register" element={<Register />} />
              <Route path="/notifications" element={<Notifications />} />
              {/* Hanya admin & ketua */}
              <Route element={<PrivateRoute roles={['admin', 'ketua']} />}>
                <Route path="/users" element={<Users />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}