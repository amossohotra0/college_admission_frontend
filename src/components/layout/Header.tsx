import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };

  const userRole = user?.role?.role;
  
  // Define navigation links based on user role
  let navLinks = [];
  
  if (userRole === 'admin') {
    navLinks = [
      { name: 'Dashboard', href: '/admin' },
      { name: 'User Management', href: '/admin/users' },
      { name: 'Applications', href: '/admin/applications' },
      { name: 'Programs', href: '/admin/programs' },
      { name: 'Payments', href: '/admin/finance' },
      { name: 'Announcements', href: '/admin/announcements' },
    ];
  } else if (userRole === 'admission_officer') {
    navLinks = [
      { name: 'Dashboard', href: '/admin/admission' },
      { name: 'Applications', href: '/admin/applications' },
      { name: 'Programs', href: '/admin/programs' },
      { name: 'Announcements', href: '/admin/announcements' },
    ];
  } else if (userRole === 'reviewer') {
    navLinks = [
      { name: 'Dashboard', href: '/admin/reviewer' },
      { name: 'Applications', href: '/admin/applications' },
    ];
  } else if (userRole === 'accountant') {
    navLinks = [
      { name: 'Dashboard', href: '/admin/finance' },
      { name: 'Payments', href: '/admin/finance' },
      { name: 'Fee Structure', href: '/admin/finance/fee-structure' },
    ];
  } else if (userRole === 'data_entry') {
    navLinks = [
      { name: 'Dashboard', href: '/admin/data-entry' },
      { name: 'Applications', href: '/admin/applications' },
      { name: 'Lookup Data', href: '/admin/data-entry' },
    ];
  } else {
    // Default for applicants
    navLinks = [
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Programs', href: '/programs' },
      { name: 'Applications', href: '/applications' },
      { name: 'Payments', href: '/payments' },
      { name: 'Profile', href: '/profile' },
    ];
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href={userRole !== 'applicant' ? `/admin/${userRole === 'admission_officer' ? 'admission' : userRole === 'reviewer' ? 'reviewer' : userRole === 'accountant' ? 'finance' : userRole === 'data_entry' ? 'data-entry' : ''}` : '/dashboard'} className="font-bold text-xl text-blue-600">
                College Admissions
              </Link>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                    isActive(link.href)
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="ml-3 relative">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 mr-4">
                  {user?.first_name} {user?.last_name}
                </span>
                <button
                  onClick={logout}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span className="sr-only">Log out</span>
                  <LogOut className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block pl-3 pr-4 py-2 border-l-4 text-base font-medium',
                  isActive(link.href)
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <User className="h-10 w-10 rounded-full bg-gray-100 p-2" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  {user?.first_name} {user?.last_name}
                </div>
                <div className="text-sm font-medium text-gray-500">{user?.email}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;