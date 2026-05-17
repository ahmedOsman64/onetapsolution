import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileNavbar from '../components/mobile/MobileNavbar';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black transition-colors duration-300">
      {/* Desktop Navbar - hidden on mobile */}
      <div className="hidden md:block">
        <Navbar />
      </div>

      <main className="grow">
        <Outlet />
      </main>

      {/* Desktop Footer - hidden on mobile */}
      <div className="hidden md:block">
        <Footer />
      </div>

      {/* Mobile Bottom Navigation - only on mobile */}
      <MobileNavbar />
    </div>
  );
};

export default MainLayout;
