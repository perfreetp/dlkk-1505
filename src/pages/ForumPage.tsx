import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Plus,
  Pin,
  Flame,
  Clock,
  Eye,
  Search,
  HelpCircle,
  BookOpen,
  Lightbulb,
  Settings,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Input';
import { mockPosts, mockCurrentUser } from '@/data/mockData';
import { cn, formatDate, generateId } from '@/lib/utils';
import type { ForumPost } from '@/types';

type BoardType = 'all' | '系统讨论' | '软件评测' | '求助问答' | '教程分享' | '闲聊灌水';
type SortType = 'hot' | 'newest' | 'most_replied';

const boards = [
  { id: 'all', label: '全部板块', icon: MessageSquare },
  { id: '系统讨论', label: '系统讨论', icon: Settings },
  { id: '软件评测', label: '软件评测', icon: BookOpen },
  { id: '求助问答', label: '求助问答', icon: HelpCircle },
  { id: '教程分享', label: '教程分享', icon: Lightbulb },
  { id: '闲聊灌水', label: '闲聊灌水', icon: MessageSquare },
];

export default function ForumPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<ForumPost[]>(mockPosts);
  const [activeBoard, setActiveBoard] = useState<BoardType>('all');
  const [sortBy, setSortBy] = useState<SortType>('hot');
  const [search, setSearch] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostBoard, setNewPostBoard] = useState('软件评测');
  const [newPostTags, setNewPostTags] = useState('');

  const filteredPosts = posts
    .filter((p) => activeBoard === 'all' || p.board === activeBoard)
    .filter((p) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      switch (sortBy) {
        case 'hot':
          return (b.viewCount + b.replyCount * 10) - (a.viewCount + a.replyCount * 10);
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'most_replied':
          return b.replyCount - a.replyCount;
        default:
          return 0;
      }
    });

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    const newPost: ForumPost = {
      id: generateId(),
      title: newPostTitle,
      content: newPostContent,
      authorId: mockCurrentUser.id,
      authorName: mockCurrentUser.name,
      authorAvatar: mockCurrentUser.avatar,
      board: newPostBoard,
      tags: newPostTags.split(/[,，\s]+/).filter(Boolean),
      isPinned: false,
      isHighlighted: false,
      viewCount: 0,
      replyCount: 0,
      createdAt: new Date().toISOString(),
      replies: [],
    };
    setPosts([newPost, ...posts]);
    setShowNewPostModal(false);
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostTags('');
    navigate(`/forum/${newPost.id}`);
  };

  return (
    <div className="container py-8 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-800 mb-2">讨论区</h1>
          <p className="text-silver-500">与百万 Mac 用户一起交流使用心得</p>
        </div>
        <Button onClick={() => setShowNewPostModal(true)}>
          <Plus className="w-4 h-4" />
          发布新帖
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="mb-4">
                  <Input
                    searchMode
                    placeholder="搜索帖子..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  {boards.map((board) => {
                    const Icon = board.icon;
                    const count = board.id === 'all'
                      ? posts.length
                      : posts.filter((p) => p.board === board.id).length;
                    const isActive = activeBoard === board.id;
                    return (
                      <button
                        key={board.id}
                        onClick={() => setActiveBoard(board.id as BoardType)}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                          isActive
                            ? 'bg-brand-500 text-white'
                            : 'text-silver-600 hover:bg-silver-50'
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {board.label}
                        </span>
                        <span className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          isActive ? 'bg-white/20 text-white' : 'bg-silver-100 text-silver-500'
                        )}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Posts List */}
        <div className="lg:col-span-3">
          {/* Sort Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center justify-between mb-6"
          >
            <div className="flex items-center gap-1">
              {[
                { value: 'hot', label: '热门', icon: Flame },
                { value: 'newest', label: '最新', icon: Clock },
                { value: 'most_replied', label: '回复最多', icon: MessageSquare },
              ].map((option) => {
                const Icon = option.icon;
                const isActive = sortBy === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value as SortType)}
                    className={cn(
                      'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                      isActive ? 'bg-silver-100 text-brand-700' : 'text-silver-500 hover:text-brand-600'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {option.label}
                  </button>
                );
              })}
            </div>
            <span className="text-sm text-silver-400">
              共 {filteredPosts.length} 个帖子
            </span>
          </motion.div>

          {/* Posts */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-16">
                  <Search className="w-16 h-16 text-silver-200 mx-auto mb-4" />
                  <p className="text-silver-500 mb-2">没有找到相关帖子</p>
                  <p className="text-silver-400 text-sm">试试其他关键词或分类</p>
                </CardContent>
              </Card>
            ) : (
              filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/forum/${post.id}`}>
                    <Card hover className="p-6">
                      <div className="flex items-start gap-4">
                        <img
                          src={post.authorAvatar}
                          alt={post.authorName}
                          className="w-12 h-12 rounded-2xl bg-silver-200 flex-shrink-0"
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
                            {post.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-2 py-0.5 rounded-md bg-silver-50 text-silver-500"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                          <h3 className="text-lg font-semibold text-brand-800 mb-2 line-clamp-1">
                            {post.title}
                          </h3>
                          <p className="text-sm text-silver-500 line-clamp-2 mb-4">
                            {post.content}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-silver-400 flex-wrap">
                            <span className="font-medium text-silver-600">{post.authorName}</span>
                            <span>·</span>
                            <span>{formatDate(post.createdAt)}</span>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" />
                              {post.viewCount}
                            </span>
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
              ))
            )}
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      <Modal
        isOpen={showNewPostModal}
        onClose={() => setShowNewPostModal(false)}
        title="发布新帖"
        size="lg"
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-brand-700 mb-2">帖子标题</label>
            <Input
              placeholder="请输入标题..."
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-700 mb-2">选择板块</label>
            <div className="flex flex-wrap gap-2">
              {boards.filter((b) => b.id !== 'all').map((board) => (
                <button
                  key={board.id}
                  onClick={() => setNewPostBoard(board.id)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                    newPostBoard === board.id
                      ? 'bg-brand-500 text-white'
                      : 'bg-silver-50 text-silver-600 hover:bg-silver-100'
                  )}
                >
                  {board.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-700 mb-2">
              标签 <span className="text-silver-400 font-normal">(逗号或空格分隔)</span>
            </label>
            <Input
              placeholder="例如：macOS, 效率, 教程"
              value={newPostTags}
              onChange={(e) => setNewPostTags(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-700 mb-2">帖子内容</label>
            <Textarea
              placeholder="分享你的想法..."
              rows={8}
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-silver-100">
            <Button variant="secondary" onClick={() => setShowNewPostModal(false)}>
              取消
            </Button>
            <Button
              onClick={handleCreatePost}
              disabled={!newPostTitle.trim() || !newPostContent.trim()}
            >
              发布帖子
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
