import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  DollarSign, 
  Smartphone, 
  Building2, 
  Users, 
  Sparkles, 
  CheckCircle2,
  Receipt,
  HeartHandshake
} from 'lucide-react';
import { OrderTicket, TableId } from '../../types/restaurant';
import { sounds } from '../../utils/audio';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderTicket | null;
  tableId: TableId;
  onPaymentSuccess: (paymentDetails: {
    method: 'cash' | 'card' | 'apple_pay' | 'google_pay' | 'bank_transfer';
    splitWays: number;
    tipAmount: number;
    finalTotal: number;
  }) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  order,
  tableId,
  onPaymentSuccess,
}) => {
  if (!isOpen || !order) return null;

  const [splitWays, setSplitWays] = useState<number>(1);
  const [tipPercent, setTipPercent] = useState<number>(10);
  const [customTip, setCustomTip] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'google_pay' | 'bank_transfer' | 'cash'>('apple_pay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paidSuccess, setPaidSuccess] = useState(false);

  const baseTotal = order.subtotal + order.tax;
  const tipAmount = customTip !== '' 
    ? Math.max(0, Number(customTip) || 0)
    : Math.round((baseTotal * tipPercent) / 100);

  const grandTotal = baseTotal + tipAmount;
  const perPersonAmount = Math.ceil(grandTotal / splitWays);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaidSuccess(true);
      sounds.playSuccessChime();

      setTimeout(() => {
        onPaymentSuccess({
          method: paymentMethod,
          splitWays,
          tipAmount,
          finalTotal: grandTotal,
        });
      }, 1200);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[94vh] flex flex-col animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Settle Table Bill & Tip
              </h2>
              <p className="text-xs text-slate-400">
                Order #{order.orderNumber} • Table {tableId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Checkout"
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {paidSuccess ? (
          /* Payment Success Confirmation View */
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border-2 border-emerald-500/40 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">Payment Confirmed!</h3>
              <p className="text-sm text-slate-300 mt-1">
                {paymentMethod === 'cash' 
                  ? 'Waiter has been notified to collect cash at Table ' + tableId
                  : 'Transaction approved. Digital receipt generated.'}
              </p>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400">
              Total Paid: Rs {grandTotal.toLocaleString()} {splitWays > 1 && `(${splitWays} ways • Rs ${perPersonAmount.toLocaleString()} each)`}
            </div>
          </div>
        ) : (
          /* Checkout Interactive Form */
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-200">
            {/* Itemized summary */}
            <div className="bg-slate-950/70 rounded-2xl border border-slate-800 p-3.5 space-y-2 text-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Itemized Summary
              </div>
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-slate-300">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold text-orange-400">{item.quantity}x</span>
                    <span className="truncate">{item.name}</span>
                    <span className="text-[10px] text-slate-400">({item.portion})</span>
                  </div>
                  <span className="font-mono ml-2">Rs {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t border-slate-800 pt-2 flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>Rs {order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GST & Service Charge (5%)</span>
                <span>Rs {order.tax.toLocaleString()}</span>
              </div>
            </div>

            {/* Step 6a: Bill Splitting Utility */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-orange-500" />
                  Split the Bill
                </label>
                <span className="text-xs font-bold text-orange-400">
                  {splitWays === 1 ? 'Whole Bill' : `${splitWays} Ways (Rs ${perPersonAmount.toLocaleString()} / person)`}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((ways) => (
                  <button
                    key={ways}
                    type="button"
                    onClick={() => setSplitWays(ways)}
                    className={`py-2 px-2 rounded-xl border text-xs font-bold transition-all text-center ${
                      splitWays === ways
                        ? 'border-orange-500 bg-orange-500/20 text-orange-300'
                        : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div>{ways === 1 ? 'Whole' : `${ways} Ways`}</div>
                    <div className="text-[10px] font-normal text-slate-400 mt-0.5">
                      {ways === 1 ? '1 Pay' : `Rs ${Math.ceil(grandTotal / ways).toLocaleString()}`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 6a: Tipping Engine */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Add Waiter Tip
                </label>
                <span className="text-xs text-amber-400 font-semibold">
                  +Rs {tipAmount.toLocaleString()}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {[0, 5, 10, 15, 20].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => {
                      setTipPercent(pct);
                      setCustomTip('');
                    }}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      customTip === '' && tipPercent === pct
                        ? 'border-amber-500 bg-amber-500/20 text-amber-300 shadow'
                        : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {pct === 0 ? 'No Tip' : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Multi-Method Payments (Cash, Bank Transfer, Card, Apple Pay, Google Pay) */}
            <div>
              <label className="text-xs font-bold tracking-wider uppercase text-slate-400 block mb-2">
                Select Payment Method
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {/* Apple Pay */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                    paymentMethod === 'apple_pay'
                      ? 'border-orange-500 bg-orange-500/15 text-white'
                      : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs">
                    
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold">Apple Pay</div>
                    <div className="text-[10px] text-slate-400">1-Touch Pay</div>
                  </div>
                </button>

                {/* Google Pay */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('google_pay')}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                    paymentMethod === 'google_pay'
                      ? 'border-orange-500 bg-orange-500/15 text-white'
                      : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-white text-slate-900 flex items-center justify-center font-bold text-xs">
                    G
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold">Google Pay</div>
                    <div className="text-[10px] text-slate-400">Fast & Safe</div>
                  </div>
                </button>

                {/* Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-orange-500 bg-orange-500/15 text-white'
                      : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold">Credit/Debit</div>
                    <div className="text-[10px] text-slate-400">Visa/Master</div>
                  </div>
                </button>

                {/* Bank Transfer */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-orange-500 bg-orange-500/15 text-white'
                      : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold">Bank / UPI</div>
                    <div className="text-[10px] text-slate-400">Direct Wire</div>
                  </div>
                </button>

                {/* Cash */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-orange-500 bg-orange-500/15 text-white'
                      : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold">Pay Cash</div>
                    <div className="text-[10px] text-slate-400">Call Waiter</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Payment Action */}
        {!paidSuccess && (
          <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4">
            <div>
              <div className="text-[11px] text-slate-400">Total Payable:</div>
              <div className="text-xl font-black text-orange-400">
                Rs {grandTotal.toLocaleString()}
              </div>
              {splitWays > 1 && (
                <div className="text-[11px] text-amber-400 font-semibold">
                  Rs {perPersonAmount.toLocaleString()} / person
                </div>
              )}
            </div>

            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="flex-1 py-3.5 px-5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Processing...</span>
              ) : (
                <>
                  <HeartHandshake className="w-4 h-4" />
                  <span>
                    {paymentMethod === 'cash' ? 'Request Cash Collection' : `Pay Rs ${grandTotal.toLocaleString()}`}
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
