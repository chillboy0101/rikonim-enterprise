export function BrandLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <img
        src="/brand/logo.png"
        alt="Rikonim Enterprise"
        className="h-full w-full object-contain object-left"
      />
    </div>
  );
}
