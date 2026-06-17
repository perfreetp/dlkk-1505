import { create } from 'zustand';
import type { ForumPost, ForumReply } from '@/types';
import { mockPosts } from '@/data/mockData';
import { generateId } from '@/lib/utils';

interface ForumState {
  posts: ForumPost[];
  addPost: (post: Omit<ForumPost, 'id' | 'viewCount' | 'replyCount' | 'createdAt' | 'replies' | 'isPinned' | 'isHighlighted'>) => ForumPost;
  getPostById: (id: string) => ForumPost | undefined;
  addReply: (postId: string, reply: Omit<ForumReply, 'id' | 'createdAt' | 'isReported'>) => void;
  togglePin: (postId: string) => void;
  toggleHighlight: (postId: string) => void;
  incrementViewCount: (postId: string) => void;
  setReport: (replyId: string, isReported: boolean) => void;
}

export const useForumStore = create<ForumState>((set, get) => ({
  posts: mockPosts,

  addPost: (postData) => {
    const newPost: ForumPost = {
      id: generateId(),
      ...postData,
      viewCount: 0,
      replyCount: 0,
      createdAt: new Date().toISOString(),
      replies: [],
      isPinned: false,
      isHighlighted: false,
    };
    set((state) => ({
      posts: [newPost, ...state.posts],
    }));
    return newPost;
  },

  getPostById: (id) => get().posts.find((p) => p.id === id),

  addReply: (postId, replyData) => {
    const newReply: ForumReply = {
      id: generateId(),
      ...replyData,
      createdAt: new Date().toISOString(),
      isReported: false,
    };
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              replies: [...post.replies, newReply],
              replyCount: post.replyCount + 1,
            }
          : post
      ),
    }));
  },

  togglePin: (postId) => {
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId ? { ...post, isPinned: !post.isPinned } : post
      ),
    }));
  },

  toggleHighlight: (postId) => {
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId ? { ...post, isHighlighted: !post.isHighlighted } : post
      ),
    }));
  },

  incrementViewCount: (postId) => {
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId ? { ...post, viewCount: post.viewCount + 1 } : post
      ),
    }));
  },

  setReport: (replyId, isReported) => {
    set((state) => ({
      posts: state.posts.map((post) => ({
        ...post,
        replies: post.replies.map((reply) =>
          reply.id === replyId ? { ...reply, isReported } : reply
        ),
      })),
    }));
  },
}));
