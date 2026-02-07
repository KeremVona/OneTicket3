import React, { useState } from "react";

interface Ticket {
  id: string;
  title: string;
  description: string;
  field: "HARDWARE" | "SOFTWARE";
  status: string;
  technician?: string;
  madeAt: string;
  fixedAt?: string;
}

interface ReviewData {
  reviewRating: number;
  reviewComment: string;
}

interface ActionCenterProps {
  fixedTickets: Ticket[];
  onCloseTicket: (ticketId: string, review: ReviewData) => void;
}

const StarRating: React.FC<{
  rating: number;
  onRatingChange: (rating: number) => void;
}> = ({ rating, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className="transition-transform hover:scale-110 focus:outline-none"
        >
          <svg
            className={`w-8 h-8 transition-colors ${
              star <= (hoverRating || rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 fill-gray-300"
            }`}
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </button>
      ))}
    </div>
  );
};

const ReviewCard: React.FC<{
  ticket: Ticket;
  onClose: (ticketId: string, review: ReviewData) => void;
}> = ({ ticket, onClose }) => {
  const [reviewRating, setRating] = useState(0);
  const [reviewComment, setComment] = useState("");

  const handleSubmit = () => {
    if (reviewRating > 0) {
      onClose(ticket.id, { reviewRating, reviewComment });
    }
  };

  const getCategoryIcon = () => {
    if (ticket.field === "HARDWARE") {
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      );
    }
    return (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    );
  };

  return (
    <div className="bg-white border-2 border-orange-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      {/* Alert Banner */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-400 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg
            className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <h3 className="font-semibold text-orange-900 mb-1">
              Action Required
            </h3>
            <p className="text-sm text-orange-800">
              The technician marked this as fixed. Is it working now?
            </p>
          </div>
        </div>
      </div>

      {/* Ticket Info */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                {getCategoryIcon()}
                {ticket.field}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              {ticket.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
          </div>
        </div>

        {ticket.technician && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>
              Fixed by: <strong>{ticket.technician}</strong>
            </span>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-6 space-y-5">
        {/* Rating */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            How would you rate this fix? *
          </label>
          <StarRating rating={reviewRating} onRatingChange={setRating} />
          {reviewRating > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              {reviewRating === 5 && "⭐ Excellent!"}
              {reviewRating === 4 && "👍 Very good!"}
              {reviewRating === 3 && "😊 Good"}
              {reviewRating === 2 && "😐 Could be better"}
              {reviewRating === 1 && "😞 Needs improvement"}
            </p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label
            htmlFor={`comment-${ticket.id}`}
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Additional feedback (Optional)
          </label>
          <textarea
            id={`comment-${ticket.id}`}
            value={reviewComment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="e.g., Thank you! Everything is working perfectly now."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow placeholder-gray-400 resize-none text-sm"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleSubmit}
          disabled={reviewRating === 0}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-6 py-3.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:hover:shadow-lg flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Confirm & Close Ticket
        </button>
        {reviewRating === 0 && (
          <p className="text-xs text-center text-gray-500 -mt-2">
            Please provide a rating before closing the ticket
          </p>
        )}
      </div>
    </div>
  );
};

const ActionCenter: React.FC<ActionCenterProps> = ({
  fixedTickets,
  onCloseTicket,
}) => {
  if (fixedTickets.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full">
          <svg
            className="w-6 h-6 text-orange-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Action Required</h2>
          <p className="text-gray-600 text-sm">
            {fixedTickets.length}{" "}
            {fixedTickets.length === 1 ? "ticket needs" : "tickets need"} your
            review
          </p>
        </div>
      </div>

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {fixedTickets.map((ticket) => (
          <ReviewCard key={ticket.id} ticket={ticket} onClose={onCloseTicket} />
        ))}
      </div>
    </div>
  );
};

export default ActionCenter;
