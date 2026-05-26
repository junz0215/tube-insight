import { AlertCircle } from 'lucide-react';

export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div
      className="flex items-center gap-3 p-5 mx-auto max-w-lg"
      style={{ backgroundColor: '#f7f6f2', borderRadius: '40px' }}
    >
      <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#fc5000' }} />
      <p className="text-sm font-medium" style={{ color: '#070607', fontFamily: 'var(--font-dm-sans)' }}>
        {message}
      </p>
    </div>
  );
}
