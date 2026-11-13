export type UserRole = 'customer' | 'chef' | 'owner';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: number;
  // Customer-specific fields
  loyaltyPoints?: number;
  phone?: string;
  // Chef-specific fields
  station?: string; // e.g. "Head Chef - Grill & Karahi"
  // Owner-specific fields
  restaurantName?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
