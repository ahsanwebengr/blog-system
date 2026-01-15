import { Link, useLocation } from 'react-router-dom';
import { FileText, PlusCircle, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/blogs', label: 'All Blogs', icon: FileText },
  { href: '/blogs/create', label: 'Create Blog', icon: PlusCircle },
];

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container flex h-14 items-center'>
          <div className='flex items-center space-x-2'>
            <LayoutDashboard className='h-6 w-6' />
            <span className='font-bold text-xl'>Blog Admin</span>
          </div>
          <nav className='ml-8 flex items-center space-x-6'>
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
        </div>
      </header>

      {/* Main Content */}
      <main className='container py-6'>{children}</main>
    </div>
  );
}
