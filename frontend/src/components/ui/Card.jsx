export default function Card({ children, className = '', hover = false }) {
  return (
    <div className={`glass rounded-xl p-6 ${hover ? 'hover:bg-white/10 hover:border-primary/30 transition-all duration-200 cursor-pointer' : ''} ${className}`}>
      {children}
    </div>
  );
}