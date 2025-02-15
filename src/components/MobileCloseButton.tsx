import { Link } from 'react-router-dom';
import { X as CloseIcon } from 'lucide-react';

export function MobileCloseButton() {
  return (
    <Link
      to="/"
      className="md:hidden fixed top-5 right-5 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white"
      aria-label="Close"
    >
      <CloseIcon size={20} />
    </Link>
  );
} 