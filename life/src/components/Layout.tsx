import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
  showHeaderFooter?: boolean;
  onNavigateHome?: () => void;
  onNavigateAdmin?: () => void;
}

export function Layout({ children, showHeaderFooter = true, onNavigateHome, onNavigateAdmin }: LayoutProps) {
  if (!showHeaderFooter) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onNavigateHome={onNavigateHome} onNavigateAdmin={onNavigateAdmin} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
