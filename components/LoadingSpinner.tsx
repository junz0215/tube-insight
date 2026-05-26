export default function LoadingSpinner({ label = '불러오는 중...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div
        className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: '#fc5000', borderTopColor: 'transparent' }}
      />
      <p className="text-sm font-medium" style={{ color: '#717171', fontFamily: 'var(--font-dm-sans)' }}>
        {label}
      </p>
    </div>
  );
}
