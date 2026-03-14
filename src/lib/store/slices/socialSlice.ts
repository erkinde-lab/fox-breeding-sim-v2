import { StateCreator } from "zustand";
import { RootState } from "../index";
import {
  ForumCategory,
  ForumPost,
  NewsItem,
  Report,
  Member,
  AdminLog,
  Role
} from "../types";

export interface SocialSlice {
  forumCategories: ForumCategory[];
  forumPosts: ForumPost[];
  news: NewsItem[];
  reports: Report[];
  members: Member[];
  adminLogs: AdminLog[];

  // Actions
  addForumCategory: (name: string, description: string, icon: string) => void;
  addForumPost: (categoryId: string, author: string, title: string, content: string) => void;
  addForumReply: (postId: string, author: string, content: string) => void;
  deleteForumPost: (postId: string) => void;
  deleteForumReply: (postId: string, replyId: string) => void;
  togglePinPost: (postId: string) => void;
  lockForumPost: (postId: string) => void;
  addNews: (title: string, content: string, category: NewsItem['category']) => void;
  deleteNews: (id: string) => void;
  addReport: (report: Partial<Report>) => void;
  resolveReport: (reportId: string, action: "resolved" | "dismissed") => void;
  updateMemberRole: (memberId: string, role: Role) => void;
  warnMember: (memberId: string, reason: string) => void;
  banMember: (memberId: string) => void;
  addAdminLog: (action: string, details: string) => void;
}

export const createSocialSlice: StateCreator<RootState, [], [], SocialSlice> = (set) => ({
  forumCategories: [],
  forumPosts: [],
  news: [],
  reports: [],
  members: [],
  adminLogs: [],

  addForumCategory: (name, description, icon) => set((state: any) => ({
    forumCategories: [...state.forumCategories, { id: Date.now().toString(), name, description, icon }]
  })),
  addForumPost: (categoryId, author, title, content) => set((state: any) => ({
    forumPosts: [...state.forumPosts, {
      id: Date.now().toString(),
      categoryId,
      author,
      title,
      content,
      createdAt: new Date().toISOString(),
      replies: []
    }]
  })),
  addForumReply: (postId, author, content) => set((state: any) => ({
    forumPosts: state.forumPosts.map((p: ForumPost) => p.id === postId ? {
      ...p,
      replies: [...(p.replies || []), { id: Date.now().toString(), author, content, createdAt: new Date().toISOString() }]
    } : p)
  })),
  deleteForumPost: (postId) => set((state: any) => ({
    forumPosts: state.forumPosts.filter((p: ForumPost) => p.id !== postId)
  })),
  deleteForumReply: (postId, replyId) => set((state: any) => ({
    forumPosts: state.forumPosts.map((p: ForumPost) => p.id === postId ? {
      ...p,
      replies: (p.replies || []).filter(r => r.id !== replyId)
    } : p)
  })),
  togglePinPost: (postId) => set((state: any) => ({
    forumPosts: state.forumPosts.map((p: ForumPost) => p.id === postId ? { ...p, isPinned: !p.isPinned } : p)
  })),
  lockForumPost: (postId) => set((state: any) => ({
    forumPosts: state.forumPosts.map((p: ForumPost) => p.id === postId ? { ...p, isLocked: !p.isLocked } : p)
  })),
  addNews: (title, content, category) => set((state: any) => ({
    news: [{ id: Date.now().toString(), title, content, category, date: new Date().toISOString() }, ...state.news]
  })),
  deleteNews: (id) => set((state: any) => ({ news: state.news.filter((n: NewsItem) => n.id !== id) })),
  addReport: (report) => set((state: any) => ({
    reports: [...state.reports, {
      id: Date.now().toString(),
      status: "pending",
      createdAt: new Date().toISOString(),
      ...report
    } as Report]
  })),
  resolveReport: (reportId, action) => set((state: any) => ({
    reports: state.reports.map((r: Report) => r.id === reportId ? { ...r, status: action } : r)
  })),
  updateMemberRole: (memberId, role) => set((state: any) => ({
    members: state.members.map((m: Member) => m.id === memberId ? { ...m, role } : m)
  })),
  warnMember: (memberId, reason) => set((state: any) => ({
    members: state.members.map((m: Member) => m.id === memberId ? { ...m, warnings: [...m.warnings, reason] } : m),
    adminLogs: [...state.adminLogs, {
      id: Date.now().toString(),
      adminId: state.currentMemberId,
      adminName: state.members.find((m: Member) => m.id === state.currentMemberId)?.name || "Admin",
      action: "Warned Member",
      details: `Member ID: ${memberId}, Reason: ${reason}`,
      timestamp: new Date().toISOString()
    }]
  })),
  banMember: (memberId) => set((state: any) => ({
    members: state.members.map((m: Member) => m.id === memberId ? { ...m, isBanned: true } : m),
    adminLogs: [...state.adminLogs, {
      id: Date.now().toString(),
      adminId: state.currentMemberId,
      adminName: state.members.find((m: Member) => m.id === state.currentMemberId)?.name || "Admin",
      action: "Banned Member",
      details: `Member ID: ${memberId}`,
      timestamp: new Date().toISOString()
    }]
  })),
  addAdminLog: (action, details) => set((state: any) => ({
    adminLogs: [{
      id: Date.now().toString(),
      adminId: state.currentMemberId,
      adminName: state.members.find((m: Member) => m.id === state.currentMemberId)?.name || "Admin",
      action,
      details,
      timestamp: new Date().toISOString()
    }, ...state.adminLogs]
  })),
});
