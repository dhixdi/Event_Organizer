export default function Spinner({ size = 'md', label = '' }) {
  const sizes = {
    xs:  'w-4 h-4 border-[1.5px]',
    sm:  'w-5 h-5 border-2',
    md:  'w-8 h-8 border-2',
    lg:  'w-12 h-12 border-[3px]',
    xl:  'w-16 h-16 border-[3px]',
  };
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div className={`${sizes[size]} border-primary/20 border-t-primary rounded-full animate-spin`} />
      {label && <p className="text-sm text-text-muted animate-pulse-soft">{label}</p>}
    </div>
  );
}