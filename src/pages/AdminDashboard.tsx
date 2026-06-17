import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Package,
  MessageSquare,
  Link as LinkIcon,
  Star,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  AlertTriangle,
  Plus,
  Edit3,
  Trash2,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input, Textarea } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { mockSoftware } from '@/data/mockData';
import { cn, formatDate } from '@/lib/utils';
import type { Submission, ReportItem, FeaturedTopic } from '@/types';
import { useAdminStore } from '@/store/useAdminStore';

type TabType = 'submissions' | 'comments' | 'links' | 'topics';

const navItems: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'submissions', label: '投稿审核', icon: Package },
  { id: 'comments', label: '评论审核', icon: MessageSquare },
  { id: 'links', label: '链接审核', icon: LinkIcon },
  { id: 'topics', label: '专题推荐', icon: Star },
];

const typeLabels = {
  software: '软件提交',
  changelog: '更新日志',
  maintainer_claim: '维护认领',
  comment: '评论',
  link: '链接',
  post: '帖子',
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('submissions');
  const {
    submissions,
    reports,
    topics,
    approveSubmission,
    rejectSubmission,
    resolveReport,
    toggleTopic,
    deleteTopic,
    createTopic,
    updateTopic,
  } = useAdminStore();

  const [reviewModal, setReviewModal] = useState<{ open: boolean; submission: Submission | null }>({ open: false, submission: null });
  const [reviewNote, setReviewNote] = useState('');

  const [topicModal, setTopicModal] = useState(false);
  const [editTopicModal, setEditTopicModal] = useState<{ open: boolean; topic: FeaturedTopic | null }>({ open: false, topic: null });
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicDesc, setNewTopicDesc] = useState('');
  const [editTopicTitle, setEditTopicTitle] = useState('');
  const [editTopicDesc, setEditTopicDesc] = useState('');

  const stats = [
    { label: '待审核投稿', value: submissions.filter((s) => s.status === 'pending').length, icon: Clock, color: 'text-apple-orange' },
    { label: '待处理举报', value: reports.filter((r) => r.status === 'pending').length, icon: AlertTriangle, color: 'text-apple-red' },
    { label: '已通过投稿', value: submissions.filter((s) => s.status === 'approved').length, icon: CheckCircle, color: 'text-apple-green' },
    { label: '活跃专题', value: topics.filter((t) => t.isActive).length, icon: Star, color: 'text-apple-purple' },
  ];

  const handleApprove = (id: string) => {
    approveSubmission(id, reviewNote);
    setReviewModal({ open: false, submission: null });
    setReviewNote('');
  };

  const handleReject = (id: string) => {
    rejectSubmission(id, reviewNote);
    setReviewModal({ open: false, submission: null });
    setReviewNote('');
  };

  const handleResolveReport = (id: string, resolved: boolean) => {
    resolveReport(id, resolved);
  };

  const handleToggleTopic = (id: string) => {
    toggleTopic(id);
  };

  const handleDeleteTopic = (id: string) => {
    deleteTopic(id);
  };

  const handleCreateTopic = () => {
    if (!newTopicTitle.trim()) return;
    createTopic(newTopicTitle, newTopicDesc);
    setTopicModal(false);
    setNewTopicTitle('');
    setNewTopicDesc('');
  };

  const handleOpenEditTopic = (topic: FeaturedTopic) => {
    setEditTopicTitle(topic.title);
    setEditTopicDesc(topic.description);
    setEditTopicModal({ open: true, topic });
  };

  const handleUpdateTopic = () => {
    if (!editTopicModal.topic || !editTopicTitle.trim()) return;
    updateTopic(editTopicModal.topic.id, editTopicTitle, editTopicDesc);
    setEditTopicModal({ open: false, topic: null });
    setEditTopicTitle('');
    setEditTopicDesc('');
  };

  return (
    <div className="container py-8 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="mb-6">
              <CardContent className="pt-8 pb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-apple-red to-apple-orange flex items-center justify-center">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-display font-bold text-brand-800">审核管理</h2>
                    <Badge variant="danger" className="mt-1">
                      管理员
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-silver-500">
                  管理社区投稿、评论和专题推荐，维护社区内容质量。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-2">
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    const badgeCount =
                      item.id === 'submissions'
                        ? submissions.filter((s) => s.status === 'pending').length
                        : item.id === 'comments' || item.id === 'links'
                        ? reports.filter((r) => r.status === 'pending' && (item.id === 'comments' ? r.type === 'comment' : r.type === 'link')).length
                        : 0;
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
                        {badgeCount > 0 && (
                          <span className={cn(
                            'ml-auto text-xs px-2 py-0.5 rounded-full',
                            isActive ? 'bg-white/20 text-white' : 'bg-apple-red/15 text-apple-red'
                          )}>
                            {badgeCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
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
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="p-5">
                      <div className="flex items-center gap-3">
                        <div className={cn('p-2.5 rounded-xl bg-silver-50', stat.color)}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-2xl font-display font-bold text-brand-800">{stat.value}</p>
                          <p className="text-xs text-silver-500">{stat.label}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Submissions Review */}
            {activeTab === 'submissions' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-display font-bold text-brand-800 mb-1">投稿审核</h1>
                    <p className="text-silver-500">处理用户提交的软件、更新日志和维护认领</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Input searchMode placeholder="搜索投稿..." className="w-56" />
                  </div>
                </div>

                <Card>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-silver-100">
                          <th className="text-left text-xs font-medium text-silver-500 uppercase px-6 py-4">类型</th>
                          <th className="text-left text-xs font-medium text-silver-500 uppercase px-6 py-4">内容</th>
                          <th className="text-left text-xs font-medium text-silver-500 uppercase px-6 py-4">提交人</th>
                          <th className="text-left text-xs font-medium text-silver-500 uppercase px-6 py-4">时间</th>
                          <th className="text-left text-xs font-medium text-silver-500 uppercase px-6 py-4">状态</th>
                          <th className="text-right text-xs font-medium text-silver-500 uppercase px-6 py-4">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-silver-50">
                        {submissions.map((submission) => (
                          <tr key={submission.id} className="hover:bg-silver-50/50">
                            <td className="px-6 py-4">
                              <Badge>{typeLabels[submission.type]}</Badge>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-medium text-brand-800 text-sm">
                                {(submission.payload.name as string) ||
                                  (submission.payload.softwareId
                                    ? mockSoftware.find((s) => s.id === submission.payload.softwareId)?.name
                                    : (submission.payload.reason as string)?.slice(0, 30) + '...') ||
                                  '投稿内容'}
                              </p>
                            </td>
                            <td className="px-6 py-4 text-sm text-silver-600">{submission.submittedByName}</td>
                            <td className="px-6 py-4 text-sm text-silver-500">{formatDate(submission.submittedAt)}</td>
                            <td className="px-6 py-4">
                              {submission.status === 'pending' && (
                                <Badge variant="warning" className="flex items-center gap-1 w-fit">
                                  <Clock className="w-3 h-3" />
                                  待审核
                                </Badge>
                              )}
                              {submission.status === 'approved' && (
                                <Badge variant="success" className="flex items-center gap-1 w-fit">
                                  <CheckCircle className="w-3 h-3" />
                                  已通过
                                </Badge>
                              )}
                              {submission.status === 'rejected' && (
                                <Badge variant="danger" className="flex items-center gap-1 w-fit">
                                  <XCircle className="w-3 h-3" />
                                  已驳回
                                </Badge>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              {submission.status === 'pending' ? (
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => setReviewModal({ open: true, submission })}
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    审核
                                  </Button>
                                </div>
                              ) : (
                                <Badge variant="default">已处理</Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}

            {/* Comments & Links Review */}
            {(activeTab === 'comments' || activeTab === 'links') && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-display font-bold text-brand-800 mb-1">
                      {activeTab === 'comments' ? '评论审核' : '链接审核'}
                    </h1>
                    <p className="text-silver-500">处理用户举报的违规{activeTab === 'comments' ? '评论' : '下载链接'}</p>
                  </div>
                </div>

                {reports
                  .filter((r) => (activeTab === 'comments' ? r.type === 'comment' || r.type === 'post' : r.type === 'link'))
                  .length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-16">
                      <CheckCircle className="w-16 h-16 text-apple-green mx-auto mb-4" />
                      <p className="text-silver-500">暂无待处理的举报</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {reports
                      .filter((r) => (activeTab === 'comments' ? r.type === 'comment' || r.type === 'post' : r.type === 'link'))
                      .map((report) => (
                        <Card key={report.id} className="p-5">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex items-center gap-3 flex-wrap">
                              <Badge variant={report.status === 'pending' ? 'warning' : report.status === 'resolved' ? 'success' : 'default'}>
                                {report.status === 'pending' && <Clock className="w-3 h-3 inline mr-1" />}
                                {report.status === 'resolved' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                                {report.status === 'pending' ? '待处理' : report.status === 'resolved' ? '已处理' : '已忽略'}
                              </Badge>
                              <Badge>{typeLabels[report.type]}</Badge>
                              <span className="text-xs text-silver-400">
                                举报人：{report.reporterName} · {formatDate(report.createdAt)}
                              </span>
                            </div>
                          </div>
                          <div className="p-4 rounded-xl bg-silver-50 mb-4">
                            <p className="text-sm text-silver-500 mb-1">举报原因：</p>
                            <p className="text-brand-700">{report.reason}</p>
                            {report.content && (
                              <>
                                <p className="text-sm text-silver-500 mt-3 mb-1">违规内容：</p>
                                <p className="text-apple-red text-sm bg-red-50 p-3 rounded-lg">{report.content}</p>
                              </>
                            )}
                          </div>
                          {report.status === 'pending' && (
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="secondary" size="sm" onClick={() => handleResolveReport(report.id, false)}>
                                <XCircle className="w-3.5 h-3.5" />
                                忽略
                              </Button>
                              <Button variant="danger" size="sm" onClick={() => handleResolveReport(report.id, true)}>
                                <Trash2 className="w-3.5 h-3.5" />
                                删除内容
                              </Button>
                            </div>
                          )}
                        </Card>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Featured Topics */}
            {activeTab === 'topics' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-display font-bold text-brand-800 mb-1">专题推荐</h1>
                    <p className="text-silver-500">管理首页展示的专题推荐</p>
                  </div>
                  <Button onClick={() => setTopicModal(true)}>
                    <Plus className="w-4 h-4" />
                    创建专题
                  </Button>
                </div>

                <div className="space-y-4">
                  {topics.map((topic) => (
                    <Card key={topic.id} className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="text-lg font-semibold text-brand-800">{topic.title}</h3>
                            <Badge variant={topic.isActive ? 'success' : 'default'}>
                              {topic.isActive ? '已上架' : '已下架'}
                            </Badge>
                          </div>
                          <p className="text-silver-600 text-sm mb-3">{topic.description}</p>
                          <div className="flex items-center gap-3 text-xs text-silver-400 flex-wrap">
                            <span>{topic.softwareIds.length} 款软件</span>
                            <span>·</span>
                            <span>创建于 {formatDate(topic.createdAt)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleOpenEditTopic(topic)}>
                            <Edit3 className="w-3.5 h-3.5" />
                            编辑
                          </Button>
                          <Button
                            variant={topic.isActive ? 'secondary' : 'primary'}
                            size="sm"
                            onClick={() => handleToggleTopic(topic.id)}
                          >
                            {topic.isActive ? '下架' : '上架'}
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="text-apple-red hover:text-apple-red"
                            onClick={() => handleDeleteTopic(topic.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={reviewModal.open}
        onClose={() => setReviewModal({ open: false, submission: null })}
        title="审核投稿"
        size="lg"
      >
        {reviewModal.submission && (
          <div className="space-y-5">
            <div className="p-5 rounded-xl bg-silver-50">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <Badge>{typeLabels[reviewModal.submission.type]}</Badge>
                <span className="text-sm text-silver-500">
                  提交人：{reviewModal.submission.submittedByName} · {formatDate(reviewModal.submission.submittedAt)}
                </span>
              </div>
              <div className="space-y-2">
                {Object.entries(reviewModal.submission.payload).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-xs text-silver-500 mb-0.5 capitalize">{key}</p>
                    <p className="text-brand-800 text-sm">{String(value)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-700 mb-2">审核意见</label>
              <Textarea
                placeholder="请输入审核意见（可选）"
                rows={3}
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-silver-100">
              <Button variant="secondary" onClick={() => setReviewModal({ open: false, submission: null })}>
                取消
              </Button>
              <Button variant="danger" onClick={() => handleReject(reviewModal.submission!.id)}>
                <XCircle className="w-4 h-4" />
                驳回
              </Button>
              <Button onClick={() => handleApprove(reviewModal.submission!.id)}>
                <CheckCircle className="w-4 h-4" />
                通过
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Topic Modal */}
      <Modal
        isOpen={topicModal}
        onClose={() => setTopicModal(false)}
        title="创建专题"
        size="md"
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-brand-700 mb-2">专题标题 *</label>
            <Input
              placeholder="例如：2024 年效率工具精选"
              value={newTopicTitle}
              onChange={(e) => setNewTopicTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-700 mb-2">专题描述</label>
            <Textarea
              placeholder="简要介绍这个专题"
              rows={3}
              value={newTopicDesc}
              onChange={(e) => setNewTopicDesc(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-silver-100">
            <Button variant="secondary" onClick={() => setTopicModal(false)}>
              取消
            </Button>
            <Button onClick={handleCreateTopic} disabled={!newTopicTitle.trim()}>
              创建专题
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Topic Modal */}
      <Modal
        isOpen={editTopicModal.open}
        onClose={() => setEditTopicModal({ open: false, topic: null })}
        title="编辑专题"
        size="md"
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-brand-700 mb-2">专题标题 *</label>
            <Input
              placeholder="例如：2024 年效率工具精选"
              value={editTopicTitle}
              onChange={(e) => setEditTopicTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-700 mb-2">专题描述</label>
            <Textarea
              placeholder="简要介绍这个专题"
              rows={3}
              value={editTopicDesc}
              onChange={(e) => setEditTopicDesc(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-silver-100">
            <Button variant="secondary" onClick={() => setEditTopicModal({ open: false, topic: null })}>
              取消
            </Button>
            <Button onClick={handleUpdateTopic} disabled={!editTopicTitle.trim()}>
              保存修改
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
