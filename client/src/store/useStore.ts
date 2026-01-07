import { create } from 'zustand';
import { addDays, format } from 'date-fns';
import { getUserData, setUserData as saveUserData, removeUserData } from '@/lib/auth';

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

export interface User {
  name: string;
  email: string;
  avatar: string;
  plan: 'Free' | 'Pro';
}

interface AppState {
  user: User | null;
  generatedContent: GeneratedContent[];
  isGenerating: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  generateContent: (params: { platform: Platform; type: ContentType; tone: Tone; topic: string; language: string }) => Promise<void>;
  generateImageCaption: (file: File) => Promise<void>;
  schedulePost: (id: string, date: Date) => void;
  deleteContent: (id: string) => void;
  loadFromLocalStorage: () => void;
}

// LocalStorage keys
const CONTENT_STORAGE_KEY = 'socialgen_content';

// Load content from localStorage
function loadContentFromStorage(): GeneratedContent[] {
  try {
    const stored = localStorage.getItem(CONTENT_STORAGE_KEY);
    if (stored) {
      const content = JSON.parse(stored);
      // Parse dates back to Date objects
      return content.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        scheduledDate: item.scheduledDate ? new Date(item.scheduledDate) : undefined,
      }));
    }
  } catch (error) {
    console.error('Error loading content from localStorage:', error);
  }
  
  // Return mock data if nothing in storage
  return [
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
}

// Save content to localStorage
function saveContentToStorage(content: GeneratedContent[]) {
  try {
    localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
  } catch (error) {
    console.error('Error saving content to localStorage:', error);
  }
}

export const useStore = create<AppState>((set, get) => ({
  user: getUserData(),
  generatedContent: loadContentFromStorage(),
  isGenerating: false,

  setUser: (user) => {
    if (user) {
      saveUserData(user);
    } else {
      removeUserData();
    }
    set({ user });
  },

  logout: () => {
    removeUserData();
    set({ user: null });
  },

  generateContent: async (params) => {
    set({ isGenerating: true });
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newContent: GeneratedContent = {
      id: Math.random().toString(36).substr(2, 9),
      platform: params.platform,
      type: params.type,
      topic: params.topic,
      content: `[AI Generated ${params.tone} ${params.type} for ${params.platform} about "${params.topic}"]\n\nHere is some engaging content that your audience will love. It is tailored to match your brand voice and drive engagement. 🚀\n\nThis content is optimized for maximum reach and engagement on ${params.platform}. Feel free to customize it to match your unique style!`,
      hashtags: ['#AI', '#ContentCreator', `#${params.platform}`, '#Trending', '#SocialMedia'],
      emoji: ['✨', '🤖', '📱', '🎯'],
      status: 'Draft',
      createdAt: new Date(),
    };

    const updatedContent = [newContent, ...get().generatedContent];
    saveContentToStorage(updatedContent);
    
    set({
      generatedContent: updatedContent,
      isGenerating: false,
    });
  },

  generateImageCaption: async (file) => {
    set({ isGenerating: true });
    await new Promise((resolve) => setTimeout(resolve, 2500));
    
    const newContent: GeneratedContent = {
      id: Math.random().toString(36).substr(2, 9),
      platform: 'Instagram',
      type: 'Post',
      topic: 'Image Upload',
      content: "Just captured this amazing moment! 📸 Sometimes you just have to stop and appreciate the view. What's your favorite part of the day? Drop a comment below! 👇",
      hashtags: ['#PhotoOfTheDay', '#Moments', '#LifeStyle', '#Photography'],
      emoji: ['📸', '❤️', '🌅', '✨'],
      imageUrl: URL.createObjectURL(file),
      status: 'Draft',
      createdAt: new Date(),
    };

    const updatedContent = [newContent, ...get().generatedContent];
    saveContentToStorage(updatedContent);

    set({
      generatedContent: updatedContent,
      isGenerating: false,
    });
  },

  schedulePost: (id, date) => {
    const updatedContent = get().generatedContent.map((c) => 
      c.id === id ? { ...c, status: 'Scheduled' as const, scheduledDate: date } : c
    );
    saveContentToStorage(updatedContent);
    set({ generatedContent: updatedContent });
  },

  deleteContent: (id) => {
    const updatedContent = get().generatedContent.filter((c) => c.id !== id);
    saveContentToStorage(updatedContent);
    set({ generatedContent: updatedContent });
  },

  loadFromLocalStorage: () => {
    const user = getUserData();
    const content = loadContentFromStorage();
    set({ user, generatedContent: content });
  },
}));
