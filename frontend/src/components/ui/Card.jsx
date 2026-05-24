export default function Card({ children, className = '', hover = false, padding = true }) {
  return (
    <div className={`
      bg-surface rounded-2xl border border-border-light
      ${padding ? 'p-5' : ''}
      ${hover
        ? 'shadow-card hover:shadow-card-md hover:-translate-y-0.5 cursor-pointer transition-all duration-200'
        : 'shadow-card'}
      ${className}
    `}>
      {children}
    </div>
  );
}