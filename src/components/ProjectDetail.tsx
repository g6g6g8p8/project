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

  if (!project) {
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
    <div className="lg:grid lg:grid-cols-2 lg:gap-12">
      {/* Left Column - Fixed */}
      <div className="lg:sticky lg:top-12 lg:h-[calc(100vh-96px)] space-y-8">
        <button
          onClick={() => navigate(-1)}
          className="fixed top-8 right-8 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-gray-500/90 hover:bg-gray-600/90 backdrop-blur-sm text-white transition-colors"
        >
          <CloseIcon size={20} />
        </button>

        <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-border/10">
          <img 
            src={project.image_url} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-title-1">{project.title}</h1>
          <p className="text-body opacity-60">{project.description}</p>
        </div>
      </div>

      {/* Right Column - Scrollable */}
      <div className="mt-8 lg:mt-0 space-y-8">
        {project.content.map((section, index) => (
          <div key={index} className="space-y-4">
            {section.title && (
              <h2 className="text-title-3">{section.title}</h2>
            )}
            {section.content}
          </div>
        ))}
      </div>
    </div>
  );
}