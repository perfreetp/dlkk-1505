import { create } from 'zustand';
import type { User, Review, DownloadRecord } from '@/types';
import { mockCurrentUser, mockReviews } from '@/data/mockData';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  toggleFavorite: (softwareId: string) => void;
  isFavorite: (softwareId: string) => boolean;
  addDownload: (record: DownloadRecord) => void;
  saveDraftReview: (review: Review) => void;
  removeDraftReview: (reviewId: string) => void;
  publishReview: (reviewId: string) => Review | null;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: mockCurrentUser,
  isLoggedIn: true,

  login: () => set({ user: mockCurrentUser, isLoggedIn: true }),
  logout: () => set({ user: null, isLoggedIn: false }),

  toggleFavorite: (softwareId) =>
    set((state) => {
      if (!state.user) return state;
      const favorites = state.user.favorites.includes(softwareId)
        ? state.user.favorites.filter((id) => id !== softwareId)
        : [...state.user.favorites, softwareId];
      return { user: { ...state.user, favorites } };
    }),

  isFavorite: (softwareId) => get().user?.favorites.includes(softwareId) ?? false,

  addDownload: (record) =>
    set((state) => {
      if (!state.user) return state;
      return {
        user: {
          ...state.user,
          downloadHistory: [record, ...state.user.downloadHistory],
        },
      };
    }),

  saveDraftReview: (review) =>
    set((state) => {
      if (!state.user) return state;
      const existingIndex = state.user.draftReviews.findIndex((r) => r.id === review.id);
      const draftReviews = [...state.user.draftReviews];
      if (existingIndex >= 0) {
        draftReviews[existingIndex] = review;
      } else {
        draftReviews.push(review);
      }
      return { user: { ...state.user, draftReviews } };
    }),

  removeDraftReview: (reviewId) =>
    set((state) => {
      if (!state.user) return state;
      return {
        user: {
          ...state.user,
          draftReviews: state.user.draftReviews.filter((r) => r.id !== reviewId),
        },
      };
    }),

  publishReview: (reviewId) => {
    const state = get();
    if (!state.user) return null;
    const draft = state.user.draftReviews.find((r) => r.id === reviewId);
    if (!draft) return null;
    const publishedReview = { ...draft, isDraft: false, createdAt: new Date().toISOString() };
    set({
      user: {
        ...state.user,
        draftReviews: state.user.draftReviews.filter((r) => r.id !== reviewId),
      },
    });
    return publishedReview;
  },
}));

interface SoftwareState {
  reviews: Review[];
  addReview: (review: Review) => void;
  getReviewsBySoftware: (softwareId: string) => Review[];
}

export const useSoftwareStore = create<SoftwareState>((set, get) => ({
  reviews: mockReviews,

  addReview: (review) => set((state) => ({ reviews: [review, ...state.reviews] })),

  getReviewsBySoftware: (softwareId) =>
    get().reviews.filter((r) => r.softwareId === softwareId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
}));
