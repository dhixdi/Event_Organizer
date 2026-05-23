import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-6xl font-display font-bold text-primary">404</h1>
      <p className="text-muted">Halaman tidak ditemukan</p>
      <Link to="/dashboard" className="px-4 py-2 bg-primary rounded-lg text-sm hover:bg-primary/80 transition-colors">
        Kembali ke Dashboard
      </Link>
    </div>
  );
}