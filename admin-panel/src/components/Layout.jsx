import { Link, useLocation } from 'react-router-dom';
import { FileText, PlusCircle, LayoutDashboard, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { href: '/blogs', label: 'All Blogs', icon: FileText },
  { href: '/blogs/create', label: 'Create Blog', icon: PlusCircle },
];

export default function Layout({ children }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container flex h-14 items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <LayoutDashboard className='h-6 w-6' />
            <span className='font-bold text-xl'>Blog Admin</span>
          </div>

          {/* Desktop nav */}
          <nav className='hidden sm:flex ml-8 items-center space-x-6'>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  <Icon className='h-4 w-4' />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <button
            className='sm:hidden p-2 rounded-md hover:bg-muted/50'
            aria-label='Open menu'
            onClick={() => setOpen(prev => !prev)}
          >
            <Menu className='h-5 w-5' />
          </button>
        </div>

        {/* Mobile nav panel */}
        {open && (
          <div className='sm:hidden border-t bg-background'>
            <div className='container py-2 flex flex-col space-y-1'>
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      'flex items-center space-x-2 px-2 py-2 rounded-md text-sm font-medium',
                      isActive
                        ? 'text-primary bg-muted/30'
                        : 'text-muted-foreground hover:bg-muted/10'
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <Icon className='h-4 w-4' />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className='container px-2 sm:px-4 py-6'>{children}</main>
    </div>
  );
}
