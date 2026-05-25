import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import PrivateRoute   from './components/PrivateRoute';
import AppLayout      from './components/layout/AppLayout';

import Login               from './pages/Login';
import Register            from './pages/Register';
import Dashboard           from './pages/Dashboard';
import Events              from './pages/Events';
import EventDetail         from './pages/EventDetail';
import Users               from './pages/Users';
import Tugas               from './pages/Tugas';
import Profile             from './pages/Profile';
import Notifications       from './pages/Notifications';
import Chat                from './pages/Chat';
import Checklist           from './pages/Checklist';
import BroadcastNotifikasi from './pages/BroadcastNotifikasi';
import NotFound            from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
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
                <Route path="/tugas"        element={<Tugas />} />
                <Route path="/profile"      element={<Profile />} />
                <Route path="/notifikasi"   element={<Notifications />} />
                <Route path="/notifications" element={<Notifications />} />

                {/* Chat — semua role bisa akses */}
                <Route path="/chat/:eventId" element={<Chat />} />

                {/* Checklist realtime — semua role bisa akses */}
                <Route path="/checklist/:eventId" element={<Checklist />} />

                {/* Broadcast notif — admin & ketua only */}
                <Route element={<PrivateRoute roles={['admin', 'ketua']} />}>
                  <Route path="/users"             element={<Users />} />
                  <Route path="/notifikasi/kirim"  element={<BroadcastNotifikasi />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}