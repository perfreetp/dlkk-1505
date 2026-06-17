import { create } from 'zustand';
import type { Submission, ReportItem, FeaturedTopic } from '@/types';
import { mockSubmissions, mockReports, mockTopics } from '@/data/mockData';
import { generateId } from '@/lib/utils';

interface AdminState {
  submissions: Submission[];
  reports: ReportItem[];
  topics: FeaturedTopic[];
  approveSubmission: (id: string, reviewNote?: string) => void;
  rejectSubmission: (id: string, reviewNote?: string) => void;
  resolveReport: (id: string, resolved: boolean) => void;
  toggleTopic: (id: string) => void;
  deleteTopic: (id: string) => void;
  createTopic: (title: string, description: string) => void;
  updateTopic: (id: string, title: string, description: string) => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  submissions: mockSubmissions,
  reports: mockReports,
  topics: mockTopics,

  approveSubmission: (id, reviewNote) =>
    set((state) => ({
      submissions: state.submissions.map((s) =>
        s.id === id ? { ...s, status: 'approved', reviewNote: reviewNote || '审核通过' } : s
      ),
    })),

  rejectSubmission: (id, reviewNote) =>
    set((state) => ({
      submissions: state.submissions.map((s) =>
        s.id === id ? { ...s, status: 'rejected', reviewNote: reviewNote || '审核未通过' } : s
      ),
    })),

  resolveReport: (id, resolved) =>
    set((state) => ({
      reports: state.reports.map((r) =>
        r.id === id ? { ...r, status: resolved ? 'resolved' : 'dismissed' } : r
      ),
    })),

  toggleTopic: (id) =>
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === id ? { ...t, isActive: !t.isActive } : t
      ),
    })),

  deleteTopic: (id) =>
    set((state) => ({
      topics: state.topics.filter((t) => t.id !== id),
    })),

  createTopic: (title, description) => {
    const newTopic: FeaturedTopic = {
      id: generateId(),
      title,
      description,
      softwareIds: [],
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      topics: [newTopic, ...state.topics],
    }));
  },

  updateTopic: (id, title, description) =>
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === id ? { ...t, title, description } : t
      ),
    })),
}));
