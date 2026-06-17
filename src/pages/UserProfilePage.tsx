import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Users,
  Download,
  FileText,
  User as UserIcon,
  Edit3,
  Trash2,
  Send,
  ChevronRight,
  Shield,
  UploadCloud,
  Calendar,
  Star,
  Settings,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SoftwareCard } from '@/components/features/SoftwareCard';
import { Rating } from '@/components/ui/Rating';
import { mockSoftware } from '@/data/mockData';
import { useAuthStore } from '@/store/useAuthStore';
import { cn, formatDate, formatDateShort } from '@/lib/utils';

type TabType = 'favorites' | 'following' | 'downloads' | 'drafts' | 'settings';

const navItems: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'favorites', label: '我的收藏', icon: Heart },
  { id: 'following', label: '关注作者', icon: Users },
  { id: 'downloads', label: '下载历史', icon: Download },
  { id: 'drafts', label: '评价草稿', icon: FileText },
  { id: 'settings', label: '账号设置', icon: Settings },
];

export default function UserProfilePage() {
  const navigate = useNavigate();
  const { user, isLoggedIn, toggleFavorite, removeDraftReview, publishReview } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('favorites');

  if (!isLoggedIn || !user) {
    return (
      <div className="container py-20 text-center">
        <p className="text-silver-500 mb-4">请先登录</p>
        <Link to="/login">
          <Button>去登录</Button>
        </Link>
      </div>
    );
  }

  const favoriteSoftware = mockSoftware.filter((s) => user.favorites.includes(s.id));

  const mockAuthors = [
    { id: 'a1', name: '效率达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Author1', softwareCount: 15, followers: 2340 },
    { id: 'a2', name: '设计师小王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Author2', softwareCount: 8, followers: 1890 },
    { id: 'a3', name: '开发者小李', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Author3', softwareCount: 22, followers: 5670 },
  ];

  return (
    <div className="container py-8 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Profile Card */}
            <Card className="mb-6">
              <CardContent className="text-center pt-8 pb-6">
                <div className="relative inline-block mb-4">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-24 h-24 rounded-3xl bg-silver-200 mx-auto shadow-medium"
                  />
                  <button className="absolute bottom-0 right-0 p-2 rounded-full bg-brand-500 text-white shadow-medium hover:bg-brand-600 transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="text-xl font-display font-bold text-brand-800 mb-1">{user.name}</h2>
                <p className="text-sm text-silver-500 mb-3">{user.email}</p>
                <div className="flex items-center justify-center gap-2">
                  {user.role === 'admin' && (
                    <Badge variant="danger" className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      管理员
                    </Badge>
                  )}
                  {user.role === 'contributor' && (
                    <Badge variant="info" className="flex items-center gap-1">
                      <UploadCloud className="w-3 h-3" />
                      贡献者
                    </Badge>
                  )}
                  {user.role === 'user' && <Badge>普通用户</Badge>}
                </div>
                {user.bio && (
                  <p className="text-sm text-silver-600 mt-4 px-4">{user.bio}</p>
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <Card>
              <CardContent className="p-2">
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-all',
                          isActive
                            ? 'bg-brand-500 text-white shadow-soft'
                            : 'text-silver-600 hover:bg-silver-50 hover:text-brand-700'
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        {item.label}
                        {item.id === 'favorites' && (
                          <span className={cn(
                            'ml-auto text-xs px-2 py-0.5 rounded-full',
                            isActive ? 'bg-white/20 text-white' : 'bg-silver-100 text-silver-500'
                          )}>
                            {favoriteSoftware.length}
                          </span>
                        )}
                        {item.id === 'drafts' && user.draftReviews.length > 0 && (
                          <span className={cn(
                            'ml-auto text-xs px-2 py-0.5 rounded-full',
                            isActive ? 'bg-white/20 text-white' : 'bg-apple-orange/15 text-apple-orange'
                          )}>
                            {user.draftReviews.length}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <div className="mt-6 space-y-2">
              {user.role === 'contributor' && (
                <Link to="/contributor" className="block">
                  <div className="card-hover p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <UploadCloud className="w-5 h-5 text-brand-500" />
                      <span className="font-medium text-brand-700">贡献者后台</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-silver-400" />
                  </div>
                </Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className="block">
                  <div className="card-hover p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-apple-red" />
                      <span className="font-medium text-brand-700">审核管理</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-silver-400" />
                  </div>
                </Link>
              )}
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Favorites */}
            {activeTab === 'favorites' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-display font-bold text-brand-800 mb-1">我的收藏</h1>
                    <p className="text-silver-500">共收藏 {favoriteSoftware.length} 款软件</p>
                  </div>
                </div>
                {favoriteSoftware.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-16">
                      <Heart className="w-16 h-16 text-silver-200 mx-auto mb-4" />
                      <p className="text-silver-500 mb-2">还没有收藏任何软件</p>
                      <p className="text-silver-400 text-sm mb-6">去发现页收藏喜欢的软件吧</p>
                      <Link to="/category">
                        <Button>浏览软件</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {favoriteSoftware.map((software) => (
                      <SoftwareCard key={software.id} software={software} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Following Authors */}
            {activeTab === 'following' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-display font-bold text-brand-800 mb-1">关注作者</h1>
                    <p className="text-silver-500">共关注 {mockAuthors.length} 位作者</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockAuthors.map((author) => (
                    <Card key={author.id} hover className="p-5">
                      <div className="flex items-start gap-4">
                        <img
                          src={author.avatar}
                          alt={author.name}
                          className="w-14 h-14 rounded-2xl bg-silver-200"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-brand-800">{author.name}</h3>
                          <div className="flex items-center gap-3 text-xs text-silver-400 mt-1 mb-3">
                            <span>{author.softwareCount} 款软件</span>
                            <span>·</span>
                            <span>{author.followers.toLocaleString()} 粉丝</span>
                          </div>
                          <Button variant="secondary" size="sm">
                            <Users className="w-3.5 h-3.5" />
                            已关注
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Download History */}
            {activeTab === 'downloads' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-display font-bold text-brand-800 mb-1">下载历史</h1>
                    <p className="text-silver-500">共下载 {user.downloadHistory.length} 款软件</p>
                  </div>
                </div>
                {user.downloadHistory.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-16">
                      <Download className="w-16 h-16 text-silver-200 mx-auto mb-4" />
                      <p className="text-silver-500">暂无下载记录</p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <div className="divide-y divide-silver-100">
                      {user.downloadHistory.map((record, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-5 hover:bg-silver-50 transition-colors"
                        >
                          <img
                            src={record.softwareIcon}
                            alt={record.softwareName}
                            className="w-12 h-12 rounded-xl bg-silver-100"
                          />
                          <div className="flex-1 min-w-0">
                            <Link to={`/app/${record.softwareId}`} className="font-medium text-brand-800 hover:text-brand-600">
                              {record.softwareName}
                            </Link>
                            <div className="flex items-center gap-2 text-xs text-silver-400 mt-1">
                              <Download className="w-3 h-3" />
                              {record.source}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-silver-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDateShort(record.downloadedAt)}
                            </p>
                            <p className="text-xs text-silver-500 mt-0.5">{formatDate(record.downloadedAt)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* Draft Reviews */}
            {activeTab === 'drafts' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-display font-bold text-brand-800 mb-1">评价草稿</h1>
                    <p className="text-silver-500">共 {user.draftReviews.length} 篇草稿</p>
                  </div>
                </div>
                {user.draftReviews.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-16">
                      <FileText className="w-16 h-16 text-silver-200 mx-auto mb-4" />
                      <p className="text-silver-500">暂无评价草稿</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {user.draftReviews.map((draft) => {
                      const software = mockSoftware.find((s) => s.id === draft.softwareId);
                      return (
                        <Card key={draft.id} className="p-5">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex items-center gap-3">
                              {software && (
                                <img
                                  src={software.icon}
                                  alt={software.name}
                                  className="w-10 h-10 rounded-xl bg-silver-100"
                                />
                              )}
                              <div>
                                <p className="font-medium text-brand-800">
                                  {software?.name || '未知软件'}
                                </p>
                                <Rating value={draft.rating} size="sm" />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => removeDraftReview(draft.id)}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                删除
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => {
                                  publishReview(draft.id);
                                }}
                              >
                                <Send className="w-3.5 h-3.5" />
                                发布
                              </Button>
                            </div>
                          </div>
                          <p className="text-brand-700 line-clamp-3">{draft.content}</p>
                          <p className="text-xs text-silver-400 mt-3">
                            保存于 {formatDate(draft.createdAt)}
                          </p>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Settings */}
            {activeTab === 'settings' && (
              <div>
                <h1 className="text-2xl font-display font-bold text-brand-800 mb-6">账号设置</h1>
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-brand-500" />
                        基本信息
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-6">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-20 h-20 rounded-2xl bg-silver-200"
                        />
                        <Button variant="secondary" size="sm">
                          <Edit3 className="w-4 h-4" />
                          更换头像
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-brand-700 mb-1.5">昵称</label>
                          <input defaultValue={user.name} className="input" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-brand-700 mb-1.5">邮箱</label>
                          <input defaultValue={user.email} className="input" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-700 mb-1.5">个人简介</label>
                        <textarea
                          defaultValue={user.bio}
                          rows={3}
                          className="w-full px-4 py-2.5 rounded-xl bg-silver-50 border border-silver-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button>保存修改</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-apple-red">
                        <LogOut className="w-5 h-5" />
                        危险操作
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-100">
                        <div>
                          <p className="font-medium text-apple-red">退出登录</p>
                          <p className="text-xs text-silver-500 mt-0.5">退出当前账号</p>
                        </div>
                        <Button variant="danger" size="sm">
                          <LogOut className="w-4 h-4" />
                          退出登录
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
