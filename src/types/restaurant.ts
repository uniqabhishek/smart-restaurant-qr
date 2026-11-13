export type TableId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type DishCategory = 
  | 'all'
  | 'karahi_mains'
  | 'bbq_tandoor'
  | 'biryani_rice'
  | 'breads_sides'
  | 'desserts'
  | 'drinks';

export interface PortionOption {
  name: 'Small' | 'Medium' | 'Large';
  priceOffset: number; // additional cost over base price
  serves: string;
}

export interface MenuItem {
  id: string;
  name: string;
  urduName?: string;
  category: DishCategory;
  price: number;
  description: string;
  image: string;
  allergens: string[]; // e.g. ["Dairy", "Gluten", "Nuts"]
  spiceLevel: number; // 0 to 4
  portions: PortionOption[];
  isSpecial?: boolean;
  isPopular?: boolean;
  isVeg?: boolean;
}

export interface CartItem {
  id: string; // unique item cart uuid
  menuItemId: string;
  name: string;
  price: number;
  portion: 'Small' | 'Medium' | 'Large';
  quantity: number;
  spiceLevel: number;
  specialInstructions: string;
  image: string;
}

export type OrderStatus = 'new' | 'cooking' | 'ready' | 'served';

export interface OrderItem {
  menuItemId: string;
  name: string;
  portion: 'Small' | 'Medium' | 'Large';
  quantity: number;
  price: number;
  spiceLevel: number;
  allergens: string[];
  specialInstructions?: string;
}

export interface OrderTicket {
  id: string;
  orderNumber: number;
  tableId: TableId;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  tipAmount: number;
  totalAmount: number;
  createdAt: number; // timestamp
  cookingStartedAt?: number;
  readyAt?: number;
  servedAt?: number;
  paymentMethod?: 'cash' | 'card' | 'apple_pay' | 'google_pay' | 'bank_transfer';
  paymentSplitWays?: number;
  isPaid?: boolean;
}

export interface WaiterCall {
  id: string;
  tableId: TableId;
  reason: string; // e.g. "Call Waiter", "Water Refill", "Bill Request", "Clean Table"
  createdAt: number;
  status: 'pending' | 'acknowledged';
}

export interface TableState {
  id: TableId;
  label: string;
  capacity: number;
  shape: 'round' | 'square' | 'booth';
  x: number; // percent in floor map
  y: number; // percent in floor map
  status: 'available' | 'occupied' | 'order_active' | 'waiter_called';
  guestCount: number;
  currentOrderId?: string;
  waiterCallId?: string;
  seatedTime?: number;
}

export interface ReviewSubmission {
  id: string;
  tableId: TableId;
  orderId?: string;
  rating: number; // 1-5
  tags: string[];
  comment: string;
  createdAt: number;
}
