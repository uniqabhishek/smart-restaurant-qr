import React, { useState, useEffect } from 'react';
import { 
  TableId, 
  OrderTicket, 
  TableState, 
  WaiterCall, 
  ReviewSubmission,
  CartItem,
  OrderStatus
} from './types/restaurant';
import { User, UserRole } from './types/auth';
import { getCurrentUser, logoutUser } from './utils/auth';
import { 
  getStoredOrders, 
  saveStoredOrders, 
  getStoredTables, 
  saveStoredTables, 
  getStoredWaiterCalls, 
  saveStoredWaiterCalls,
  getStoredReviews,
  saveStoredReviews,
  resetToDemoData,
  subscribeToSync
} from './utils/storage';
import { sounds } from './utils/audio';
import { HeaderNav } from './components/HeaderNav';
import { GuestView } from './components/guest/GuestView';
import { ChefInterface } from './components/chef/ChefInterface';
import { OwnerInterface } from './components/owner/OwnerInterface';
import { AuthModal } from './components/auth/AuthModal';
import { CustomerHistoryModal } from './components/customer/CustomerHistoryModal';

export const App: React.FC = () => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole>('customer');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialRole, setAuthModalInitialRole] = useState<UserRole>('customer');
  const [isCustomerHistoryOpen, setIsCustomerHistoryOpen] = useState(false);

  // Table selection & responsive phone frame
  const [selectedTable, setSelectedTable] = useState<TableId>(4); // Default Table 4 from reel
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Synced Restaurant Data
  const [orders, setOrders] = useState<OrderTicket[]>([]);
  const [tables, setTables] = useState<TableState[]>([]);
  const [waiterCalls, setWaiterCalls] = useState<WaiterCall[]>([]);
  const [reviews, setReviews] = useState<ReviewSubmission[]>([]);

  // Initial load
  useEffect(() => {
    const loadedUser = getCurrentUser();
    if (loadedUser) {
      setCurrentUser(loadedUser);
      setActiveRole(loadedUser.role);
    }

    setOrders(getStoredOrders());
    setTables(getStoredTables());
    setWaiterCalls(getStoredWaiterCalls());
    setReviews(getStoredReviews());

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tableParam = params.get('table');
      if (tableParam) {
        const parsed = parseInt(tableParam, 10);
        if (parsed >= 1 && parsed <= 8) {
          setSelectedTable(parsed as TableId);
          setActiveRole('customer');
        }
      }
      const roleParam = params.get('role');
      if (roleParam && ['customer', 'chef', 'owner'].includes(roleParam)) {
        setActiveRole(roleParam as UserRole);
      }
    }
  }, []);

  // Multi-tab real-time reactivity
  useEffect(() => {
    const unsubscribe = subscribeToSync((action) => {
      setOrders(getStoredOrders());
      setTables(getStoredTables());
      setWaiterCalls(getStoredWaiterCalls());
      setReviews(getStoredReviews());

      if (action === 'waiter_called' && soundEnabled) {
        sounds.playWaiterAlert();
      } else if (action === 'order_placed' && soundEnabled) {
        sounds.playKitchenBell();
      }
    });

    return () => unsubscribe();
  }, [soundEnabled]);

  // Active order for the selected table in Customer View
  const activeOrderForSelectedTable = orders.find(
    (o) => o.tableId === selectedTable && o.status !== 'served'
  ) || null;

  // Active waiter call for the selected table
  const activeWaiterCallForSelectedTable = waiterCalls.find(
    (c) => c.tableId === selectedTable && c.status === 'pending'
  ) || null;

  // Handler: Customer places new order
  const handlePlaceOrder = (cartItems: CartItem[]) => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.05);
    const totalAmount = subtotal + tax;

    const newOrderNumber = Math.floor(10 + Math.random() * 90);
    const newOrder: OrderTicket = {
      id: `ord-${Date.now()}`,
      orderNumber: newOrderNumber,
      tableId: selectedTable,
      status: 'new',
      items: cartItems.map((c) => ({
        menuItemId: c.menuItemId,
        name: c.name,
        portion: c.portion,
        quantity: c.quantity,
        price: c.price,
        spiceLevel: c.spiceLevel,
        allergens: [],
        specialInstructions: c.specialInstructions,
      })),
      subtotal,
      tax,
      tipAmount: 0,
      totalAmount,
      createdAt: Date.now(),
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    saveStoredOrders(updatedOrders);

    // Update table state
    const updatedTables = tables.map((t) =>
      t.id === selectedTable
        ? { ...t, status: 'order_active' as const, currentOrderId: newOrder.id, guestCount: Math.max(t.guestCount, 2) }
        : t
    );
    setTables(updatedTables);
    saveStoredTables(updatedTables);
  };

  // Handler: Update status in Kitchen Display System
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const updatedOrders = orders.map((o) => {
      if (o.id === orderId) {
        const updated = { ...o, status: newStatus };
        if (newStatus === 'cooking') updated.cookingStartedAt = Date.now();
        if (newStatus === 'ready') updated.readyAt = Date.now();
        if (newStatus === 'served') updated.servedAt = Date.now();
        return updated;
      }
      return o;
    });
    setOrders(updatedOrders);
    saveStoredOrders(updatedOrders);
  };

  // Handler: Customer calls waiter
  const handleCallWaiter = (reason: string) => {
    const newCall: WaiterCall = {
      id: `wc-${Date.now()}`,
      tableId: selectedTable,
      reason,
      createdAt: Date.now(),
      status: 'pending',
    };

    const updatedCalls = [newCall, ...waiterCalls.filter((c) => c.tableId !== selectedTable)];
    setWaiterCalls(updatedCalls);
    saveStoredWaiterCalls(updatedCalls);

    const updatedTables = tables.map((t) =>
      t.id === selectedTable ? { ...t, status: 'waiter_called' as const, waiterCallId: newCall.id } : t
    );
    setTables(updatedTables);
    saveStoredTables(updatedTables);
  };

  // Handler: Staff acknowledges waiter call
  const handleAcknowledgeCall = (callId: string, tableId: TableId) => {
    const updatedCalls = waiterCalls.map((c) =>
      c.id === callId ? { ...c, status: 'acknowledged' as const } : c
    );
    setWaiterCalls(updatedCalls);
    saveStoredWaiterCalls(updatedCalls);

    const updatedTables = tables.map((t) => {
      if (t.id === tableId) {
        const hasActiveOrder = orders.some((o) => o.tableId === tableId && o.status !== 'served');
        return {
          ...t,
          status: hasActiveOrder ? ('order_active' as const) : ('occupied' as const),
          waiterCallId: undefined,
        };
      }
      return t;
    });
    setTables(updatedTables);
    saveStoredTables(updatedTables);
  };

  // Handler: Pay bill & checkout
  const handlePayBill = (paymentDetails: {
    method: 'cash' | 'card' | 'apple_pay' | 'google_pay' | 'bank_transfer';
    splitWays: number;
    tipAmount: number;
    finalTotal: number;
  }) => {
    if (!activeOrderForSelectedTable) return;

    const updatedOrders = orders.map((o) => {
      if (o.id === activeOrderForSelectedTable.id) {
        return {
          ...o,
          isPaid: true,
          paymentMethod: paymentDetails.method,
          paymentSplitWays: paymentDetails.splitWays,
          tipAmount: paymentDetails.tipAmount,
          totalAmount: paymentDetails.finalTotal,
        };
      }
      return o;
    });
    setOrders(updatedOrders);
    saveStoredOrders(updatedOrders);
  };

  // Handler: Review submission
  const handleSubmitReview = (review: ReviewSubmission) => {
    const updatedReviews = [review, ...reviews];
    setReviews(updatedReviews);
    saveStoredReviews(updatedReviews);
  };

  // Handler: Add test order for Kitchen KDS
  const handleAddNewTestOrder = () => {
    const randomTable = (Math.floor(Math.random() * 8) + 1) as TableId;
    const testOrder: OrderTicket = {
      id: `ord-test-${Date.now()}`,
      orderNumber: Math.floor(20 + Math.random() * 70),
      tableId: randomTable,
      status: 'new',
      items: [
        {
          menuItemId: 'dish-1',
          name: 'Desi Chicken Karahi',
          portion: 'Medium',
          quantity: 1,
          price: 2500,
          spiceLevel: 2,
          allergens: ['Dairy'],
          specialInstructions: 'Extra crispy naan, well garnished',
        },
        {
          menuItemId: 'dish-6',
          name: 'Garlic Butter Roghani Naan',
          portion: 'Medium',
          quantity: 2,
          price: 310,
          spiceLevel: 0,
          allergens: ['Gluten', 'Dairy'],
        }
      ],
      subtotal: 3120,
      tax: 156,
      tipAmount: 0,
      totalAmount: 3276,
      createdAt: Date.now(),
    };

    const updated = [testOrder, ...orders];
    setOrders(updated);
    saveStoredOrders(updated);
    sounds.playKitchenBell();
  };

  // Handler: Reset demo data
  const handleResetDemo = () => {
    resetToDemoData();
    setOrders(getStoredOrders());
    setTables(getStoredTables());
    setWaiterCalls(getStoredWaiterCalls());
    setReviews(getStoredReviews());
  };

  // Handler: Clear Table on Floor Map
  const handleClearTable = (tableId: TableId) => {
    const updatedTables = tables.map((t) =>
      t.id === tableId
        ? { ...t, status: 'available' as const, guestCount: 0, currentOrderId: undefined, waiterCallId: undefined }
        : t
    );
    setTables(updatedTables);
    saveStoredTables(updatedTables);
  };

  // Handler: Auth Login / Signup Success
  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setActiveRole(user.role);
  };

  // Handler: User Logout
  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setActiveRole('customer');
  };

  const activeOrdersCount = orders.filter((o) => o.status !== 'served').length;
  const pendingCallsCount = waiterCalls.filter((c) => c.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Controller Header */}
      <HeaderNav
        currentUser={currentUser}
        onOpenAuth={(role) => {
          if (role) setAuthModalInitialRole(role);
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        activeRole={activeRole}
        onSelectRole={setActiveRole}
        selectedTable={selectedTable}
        onSelectTable={setSelectedTable}
        activeOrdersCount={activeOrdersCount}
        pendingCallsCount={pendingCallsCount}
        onResetDemo={handleResetDemo}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        isPhoneFrame={isPhoneFrame}
        onTogglePhoneFrame={() => setIsPhoneFrame(!isPhoneFrame)}
        onOpenCustomerHistory={() => setIsCustomerHistoryOpen(true)}
      />

      {/* Main Dedicated Interfaces by Role */}
      <main className="flex-1">
        {/* 1. CUSTOMER INTERFACE */}
        {activeRole === 'customer' && (
          <GuestView
            tableId={selectedTable}
            activeOrder={activeOrderForSelectedTable}
            onPlaceOrder={handlePlaceOrder}
            onCallWaiter={handleCallWaiter}
            onPayBill={handlePayBill}
            onSubmitReview={handleSubmitReview}
            isPhoneFrame={isPhoneFrame}
            activeWaiterCall={activeWaiterCallForSelectedTable}
          />
        )}

        {/* 2. KITCHEN CHEF INTERFACE */}
        {activeRole === 'chef' && (
          <ChefInterface
            user={currentUser || {
              id: 'chef-guest',
              name: 'Chef Tariq Jamil',
              email: 'chef@resto.com',
              role: 'chef',
              station: 'Head Chef • Karahi & Tandoor Station',
              createdAt: Date.now()
            }}
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onAddNewTestOrder={handleAddNewTestOrder}
            onLogout={handleLogout}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled(!soundEnabled)}
          />
        )}

        {/* 3. OWNER INTERFACE */}
        {activeRole === 'owner' && (
          <OwnerInterface
            user={currentUser || {
              id: 'owner-guest',
              name: 'Shah Fahid (Owner)',
              email: 'owner@resto.com',
              role: 'owner',
              restaurantName: 'The Royal Grand Feast',
              createdAt: Date.now()
            }}
            orders={orders}
            tables={tables}
            waiterCalls={waiterCalls}
            reviews={reviews}
            onAcknowledgeCall={handleAcknowledgeCall}
            onClearTable={handleClearTable}
            onTriggerTestCall={(tId) => {
              setSelectedTable(tId);
              handleCallWaiter('Call Waiter');
              sounds.playWaiterAlert();
            }}
            onOpenTableAsGuest={(tId) => {
              setSelectedTable(tId);
              setActiveRole('customer');
            }}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onAddNewTestOrder={handleAddNewTestOrder}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Auth Modal (Login & Signup) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialRole={authModalInitialRole}
      />

      {/* Customer History & Rewards Modal */}
      <CustomerHistoryModal
        isOpen={isCustomerHistoryOpen}
        onClose={() => setIsCustomerHistoryOpen(false)}
        user={currentUser}
        orders={orders.filter((o) => o.isPaid || o.status === 'served')}
      />
    </div>
  );
};
