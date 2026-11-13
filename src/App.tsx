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
import { HeaderNav, AppViewMode } from './components/HeaderNav';
import { GuestView } from './components/guest/GuestView';
import { KitchenDisplay } from './components/kds/KitchenDisplay';
import { FloorMap } from './components/floor/FloorMap';
import { ManagerDashboard } from './components/manager/ManagerDashboard';
import { QRCodeStation } from './components/qr/QRCodeStation';

export const App: React.FC = () => {
  // Navigation & View Mode
  const [currentView, setCurrentView] = useState<AppViewMode>('guest');
  const [selectedTable, setSelectedTable] = useState<TableId>(4); // Default to Table 4 as shown in reel
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Synced Restaurant Data
  const [orders, setOrders] = useState<OrderTicket[]>([]);
  const [tables, setTables] = useState<TableState[]>([]);
  const [waiterCalls, setWaiterCalls] = useState<WaiterCall[]>([]);
  const [reviews, setReviews] = useState<ReviewSubmission[]>([]);

  // Initial load & URL query param parsing
  useEffect(() => {
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
          setCurrentView('guest');
        }
      }
      const viewParam = params.get('view');
      if (viewParam && ['guest', 'kitchen', 'floor', 'manager', 'qr_station'].includes(viewParam)) {
        setCurrentView(viewParam as AppViewMode);
      }
    }
  }, []);

  // Multi-tab real-time reactivity
  useEffect(() => {
    const unsubscribe = subscribeToSync((action, _payload) => {
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

  // Active order for the selected table in Guest View
  const activeOrderForSelectedTable = orders.find(
    (o) => o.tableId === selectedTable && o.status !== 'served'
  ) || null;

  // Active waiter call for the selected table
  const activeWaiterCallForSelectedTable = waiterCalls.find(
    (c) => c.tableId === selectedTable && c.status === 'pending'
  ) || null;

  // Handler: Place new order from Guest View
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

  // Handler: Guest calls waiter
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

  // Handler: Staff acknowledges waiter call on Floor Map
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

  // Handler: Add test order for Kitchen KDS demo
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
          specialInstructions: 'Extra crispy naan',
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

  const activeOrdersCount = orders.filter((o) => o.status !== 'served').length;
  const pendingCallsCount = waiterCalls.filter((c) => c.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Controller Header */}
      <HeaderNav
        currentView={currentView}
        onSelectView={setCurrentView}
        selectedTable={selectedTable}
        onSelectTable={setSelectedTable}
        activeOrdersCount={activeOrdersCount}
        pendingCallsCount={pendingCallsCount}
        onResetDemo={handleResetDemo}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        isPhoneFrame={isPhoneFrame}
        onTogglePhoneFrame={() => setIsPhoneFrame(!isPhoneFrame)}
      />

      {/* Main Body Viewport */}
      <main className="flex-1">
        {currentView === 'guest' && (
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

        {currentView === 'kitchen' && (
          <KitchenDisplay
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onAddNewTestOrder={handleAddNewTestOrder}
          />
        )}

        {currentView === 'floor' && (
          <FloorMap
            tables={tables}
            waiterCalls={waiterCalls}
            orders={orders}
            onAcknowledgeCall={handleAcknowledgeCall}
            onSelectTableForGuestView={(tId) => {
              setSelectedTable(tId);
              setCurrentView('guest');
            }}
            onTriggerTestCall={(tId) => {
              setSelectedTable(tId);
              handleCallWaiter('Call Waiter');
              sounds.playWaiterAlert();
            }}
            onClearTable={handleClearTable}
          />
        )}

        {currentView === 'manager' && (
          <ManagerDashboard
            orders={orders}
            tables={tables}
            reviews={reviews}
          />
        )}

        {currentView === 'qr_station' && (
          <QRCodeStation
            onOpenTable={(tId) => {
              setSelectedTable(tId);
              setCurrentView('guest');
            }}
          />
        )}
      </main>
    </div>
  );
};
