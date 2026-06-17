import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Heart,
  Download,
  Star,
  ExternalLink,
  Apple,
  Cpu,
  Monitor,
  Clock,
  X,
  ChevronRight,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Flag,
  Send,
  Save,
  MessageSquare,
  Package,
  Calendar,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { SoftwareCard } from '@/components/features/SoftwareCard';
import { mockSoftware } from '@/data/mockData';
import { useAuthStore, useSoftwareStore } from '@/store/useAuthStore';
import { cn, formatDate, formatDateShort, formatNumber, getCategoryColor, getCategoryLabel, generateId } from '@/lib/utils';
import type { Review } from '@/types';

export default function AppDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const software = mockSoftware.find((s) => s.id === id);
  const { toggleFavorite, isFavorite, addDownload, user, saveDraftReview, publishReview } = useAuthStore();
  const { getReviewsBySoftware, addReview } = useSoftwareStore();
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentScreenshotIndex, setCurrentScreenshotIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'reviews' | 'changelog' | 'compatibility'>('reviews');
  const [newRating, setNewRating] = useState(5);
  const [newReviewContent, setNewReviewContent] = useState('');
  const [activeReviewTab, setActiveReviewTab] = useState<'write' | 'list'>('list');

  if (!software) {
    return (
      <div className="container py-20 text-center">
        <p className="text-silver-500 mb-4">软件不存在</p>
        <Link to="/">
          <Button variant="secondary">返回首页</Button>
        </Link>
      </div>
    );
  }

  const reviews = getReviewsBySoftware(software.id);
  const alternatives = mockSoftware.filter((s) => software.alternatives.includes(s.id));
  const favorited = isFavorite(software.id);

  const openLightbox = (index: number) => {
    setCurrentScreenshotIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const prevScreenshot = () => {
    setCurrentScreenshotIndex((i) => (i - 1 + software.screenshots.length) % software.screenshots.length);
  };

  const nextScreenshot = () => {
    setCurrentScreenshotIndex((i) => (i + 1) % software.screenshots.length);
  };

  const handleDownload = (source: string, url?: string) => {
    addDownload({
      softwareId: software.id,
      softwareName: software.name,
      softwareIcon: software.icon,
      downloadedAt: new Date().toISOString(),
      source,
    });
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleSaveDraft = () => {
    if (!user || !newReviewContent.trim()) return;
    const draft: Review = {
      id: generateId(),
      softwareId: software.id,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      rating: newRating,
      content: newReviewContent,
      createdAt: new Date().toISOString(),
      isDraft: true,
    };
    saveDraftReview(draft);
    setNewReviewContent('');
    setNewRating(5);
  };

  const handlePublishReview = () => {
    if (!user || !newReviewContent.trim()) return;
    const review: Review = {
      id: generateId(),
      softwareId: software.id,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      rating: newRating,
      content: newReviewContent,
      createdAt: new Date().toISOString(),
    };
    addReview(review);
    setNewReviewContent('');
    setNewRating(5);
    setActiveReviewTab('list');
  };

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    return { star, count, percent: reviews.length > 0 ? (count / reviews.length) * 100 : 0 };
  });

  return (
    <div className="pb-16">
      {/* Top Bar */}
      <div className="sticky top-16 z-30 glass border-b border-silver-100">
        <div className="container py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-silver-600 hover:text-brand-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">返回</span>
          </button>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => toggleFavorite(software.id)}>
              <Heart className={cn('w-4 h-4', favorited && 'fill-apple-red text-apple-red')} />
              {favorited ? '已收藏' : '收藏'}
            </Button>
            <Button size="sm" onClick={() => handleDownload('官方下载', software.downloadLinks.official || software.downloadLinks.appStore || software.downloadLinks.local)}>
              <Download className="w-4 h-4" />
              下载
            </Button>
          </div>
        </div>
      </div>

      <div className="container mt-8">
        {/* Header Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row gap-8"
        >
          <div className="flex-1">
            <div className="flex items-start gap-6 mb-6">
              <img
                src={software.icon}
                alt={software.name}
                className="w-24 h-24 rounded-3xl shadow-medium bg-silver-100"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h1 className="text-3xl font-display font-bold text-brand-800">{software.name}</h1>
                  {software.isNew && <Badge variant="new">NEW</Badge>}
                  <Badge className={getCategoryColor(software.category)}>
                    {getCategoryLabel(software.category)}
                  </Badge>
                  {software.price.type === 'free' && <Badge variant="success">免费</Badge>}
                  {software.price.type === 'limited_free' && <Badge variant="warning">限免</Badge>}
                  {software.price.type === 'paid' && (
                    <Badge variant="info">¥{software.price.amount}</Badge>
                  )}
                </div>
                <p className="text-silver-500 mb-3">{software.description}</p>
                <div className="flex items-center gap-5 flex-wrap">
                  <Rating value={software.rating} size="lg" showValue />
                  <span className="text-sm text-silver-400">
                    {software.ratingCount.toLocaleString()} 条评价
                  </span>
                  <span className="text-sm text-silver-400 flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    {formatNumber(software.downloadCount)} 次下载
                  </span>
                  <span className="text-sm text-silver-400 flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    v{software.version}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-brand-700 leading-relaxed mb-8">{software.longDescription}</p>

            <div className="flex flex-wrap gap-3">
              {software.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-lg bg-silver-50 text-silver-600 text-sm font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Download Panel */}
          <div className="lg:w-80 flex-shrink-0">
            <Card className="sticky top-36">
              <CardContent>
                <h3 className="font-semibold text-brand-800 mb-4 flex items-center gap-2">
                  <Download className="w-5 h-5 text-brand-500" />
                  下载方式
                </h3>
                <div className="space-y-3">
                  {software.downloadLinks.official && (
                    <Button
                      fullWidth
                      onClick={() => handleDownload('官方下载', software.downloadLinks.official)}
                      className="justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        官方下载
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                  {software.downloadLinks.appStore && (
                    <Button variant="secondary" fullWidth className="justify-between" onClick={() => handleDownload('App Store', software.downloadLinks.appStore)}>
                      <span className="flex items-center gap-2">
                        <Apple className="w-4 h-4" />
                        App Store
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                  {software.downloadLinks.local && (
                    <Button variant="secondary" fullWidth className="justify-between" onClick={() => handleDownload('本地下载', software.downloadLinks.local)}>
                      <span className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        本地下载
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-silver-100 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Cpu className="w-4 h-4 text-silver-400" />
                    <span className="text-silver-500">芯片支持</span>
                    <div className="flex-1 flex justify-end gap-2">
                      {software.compatibility.appleSilicon && (
                        <Badge variant="success" className="text-xs">Apple Silicon</Badge>
                      )}
                      {software.compatibility.intel && (
                        <Badge variant="info" className="text-xs">Intel</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Monitor className="w-4 h-4 text-silver-400" />
                    <span className="text-silver-500">最低系统</span>
                    <span className="ml-auto text-brand-700 font-medium">macOS {software.compatibility.minMacOS}+</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-silver-400" />
                    <span className="text-silver-500">更新时间</span>
                    <span className="ml-auto text-brand-700 font-medium">{formatDateShort(software.updatedAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Screenshots */}
        <section className="mt-12">
          <h2 className="section-title mb-6">截图预览</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
            {software.screenshots.map((screenshot, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => openLightbox(index)}
                className="flex-shrink-0 w-[600px] rounded-2xl overflow-hidden shadow-soft border border-silver-100 hover:shadow-medium transition-all group"
              >
                <img
                  src={screenshot}
                  alt={`${software.name} 截图 ${index + 1}`}
                  className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
                />
              </motion.button>
            ))}
          </div>
        </section>

        {/* Tabs Section */}
        <section className="mt-12">
          <div className="flex items-center gap-8 border-b border-silver-100 mb-8">
            {(['reviews', 'changelog', 'compatibility'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'pb-4 font-medium text-sm transition-colors',
                  activeTab === tab ? 'tab-active' : 'tab-inactive'
                )}
              >
                {tab === 'reviews' && `用户评价 (${reviews.length})`}
                {tab === 'changelog' && '版本记录'}
                {tab === 'compatibility' && '系统兼容'}
              </button>
            ))}
          </div>

          {activeTab === 'reviews' && (
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Rating Summary */}
                <Card className="lg:col-span-1">
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="text-5xl font-display font-bold text-brand-800 mb-2">
                        {software.rating.toFixed(1)}
                      </div>
                      <Rating value={software.rating} size="lg" className="justify-center" />
                      <p className="text-sm text-silver-500 mt-2">
                        {software.ratingCount.toLocaleString()} 条评价
                      </p>
                    </div>
                    <div className="space-y-2">
                      {ratingDistribution.map(({ star, percent, count }) => (
                        <div key={star} className="flex items-center gap-3">
                          <span className="text-sm text-silver-600 w-8">{star} 星</span>
                          <div className="flex-1 h-2 bg-silver-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percent}%` }}
                              className="h-full bg-apple-yellow rounded-full"
                            />
                          </div>
                          <span className="text-xs text-silver-400 w-8 text-right">{count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Write / List Reviews */}
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-4 mb-6">
                    <button
                      onClick={() => setActiveReviewTab('list')}
                      className={cn(
                        'px-4 py-2 rounded-xl font-medium text-sm transition-all',
                        activeReviewTab === 'list'
                          ? 'bg-brand-500 text-white'
                          : 'text-silver-600 hover:bg-silver-100'
                      )}
                    >
                      <MessageSquare className="w-4 h-4 inline mr-2" />
                      查看评价
                    </button>
                    <button
                      onClick={() => setActiveReviewTab('write')}
                      className={cn(
                        'px-4 py-2 rounded-xl font-medium text-sm transition-all',
                        activeReviewTab === 'write'
                          ? 'bg-brand-500 text-white'
                          : 'text-silver-600 hover:bg-silver-100'
                      )}
                    >
                      <Star className="w-4 h-4 inline mr-2" />
                      写评价
                    </button>
                  </div>

                  {activeReviewTab === 'write' && user && (
                    <Card>
                      <CardContent>
                        <div className="flex items-center gap-4 mb-6">
                          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl bg-silver-200" />
                          <div>
                            <p className="font-medium text-brand-800">{user.name}</p>
                            <div className="mt-1">
                              <Rating
                                value={newRating}
                                size="md"
                                readOnly={false}
                                onChange={setNewRating}
                              />
                            </div>
                          </div>
                        </div>
                        <Textarea
                          placeholder="分享你的使用体验..."
                          rows={5}
                          value={newReviewContent}
                          onChange={(e) => setNewReviewContent(e.target.value)}
                        />
                        <div className="flex items-center justify-between mt-4">
                          <Button variant="secondary" size="sm" onClick={handleSaveDraft}>
                            <Save className="w-4 h-4" />
                            保存草稿
                          </Button>
                          <Button onClick={handlePublishReview} disabled={!newReviewContent.trim()}>
                            <Send className="w-4 h-4" />
                            发布评价
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {activeReviewTab === 'list' && (
                    <div className="space-y-4">
                      {reviews.length === 0 ? (
                        <Card>
                          <CardContent className="text-center py-12">
                            <MessageSquare className="w-12 h-12 text-silver-300 mx-auto mb-3" />
                            <p className="text-silver-500">暂无评价，来成为第一个评价的用户吧！</p>
                          </CardContent>
                        </Card>
                      ) : (
                        reviews.map((review) => (
                          <Card key={review.id}>
                            <CardContent>
                              <div className="flex items-start gap-4">
                                <img
                                  src={review.userAvatar}
                                  alt={review.userName}
                                  className="w-10 h-10 rounded-xl bg-silver-200 flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                                    <div className="flex items-center gap-3">
                                      <span className="font-medium text-brand-800">{review.userName}</span>
                                      <Rating value={review.rating} size="sm" />
                                    </div>
                                    <span className="text-xs text-silver-400">{formatDate(review.createdAt)}</span>
                                  </div>
                                  <p className="text-brand-700 leading-relaxed">{review.content}</p>
                                  <div className="flex items-center gap-4 mt-3">
                                    <button className="text-xs text-silver-400 hover:text-silver-600 flex items-center gap-1">
                                      <Flag className="w-3.5 h-3.5" />
                                      举报
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'changelog' && (
            <div className="max-w-2xl">
              {software.versions.map((version, index) => (
                <motion.div
                  key={version.version}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-8 pb-8 last:pb-0"
                >
                  {index !== software.versions.length - 1 && (
                    <div className="absolute left-3 top-8 bottom-0 w-px bg-silver-200" />
                  )}
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center">
                    <Clock className="w-3 h-3 text-white" />
                  </div>
                  <Card>
                    <CardContent>
                      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                        <h4 className="font-semibold text-brand-800">v{version.version}</h4>
                        <span className="text-sm text-silver-400">{formatDateShort(version.date)}</span>
                      </div>
                      <ul className="space-y-2">
                        {version.changelog.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-silver-600 text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'compatibility' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-brand-500" />
                    芯片兼容性
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-silver-50">
                    <div className="flex items-center gap-3">
                      <Cpu className="w-6 h-6 text-apple-purple" />
                      <div>
                        <p className="font-medium text-brand-800">Apple Silicon</p>
                        <p className="text-xs text-silver-500">M1 / M2 / M3 / M4 系列</p>
                      </div>
                    </div>
                    {software.compatibility.appleSilicon ? (
                      <Badge variant="success">已支持</Badge>
                    ) : (
                      <Badge variant="danger">不支持</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-silver-50">
                    <div className="flex items-center gap-3">
                      <Cpu className="w-6 h-6 text-brand-500" />
                      <div>
                        <p className="font-medium text-brand-800">Intel 芯片</p>
                        <p className="text-xs text-silver-500">Core i5 / i7 / i9 系列</p>
                      </div>
                    </div>
                    {software.compatibility.intel ? (
                      <Badge variant="success">已支持</Badge>
                    ) : (
                      <Badge variant="danger">不支持</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-brand-500" />
                    系统版本
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-xl bg-silver-50">
                    <p className="text-sm text-silver-500 mb-2">最低 macOS 版本要求</p>
                    <p className="text-2xl font-display font-bold text-brand-800">
                      {software.compatibility.minMacOS}+
                    </p>
                  </div>
                  <div className="mt-4 space-y-2">
                    {['15 Sequoia', '14 Sonoma', '13 Ventura', '12 Monterey', '11 Big Sur'].map((version) => {
                      const minVersion = parseFloat(software.compatibility.minMacOS);
                      const currentVersion = parseFloat(version);
                      const supported = currentVersion >= minVersion;
                      return (
                        <div key={version} className="flex items-center justify-between text-sm py-1">
                          <span className="text-silver-600">macOS {version}</span>
                          {supported ? (
                            <Badge variant="success">支持</Badge>
                          ) : (
                            <Badge variant="default">未测试</Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </section>

        {/* Alternatives */}
        {alternatives.length > 0 && (
          <section className="mt-16">
            <h2 className="section-title mb-6">相似软件推荐</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {alternatives.map((alt) => (
                <SoftwareCard key={alt.id} software={alt} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brand-900/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); prevScreenshot(); }}
              className="absolute left-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextScreenshot(); }}
              className="absolute right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
            <motion.img
              key={currentScreenshotIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              src={software.screenshots[currentScreenshotIndex]}
              alt={`${software.name} 截图`}
              className="max-w-full max-h-[85vh] rounded-2xl shadow-heavy"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {software.screenshots.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setCurrentScreenshotIndex(i); }}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all',
                    i === currentScreenshotIndex ? 'bg-white w-8' : 'bg-white/40'
                  )}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
