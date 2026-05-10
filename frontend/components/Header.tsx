'use client';

import { Search } from 'lucide-react';

interface HeaderProps {
  title: string;
  breadcrumb?: string[];
}

export default function Header({ title, breadcrumb = [] }: HeaderProps) {
  return (
    <div className="ml-32 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="px-8 py-6">
        {breadcrumb.length > 0 && (
          <div className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
            {breadcrumb.map((item, idx) => (
              <span key={idx}>
                {item}
                {idx < breadcrumb.length - 1 && <span className="mx-1">›</span>}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-input text-foreground placeholder-muted-foreground pl-10 pr-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring w-48"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}