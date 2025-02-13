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
import ProjectCard from './components/ProjectCard';
import { getImageColor } from './lib/utils';
import { useAbout } from './hooks/useAbout';

function DesktopSidebar() {
  const { projects } = useProjects();
  
  const categories = projects?.reduce((acc, project) => {
    const tag = project.tags[0] || 'Other';
    if (!acc[tag]) {
      acc[tag] = [];
    }
    acc[tag].push(project);
    return acc;
  }, {} as Record<string, typeof projects>);

  return (
    <aside className="hidden lg:block fixed h-screen w-68 bg-background border-r border-border p-6 overflow-y-auto">
      <Link to="/" className="text-[22px] leading-[27px] md:text-[27px] md:leading-[32px] font-semibold tracking-[-.021em] block mb-8">
        Giulio Pinotti
      </Link>
      
      <nav className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex-1 space-y-8">
          {categories && Object.entries(categories).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-subheadline font-medium opacity-60 mb-2">
                {category} ({items.length})
              </h2>
              <ul className="space-y-2">
                {items.map((project) => (
                  <li key={project.id}>
                    <NavLink
                      to={`/projects/${project.slug}`}
                      className={({ isActive }) =>
                        cn(
                          "block text-callout hover:opacity-80 transition-opacity",
                          isActive ? "opacity-100" : "opacity-60"
                        )
                      }
                    >
                      {project.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="space-y-8">
          <div className="space-y-2">
            <NavLink
              to="/about"
              className={({ isActive }) =>
                cn(
                  "block text-callout hover:opacity-80 transition-opacity",
                  isActive ? "opacity-100" : "opacity-60"
                )
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                cn(
                  "block text-callout hover:opacity-80 transition-opacity",
                  isActive ? "opacity-100" : "opacity-60"
                )
              }
            >
              Contact
            </NavLink>
          </div>

          <div className="flex space-x-4">
            <a
              href="https://linkedin.com/in/pinotti"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              <i className="bi bi-linkedin text-xl"></i>
            </a>
            <a
              href="https://behance.net/giuliopinotti"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              <i className="bi bi-behance text-xl"></i>
            </a>
            <a
              href="https://www.youtube.com/@giuliopinotti"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              <i className="bi bi-youtube text-xl"></i>
            </a>
            <a
              href="https://soundcloud.com/djpinotti"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-border/10 hover:bg-border/20 transition-colors"
            >
              <i className="bi bi-soundwave opacity-60 text-lg"></i>
            </a>
          </div>
        </div>
      </nav>
    </aside>
  );
}

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
    <div className="p-5">
      <div className="lg:hidden flex items-center justify-between mb-5">
        <Link to="/" className="text-[22px] leading-[27px] md:text-[27px] md:leading-[32px] font-semibold tracking-[-.021em]">
          Giulio Pinotti
        </Link>
        <Link 
          to="/about"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-border/10 hover:bg-border/20 transition-colors overflow-hidden"
        >
          {about?.avatar_url ? (
            <img 
              src={about.avatar_url} 
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <UserCircle size={24} className="opacity-60" />
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

  const handleShare = async () => {
    const shareData = {
      title: about?.name || 'About',
      text: about?.short_bio || '',
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foreground"></div>
      </div>
    );
  }

  if (!about) return null;

  return (
    <div className="p-5 md:p-8 lg:p-12 max-w-7xl mx-auto bg-[#F7F7F7] dark:bg-black">
      <button
        onClick={() => navigate(-1)}
        className="fixed top-8 right-8 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-gray-500/90 hover:bg-gray-600/90 backdrop-blur-sm text-white transition-colors"
      >
        <CloseIcon size={20} />
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

          {/* Short Bio Section */}
          <div className="bg-white dark:bg-[#282828] rounded-2xl p-6">
            <h3 className="text-title-3 mb-4 dark:text-white">Short bio</h3>
            <div className="prose dark:prose-invert">
              <p className="text-body dark:text-white/90">{about.short_bio}</p>
            </div>
          </div>

          {/* What I Do Section */}
          <div className="space-y-5">
            <h3 className="text-subheadline font-medium opacity-60 dark:text-white/60">WHAT I DO</h3>
            <div className="bg-white dark:bg-[#282828] rounded-2xl p-6">
              <div className="prose dark:prose-invert">
                <p className="text-body dark:text-white/90">{about.what_i_do}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Career Highlights Section */}
          <div className="space-y-5">
            <h3 className="text-subheadline font-medium opacity-60 dark:text-white/60">CAREER HIGHLIGHTS</h3>
            <div className="space-y-5">
              {about.career_highlights.map((highlight) => (
                <div 
                  key={highlight.id}
                  className="bg-white dark:bg-[#282828] rounded-2xl p-6 flex items-center gap-4"
                >
                  <img 
                    src={highlight.logo_url} 
                    alt={highlight.company}
                    className="w-16 h-16 rounded-2xl bg-border/10"
                  />
                  <div>
                    <h4 className="text-title-3 dark:text-white">{highlight.role}</h4>
                    <p className="text-headline dark:text-white/90">{highlight.company}</p>
                    <p className="text-body opacity-60 dark:text-white/60">{highlight.period}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Brands Section */}
          <div className="space-y-5">
            <h3 className="text-subheadline font-medium opacity-60 dark:text-white/60">BRANDS I'VE WORKED WITH</h3>
            <div className="bg-white dark:bg-[#282828] rounded-2xl p-6">
              <div className="flex flex-wrap gap-2">
                {about.brands.map((brand, index) => (
                  <span 
                    key={index}
                    className="px-4 py-2 bg-gray-50 dark:bg-white/10 rounded-full text-footnote dark:text-white/90"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Awards Section */}
          <div className="space-y-5">
            <h3 className="text-subheadline font-medium opacity-60 dark:text-white/60">AWARDS</h3>
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
  );
}

function Contact() {
  return (
    <div className="p-5 max-w-3xl">
      <div className="lg:hidden flex items-center justify-between mb-5">
        <Link to="/" className="text-[22px] leading-[27px] md:text-[27px] md:leading-[32px] font-semibold tracking-[-.021em]">
          Giulio Pinotti
        </Link>
        <Link 
          to="/about"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-border/10 hover:bg-border/20 transition-colors"
        >
          <UserCircle size={24} className="opacity-60" />
        </Link>
      </div>
      <h2 className="text-title-1 mb-5">Contact</h2>
      <div className="prose">
        <p className="text-body">
          Get in touch for collaborations, inquiries, or just to say hello.
        </p>
        <a
          href="mailto:giulio@pinotti.work"
          className="inline-block mt-4 text-body hover:opacity-80 transition-opacity"
        >
          giulio@pinotti.work
        </a>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-background dark:bg-black text-foreground">
        <DesktopSidebar />
        <main className="flex-1 w-full lg:pl-68 min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App