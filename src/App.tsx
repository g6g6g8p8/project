import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Link, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter as FilterIcon, 
  ArrowRight, 
  UserCircle, 
  X as CloseIcon, 
  Share2 
} from 'lucide-react';
import { LinkedInIcon, BehanceIcon, SoundCloudIcon } from './components/icons/SocialIcons';
import { useProjects, ProjectFilters } from './hooks/useProjects';
import { cn } from './lib/utils';
import ProjectDetail from './components/ProjectDetail';
import { ProjectCard } from './ProjectCard';
import { getImageColor } from './lib/utils';
import { useAbout } from './hooks/useAbout';

function FeaturedProjects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters: ProjectFilters = {
    client: searchParams.get('client') || undefined,
    year: searchParams.get('year') || undefined,
    tag: searchParams.get('tag') || undefined,
    role: searchParams.get('role') || undefined,
  };
  const { projects, loading } = useProjects(filters);
  const [imageColors, setImageColors] = useState<Record<number, string>>({});

  useEffect(() => {
    async function loadImageColors() {
      const colors: Record<number, string> = {};
      for (const project of projects) {
        colors[project.id] = await getImageColor(project.image_url);
      }
      setImageColors(colors);
    }
    if (projects.length > 0) {
      loadImageColors();
    }
  }, [projects]);

  const hasFilters = Boolean(filters.client || filters.year || filters.tag || filters.role);

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="space-y-8">
      {hasFilters && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FilterIcon size={20} className="opacity-60" />
            <span className="text-subheadline opacity-60">
              Filtering by: {filters.client || filters.year || filters.tag || filters.role}
            </span>
          </div>
          <button
            onClick={clearFilters}
            className="text-subheadline opacity-60 hover:opacity-100 transition-opacity"
          >
            Clear filters
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} imageColor={imageColors[project.id]} />
        ))}
      </div>
    </div>
  );
}

function Home() {
  const { about } = useAbout();
  const { projects } = useProjects();

  return (
    <div className="p-5 md:p-8 lg:p-10">
      <div className="flex items-center justify-between mb-5">
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
      <FeaturedProjects />
    </div>
  );
}

function About() {
  const { about, loading } = useAbout();
  const navigate = useNavigate();

  const handleFilter = (type: 'client' | 'year' | 'tag', value: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set(type, value);
    navigate(`/?${searchParams.toString()}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foreground"></div>
      </div>
    );
  }

  if (!about) return null;

  const CareerHighlights = () => (
    <div className="space-y-5">
      <h3 className="text-subheadline font-medium opacity-60 dark:text-white/60">CAREER HIGHLIGHTS</h3>
      <div className="bg-white dark:bg-[#282828] rounded-2xl p-6">
        {about.career_highlights.map((highlight, index) => (
          <React.Fragment key={highlight.id}>
            <div className="space-y-6">
              {/* Header with Logo and Title */}
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

              {/* Description */}
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

  const Brands = () => (
    <div className="space-y-5">
      <h3 className="text-subheadline font-medium opacity-60 dark:text-white/60">BRANDS I'VE WORKED WITH</h3>
      <div className="bg-white dark:bg-[#282828] rounded-2xl p-6">
        <div className="flex flex-wrap gap-2">
          {about.brands.map((brand, index) => (
            <button
              key={index}
              onClick={() => handleFilter('client', brand)}
              className="px-4 py-2 bg-gray-50 dark:bg-white/10 rounded-full text-footnote dark:text-white/90 hover:opacity-80 transition-opacity"
            >
              {brand}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F7F7] dark:bg-black">
      <div className="p-5 md:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
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

            {/* Career Highlights */}
            <CareerHighlights />

            {/* What I Do */}
            <div className="space-y-5">
              <h3 className="text-[14px] leading-[17px] font-medium opacity-60 dark:text-white/60">WHAT I DO</h3>
              <div className="bg-white dark:bg-[#282828] rounded-2xl p-6">
                <p className="text-body dark:text-white/90">{about.what_i_do}</p>
              </div>
            </div>

            {/* Brands */}
            <div className="space-y-5">
              <h3 className="text-[14px] leading-[17px] font-medium opacity-60 dark:text-white/60">BRANDS I'VE WORKED WITH</h3>
              <div className="bg-white dark:bg-[#282828] rounded-2xl p-6">
                <div className="flex flex-wrap gap-2">
                  {about.brands.map((brand, index) => (
                    <span key={index} className="px-4 py-2 bg-gray-50 dark:bg-white/10 rounded-full text-footnote dark:text-white/90">
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Awards */}
            <div className="space-y-5">
              <h3 className="text-[14px] leading-[17px] font-medium opacity-60 dark:text-white/60">AWARDS</h3>
              <div className="bg-white dark:bg-[#282828] rounded-2xl p-6">
                <div className="space-y-2">
                  {about.awards.map((award, index) => (
                    <p key={index} className="text-body dark:text-white/90">{award}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background dark:bg-black text-foreground">
        <main className="min-h-screen">
          <div className="max-w-[1440px] mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects/:slug" element={<ProjectDetail />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App