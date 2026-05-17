import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Portfolio from '../components/Portfolio';
import Stats from '../components/Stats';
import Testimonials from '../components/Testimonials';
import MobileHome from '../components/mobile/MobileHome';

const Home = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return <MobileHome />;
  }

  return (
    <>
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <Stats />
      <Testimonials />
    </>
  );
};

export default Home;
