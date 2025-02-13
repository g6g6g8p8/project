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
        
        return (
          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe
              src={video.url}
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
    <div className="bg-background dark:bg-black">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative"
      >
        <Link
          to="/"
          className="fixed top-8 right-8 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-gray-500/90 hover:bg-gray-600/90 backdrop-blur-sm text-white transition-colors"
        >
          <CloseIcon size={20} />
        </Link>

        <div className="relative">
          <div className="md:aspect-[21/9] aspect-[3/4] w-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-none">
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
          
          <div className="absolute inset-x-0 bottom-0 p-8">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-title-2 md:text-title-1 text-white mb-2">{project.title}</h1>
              <p className="text-callout md:text-body text-white/90 max-w-2xl leading-relaxed">{project.description}</p>
            </div>
          </div>
        </div>

        <div className="p-5 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-8 md:space-y-16">
              {content?.map((item) => (
                <div key={item.id} className="max-w-4xl">
                  {renderContent(item)}
                </div>
              ))}
            </div>

            <div className="mt-16 space-y-5">
              <h3 className="text-subheadline font-medium opacity-60">EXPLORE</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-footnote opacity-60 block mb-2">Category</span>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-2 bg-foreground/5 dark:bg-foreground/10 rounded-full text-footnote">
                      {project.category}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-footnote opacity-60 block mb-2">Client</span>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-2 bg-foreground/5 dark:bg-foreground/10 rounded-full text-footnote">
                      {project.client}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-footnote opacity-60 block mb-2">Role</span>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-2 bg-foreground/5 dark:bg-foreground/10 rounded-full text-footnote">
                      {project.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>

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
      </motion.div>
    </div>
  );
}