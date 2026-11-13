import { TableState, OrderTicket, WaiterCall, ReviewSubmission } from '../types/restaurant';

const STORAGE_KEYS = {
  ORDERS: 'resto_orders_v1',
  TABLES: 'resto_tables_v1',
  WAITER_CALLS: 'resto_waiter_calls_v1',
  REVIEWS: 'resto_reviews_v1',
};

export const INITIAL_TABLES: TableState[] = [
  { id: 1, label: 'T1', capacity: 2, shape: 'square', x: 18, y: 22, status: 'occupied', guestCount: 2, seatedTime: Date.now() - 25 * 60 * 1000 },
  { id: 2, label: 'T2', capacity: 4, shape: 'booth', x: 42, y: 22, status: 'available', guestCount: 0 },
  { id: 3, label: 'T3', capacity: 4, shape: 'square', x: 68, y: 22, status: 'order_active', guestCount: 3, currentOrderId: 'ord-102', seatedTime: Date.now() - 40 * 60 * 1000 },
  { id: 4, label: 'T4', capacity: 4, shape: 'booth', x: 18, y: 56, status: 'waiter_called', guestCount: 4, currentOrderId: 'ord-104', waiterCallId: 'wc-1', seatedTime: Date.now() - 32 * 60 * 1000 },
  { id: 5, label: 'T5', capacity: 6, shape: 'round', x: 42, y: 56, status: 'order_active', guestCount: 5, currentOrderId: 'ord-105', seatedTime: Date.now() - 15 * 60 * 1000 },
  { id: 6, label: 'T6', capacity: 4, shape: 'square', x: 68, y: 56, status: 'available', guestCount: 0 },
  { id: 7, label: 'T7', capacity: 4, shape: 'booth', x: 18, y: 84, status: 'occupied', guestCount: 2, seatedTime: Date.now() - 10 * 60 * 1000 },
  { id: 8, label: 'T8', capacity: 8, shape: 'round', x: 55, y: 84, status: 'available', guestCount: 0 },
];

export const INITIAL_ORDERS: OrderTicket[] = [
  {
    id: 'ord-104',
    orderNumber: 12,
    tableId: 4,
    status: 'cooking',
    items: [
      {
        menuItemId: 'dish-1',
        name: 'Desi Chicken Karahi',
        portion: 'Small',
        quantity: 1,
        price: 1850,
        spiceLevel: 2,
        allergens: ['Dairy'],
        specialInstructions: 'Medium spicy, extra ginger',
      },
      {
        menuItemId: 'dish-6',
        name: 'Garlic Butter Roghani Naan',
        portion: 'Medium',
        quantity: 2,
        price: 310,
        spiceLevel: 0,
        allergens: ['Gluten', 'Dairy'],
      },
      {
        menuItemId: 'dish-7',
        name: 'Fresh Mint Zeera Raita & Salad',
        portion: 'Small',
        quantity: 1,
        price: 150,
        spiceLevel: 0,
        allergens: ['Dairy'],
      }
    ],
    subtotal: 2470,
    tax: 123,
    tipAmount: 0,
    totalAmount: 2593,
    createdAt: Date.now() - 9 * 60 * 1000,
    cookingStartedAt: Date.now() - 8 * 60 * 1000,
  },
  {
    id: 'ord-102',
    orderNumber: 11,
    tableId: 3,
    status: 'ready',
    items: [
      {
        menuItemId: 'dish-3',
        name: 'Royal Dum Mutton Biryani',
        portion: 'Medium',
        quantity: 1,
        price: 1600,
        spiceLevel: 3,
        allergens: ['Dairy', 'Nuts'],
      },
      {
        menuItemId: 'dish-10',
        name: 'Fresh Alphonso Mango Lassi',
        portion: 'Small',
        quantity: 2,
        price: 360,
        spiceLevel: 0,
        allergens: ['Dairy'],
      }
    ],
    subtotal: 2320,
    tax: 116,
    tipAmount: 200,
    totalAmount: 2636,
    createdAt: Date.now() - 22 * 60 * 1000,
    cookingStartedAt: Date.now() - 20 * 60 * 1000,
    readyAt: Date.now() - 2 * 60 * 1000,
  },
  {
    id: 'ord-105',
    orderNumber: 14,
    tableId: 5,
    status: 'new',
    items: [
      {
        menuItemId: 'dish-2',
        name: 'Shinwari Mutton Karahi',
        portion: 'Small',
        quantity: 1,
        price: 2650,
        spiceLevel: 1,
        allergens: [],
        specialInstructions: 'Well done mutton',
      },
      {
        menuItemId: 'dish-4',
        name: 'Tandoori Reshmi Seekh Kabab',
        portion: 'Small',
        quantity: 1,
        price: 980,
        spiceLevel: 2,
        allergens: ['Dairy'],
      },
      {
        menuItemId: 'dish-6',
        name: 'Garlic Butter Roghani Naan',
        portion: 'Large',
        quantity: 1,
        price: 480,
        spiceLevel: 0,
        allergens: ['Gluten', 'Dairy'],
      }
    ],
    subtotal: 4110,
    tax: 205,
    tipAmount: 0,
    totalAmount: 4315,
    createdAt: Date.now() - 3 * 60 * 1000,
  }
];

export const INITIAL_WAITER_CALLS: WaiterCall[] = [
  {
    id: 'wc-1',
    tableId: 4,
    reason: 'Call Waiter',
    createdAt: Date.now() - 2 * 60 * 1000,
    status: 'pending',
  }
];

// Broadcast channel for multi-tab synchronization
let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  broadcastChannel = new BroadcastChannel('resto_channel');
}

export function notifySync(action: string, payload?: unknown) {
  if (broadcastChannel) {
    broadcastChannel.postMessage({ action, payload, timestamp: Date.now() });
  }
}

export function subscribeToSync(callback: (action: string, payload: unknown) => void) {
  if (!broadcastChannel) return () => {};
  const handler = (event: MessageEvent) => {
    callback(event.data?.action, event.data?.payload);
  };
  broadcastChannel.addEventListener('message', handler);
  return () => {
    broadcastChannel?.removeEventListener('message', handler);
  };
}

export function getStoredOrders(): OrderTicket[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return raw ? JSON.parse(raw) : INITIAL_ORDERS;
  } catch {
    return INITIAL_ORDERS;
  }
}

export function saveStoredOrders(orders: OrderTicket[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    notifySync('orders_updated', orders);
  } catch {
    // Ignore storage quota
  }
}

export function getStoredTables(): TableState[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TABLES);
    return raw ? JSON.parse(raw) : INITIAL_TABLES;
  } catch {
    return INITIAL_TABLES;
  }
}

export function saveStoredTables(tables: TableState[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
    notifySync('tables_updated', tables);
  } catch {
    // Ignore
  }
}

export function getStoredWaiterCalls(): WaiterCall[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WAITER_CALLS);
    return raw ? JSON.parse(raw) : INITIAL_WAITER_CALLS;
  } catch {
    return INITIAL_WAITER_CALLS;
  }
}

export function saveStoredWaiterCalls(calls: WaiterCall[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.WAITER_CALLS, JSON.stringify(calls));
    notifySync('waiter_calls_updated', calls);
  } catch {
    // Ignore
  }
}

export function getStoredReviews(): ReviewSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredReviews(reviews: ReviewSubmission[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    notifySync('reviews_updated', reviews);
  } catch {
    // Ignore
  }
}

export function resetToDemoData() {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(INITIAL_TABLES));
  localStorage.setItem(STORAGE_KEYS.WAITER_CALLS, JSON.stringify(INITIAL_WAITER_CALLS));
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify([]));
  notifySync('reset_demo');
}
