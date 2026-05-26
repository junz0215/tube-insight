interface Props {
  label: string;
  value: string;
  variant?: 'orange' | 'ash';
  icon?: React.ReactNode;
}

export default function StatsCard({ label, value, variant = 'ash', icon }: Props) {
  const isOrange = variant === 'orange';

  return (
    <div
      className="flex flex-col gap-2"
      style={{
        backgroundColor: isOrange ? '#fc5000' : '#f7f6f2',
        borderRadius: '40px',
        padding: '40px',
      }}
    >
      {icon && (
        <div className="mb-2" style={{ color: isOrange ? 'rgba(255,255,255,0.7)' : '#888' }}>
          {icon}
        </div>
      )}
      <div
        className="font-display leading-none break-all"
        style={{
          fontFamily: 'var(--font-bebas)',
          fontSize: '56px',
          letterSpacing: '0.02em',
          lineHeight: '0.94',
          color: isOrange ? '#ffffff' : '#070607',
        }}
      >
        {value}
      </div>
      <div
        className="text-sm font-medium mt-1"
        style={{
          fontFamily: 'var(--font-dm-sans)',
          color: isOrange ? 'rgba(255,255,255,0.85)' : '#717171',
        }}
      >
        {label}
      </div>
    </div>
  );
}
