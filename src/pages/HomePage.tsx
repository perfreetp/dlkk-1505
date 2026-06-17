import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  ChevronRight,
  Sparkles,
  Clock,
  MessageSquare,
  ArrowRight,
  Flame,
  Pin,
  TrendingUp,
  Briefcase,
  Code2,
  Palette,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SoftwareCard } from '@/components/features/SoftwareCard';
import { mockSoftware, mockPosts } from '@/data/mockData';
import { formatDate, getCategoryColor, getCategoryLabel } from '@/lib/utils';

export default function HomePage() {
  const featuredSoftware = mockSoftware.filter((s) => s.isFeatured).slice(0, 6);
  const newSoftware = [...mockSoftware].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);
  const limitedFreeSoftware = mockSoftware.filter((s) => s.price.type === 'limited_free');
  const hotPosts = mockPosts.filter((p) => p.isHighlighted || p.isPinned).slice(0, 4);

  const categories = [
    { id: 'office', label: '办公', icon: Briefcase, count: mockSoftware.filter(s => s.category === 'office').length },
    { id: 'development', label: '开发', icon: Code2, count: mockSoftware.filter(s => s.category === 'development').length },
    { id: 'design', label: '设计', icon: Palette, count: mockSoftware.filter(s => s.category === 'design').length },
    { id: 'efficiency', label: '效率', icon: Zap, count: mockSoftware.filter(s => s.category === 'efficiency').length },
  ];

  const heroFeatures = [
    { icon: Sparkles, title: '精选软件', desc: '编辑精心挑选的优质 Mac 应用' },
    { icon: Clock, title: '限免提醒', desc: '第一时间获取限时免费信息' },
    { icon: MessageSquare, title: '活跃社区', desc: '与百万 Mac 用户交流心得' },
  ];

  const [heroIndex, setHeroIndex] = useState(0);
  const heroSoftware = featuredSoftware.slice(0, 3);

  return (
    <div className="pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800" />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(77, 132, 186, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(175, 82, 222, 0.2) 0%, transparent 50%)`,
        }} />
        <div className="container relative py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="new" className="mb-6">
                <Sparkles className="w-3 h-3" />
                发现最好的 Mac 软件
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-display font-bold text-white leading-tight mb-6">
                为 Mac 用户打造的
                <br />
                <span className="bg-gradient-to-r from-white via-silver-100 to-silver-200 bg-clip-text text-transparent">
                  软件发现社区
                </span>
              </h1>
              <p className="text-lg text-silver-200 mb-8 max-w-xl">
                精选优质 macOS 应用，真实用户评价，活跃的讨论社区。让每一款软件都值得被发现。
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link to="/category">
                  <Button size="lg" className="bg-white text-brand-700 hover:bg-silver-100">
                    开始探索
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/forum">
                  <Button variant="ghost" size="lg" className="text-white hover:bg-white/10">
                    加入讨论
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
                {heroFeatures.map((feature) => (
                  <div key={feature.title}>
                    <feature.icon className="w-6 h-6 text-apple-orange mb-2" />
                    <p className="text-white font-semibold">{feature.title}</p>
                    <p className="text-silver-300 text-sm mt-0.5">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <button
                  onClick={() => setHeroIndex((heroIndex + 1) % heroSoftware.length)}
                  className="block w-full group"
                >
                  <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-heavy overflow-hidden">
                    <motion.div
                      key={heroIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="flex items-start gap-5 mb-6">
                        <img
                          src={heroSoftware[heroIndex].icon}
                          alt={heroSoftware[heroIndex].name}
                          className="w-20 h-20 rounded-2xl shadow-medium"
                        />
                        <div>
                          <h3 className="text-2xl font-display font-semibold text-white mb-1">
                            {heroSoftware[heroIndex].name}
                          </h3>
                          <Badge className={getCategoryColor(heroSoftware[heroIndex].category)}>
                            {getCategoryLabel(heroSoftware[heroIndex].category)}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-silver-100 text-lg mb-6 leading-relaxed">
                        {heroSoftware[heroIndex].longDescription}
                      </p>
                      <div className="flex items-center gap-6 text-sm text-silver-200">
                        <span>⭐ {heroSoftware[heroIndex].rating} 评分</span>
                        <span>📥 {heroSoftware[heroIndex].downloadCount.toLocaleString()} 下载</span>
                        <span>📦 v{heroSoftware[heroIndex].version}</span>
                      </div>
                    </motion.div>
                    <div className="absolute bottom-6 right-6 flex gap-1.5">
                      {heroSoftware.map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-all ${
                            i === heroIndex ? 'bg-white w-6' : 'bg-white/40'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Quick Nav */}
      <section className="container -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Link to={`/category/${cat.id}`}>
                <Card hover className="p-5 text-center">
                  <div className={`w-12 h-12 rounded-2xl ${getCategoryColor(cat.id)} flex items-center justify-center mx-auto mb-3`}>
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-brand-800">{cat.label}</p>
                  <p className="text-sm text-silver-500 mt-0.5">{cat.count} 款应用</p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Software */}
      <section className="container mt-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-apple-orange" />
              精选软件
            </h2>
            <p className="text-silver-500 mt-1">编辑推荐的优质 Mac 应用</p>
          </div>
          <Link to="/category" className="flex items-center gap-1 text-brand-600 hover:text-brand-700 font-medium text-sm">
            查看全部
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredSoftware.map((software) => (
            <SoftwareCard key={software.id} software={software} size="lg" />
          ))}
        </div>
      </section>

      {/* Limited Free Section */}
      {limitedFreeSoftware.length > 0 && (
        <section className="container mt-16">
          <div className="bg-gradient-to-r from-apple-orange via-apple-pink to-apple-purple rounded-3xl p-1">
            <div className="bg-white rounded-[22px] p-6 lg:p-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <Badge variant="warning" className="mb-3">
                    <Clock className="w-3 h-3" />
                    限时免费
                  </Badge>
                  <h2 className="section-title">限时免费 & 折扣专区</h2>
                  <p className="text-silver-500 mt-1">机不可失，抓紧时间下载！</p>
                </div>
                <Link to="/category?filter=limited_free" className="hidden md:flex items-center gap-1 text-brand-600 hover:text-brand-700 font-medium text-sm">
                  更多限免
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {limitedFreeSoftware.map((software) => (
                  <SoftwareCard key={software.id} software={software} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* New Software */}
      <section className="container mt-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-apple-green" />
              最新上架
            </h2>
            <p className="text-silver-500 mt-1">最近新加入的 Mac 应用</p>
          </div>
          <Link to="/category?sort=newest" className="flex items-center gap-1 text-brand-600 hover:text-brand-700 font-medium text-sm">
            查看全部
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {newSoftware.map((software) => (
            <SoftwareCard key={software.id} software={software} size="sm" />
          ))}
        </div>
      </section>

      {/* Hot Discussions */}
      <section className="container mt-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title flex items-center gap-2">
              <Flame className="w-6 h-6 text-apple-red" />
              热门讨论
            </h2>
            <p className="text-silver-500 mt-1">社区里大家都在聊什么</p>
          </div>
          <Link to="/forum" className="flex items-center gap-1 text-brand-600 hover:text-brand-700 font-medium text-sm">
            进入讨论区
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {hotPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.3 }}
            >
              <Link to={`/forum/${post.id}`}>
                <Card hover className="p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-10 h-10 rounded-xl bg-silver-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        {post.isPinned && (
                          <Badge variant="info">
                            <Pin className="w-3 h-3" />
                            置顶
                          </Badge>
                        )}
                        {post.isHighlighted && <Badge variant="warning">精华</Badge>}
                        <Badge>{post.board}</Badge>
                      </div>
                      <h3 className="font-semibold text-brand-800 text-lg mb-2 line-clamp-1">
                        {post.title}
                      </h3>
                      <p className="text-sm text-silver-500 line-clamp-2 mb-4">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-silver-400">
                        <span>{post.authorName}</span>
                        <span>·</span>
                        <span>{formatDate(post.createdAt)}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          {post.replyCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
