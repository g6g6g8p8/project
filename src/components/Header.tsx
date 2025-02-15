import { Link } from 'react-router-dom';
import { useAbout } from '../hooks/useAbout';

export function Header() {
  const { about } = useAbout();
  
  return (
    <header className="hidden md:flex items-center justify-between px-8 py-6">
      <div>
        <Link to="/" className="block">
          <h1 className="text-[26px] leading-[31px] font-semibold">{about?.title}</h1>
          <p className="text-[14px] leading-[20px] opacity-60 mt-1">{about?.subtitle}</p>
        </Link>
      </div>
      <Link to="/about" className="block">
        <img
          src={about?.avatar_url}
          alt="Avatar"
          className="w-10 h-10 rounded-full"
        />
      </Link>
    </header>
  );
} 