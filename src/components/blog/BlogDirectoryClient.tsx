'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ClinicalArticle } from '@/types/blog';
import { BLOG_CATEGORIES } from '@/data/blogArticles';
import { Clock, ShieldCheck, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

interface BlogDirectoryClientProps {
  articles: ClinicalArticle[];
}

export default function BlogDirectoryClient({ articles }: BlogDirectoryClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredArticles = selectedCategory === 'all'
    ? articles
    : articles.filter((a) => a.category === selectedCategory);

  const featured = articles[0];

  return (
    <div className="space-y-12">
      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {BLOG_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/30'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-300 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Featured Article Card (shown on 'all' view) */}
      {selectedCategory === 'all' && featured && (
        <div className="relative group bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="grid lg:grid-cols-12 gap-6 items-center p-6 sm:p-8">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-primary-100 text-primary-800 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full">
                  <Sparkles className="w-3 h-3 text-primary-600" />
                  <span>Featured Clinical Guide</span>
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{featured.readTimeMinutes} min read</span>
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif leading-tight group-hover:text-primary-700 transition-colors">
                <Link href={`/blog/${featured.slug}`}>
                  {featured.title}
                </Link>
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                {featured.metaDescription}
              </p>

              {/* Key Takeaways preview */}
              {featured.keyTakeaways && featured.keyTakeaways.length > 0 && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-700 space-y-1.5">
                  <div className="font-extrabold text-slate-900 uppercase text-[10px] tracking-wider text-primary-700">
                    Key Clinical Takeaway:
                  </div>
                  <div className="line-clamp-2 italic">
                    "{featured.keyTakeaways[0]}"
                  </div>
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-6 h-6 rounded-full overflow-hidden relative border border-slate-200">
                    <Image
                      src="/images/original/sunitha.jpg"
                      alt={featured.clinicalReviewer.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span>Reviewed by <strong>{featured.clinicalReviewer.name}</strong></span>
                </div>

                <Link
                  href={`/blog/${featured.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-primary-600 hover:text-primary-700 group-hover:translate-x-1 transition-all"
                >
                  <span>Read Full Medical Guide</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden shadow-inner">
              <Image
                src={featured.heroImage.src}
                alt={featured.heroImage.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      )}

      {/* Main Grid of Clinical Guides */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary-600" />
            <span>Clinical Knowledge Catalog ({filteredArticles.length})</span>
          </h3>
          <span className="text-xs text-slate-500">Hyderabad Healthcare Resource</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <article
              key={article.slug}
              className="group bg-white rounded-2xl border border-slate-200/80 hover:border-primary-300 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* Thumbnail Image */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={article.heroImage.src}
                    alt={article.heroImage.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-primary-700 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                    {article.categoryLabel}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{article.readTimeMinutes} min read</span>
                    </span>
                    <span>{new Date(article.publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>

                  <h4 className="text-base font-extrabold text-slate-900 tracking-tight font-serif leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
                    <Link href={`/blog/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {article.metaDescription}
                  </p>
                </div>
              </div>

              {/* Bottom Footer */}
              <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Verified</span>
                </div>
                <Link
                  href={`/blog/${article.slug}`}
                  className="inline-flex items-center gap-1 text-primary-600 font-bold hover:text-primary-700"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
