import React, { useState } from 'react';
import { X, Star, Heart, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TableId, ReviewSubmission } from '../../types/restaurant';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableId: TableId;
  orderId?: string;
  onSubmitReview: (review: ReviewSubmission) => void;
}

const REVIEW_TAGS = [
  '⚡ Fast Service',
  '🔥 Flavor Packed',
  '👨‍🍳 Great Cooking',
  '🧼 Super Clean',
  '💖 Friendly Staff',
  '✨ Nice Ambiance',
  '📱 Easy QR Order'
];

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  tableId,
  orderId,
  onSubmitReview,
}) => {
  if (!isOpen) return null;

  const [rating, setRating] = useState<number>(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['⚡ Fast Service', '🔥 Flavor Packed']);
  const [comment, setComment] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    // Fire festive confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f97316', '#f59e0b', '#10b981', '#3b82f6'],
      });
    } catch {
      // ignore
    }

    const review: ReviewSubmission = {
      id: `rev-${Date.now()}`,
      tableId,
      orderId,
      rating,
      tags: selectedTags,
      comment: comment.trim(),
      createdAt: Date.now(),
    };

    onSubmitReview(review);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 relative animate-in zoom-in-95 duration-300 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close Review"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-6 space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border-2 border-emerald-500/40 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-white">Thank You So Much!</h3>
            <p className="text-sm text-slate-300">
              Your valuable feedback helps our kitchen and service team keep improving!
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Sparkles className="w-3.5 h-3.5" /> 1-Tap Guest Review
              </span>
              <h3 className="text-xl font-black text-white mt-2">
                How was your dining experience?
              </h3>
              <p className="text-xs text-slate-400">
                Table {tableId} • Rate your food & hospitality
              </p>
            </div>

            {/* Star Rating */}
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-9 h-9 transition-colors ${
                      star <= rating
                        ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]'
                        : 'text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Quick compliments tags */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block text-left">
                What did you love most?
              </label>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {REVIEW_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-orange-500/20 text-orange-300 border-orange-500/40 shadow-sm'
                          : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional note */}
            <div>
              <textarea
                rows={2}
                placeholder="Share any special compliments for chef or waiter..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 resize-none transition-colors"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 font-extrabold text-sm text-white shadow-xl shadow-orange-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Submit 1-Tap Review</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
