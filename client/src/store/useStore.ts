import { create } from 'zustand';
import { addDays, format } from 'date-fns';

export type Platform = 'Instagram' | 'Facebook' | 'LinkedIn' | 'Twitter' | 'YouTube';
export type ContentType = 'Post' | 'Reel' | 'Story' | 'Carousel' | 'Thread';
export type Tone = 'Professional' | 'Casual' | 'Funny' | 'Motivational';

export interface GeneratedContent {
  id: string;
  platform: Platform;
  type: ContentType;
  topic: string;
  content: string;
  hashtags: string[];
  emoji: string[];
  cta?: string;
  status: 'Draft' | 'Scheduled' | 'Posted';
  scheduledDate?: Date;
  createdAt: Date;
  imageUrl?: string;
}

interface User {
  name: string;
  email: string;
  avatar: string;
  plan: 'Free' | 'Pro';
}

interface AppState {
  user: User | null;
  generatedContent: GeneratedContent[];
  isGenerating: boolean;
  login: (email: string) => void;
  logout: () => void;
  generateContent: (params: { platform: Platform; type: ContentType; tone: Tone; topic: string; language: string }) => Promise<void>;
  generateImageCaption: (file: File) => Promise<void>;
  schedulePost: (id: string, date: Date) => void;
  deleteContent: (id: string) => void;
}

// Mock Data
const MOCK_USER: User = {
  name: 'Alex Creator',
  email: 'alex@socialgen.ai',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
  plan: 'Pro',
};

const MOCK_CONTENT: GeneratedContent[] = [
  {
    id: '1',
    platform: 'Instagram',
    type: 'Post',
    topic: 'Product Launch',
    content: "🚀 Exciting news! We've just launched our new AI-powered analytics tool. It's never been easier to track your growth. Check it out now! #SocialGen #AI #Growth",
    hashtags: ['#SocialGen', '#AI', '#TechLaunch', '#Analytics'],
    emoji: ['🚀', '📈', '🔥'],
    status: 'Posted',
    createdAt: addDays(new Date(), -2),
  },
  {
    id: '2',
    platform: 'LinkedIn',
    type: 'Post',
    topic: 'Leadership Tips',
    content: "True leadership isn't about being in charge. It's about taking care of those in your charge. Here are 3 ways to support your team better this week...",
    hashtags: ['#Leadership', '#Management', '#Culture'],
    emoji: ['💼', '🤝'],
    status: 'Scheduled',
    scheduledDate: addDays(new Date(), 1),
    createdAt: addDays(new Date(), -1),
  },
];

export const useStore = create<AppState>((set) => ({
  user: MOCK_USER, // Auto-login for mockup
  generatedContent: MOCK_CONTENT,
  isGenerating: false,

  login: (email) => set({ user: { ...MOCK_USER, email } }),
  logout: () => set({ user: null }),

  generateContent: async (params) => {
    set({ isGenerating: true });
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newContent: GeneratedContent = {
      id: Math.random().toString(36).substr(2, 9),
      platform: params.platform,
      type: params.type,
      topic: params.topic,
      content: `[AI Generated ${params.tone} ${params.type} for ${params.platform} about "${params.topic}"]\n\nHere is some engaging content that your audience will love. It is tailored to match your brand voice and drive engagement.`,
      hashtags: ['#AI', '#ContentCreator', `#${params.platform}`, '#Trending'],
      emoji: ['✨', '🤖', '📱'],
      status: 'Draft',
      createdAt: new Date(),
    };

    set((state) => ({
      generatedContent: [newContent, ...state.generatedContent],
      isGenerating: false,
    }));
  },

  generateImageCaption: async (file) => {
    set({ isGenerating: true });
    await new Promise((resolve) => setTimeout(resolve, 2500));
    
    const newContent: GeneratedContent = {
      id: Math.random().toString(36).substr(2, 9),
      platform: 'Instagram',
      type: 'Post',
      topic: 'Image Upload',
      content: "Just captured this amazing moment! 📸 Sometimes you just have to stop and appreciate the view. What's your favorite part of the day?",
      hashtags: ['#PhotoOfTheDay', '#Moments', '#LifeStyle'],
      emoji: ['📸', '❤️', '🌅'],
      imageUrl: URL.createObjectURL(file),
      status: 'Draft',
      createdAt: new Date(),
    };

    set((state) => ({
      generatedContent: [newContent, ...state.generatedContent],
      isGenerating: false,
    }));
  },

  schedulePost: (id, date) => set((state) => ({
    generatedContent: state.generatedContent.map((c) => 
      c.id === id ? { ...c, status: 'Scheduled', scheduledDate: date } : c
    ),
  })),

  deleteContent: (id) => set((state) => ({
    generatedContent: state.generatedContent.filter((c) => c.id !== id),
  })),
}));
