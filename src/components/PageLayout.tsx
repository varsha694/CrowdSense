import { ReactNode } from 'react';
import { Header } from '@/components/Header';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  fullHeight?: boolean;
  hideHeader?: boolean;
}

export function PageLayout({ children, className, fullHeight = true, hideHeader = false }: PageLayoutProps) {
  return (
    <div className={cn(
      "bg-background",
      fullHeight && "min-h-screen",
      className
    )}>
      {!hideHeader && <Header />}
      {children}
    </div>
  );
}
