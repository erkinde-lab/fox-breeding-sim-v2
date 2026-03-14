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

  addForumCategory: (name, description, icon) => set((state: any) => {
    const newCategory = { id: Date.now().toString(), name, description, icon };
    return {
      forumCategories: [...state.forumCategories, newCategory],
      adminLogs: [{
        id: Math.random().toString(),
        adminId: state.currentMemberId,
        adminName: state.members.find((m: Member) => m.id === state.currentMemberId)?.name || "Admin",
        action: "Added Forum Category",
        details: `Category: ${name}`,
        timestamp: new Date().toISOString()
      }, ...state.adminLogs]
    };
  }),
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
  deleteForumPost: (postId) => set((state: any) => {
    const post = state.forumPosts.find((p: ForumPost) => p.id === postId);
    return {
      forumPosts: state.forumPosts.filter((p: ForumPost) => p.id !== postId),
      adminLogs: [{
        id: Math.random().toString(),
        adminId: state.currentMemberId,
        adminName: state.members.find((m: Member) => m.id === state.currentMemberId)?.name || "Admin",
        action: "Deleted Forum Post",
        details: `Post ID: ${postId}, Title: ${post?.title || 'Unknown'}`,
        timestamp: new Date().toISOString()
      }, ...state.adminLogs]
    };
  }),
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
    news: [{ id: Date.now().toString(), title, content, category, date: new Date().toISOString() }, ...state.news],
    adminLogs: [{
      id: Math.random().toString(),
      adminId: state.currentMemberId,
      adminName: state.members.find((m: Member) => m.id === state.currentMemberId)?.name || "Admin",
      action: "Added News",
      details: `Title: ${title}`,
      timestamp: new Date().toISOString()
    }, ...state.adminLogs]
  })),
  deleteNews: (id) => set((state: any) => ({
    news: state.news.filter((n: NewsItem) => n.id !== id),
    adminLogs: [{
      id: Math.random().toString(),
      adminId: state.currentMemberId,
      adminName: state.members.find((m: Member) => m.id === state.currentMemberId)?.name || "Admin",
      action: "Deleted News",
      details: `News ID: ${id}`,
      timestamp: new Date().toISOString()
    }, ...state.adminLogs]
  })),
  addReport: (report) => set((state: any) => ({
    reports: [...state.reports, {
      id: Date.now().toString(),
      status: "pending",
      createdAt: new Date().toISOString(),
      ...report
    } as Report]
  })),
  resolveReport: (reportId, action) => set((state: any) => ({
    reports: state.reports.map((r: Report) => r.id === reportId ? { ...r, status: action } : r),
    adminLogs: [{
      id: Math.random().toString(),
      adminId: state.currentMemberId,
      adminName: state.members.find((m: Member) => m.id === state.currentMemberId)?.name || "Admin",
      action: "Resolved Report",
      details: `Report ID: ${reportId}, Status: ${action}`,
      timestamp: new Date().toISOString()
    }, ...state.adminLogs]
  })),
  updateMemberRole: (memberId, role) => set((state: any) => ({
    members: state.members.map((m: Member) => m.id === memberId ? { ...m, role } : m),
    adminLogs: [{
      id: Math.random().toString(),
      adminId: state.currentMemberId,
      adminName: state.members.find((m: Member) => m.id === state.currentMemberId)?.name || "Admin",
      action: "Updated Member Role",
      details: `Member ID: ${memberId}, Role: ${role}`,
      timestamp: new Date().toISOString()
    }, ...state.adminLogs]
  })),
  warnMember: (memberId, reason) => set((state: any) => ({
    members: state.members.map((m: Member) => m.id === memberId ? { ...m, warnings: [...(m.warnings || []), reason] } : m),
    adminLogs: [{
      id: Date.now().toString(),
      adminId: state.currentMemberId,
      adminName: state.members.find((m: Member) => m.id === state.currentMemberId)?.name || "Admin",
      action: "Warned Member",
      details: `Member ID: ${memberId}, Reason: ${reason}`,
      timestamp: new Date().toISOString()
    }, ...state.adminLogs]
  })),
  banMember: (memberId) => set((state: any) => ({
    members: state.members.map((m: Member) => m.id === memberId ? { ...m, isBanned: true } : m),
    adminLogs: [{
      id: Date.now().toString(),
      adminId: state.currentMemberId,
      adminName: state.members.find((m: Member) => m.id === state.currentMemberId)?.name || "Admin",
      action: "Banned Member",
      details: `Member ID: ${memberId}`,
      timestamp: new Date().toISOString()
    }, ...state.adminLogs]
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
