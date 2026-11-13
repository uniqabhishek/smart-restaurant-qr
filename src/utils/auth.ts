import { User, UserRole } from '../types/auth';

const STORAGE_KEY_AUTH_USER = 'resto_current_user_v1';
const STORAGE_KEY_ALL_USERS = 'resto_all_users_v1';

export const INITIAL_DEMO_USERS: (User & { passwordHash: string })[] = [
  {
    id: 'user-owner-1',
    name: 'Shah Fahid (Owner)',
    email: 'owner@resto.com',
    passwordHash: 'owner123',
    role: 'owner',
    restaurantName: 'The Royal Grand Feast',
    avatar: '👑',
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'user-chef-1',
    name: 'Chef Tariq Jamil',
    email: 'chef@resto.com',
    passwordHash: 'chef123',
    role: 'chef',
    station: 'Head Chef • Karahi & Tandoor Station',
    avatar: '👨‍🍳',
    createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'user-cust-1',
    name: 'Sarah Khan',
    email: 'customer@resto.com',
    passwordHash: 'cust123',
    role: 'customer',
    loyaltyPoints: 340,
    phone: '+92 300 1234567',
    avatar: '📱',
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
  },
];

export function getAllUsers(): (User & { passwordHash: string })[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ALL_USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(INITIAL_DEMO_USERS));
      return INITIAL_DEMO_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_USERS;
  }
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUTH_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function loginUser(email: string, password: string): { success: boolean; user?: User; error?: string } {
  const users = getAllUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const matched = users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!matched) {
    return { success: false, error: 'No account found with this email address.' };
  }

  if (matched.passwordHash !== password) {
    return { success: false, error: 'Incorrect password. Try demo password (e.g. owner123 / chef123 / cust123).' };
  }

  const { passwordHash: _, ...safeUser } = matched;
  localStorage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(safeUser));
  return { success: true, user: safeUser };
}

export function signupUser(
  name: string,
  email: string,
  password: string,
  role: UserRole,
  stationOrRestaurant?: string
): { success: boolean; user?: User; error?: string } {
  const users = getAllUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (!name.trim() || !email.trim() || !password.trim()) {
    return { success: false, error: 'Please fill in all required fields.' };
  }

  if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    return { success: false, error: 'An account with this email already exists. Please log in.' };
  }

  const avatar = role === 'owner' ? '👑' : role === 'chef' ? '👨‍🍳' : '📱';

  const newUser: User & { passwordHash: string } = {
    id: `user-${role}-${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: password,
    role,
    avatar,
    createdAt: Date.now(),
    loyaltyPoints: role === 'customer' ? 50 : undefined, // 50 bonus points for signing up
    station: role === 'chef' ? (stationOrRestaurant || 'Main Line Cook') : undefined,
    restaurantName: role === 'owner' ? (stationOrRestaurant || 'The Royal Feast') : undefined,
  };

  const updatedUsers = [...users, newUser];
  localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(updatedUsers));

  const { passwordHash: _, ...safeUser } = newUser;
  localStorage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(safeUser));
  return { success: true, user: safeUser };
}

export function logoutUser(): void {
  localStorage.removeItem(STORAGE_KEY_AUTH_USER);
}
