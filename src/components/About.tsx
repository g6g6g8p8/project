import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAbout } from '../hooks/useAbout';
import { Header } from './Header';
import { MobileCloseButton } from './MobileCloseButton';
import { CareerHighlights } from './about/CareerHighlights';
import { Brands } from './about/Brands';

export function About() {
  const { about, loading } = useAbout();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foreground"></div>
      </div>
    );
  }

  if (!about) return null;

  return (
    <div className="min-h-screen bg-[#F7F7F7] dark:bg-black">
      <MobileCloseButton />
      <div className="hidden md:block">
        <Header />
      </div>
      <div className="p-5 md:p-8 lg:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1200px] mx-auto">
          {/* Column 1: Profile & About Me */}
          <div className="space-y-8">
            {/* Profile Section */}
            <div className="bg-white dark:bg-[#282828] rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={about.avatar_url} 
                  alt=""
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h1 className="text-title-2 dark:text-white">{about.name}</h1>
                  <a href={`mailto:${about.email}`} className="text-body opacity-60 dark:text-white/60">
                    {about.email}
                  </a>
                </div>
              </div>
              <h2 className="text-title-3 dark:text-white">{about.title}</h2>
            </div>
            {/* About Me */}
            <div className="bg-white dark:bg-[#282828] rounded-2xl p-6">
              <h3 className="text-[18px] leading-[22px] mb-4 dark:text-white">About me</h3>
              <div className="prose dark:prose-invert">
                <p className="text-body dark:text-white/90">{about.short_bio}</p>
              </div>
            </div>
          </div>

          {/* Column 2: Career Highlights */}
          <div className="md:col-span-2 lg:col-span-1">
            <CareerHighlights />
          </div>

          {/* Awards Section */}
          <div className="space-y-5">
            <h3 className="text-[14px] leading-[17px] font-medium opacity-60 dark:text-white/60">AWARDS</h3>
            <div className="bg-white dark:bg-[#282828] rounded-2xl p-6">
              <div className="space-y-6">
                {about.awards.map((award, index) => (
                  <React.Fragment key={award.id}>
                    <div className="space-y-2">
                      <div className="text-[22px] leading-[27px] font-semibold dark:text-white/90">
                        {award.title}
                      </div>
                      <div className="text-[16px] leading-[19px] text-foreground/60">
                        {award.organization}
                      </div>
                      <p className="text-[16px] leading-[24px] text-foreground/80 dark:text-white/80">
                        {award.year}
                      </p>
                    </div>
                    {index < about.awards.length - 1 && (
                      <div className="h-px bg-[#E5E5E5] dark:bg-white/10" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: What I Do & Brands */}
          <div className="space-y-8">
            {/* What I Do */}
            <div className="space-y-5">
              <h3 className="text-[14px] leading-[17px] font-medium opacity-60 dark:text-white/60">WHAT I DO</h3>
              <div className="bg-white dark:bg-[#282828] rounded-2xl p-6">
                <p className="text-body dark:text-white/90">{about.what_i_do}</p>
              </div>
            </div>
            {/* Brands */}
            <Brands />
          </div>
        </div>
      </div>
    </div>
  );
} 