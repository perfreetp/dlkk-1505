import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Download, Star, Sparkles } from 'lucide-react';
import type { Software } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';
import { useAuthStore } from '@/store/useAuthStore';
import { cn, formatNumber } from '@/lib/utils';

interface SoftwareCardProps {
  software: Software;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SoftwareCard({ software, size = 'md', className }: SoftwareCardProps) {
  const { toggleFavorite, isFavorite } = useAuthStore();
  const favorited = isFavorite(software.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(software.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        to={`/app/${software.id}`}
        className={cn(
          'card-hover block overflow-hidden group',
          size === 'sm' && 'p-4',
          size === 'md' && 'p-5',
          size === 'lg' && 'p-6',
          className
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className={cn(
              'rounded-2xl bg-gradient-to-br from-brand-50 to-silver-100 flex-shrink-0 shadow-soft overflow-hidden',
              size === 'sm' && 'w-12 h-12',
              size === 'md' && 'w-14 h-14',
              size === 'lg' && 'w-16 h-16',
            )}>
              <img
                src={software.icon}
                alt={software.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className={cn(
                  'font-display font-semibold text-brand-800 truncate',
                  size === 'sm' && 'text-base',
                  size === 'md' && 'text-lg',
                  size === 'lg' && 'text-xl',
                )}>
                  {software.name}
                </h3>
                {software.isNew && <Badge variant="new">NEW</Badge>}
                {software.price.type === 'limited_free' && (
                  <Badge variant="warning">
                    <Sparkles className="w-3 h-3" />
                    限免
                  </Badge>
                )}
                {software.price.type === 'free' && (
                  <Badge variant="success">免费</Badge>
                )}
              </div>
              <p className={cn(
                'text-silver-500 mt-1 line-clamp-2',
                size === 'sm' && 'text-xs',
                size === 'md' && 'text-sm',
                size === 'lg' && 'text-sm',
              )}>
                {software.description}
              </p>
            </div>
          </div>
          <button
            onClick={handleFavoriteClick}
            className={cn(
              'p-2 rounded-xl transition-all flex-shrink-0',
              favorited
                ? 'bg-red-50 text-apple-red hover:bg-red-100'
                : 'text-silver-300 hover:text-apple-red hover:bg-red-50'
            )}
          >
            <Heart className={cn('w-5 h-5', favorited && 'fill-current')} />
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Rating value={software.rating} size="sm" showValue />
            <span className="text-xs text-silver-400 flex items-center gap-1">
              <Download className="w-3.5 h-3.5" />
              {formatNumber(software.downloadCount)}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {software.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-md bg-silver-50 text-silver-500"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {size === 'lg' && (
          <div className="mt-4 pt-4 border-t border-silver-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs text-silver-400">
                  版本 {software.version}
                </span>
                <span className="text-xs text-silver-300">·</span>
                <span className="text-xs text-silver-400 flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {software.ratingCount} 条评价
                </span>
              </div>
              {software.price.type === 'paid' && (
                <span className="text-sm font-semibold text-brand-700">
                  ¥{software.price.amount}
                </span>
              )}
              {software.price.type === 'limited_free' && (
                <span className="text-sm font-semibold text-apple-orange flex items-center gap-1">
                  <span className="text-silver-400 line-through text-xs">¥{software.price.originalPrice}</span>
                  免费
                </span>
              )}
            </div>
          </div>
        )}
      </Link>
    </motion.div>
  );
}
