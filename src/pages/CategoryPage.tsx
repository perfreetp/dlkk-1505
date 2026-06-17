import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Code2,
  Palette,
  Zap,
  SlidersHorizontal,
  Heart,
  X,
  ArrowUpDown,
  Sparkles,
  Clock,
  TrendingUp,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { SoftwareCard } from '@/components/features/SoftwareCard';
import { mockSoftware } from '@/data/mockData';
import { useAuthStore } from '@/store/useAuthStore';
import { cn, getCategoryLabel, getCategoryColor } from '@/lib/utils';
import type { SoftwareCategory } from '@/types';

type SortType = 'hot' | 'rating' | 'newest' | 'downloads';

const categories: { id: SoftwareCategory | 'all'; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'all', label: '全部', icon: Sparkles },
  { id: 'office', label: '办公', icon: Briefcase },
  { id: 'development', label: '开发', icon: Code2 },
  { id: 'design', label: '设计', icon: Palette },
  { id: 'efficiency', label: '效率', icon: Zap },
];

const subCategories: Record<SoftwareCategory | 'all', string[]> = {
  all: ['全部'],
  office: ['笔记/协作', '文档处理', '表格/数据', '演示文稿', '邮件客户端', '日历/任务'],
  development: ['代码编辑器', 'IDE', '终端工具', '数据库', '版本控制', 'API 工具'],
  design: ['UI/UX 设计', '图像编辑', '矢量绘图', '视频剪辑', '3D/建模', '原型工具'],
  efficiency: ['启动器', '系统工具', '浏览器', '安全工具', '窗口管理', '剪贴板工具'],
};

export default function CategoryPage() {
  const { category = 'all' } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const filterParam = searchParams.get('filter');

  const [activeCategory, setActiveCategory] = useState<SoftwareCategory | 'all'>(
    (category as SoftwareCategory | 'all') || 'all'
  );
  const [activeSubCategory, setActiveSubCategory] = useState<string>('全部');
  const [sortBy, setSortBy] = useState<SortType>('hot');
  const [search, setSearch] = useState(searchQuery);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [showOnlyFree, setShowOnlyFree] = useState(false);

  const { user } = useAuthStore();

  const filteredSoftware = useMemo(() => {
    let result = [...mockSoftware];

    if (activeCategory !== 'all') {
      result = result.filter((s) => s.category === activeCategory);
    }

    if (activeSubCategory !== '全部') {
      result = result.filter((s) => s.subCategory === activeSubCategory);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    if (showOnlyFavorites && user) {
      result = result.filter((s) => user.favorites.includes(s.id));
    }

    if (showOnlyFree) {
      result = result.filter((s) => s.price.type === 'free' || s.price.type === 'limited_free');
    }

    if (filterParam === 'limited_free') {
      result = result.filter((s) => s.price.type === 'limited_free');
    }

    switch (sortBy) {
      case 'hot':
        result.sort((a, b) => b.downloadCount + b.ratingCount * 10 - (a.downloadCount + a.ratingCount * 10));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'downloads':
        result.sort((a, b) => b.downloadCount - a.downloadCount);
        break;
    }

    return result;
  }, [activeCategory, activeSubCategory, sortBy, search, showOnlyFavorites, showOnlyFree, filterParam, user]);

  const sortOptions: { value: SortType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { value: 'hot', label: '最热门', icon: TrendingUp },
    { value: 'rating', label: '评分最高', icon: Sparkles },
    { value: 'newest', label: '最新上架', icon: Clock },
    { value: 'downloads', label: '下载最多', icon: Sparkles },
  ];

  return (
    <div className="container py-8 pb-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display font-bold text-brand-800 mb-2">
          {getCategoryLabel(activeCategory === 'all' ? '' : activeCategory) || '全部软件'}
        </h1>
        <p className="text-silver-500">
          共找到 <span className="text-brand-600 font-semibold">{filteredSoftware.length}</span> 款软件
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Input
          searchMode
          placeholder="搜索软件名称、描述、标签..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xl"
        />
      </motion.div>

      {/* Category Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <Link
                key={cat.id}
                to={cat.id === 'all' ? '/category' : `/category/${cat.id}`}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setActiveSubCategory('全部');
                }}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap',
                  isActive
                    ? 'bg-brand-500 text-white shadow-medium'
                    : 'bg-white text-silver-600 hover:bg-silver-50 border border-silver-100'
                )}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap items-center justify-between gap-4 mb-8"
      >
        {/* Sub-categories */}
        <div className="flex items-center gap-2 flex-wrap">
          {subCategories[activeCategory as SoftwareCategory | 'all']?.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubCategory(sub)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                activeSubCategory === sub
                  ? 'bg-brand-50 text-brand-600 border border-brand-200'
                  : 'text-silver-500 hover:text-brand-600 hover:bg-silver-50'
              )}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Sort & Filter */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Filter Chips */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all',
                showOnlyFavorites
                  ? 'bg-red-50 text-apple-red border border-red-200'
                  : 'bg-white text-silver-600 border border-silver-100 hover:bg-silver-50'
              )}
            >
              <Heart className={cn('w-4 h-4', showOnlyFavorites && 'fill-current')} />
              仅看收藏
            </button>
            <button
              onClick={() => setShowOnlyFree(!showOnlyFree)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all',
                showOnlyFree
                  ? 'bg-green-50 text-apple-green border border-green-200'
                  : 'bg-white text-silver-600 border border-silver-100 hover:bg-silver-50'
              )}
            >
              <Sparkles className="w-4 h-4" />
              免费
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative group">
            <Button variant="secondary" size="sm">
              <ArrowUpDown className="w-4 h-4" />
              排序
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
            <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-heavy border border-silver-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
              {sortOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={cn(
                      'w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors',
                      sortBy === option.value
                        ? 'bg-brand-50 text-brand-600 font-medium'
                        : 'text-silver-600 hover:bg-silver-50'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Active Filters */}
      {(showOnlyFavorites || showOnlyFree || activeSubCategory !== '全部' || search) && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-sm text-silver-500">筛选：</span>
          {search && (
            <Badge className="flex items-center gap-1">
              <Search className="w-3 h-3" />
              "{search}"
              <button onClick={() => setSearch('')}><X className="w-3 h-3" /></button>
            </Badge>
          )}
          {activeSubCategory !== '全部' && (
            <Badge className="flex items-center gap-1">
              {activeSubCategory}
              <button onClick={() => setActiveSubCategory('全部')}><X className="w-3 h-3" /></button>
            </Badge>
          )}
          {showOnlyFavorites && (
            <Badge variant="danger" className="flex items-center gap-1">
              仅收藏
              <button onClick={() => setShowOnlyFavorites(false)}><X className="w-3 h-3" /></button>
            </Badge>
          )}
          {showOnlyFree && (
            <Badge variant="success" className="flex items-center gap-1">
              仅免费
              <button onClick={() => setShowOnlyFree(false)}><X className="w-3 h-3" /></button>
            </Badge>
          )}
          <button
            onClick={() => {
              setSearch('');
              setActiveSubCategory('全部');
              setShowOnlyFavorites(false);
              setShowOnlyFree(false);
            }}
            className="text-sm text-silver-500 hover:text-brand-600 underline"
          >
            清除全部
          </button>
        </div>
      )}

      {/* Software Grid */}
      {filteredSoftware.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Search className="w-16 h-16 text-silver-200 mx-auto mb-4" />
          <p className="text-lg text-silver-600 font-medium mb-2">没有找到匹配的软件</p>
          <p className="text-silver-400 mb-6">试试调整筛选条件或搜索其他关键词</p>
          <Button
            variant="secondary"
            onClick={() => {
              setSearch('');
              setActiveSubCategory('全部');
              setShowOnlyFavorites(false);
              setShowOnlyFree(false);
            }}
          >
            重置筛选
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSoftware.map((software, index) => (
            <SoftwareCard key={software.id} software={software} />
          ))}
        </div>
      )}
    </div>
  );
}
