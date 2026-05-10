'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface AlgorithmCardProps {
  id: string;
  title: string;
  description: string;
  color: 'blue' | 'yellow' | 'green' | 'red' | 'pink';
  href: string;
}

const colorClasses = {
  blue: 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-400/30 hover:border-blue-400/60 hover:shadow-lg hover:shadow-blue-500/20',
  yellow: 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-yellow-400/30 hover:border-yellow-400/60 hover:shadow-lg hover:shadow-yellow-500/20',
  green: 'bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-400/30 hover:border-green-400/60 hover:shadow-lg hover:shadow-green-500/20',
  red: 'bg-gradient-to-br from-red-500/20 to-red-600/10 border-red-400/30 hover:border-red-400/60 hover:shadow-lg hover:shadow-red-500/20',
  pink: 'bg-gradient-to-br from-pink-500/20 to-pink-600/10 border-pink-400/30 hover:border-pink-400/60 hover:shadow-lg hover:shadow-pink-500/20',
};

const colorTextClasses = {
  blue: 'text-blue-400',
  yellow: 'text-yellow-400',
  green: 'text-green-400',
  red: 'text-red-400',
  pink: 'text-pink-400',
};

export default function AlgorithmCard({
  id,
  title,
  description,
  color,
  href,
}: AlgorithmCardProps) {
  return (
    <Link href={href}>
      <div
        className={`p-6 rounded-xl border backdrop-blur-sm transition-all duration-300 cursor-pointer group ${colorClasses[color]}`}
      >
        {/* Card Icon/Marker */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-2 h-2 rounded-full ${colorTextClasses[color]}`}></div>
          <ChevronRight className={`w-5 h-5 ${colorTextClasses[color]} opacity-0 group-hover:opacity-100 transition-opacity`} />
        </div>

        {/* Title */}
        <h3 className={`text-lg font-bold ${colorTextClasses[color]} mb-2 transition-colors`}>
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-foreground/80 leading-relaxed">
          {description}
        </p>

        {/* Card ID */}
        <div className={`mt-4 text-xs ${colorTextClasses[color]}/60`}>
          card{id}
        </div>
      </div>
    </Link>
  );
}