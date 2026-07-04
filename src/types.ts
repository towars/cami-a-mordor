export interface Milestone {
  id: string;
  name: string;
  distance: number; // in km
  description: string;
  bookText: string;
  audioNarrative: string;
  coordinates: { x: number; y: number }; // Percentage coordinate (0-100) relative to map size
  image?: string; // Optional image URL for each milestone
  audio?: string; // Optional custom audio track/effect URL for each milestone
  isMinor?: boolean; // Optional property to define smaller secondary points of interest
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  kmsAdded: number;
  steps: number;
  calories: number;
  note: string;
}

export interface JourneyState {
  totalKms: number;
  currentMilestoneId: string;
  unlockedMilestones: string[];
  logs: ActivityLog[];
  username?: string;
  avatarId?: string;
  customAvatarUrl?: string;
  startDate?: string;
}
