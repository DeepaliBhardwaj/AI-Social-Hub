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
  
  // Return empty array - no dummy data!
  return [];
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

    // Generate smart, context-aware content
    const toneTemplates = {
      Professional: `${params.topic}\n\nKey insights and professional analysis that demonstrates expertise and value. Perfect for ${params.platform} audience.`,
      Casual: `Hey there! 👋 Let's talk about ${params.topic}.\n\nHere's what you need to know in a friendly, conversational way.`,
      Funny: `😂 ${params.topic}? Hold my coffee! ☕\n\nHere's the fun take you didn't know you needed.`,
      Motivational: `🌟 ${params.topic} 💪\n\nYour journey starts here. Let's make it happen together!`
    };

    // Platform-specific hashtag generation
    const platformHashtags: Record<Platform, string[]> = {
      Instagram: ['#InstaGood', '#PhotoOfTheDay', '#ViralContent', '#ContentCreator'],
      LinkedIn: ['#LinkedIn', '#Professional', '#CareerGrowth', '#Leadership'],
      Twitter: ['#Twitter', '#Trending', '#Tech', '#Social'],
      Facebook: ['#Facebook', '#Community', '#Engagement', '#Social'],
      YouTube: ['#YouTube', '#Video', '#Content', '#Creator']
    };

    const topicWords = params.topic.split(' ').slice(0, 3);
    const customHashtags = topicWords.map(word => `#${word.replace(/[^a-zA-Z0-9]/g, '')}`);

    const newContent: GeneratedContent = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      platform: params.platform,
      type: params.type,
      topic: params.topic,
      content: toneTemplates[params.tone],
      hashtags: [...new Set([...customHashtags, ...platformHashtags[params.platform]])].slice(0, 8),
      emoji: ['✨', '🚀', '💡', '🎯', '📈'].slice(0, 3),
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
    
    // Validate file
    if (!file.type.startsWith('image/')) {
      set({ isGenerating: false });
      throw new Error('Please upload a valid image file');
    }

    const fileSize = file.size / 1024 / 1024; // Convert to MB
    if (fileSize > 10) {
      set({ isGenerating: false });
      throw new Error('Image size should be less than 10MB');
    }

    // Smart caption based on image name or generic
    const fileName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
    const topic = fileName.length > 3 ? fileName : 'Visual Content';

    const newContent: GeneratedContent = {
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      platform: 'Instagram',
      type: 'Post',
      topic: `Image: ${topic}`,
      content: `Capturing moments that matter! 📸\n\n${topic.charAt(0).toUpperCase() + topic.slice(1)} - telling stories through visuals.\n\nWhat do you think? Drop a comment! 👇`,
      hashtags: ['#Photography', '#VisualContent', '#PhotoOfTheDay', '#Creative', '#InstaGood'],
      emoji: ['📸', '✨', '🎨', '💫'],
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
