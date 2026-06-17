import { create } from 'zustand';
import type { Submission, SubmissionType } from '@/types';
import { mockSubmissions, mockCurrentUser } from '@/data/mockData';
import { generateId } from '@/lib/utils';

interface ContributorState {
  submissions: Submission[];
  addSubmission: (type: SubmissionType, payload: Record<string, unknown>) => Submission;
  getSubmissionsByType: (type: SubmissionType) => Submission[];
}

export const useContributorStore = create<ContributorState>((set, get) => ({
  submissions: mockSubmissions,

  addSubmission: (type, payload) => {
    const newSubmission: Submission = {
      id: generateId(),
      type,
      status: 'pending',
      submittedBy: mockCurrentUser.id,
      submittedByName: mockCurrentUser.name,
      submittedAt: new Date().toISOString(),
      payload,
    };
    set((state) => ({
      submissions: [newSubmission, ...state.submissions],
    }));
    return newSubmission;
  },

  getSubmissionsByType: (type) =>
    get().submissions.filter((s) => s.type === type),
}));
