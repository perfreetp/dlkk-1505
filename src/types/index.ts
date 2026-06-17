export type SoftwareCategory = 'office' | 'development' | 'design' | 'efficiency';

export interface VersionRecord {
  version: string;
  date: string;
  changelog: string[];
}

export interface Software {
  id: string;
  name: string;
  icon: string;
  description: string;
  longDescription: string;
  category: SoftwareCategory;
  subCategory: string;
  rating: number;
  ratingCount: number;
  downloadCount: number;
  version: string;
  versions: VersionRecord[];
  compatibility: {
    minMacOS: string;
    appleSilicon: boolean;
    intel: boolean;
  };
  screenshots: string[];
  downloadLinks: {
    official?: string;
    appStore?: string;
    local?: string;
  };
  price: {
    type: 'free' | 'paid' | 'limited_free';
    amount?: number;
    originalPrice?: number;
    limitedFreeEndsAt?: string;
  };
  alternatives: string[];
  isFeatured: boolean;
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
  maintainerId?: string;
  tags: string[];
}

export interface Review {
  id: string;
  softwareId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  content: string;
  createdAt: string;
  isDraft?: boolean;
}

export interface ForumReply {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  quoteReplyId?: string;
  quoteContent?: string;
  isReported: boolean;
  createdAt: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  board: string;
  tags: string[];
  isPinned: boolean;
  isHighlighted: boolean;
  viewCount: number;
  replyCount: number;
  createdAt: string;
  replies: ForumReply[];
}

export interface DownloadRecord {
  softwareId: string;
  softwareName: string;
  softwareIcon: string;
  downloadedAt: string;
  source: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'contributor' | 'admin';
  bio?: string;
  favorites: string[];
  followingAuthors: string[];
  downloadHistory: DownloadRecord[];
  draftReviews: Review[];
}

export type SubmissionType = 'software' | 'changelog' | 'maintainer_claim';
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface Submission {
  id: string;
  type: SubmissionType;
  status: SubmissionStatus;
  submittedBy: string;
  submittedByName: string;
  submittedAt: string;
  payload: Record<string, unknown>;
  reviewNote?: string;
}

export interface ReportItem {
  id: string;
  type: 'comment' | 'link' | 'post';
  targetId: string;
  reason: string;
  reporterId: string;
  reporterName: string;
  createdAt: string;
  status: 'pending' | 'resolved' | 'dismissed';
  content?: string;
}

export interface FeaturedTopic {
  id: string;
  title: string;
  description: string;
  softwareIds: string[];
  coverImage?: string;
  createdAt: string;
  isActive: boolean;
}
