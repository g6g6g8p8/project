import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X as CloseIcon, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProject } from '../hooks/useProject';
import { getImageColor } from '../lib/utils';
import type { ProjectContent, GalleryItem } from '../types/database';
import { useProjects } from '../hooks/useProjects';
import { groupProjectsByTag } from '../lib/utils';
import ProjectCard from './ProjectCard';
import { LoadingSkeleton } from './LoadingSkeleton';

export default function ProjectDetail() {
  const { slug } = useParams();
  const { project, content, loading } = useProject(slug);
  const { projects } = useProjects();
  const navigate = useNavigate();
  const [imageColor, setImageColor] = useState<string>('');
  const [currentSlide, setCurrentSlide] = useState<Record<string, number>>({});
  const touchStart = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (project?.image_url) {
      getImageColor(project.image_url).then(setImageColor);
    }
  }, [project?.image_url]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const renderGalleryItem = (item: GalleryItem, index: number) => {
    if (item.type === 'video') {
      return (
        <div className="relative w-full h-full flex-shrink-0">
          <video
            src={item.url}
            poster={item.poster}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    return (
      <img
        key={index}
        src={item.url}
        alt={`Gallery image ${index + 1}`}
        className="w-full h-full object-cover flex-shrink-0"
      />
    );
  };

  const renderContent = (section: ProjectContent) => {
    switch (section.type) {
      case 'text':
        return (
          <div className="prose max-w-none">
            {section.content.text?.split('\n').map((paragraph, index) => (
              <p key={index} className="text-body opacity-80">{paragraph}</p>
            ))}
          </div>
        );

      case 'gallery':
        const gallery = section.content.gallery || [];
        const currentIndex = currentSlide[section.id] || 0;
        
        return (
          <div className="relative -mx-5 lg:mx-0">
            <div className="relative aspect-[4/5] overflow-hidden rounded-none lg:rounded-2xl">
              <div 
                className="flex transition-transform duration-300 ease-in-out h-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                onTouchStart={(e) => handleTouchStart(e, section.id)}
                onTouchMove={(e) => handleTouchMove(e, section.id, gallery.length)}
                onTouchEnd={handleTouchEnd}
              >
                {gallery.map((item, index) => renderGalleryItem(item, index))}
              </div>
              
              {gallery.length > 1 && (
                <>
                  <button
                    onClick={() => handleSlideChange(section.id, 'prev', gallery.length)}
                    className="absolute left-5 lg:left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    aria-label="Previous item"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => handleSlideChange(section.id, 'next', gallery.length)}
                    className="absolute right-5 lg:right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    aria-label="Next item"
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
        return (
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-border/10">
            <iframe
              src={section.content.video?.url}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="p-5 md:p-8 lg:p-10">
        <LoadingSkeleton />
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
    <div className="min-h-screen bg-background">
      {/* Hero Image */}
      <div className="relative">
        <div className="md:aspect-[21/9] aspect-[3/4] w-full shadow-[0_2px_8px_rgba(0,0,0,0.092)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] dark:shadow-none">
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
        
        <div className="absolute inset-x-0 bottom-0 px-5 md:px-8 lg:px-10 py-6">
          <div className="max-w-4xl">
            <h1 className="text-title-2 md:text-title-1 text-white mb-2">{project.title}</h1>
            <p className="text-callout md:text-body text-white/90 max-w-[90%] leading-loose">
              {project.description}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-5 md:px-8 lg:px-10 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8 md:space-y-16">
            {content?.map((item) => (
              <div key={item.id}>
                {renderContent(item)}
              </div>
            ))}
          </div>

          {/* Tags Section */}
          <div className="mt-16 space-y-5">
            <h3 className="text-subheadline font-medium opacity-60">EXPLORE</h3>
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

          {/* Related Projects */}
          <div className="mt-16 space-y-8">
            <h3 className="text-subheadline font-medium opacity-60">RELATED PROJECTS</h3>
            {Array.from(groupProjectsByTag(projects)).map(([tag, relatedProjects]) => (
              <div key={tag} className="space-y-4">
                <h4 className="text-[18px] leading-[22px] font-medium">{tag}</h4>
                <div className="relative">
                  <div className="flex overflow-x-auto pb-4 -mx-5 lg:mx-0 px-5 lg:px-0 gap-5 no-scrollbar">
                    {relatedProjects.map((relatedProject) => (
                      <div key={relatedProject.id} className="w-[280px] flex-shrink-0">
                        <ProjectCard project={relatedProject} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Share Button */}
          <div className="mt-16 flex items-center justify-center">
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
  );
}