import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAbout } from '../../hooks/useAbout';

export function CareerHighlights() {
  const { about } = useAbout();
  const navigate = useNavigate();

  const handleFilter = (type: 'client' | 'year' | 'tag', value: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set(type, value);
    navigate(`/?${searchParams.toString()}`);
  };

  return (
    <div className="space-y-5">
      <h3 className="text-subheadline font-medium opacity-60 dark:text-white/60">CAREER HIGHLIGHTS</h3>
      <div className="bg-white dark:bg-[#282828] rounded-2xl p-6">
        {about?.career_highlights.map((highlight, index) => (
          <React.Fragment key={highlight.id}>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <button 
                  onClick={() => handleFilter('client', highlight.company)}
                  className="flex-shrink-0"
                >
                  <img 
                    src={highlight.logo_url} 
                    alt={highlight.company} 
                    className="w-[54px] h-[54px] rounded-[8px] bg-border/10 hover:opacity-80 transition-opacity" 
                  />
                </button>
                <div className="flex-1 min-w-0 space-y-1">
                  <button
                    onClick={() => handleFilter('client', highlight.company)}
                    className="text-[22px] leading-[27px] font-semibold dark:text-white/90 hover:opacity-80 transition-opacity text-left"
                  >
                    {highlight.company}
                  </button>
                  <div className="text-[16px] leading-[19px] text-foreground/60">
                    at {highlight.role}
                  </div>
                </div>
              </div>
              <p className="text-[16px] leading-[24px] text-foreground/80 dark:text-white/80">
                {highlight.period}
              </p>
            </div>
            {index < about.career_highlights.length - 1 && (
              <div className="h-px bg-[#E5E5E5] dark:bg-white/10 my-6" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
} 