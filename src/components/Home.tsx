import { Header } from './Header';
import { FeaturedProjects } from './FeaturedProjects';

export function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FeaturedProjects />
    </div>
  );
} 