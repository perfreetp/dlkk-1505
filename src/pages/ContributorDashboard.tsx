import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UploadCloud,
  Package,
  Clock,
  UserCheck,
  Plus,
  FileText,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  ChevronRight,
  Edit3,
  ListPlus,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input, Textarea } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { mockSoftware } from '@/data/mockData';
import { cn, formatDate, formatDateShort } from '@/lib/utils';
import type { SubmissionType } from '@/types';
import { useContributorStore } from '@/store/useContributorStore';

type TabType = 'submit' | 'changelog' | 'claim' | 'submissions';

const navItems: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'submit', label: '提交软件', icon: Plus },
  { id: 'changelog', label: '更新日志', icon: FileText },
  { id: 'claim', label: '认领维护', icon: UserCheck },
  { id: 'submissions', label: '投稿状态', icon: Clock },
];

const typeLabels: Record<SubmissionType, string> = {
  software: '软件提交',
  changelog: '更新日志',
  maintainer_claim: '维护认领',
};

const statusConfig = {
  pending: { label: '待审核', icon: ClockIcon, variant: 'warning' as const },
  approved: { label: '已通过', icon: CheckCircle, variant: 'success' as const },
  rejected: { label: '已驳回', icon: XCircle, variant: 'danger' as const },
};

export default function ContributorDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('submissions');
  const { submissions, addSubmission } = useContributorStore();

  // Submit form state
  const [softwareName, setSoftwareName] = useState('');
  const [softwareDesc, setSoftwareDesc] = useState('');
  const [softwareCategory, setSoftwareCategory] = useState('efficiency');
  const [softwareLink, setSoftwareLink] = useState('');

  // Changelog form state
  const [selectedSoftware, setSelectedSoftware] = useState('');
  const [changelogVersion, setChangelogVersion] = useState('');
  const [changelogContent, setChangelogContent] = useState('');

  // Claim form state
  const [claimSoftware, setClaimSoftware] = useState('');
  const [claimReason, setClaimReason] = useState('');

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmitSoftware = () => {
    if (!softwareName.trim() || !softwareDesc.trim()) return;
    addSubmission('software', {
      name: softwareName,
      description: softwareDesc,
      category: softwareCategory,
      link: softwareLink,
    });
    setShowSuccessModal(true);
    setSoftwareName('');
    setSoftwareDesc('');
    setSoftwareLink('');
  };

  const handleSubmitChangelog = () => {
    if (!selectedSoftware || !changelogVersion.trim() || !changelogContent.trim()) return;
    addSubmission('changelog', {
      softwareId: selectedSoftware,
      version: changelogVersion,
      content: changelogContent,
    });
    setShowSuccessModal(true);
    setSelectedSoftware('');
    setChangelogVersion('');
    setChangelogContent('');
  };

  const handleSubmitClaim = () => {
    if (!claimSoftware || !claimReason.trim()) return;
    addSubmission('maintainer_claim', {
      softwareId: claimSoftware,
      reason: claimReason,
    });
    setShowSuccessModal(true);
    setClaimSoftware('');
    setClaimReason('');
  };

  const stats = [
    { label: '已通过投稿', value: submissions.filter((s) => s.status === 'approved').length, icon: CheckCircle, color: 'text-apple-green' },
    { label: '待审核', value: submissions.filter((s) => s.status === 'pending').length, icon: ClockIcon, color: 'text-apple-orange' },
    { label: '已驳回', value: submissions.filter((s) => s.status === 'rejected').length, icon: XCircle, color: 'text-apple-red' },
    { label: '维护软件', value: 3, icon: ShieldCheck, color: 'text-apple-blue' },
  ];

  return (
    <div className="container py-8 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="mb-6">
              <CardContent className="pt-8 pb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                    <UploadCloud className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-display font-bold text-brand-800">贡献者中心</h2>
                    <Badge variant="success" className="mt-1">
                      <Sparkles className="w-3 h-3" />
                      认证贡献者
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-silver-500">
                  感谢你为 Mac 社区贡献内容，一起打造更好的软件发现平台。
                </p>
              </CardContent>
            </Card>

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

            {/* Submit Software */}
            {activeTab === 'submit' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-brand-500" />
                    提交新软件
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-brand-700 mb-2">软件名称 *</label>
                      <Input
                        placeholder="例如：Raycast"
                        value={softwareName}
                        onChange={(e) => setSoftwareName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-700 mb-2">软件分类 *</label>
                      <select
                        value={softwareCategory}
                        onChange={(e) => setSoftwareCategory(e.target.value)}
                        className="input"
                      >
                        <option value="office">办公</option>
                        <option value="development">开发</option>
                        <option value="design">设计</option>
                        <option value="efficiency">效率</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-700 mb-2">软件简介 *</label>
                    <Textarea
                      placeholder="用一两句话介绍这款软件的核心功能..."
                      rows={3}
                      value={softwareDesc}
                      onChange={(e) => setSoftwareDesc(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-700 mb-2">官方下载链接</label>
                    <Input
                      placeholder="https://..."
                      value={softwareLink}
                      onChange={(e) => setSoftwareLink(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-silver-100">
                    <Button variant="secondary">保存草稿</Button>
                    <Button onClick={handleSubmitSoftware} disabled={!softwareName.trim() || !softwareDesc.trim()}>
                      <UploadCloud className="w-4 h-4" />
                      提交审核
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Changelog */}
            {activeTab === 'changelog' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ListPlus className="w-5 h-5 text-brand-500" />
                    补充更新日志
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-brand-700 mb-2">选择软件 *</label>
                      <select
                        value={selectedSoftware}
                        onChange={(e) => setSelectedSoftware(e.target.value)}
                        className="input"
                      >
                        <option value="">请选择软件</option>
                        {mockSoftware.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-700 mb-2">版本号 *</label>
                      <Input
                        placeholder="例如：1.2.0"
                        value={changelogVersion}
                        onChange={(e) => setChangelogVersion(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-700 mb-2">
                      更新内容 * <span className="text-silver-400 font-normal">(每行一条)</span>
                    </label>
                    <Textarea
                      placeholder="修复了...&#10;新增了...&#10;优化了..."
                      rows={6}
                      value={changelogContent}
                      onChange={(e) => setChangelogContent(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-silver-100">
                    <Button onClick={handleSubmitChangelog} disabled={!selectedSoftware || !changelogVersion.trim() || !changelogContent.trim()}>
                      <FileText className="w-4 h-4" />
                      提交更新
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Claim Maintainer */}
            {activeTab === 'claim' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-brand-500" />
                    认领软件维护
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <p className="text-sm text-silver-500 p-4 rounded-xl bg-silver-50">
                    认领软件后，你可以为该软件补充更新日志、完善信息，帮助社区用户获取最新内容。
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-brand-700 mb-2">选择软件 *</label>
                    <select
                      value={claimSoftware}
                      onChange={(e) => setClaimSoftware(e.target.value)}
                      className="input"
                    >
                      <option value="">请选择要认领维护的软件</option>
                      {mockSoftware.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-700 mb-2">认领说明 *</label>
                    <Textarea
                      placeholder="请说明你与该软件的关系，以及你能为维护提供什么帮助..."
                      rows={5}
                      value={claimReason}
                      onChange={(e) => setClaimReason(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-silver-100">
                    <Button onClick={handleSubmitClaim} disabled={!claimSoftware || !claimReason.trim()}>
                      <ShieldCheck className="w-4 h-4" />
                      提交认领申请
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submissions Status */}
            {activeTab === 'submissions' && (
              <div>
                <h1 className="text-2xl font-display font-bold text-brand-800 mb-6">投稿状态</h1>
                {submissions.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-16">
                      <Package className="w-16 h-16 text-silver-200 mx-auto mb-4" />
                      <p className="text-silver-500">暂无投稿记录</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {submissions.map((submission) => {
                      const status = statusConfig[submission.status];
                      const StatusIcon = status.icon;
                      return (
                        <Card key={submission.id} className="p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 flex-wrap mb-2">
                                <Badge>{typeLabels[submission.type]}</Badge>
                                <Badge variant={status.variant} className="flex items-center gap-1">
                                  <StatusIcon className="w-3 h-3" />
                                  {status.label}
                                </Badge>
                              </div>
                              <h3 className="font-semibold text-brand-800">
                                {(submission.payload.name as string) || (submission.payload.softwareId as string)
                                  ? `软件：${mockSoftware.find((s) => s.id === submission.payload.softwareId)?.name || (submission.payload.name as string)}`
                                  : (submission.payload.reason as string) || '维护认领申请'}
                              </h3>
                              {submission.reviewNote && (
                                <p className="text-sm text-silver-500 mt-2 p-3 rounded-lg bg-silver-50">
                                  审核意见：{submission.reviewNote}
                                </p>
                              )}
                              <div className="flex items-center gap-3 mt-3 text-xs text-silver-400">
                                <span>提交人：{submission.submittedByName}</span>
                                <span>·</span>
                                <span>{formatDate(submission.submittedAt)}</span>
                              </div>
                            </div>
                            <button className="p-2 rounded-xl hover:bg-silver-50 text-silver-400 hover:text-brand-600 transition-colors">
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        size="sm"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-apple-green" />
          </div>
          <h3 className="text-xl font-semibold text-brand-800 mb-2">提交成功！</h3>
          <p className="text-silver-500 mb-6">你的投稿已进入审核队列，我们会尽快处理</p>
          <Button onClick={() => {
            setShowSuccessModal(false);
            setActiveTab('submissions');
          }}>
            查看投稿状态
          </Button>
        </div>
      </Modal>
    </div>
  );
}
