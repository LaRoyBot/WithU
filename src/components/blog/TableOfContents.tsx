'use client';

import React, { useEffect, useState } from 'react';
import { List, ChevronRight } from 'lucide-react';

interface TableOfContentsProps {
  items: {
    id: string;
    title: string;
  }[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -60% 0%' }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (!items || items.length === 0) return null;

  return (
    <nav className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100">
        <List className="w-4 h-4 text-primary-600" />
        <span>In This Clinical Guide</span>
      </div>
      <ul className="space-y-1.5 text-xs">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`flex items-start gap-1.5 py-1 px-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-bold'
                    : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'
                }`}
              >
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isActive ? 'text-primary-600' : 'text-slate-400'}`} />
                <span className="line-clamp-2 leading-relaxed">{item.title}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
