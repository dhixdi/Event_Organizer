import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';   // ← TAMBAH
import PrivateRoute   from './components/PrivateRoute';
import AppLayout      from './components/layout/AppLayout';

import Login        from './pages/Login';
import Register     from './pages/Register';
import Dashboard    from './pages/Dashboard';
import Events       from './pages/Events';
import EventDetail  from './pages/EventDetail';
import Users        from './pages/Users';
import Tugas        from './pages/Tugas';         // ← TAMBAH
import Profile      from './pages/Profile';       // ← TAMBAH
import Notifications from './pages/Notifications';
import NotFound     from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>                              {/* ← TAMBAH wrapper */}
        <BrowserRouter>
          <Routes>
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<PrivateRoute />}>
              <Route element={<AppLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard"    element={<Dashboard />} />
                <Route path="/events"       element={<Events />} />
                <Route path="/events/:id"   element={<EventDetail />} />
                <Route path="/tugas"        element={<Tugas />} />       {/* ← TAMBAH */}
                <Route path="/profile"      element={<Profile />} />     {/* ← TAMBAH */}
                <Route path="/notifikasi"   element={<Notifications />} />
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
      </ToastProvider>                             {/* ← TUTUP wrapper */}
    </AuthProvider>
  );
}