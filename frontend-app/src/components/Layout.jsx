import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function Layout({ children }) {
  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container flex h-16 items-center'>
          <Link to='/' className='flex items-center space-x-2'>
            <BookOpen className='h-6 w-6' />
            <span className='font-bold text-xl'>Blog</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className='container py-8'>{children}</main>

      {/* Footer */}
      <footer className='border-t py-8 mt-12'>
        <div className='container text-center text-sm text-muted-foreground'>
          <p>© {new Date().getFullYear()} Blog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
