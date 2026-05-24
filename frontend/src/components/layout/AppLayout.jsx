import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto min-h-screen">
        <div className="p-6 max-w-7xl mx-auto w-full animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}