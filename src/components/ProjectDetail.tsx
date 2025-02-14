import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X as CloseIcon, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProject } from '../hooks/useProject';
import { getImageColor } from '../lib/utils';
import type { ProjectContent } from '../types/database';

export default function ProjectDetail() {
  const { slug } = useParams();
  const { project, content, loading } = useProject(slug);
  const navigate = useNavigate();
  const [imageColor, setImageColor] = useState<string>('');
  const [currentSlide, setCurrentSlide] = useState<Record<string, number>>({});
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    if (project?.image_url) {
      getImageColor(project.image_url).then(setImageColor);
    }
  }, [project?.image_url]);

  const handleFilter = (type: 'client' | 'year' | 'tag', value: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set(type, value);
    navigate(`/?${searchParams.toString()}`);
  };

  const handleShare = async () => {
    if (!project) return;

    const shareData = {
      title: project.title,
      text: project.description,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleSlideChange = (contentId: string, direction: 'prev' | 'next', totalSlides: number) => {
    setCurrentSlide(prev => ({
      ...prev,
      [contentId]: (((prev[contentId] || 0) + (direction === 'next' ? 1 : -1)) + totalSlides) % totalSlides
    }));
  };

  const handleTouchStart = (e: React.TouchEvent, contentId: string) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent, contentId: string, totalSlides: number) => {
    if (touchStart.current === null) return;

    const touchEnd = e.touches[0].clientX;
    const diff = touchStart.current - touchEnd;

    // Swipe threshold of 50px
    if (Math.abs(diff) > 50) {
      const direction = diff > 0 ? 'next' : 'prev';
      handleSlideChange(contentId, direction, totalSlides);
      touchStart.current = null;
    }
  };

  const handleTouchEnd = () => {
    touchStart.current = null;
  };

  const renderContent = (content: ProjectContent) => {
    switch (content.type) {
      case 'text':
        return (
          <div className="prose max-w-none">
            {content.content.text?.split('\n').map((paragraph, index) => (
              <p key={index} className="text-body opacity-80">{paragraph}</p>
            ))}
          </div>
        );

      case 'gallery':
        const gallery = content.content.gallery || [];
        const currentIndex = currentSlide[content.id] || 0;
        
        return (
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
              <div 
                className="flex transition-transform duration-300 ease-in-out h-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                onTouchStart={(e) => handleTouchStart(e, content.id)}
                onTouchMove={(e) => handleTouchMove(e, content.id, gallery.length)}
                onTouchEnd={handleTouchEnd}
              >
                {gallery.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover flex-shrink-0"
                  />
                ))}
              </div>
              
              {gallery.length > 1 && (
                <>
                  <button
                    onClick={() => handleSlideChange(content.id, 'prev', gallery.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => handleSlideChange(content.id, 'next', gallery.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {gallery.map((_, index) => (
                      <div
                        key={index}
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                          index === currentIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        );

      case 'video':
        const video = content.content.video;
        if (!video?.url) return null;
        
        // Add parameters to hide title and byline
        const videoUrl = new URL(video.url);
        videoUrl.searchParams.set('title', '0');
        videoUrl.searchParams.set('byline', '0');
        videoUrl.searchParams.set('portrait', '0');
        
        return (
          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe
              src={videoUrl.toString()}
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        );

      default:
        return null;
    }
  };

  const renderTags = () => {
    if (!project) return null;

    const allTags = [
      ...project.tags.map(tag => ({ type: 'tag', value: tag })),
      { type: 'client', value: project.client },
      { type: 'role', value: project.role }
    ];

    return (
      <div className="flex flex-wrap gap-2">
        {allTags.map(({ type, value }, index) => (
          <button
            key={`${type}-${index}`}
            onClick={() => type === 'tag' && handleFilter('tag', value)}
            className="px-4 py-2 bg-foreground/5 hover:bg-foreground/10 dark:bg-foreground/10 dark:hover:bg-foreground/15 text-foreground/80 dark:text-foreground/90 rounded-full text-footnote transition-colors"
          >
            {value}
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foreground"></div>
      </div>
    );
  }

  if (!project || !content) {
    return (
      <div className="p-5 md:p-8 max-w-6xl mx-auto">
        <h1 className="text-title-2 mb-4">Project not found</h1>
        <Link to="/" className="text-body opacity-60 hover:opacity-100 transition-opacity inline-flex items-center gap-2">
          <CloseIcon size={20} />
          Back to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="lg:p-10">
      <div className="lg:grid lg:grid-cols-[40%_60%] lg:gap-12">
        {/* Left Column - Fixed */}
        <div className="lg:sticky lg:top-0 lg:h-screen">
          <button
            onClick={() => navigate(-1)}
            className="fixed lg:absolute top-8 right-8 z-50 w-9 h-9 flex items-center justify-center rounded-full bg-gray-500/90 hover:bg-gray-600/90 backdrop-blur-sm text-white transition-colors"
          >
            <CloseIcon size={17} />
          </button>

          {/* Project Card Style - Responsive to viewport height */}
          <div className="relative -mt-5 lg:mt-0">
            <div 
              className="
                aspect-[3/4] w-full 
                lg:aspect-auto 
                overflow-hidden 
                lg:rounded-2xl
                shadow-[0_2px_8px_rgba(0,0,0,0.05)]
                dark:shadow-none
                [@media(min-height:1080px)]:lg:aspect-[3/4]
                [@media(min-height:1080px)]:lg:my-10
                [@media(max-height:1080px)]:lg:h-screen
              "
            >
              <img 
                src={project.image_url} 
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div 
                className="absolute inset-0"
                style={{
                  background: imageColor 
                    ? `linear-gradient(to top, ${imageColor}99 0%, ${imageColor}00 100%)`
                    : 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)'
                }}
              />
            </div>
            
            <div className="absolute inset-x-0 bottom-0 p-6">
              <h1 className="text-[26px] leading-[31px] font-semibold text-white mb-2">{project.title}</h1>
              <p className="text-[14px] leading-[20px] text-white/90 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {[project.category, project.client].filter(Boolean).map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-white/10 rounded-full text-[12px] text-white/90"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Scrollable */}
        <div className="px-5 lg:px-0 mt-8 lg:mt-0">
          <div className="space-y-8">
            {content.map((section, index) => (
              <div key={index} className="space-y-4">
                {section.title && (
                  <h2 className="text-title-3">{section.title}</h2>
                )}
                {renderContent(section)}
              </div>
            ))}

            {/* Explore Section */}
            <div className="mt-16 space-y-5">
              <h3 className="text-subheadline font-medium opacity-60 dark:text-white/60">EXPLORE</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <button
                    key={index}
                    onClick={() => handleFilter('tag', tag)}
                    className="px-4 py-2 bg-gray-50 dark:bg-white/10 rounded-full text-footnote dark:text-white/90 hover:opacity-80 transition-opacity"
                  >
                    {tag}
                  </button>
                ))}
                <button
                  onClick={() => handleFilter('client', project.client)}
                  className="px-4 py-2 bg-gray-50 dark:bg-white/10 rounded-full text-footnote dark:text-white/90 hover:opacity-80 transition-opacity"
                >
                  {project.client}
                </button>
                <button
                  onClick={() => handleFilter('role', project.role)}
                  className="px-4 py-2 bg-gray-50 dark:bg-white/10 rounded-full text-footnote dark:text-white/90 hover:opacity-80 transition-opacity"
                >
                  {project.role}
                </button>
              </div>
            </div>

            {/* Share Button - Mobile Only */}
            <div className="mt-16 flex items-center justify-center lg:hidden">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-6 py-3 border border-border hover:bg-border/10 rounded-lg text-callout text-foreground transition-colors"
              >
                <Share2 size={18} />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}