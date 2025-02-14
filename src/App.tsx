import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCircle, 
  X as CloseIcon, 
  Share2 
} from 'lucide-react';
import { LinkedInIcon, BehanceIcon, SoundCloudIcon } from './components/icons/SocialIcons';
import { useProjects } from './hooks/useProjects';
import { cn } from './lib/utils';
import ProjectDetail from './components/ProjectDetail';
import ProjectCard from './components/ProjectCard';
import { getImageColor } from './lib/utils';
import { useAbout } from './hooks/useAbout';

function FeaturedProjects() {
  const { projects, loading } = useProjects();
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

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} imageColor={imageColors[project.id]} />
        ))}
      </div>
    </div>
  );
}

function Home() {
  const { projects = [], loading } = useProjects();
  const { about } = useAbout();

  const featuredProjects = projects
    .filter(p => p.featured)
    .sort((a, b) => (a.featured_order || 0) - (b.featured_order || 0));

  const otherProjects = projects.filter(p => !p.featured);

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

      {/* Featured Projects */}
      <div className="space-y-8 mb-16">
        {/* Main Featured Project (9:4) */}
        {featuredProjects[0] && (
          <ProjectCard project={featuredProjects[0]} />
        )}

        {/* Other Featured Projects (4:3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
          {featuredProjects.slice(1, 4).map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      {/* Other Projects */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
        {otherProjects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

// O restante do código do componente About permanece igual...

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

export default App;