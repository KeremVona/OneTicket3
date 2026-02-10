import React, { useState } from "react";

interface Ticket {
  id: number;
  title: string;
  description: string;
  category: "hardware" | "software";
  status: string;
  makerName: string;
  madeAt: string;
  closedAt?: string;
  assigneeId: string;
  internalNotes?: string;
  rating?: number;
  feedback?: string;
}

interface PastSolutionsProps {
  tickets: Ticket[];
  technicianId: string;
  technicianField: "hardware" | "software";
}

const StarDisplay: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${
            star <= rating
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
      ))}
    </div>
  );
};

const PastSolutions: React.FC<PastSolutionsProps> = ({
  tickets,
  technicianId,
  technicianField,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    "all" | "hardware" | "software"
  >("all");
  const [expandedTicketId, setExpandedTicketId] = useState<number | null>(null);

  // Field-based theme colors
  const fieldTheme = {
    hardware: {
      primary: "from-orange-500 to-amber-600",
      light: "bg-orange-50",
      text: "text-orange-600",
      border: "border-orange-200",
    },
    software: {
      primary: "from-cyan-500 to-teal-600",
      light: "bg-cyan-50",
      text: "text-cyan-600",
      border: "border-cyan-200",
    },
  };

  const theme = fieldTheme[technicianField];

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get time to resolve
  const getTimeToResolve = (madeAt: string, closedAt?: string): string => {
    if (!closedAt) return "N/A";

    const created = new Date(madeAt);
    const closed = new Date(closedAt);
    const hours = Math.floor(
      (closed.getTime() - created.getTime()) / (1000 * 60 * 60),
    );

    if (hours < 1) return "Less than 1 hour";
    if (hours === 1) return "1 hour";
    if (hours < 24) return `${hours} hours`;

    const days = Math.floor(hours / 24);
    return `${days} ${days === 1 ? "day" : "days"}`;
  };

  // Toggle expand
  const toggleExpand = (ticketId: number) => {
    setExpandedTicketId(expandedTicketId === ticketId ? null : ticketId);
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    if (category === "hardware") {
      return (
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
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      );
    }
    return (
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
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    );
  };

  // Filter tickets
  const pastTickets = tickets
    .filter(
      (ticket) =>
        (ticket.status === "fixed" || ticket.status === "closed") &&
        ticket.assigneeId === technicianId,
    )
    .filter((ticket) => {
      const matchesSearch =
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || ticket.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Sort by closed date (most recent first)
      const dateA = a.closedAt ? new Date(a.closedAt).getTime() : 0;
      const dateB = b.closedAt ? new Date(b.closedAt).getTime() : 0;
      return dateB - dateA;
    });

  // Calculate stats
  const totalResolved = pastTickets.length;
  const avgRating =
    pastTickets.filter((t) => t.rating).length > 0
      ? pastTickets.reduce((sum, t) => sum + (t.rating || 0), 0) /
        pastTickets.filter((t) => t.rating).length
      : 0;
  const fiveStarCount = pastTickets.filter((t) => t.rating === 5).length;

  // Empty state
  if (totalResolved === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center justify-center w-10 h-10 ${theme.light} rounded-full`}
          >
            <svg
              className={`w-6 h-6 ${theme.text}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Past Solutions</h2>
            <p className="text-gray-600 text-sm">
              Your knowledge base and performance history
            </p>
          </div>
        </div>

        <div
          className={`${theme.light} rounded-xl p-12 text-center border-2 border-dashed ${theme.border}`}
        >
          <div className="flex justify-center mb-4">
            <div
              className={`w-20 h-20 ${theme.light} rounded-full flex items-center justify-center`}
            >
              <svg
                className={`w-10 h-10 ${theme.text}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No past solutions yet
          </h3>
          <p className="text-gray-600">
            Your completed tickets and performance reviews will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Section Header with Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center justify-center w-10 h-10 ${theme.light} rounded-full`}
          >
            <svg
              className={`w-6 h-6 ${theme.text}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Past Solutions</h2>
            <p className="text-gray-600 text-sm">
              {totalResolved} tickets resolved
            </p>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="flex items-center gap-4">
          {avgRating > 0 && (
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {avgRating.toFixed(1)}
              </div>
              <div className="flex items-center gap-1">
                <StarDisplay rating={Math.round(avgRating)} />
              </div>
            </div>
          )}
          {fiveStarCount > 0 && (
            <div className="text-center px-4 border-l border-gray-300">
              <div className="text-2xl font-bold text-yellow-600">
                {fiveStarCount}
              </div>
              <div className="text-xs text-gray-600">5-Star Reviews</div>
            </div>
          )}
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search past solutions..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow placeholder-gray-400"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                categoryFilter === "all"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setCategoryFilter("hardware")}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                categoryFilter === "hardware"
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
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
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Hardware
            </button>
            <button
              onClick={() => setCategoryFilter("software")}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                categoryFilter === "software"
                  ? "bg-cyan-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
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
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              Software
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {pastTickets.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-lg">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-500">
            No solutions found matching your search
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {pastTickets.map((ticket) => {
              const isExpanded = expandedTicketId === ticket.id;

              return (
                <div
                  key={ticket.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Collapsed View */}
                  <div
                    onClick={() => toggleExpand(ticket.id)}
                    className="p-5 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Badges */}
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                            {getCategoryIcon(ticket.category)}
                            {ticket.category}
                          </span>

                          {ticket.rating && (
                            <div className="flex items-center gap-1">
                              <StarDisplay rating={ticket.rating} />
                            </div>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-bold text-gray-800 mb-1">
                          {ticket.title}
                        </h3>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1.5">
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
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span>
                              Resolved{" "}
                              {formatDate(ticket.closedAt || ticket.madeAt)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
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
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>
                              {getTimeToResolve(ticket.madeAt, ticket.closedAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <svg
                          className={`w-6 h-6 text-gray-400 transition-transform ${
                            isExpanded ? "transform rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Expanded View */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 bg-gray-50 p-6 space-y-4">
                      {/* Problem Description */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Problem
                        </label>
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <p className="text-gray-800 text-sm">
                            {ticket.description}
                          </p>
                        </div>
                      </div>

                      {/* Solution Notes */}
                      {ticket.internalNotes && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Solution / What I Did
                          </label>
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-gray-800 text-sm whitespace-pre-wrap">
                              {ticket.internalNotes}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Customer Feedback */}
                      {(ticket.rating || ticket.feedback) && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Customer Feedback
                          </label>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                            {ticket.rating && (
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <StarDisplay rating={ticket.rating} />
                                  <span className="text-sm font-semibold text-gray-700">
                                    {ticket.rating}/5 Stars
                                  </span>
                                </div>
                              </div>
                            )}
                            {ticket.feedback && (
                              <div>
                                <p className="text-gray-800 text-sm italic">
                                  "{ticket.feedback}"
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  — {ticket.makerName}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PastSolutions;
