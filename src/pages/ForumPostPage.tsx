import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Pin,
  Flame,
  Eye,
  MessageSquare,
  Send,
  Reply,
  Quote,
  Flag,
  ThumbsUp,
  MoreHorizontal,
  Pin as PinIcon,
  Star,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { mockPosts, mockCurrentUser } from '@/data/mockData';
import { cn, formatDate, generateId } from '@/lib/utils';
import type { ForumReply } from '@/types';

export default function ForumPostPage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const postData = mockPosts.find((p) => p.id === postId) || mockPosts[0];

  const [post, setPost] = useState(postData);
  const [replyContent, setReplyContent] = useState('');
  const [quotedReply, setQuotedReply] = useState<ForumReply | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportContent, setReportContent] = useState('');
  const [reportTarget, setReportTarget] = useState<{ type: string; id: string } | null>(null);
  const [likedReplies, setLikedReplies] = useState<Set<string>>(new Set());
  const [isAdmin] = useState(mockCurrentUser.role === 'admin');

  const handleQuote = (reply: ForumReply) => {
    setQuotedReply(reply);
  };

  const handleSubmitReply = () => {
    if (!replyContent.trim()) return;
    const newReply: ForumReply = {
      id: generateId(),
      postId: post.id,
      content: replyContent,
      authorId: mockCurrentUser.id,
      authorName: mockCurrentUser.name,
      authorAvatar: mockCurrentUser.avatar,
      quoteReplyId: quotedReply?.id,
      quoteContent: quotedReply?.content,
      isReported: false,
      createdAt: new Date().toISOString(),
    };
    setPost({
      ...post,
      replies: [...post.replies, newReply],
      replyCount: post.replyCount + 1,
    });
    setReplyContent('');
    setQuotedReply(null);
  };

  const handleReport = (type: string, id: string) => {
    setReportTarget({ type, id });
    setShowReportModal(true);
  };

  const submitReport = () => {
    setShowReportModal(false);
    setReportContent('');
    setReportTarget(null);
  };

  const toggleLike = (replyId: string) => {
    const newLiked = new Set(likedReplies);
    if (newLiked.has(replyId)) {
      newLiked.delete(replyId);
    } else {
      newLiked.add(replyId);
    }
    setLikedReplies(newLiked);
  };

  const handleTogglePin = () => {
    setPost({ ...post, isPinned: !post.isPinned });
  };

  const handleToggleHighlight = () => {
    setPost({ ...post, isHighlighted: !post.isHighlighted });
  };

  return (
    <div className="container py-8 pb-16 max-w-4xl">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/forum')}
          className="flex items-center gap-2 text-silver-600 hover:text-brand-600 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">返回讨论区</span>
        </button>
        {isAdmin && (
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleTogglePin}>
              <PinIcon className="w-4 h-4" />
              {post.isPinned ? '取消置顶' : '置顶'}
            </Button>
            <Button variant="secondary" size="sm" onClick={handleToggleHighlight}>
              <Star className="w-4 h-4" />
              {post.isHighlighted ? '取消精华' : '加精'}
            </Button>
          </div>
        )}
      </div>

      {/* Post */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8 mb-6"
      >
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {post.isPinned && (
            <Badge variant="info">
              <Pin className="w-3 h-3" />
              置顶
            </Badge>
          )}
          {post.isHighlighted && <Badge variant="warning">精华</Badge>}
          <Badge>{post.board}</Badge>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-md bg-silver-50 text-silver-500"
            >
              #{tag}
            </span>
          ))}
        </div>

        <h1 className="text-2xl lg:text-3xl font-display font-bold text-brand-800 mb-6">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-silver-100">
          <img
            src={post.authorAvatar}
            alt={post.authorName}
            className="w-12 h-12 rounded-2xl bg-silver-200"
          />
          <div className="flex-1">
            <p className="font-medium text-brand-800">{post.authorName}</p>
            <div className="flex items-center gap-3 text-xs text-silver-400 mt-0.5">
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
          <div className="relative group">
            <button className="p-2 rounded-xl hover:bg-silver-50 text-silver-400 hover:text-silver-600 transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
            <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-heavy border border-silver-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={() => handleReport('post', post.id)}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-apple-red hover:bg-red-50"
              >
                <Flag className="w-4 h-4" />
                举报帖子
              </button>
            </div>
          </div>
        </div>

        <div className="prose prose-silver max-w-none">
          <p className="text-brand-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
        </div>
      </motion.article>

      {/* Replies Section */}
      <div className="mb-6">
        <h2 className="text-xl font-display font-semibold text-brand-800 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-brand-500" />
          全部回复 <span className="text-silver-400 font-normal">({post.replies.length})</span>
        </h2>

        {post.replies.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-silver-200 mx-auto mb-3" />
              <p className="text-silver-500">暂无回复，来抢沙发吧！</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {post.replies.map((reply, index) => (
              <motion.div
                key={reply.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card p-6"
              >
                {reply.quoteContent && (
                  <div className="mb-4 p-4 rounded-xl bg-silver-50 border-l-4 border-brand-300">
                    <p className="text-sm text-silver-500 italic">
                      <Quote className="w-4 h-4 inline mr-1 text-silver-400" />
                      {reply.quoteContent}
                    </p>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <img
                    src={reply.authorAvatar}
                    alt={reply.authorName}
                    className="w-10 h-10 rounded-xl bg-silver-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-brand-800">{reply.authorName}</span>
                        <span className="text-xs text-silver-400">{formatDate(reply.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleLike(reply.id)}
                          className={cn(
                            'p-1.5 rounded-lg text-xs transition-colors flex items-center gap-1',
                            likedReplies.has(reply.id)
                              ? 'text-apple-red bg-red-50'
                              : 'text-silver-400 hover:text-brand-600 hover:bg-silver-50'
                          )}
                        >
                          <ThumbsUp className={cn('w-4 h-4', likedReplies.has(reply.id) && 'fill-current')} />
                        </button>
                        <button
                          onClick={() => handleQuote(reply)}
                          className="p-1.5 rounded-lg text-silver-400 hover:text-brand-600 hover:bg-silver-50 transition-colors"
                        >
                          <Reply className="w-4 h-4" />
                        </button>
                        {isAdmin && (
                          <button className="p-1.5 rounded-lg text-silver-400 hover:text-apple-red hover:bg-red-50 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleReport('reply', reply.id)}
                          className="p-1.5 rounded-lg text-silver-400 hover:text-apple-red hover:bg-red-50 transition-colors"
                        >
                          <Flag className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-brand-700 leading-relaxed">{reply.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Reply Form */}
      <Card>
        <CardContent>
          {quotedReply && (
            <div className="mb-4 p-3 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-brand-600 overflow-hidden">
                <Quote className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">回复 {quotedReply.authorName}：{quotedReply.content}</span>
              </div>
              <button
                onClick={() => setQuotedReply(null)}
                className="text-silver-400 hover:text-brand-600 flex-shrink-0 ml-2"
              >
                ✕
              </button>
            </div>
          )}
          <div className="flex items-start gap-4">
            <img
              src={mockCurrentUser.avatar}
              alt={mockCurrentUser.name}
              className="w-10 h-10 rounded-xl bg-silver-200 flex-shrink-0"
            />
            <div className="flex-1">
              <Textarea
                placeholder="写下你的回复..."
                rows={4}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-silver-400">
                  支持引用回复，点击回复按钮即可引用
                </p>
                <Button onClick={handleSubmitReply} disabled={!replyContent.trim()}>
                  <Send className="w-4 h-4" />
                  发表回复
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Modal */}
      <Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title="举报"
        size="md"
      >
        <div className="space-y-5">
          <p className="text-silver-600 text-sm">请选择举报原因：</p>
          <div className="space-y-2">
            {['垃圾广告', '违规内容', '人身攻击', '重复内容', '其他'].map((reason) => (
              <label key={reason} className="flex items-center gap-3 p-3 rounded-xl hover:bg-silver-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="reportReason"
                  value={reason}
                  checked={reportContent === reason}
                  onChange={() => setReportContent(reason)}
                  className="w-4 h-4 text-brand-500"
                />
                <span className="text-brand-700">{reason}</span>
              </label>
            ))}
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-silver-100">
            <Button variant="secondary" onClick={() => setShowReportModal(false)}>
              取消
            </Button>
            <Button variant="danger" onClick={submitReport} disabled={!reportContent}>
              提交举报
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
