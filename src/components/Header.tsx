import { Link } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import { useAbout } from '../hooks/useAbout';

export function Header() {
  const { about } = useAbout();
  
  return (
    <div className="p-5 md:p-8 lg:p-10">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <Link to="/" className="text-[25px] leading-[30px] md:text-[27px] md:leading-[32px] font-semibold tracking-[-.021em]">
              Giulio Pinotti,
            </Link>
            <span className="text-[20px] leading-[25px] md:text-[22px] md:leading-[27px] tracking-[-.021em] text-foreground/60">
              Creative Director
            </span>
          </div>
          <Link 
            to="/about"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-border/10 hover:bg-border/20 transition-colors overflow-hidden"
          >
            {about?.avatar_url ? (
              <img 
                src={about.avatar_url} 
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <UserCircle size={22} className="opacity-60" />
            )}
          </Link>
        </div>
      </div>
    </div>
  );
} 