import React from 'react';
import Header from './Header';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();
  
  // Don't show header on login, register, and landing pages
  const isAuthPage = pathname?.startsWith('/auth/');
  const isLandingPage = pathname === '/landing';
  const shouldShowHeader = !isAuthPage && !isLandingPage;

  return (
    <div className="min-h-screen bg-gray-50">
      {shouldShowHeader && <Header />}
      <main className={`${shouldShowHeader ? 'max-w-7xl mx-auto py-6 sm:px-6 lg:px-8' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;