import React, { useState } from "react";

interface Ticket {
  id: number;
  title: string;
  description: string;
  category: "hardware" | "software";
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "fixed" | "closed";
  technician?: string;
  technicianType?: "hardware" | "software";
  madeAt: string;
  updatedAt?: string;
}

interface TicketHistoryFeedProps {
  tickets: Ticket[];
  onTicketClick?: (ticket: Ticket) => void;
}

type StatusType = "open" | "in_progress" | "fixed" | "closed";

const TicketHistoryFeed: React.FC<TicketHistoryFeedProps> = ({
  tickets,
  onTicketClick,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Format timestamp
  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  // Status badge configuration
  const getStatusConfig = (status: StatusType) => {
    const configs = {
      open: {
        label: "Open",
        bgColor: "bg-gray-100",
        textColor: "text-gray-700",
        dotColor: "bg-gray-500",
      },
      in_progress: {
        label: "In Progress",
        bgColor: "bg-blue-100",
        textColor: "text-blue-700",
        dotColor: "bg-blue-500",
      },
      fixed: {
        label: "Fixed",
        bgColor: "bg-green-100",
        textColor: "text-green-700",
        dotColor: "bg-green-500",
      },
      closed: {
        label: "Closed",
        bgColor: "bg-gray-100",
        textColor: "text-gray-600",
        dotColor: "bg-gray-400",
      },
    };
    return configs[status] || configs.open;
  };

  // Filter and search tickets
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = ticket.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  // Empty state
  if (tickets.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 text-center shadow-lg">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-gray-400"
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
          Everything looks functional!
        </h3>
        <p className="text-gray-600">
          If you have a technical issue, use the "Report an Issue" button above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-full">
          <svg
            className="w-6 h-6 text-indigo-600"
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
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Ticket History</h2>
          <p className="text-gray-600 text-sm">
            {tickets.length} total tickets
          </p>
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
              placeholder="Search by ticket title..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow placeholder-gray-400"
            />
          </div>

          {/* Filter */}
          <div className="relative md:w-64">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow appearance-none bg-white cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="fixed">Fixed</option>
              <option value="closed">Closed</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
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
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {filteredTickets.length === 0 ? (
          <div className="p-12 text-center">
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
              No tickets found matching your search
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTickets.map((ticket) => {
              const statusConfig = getStatusConfig(ticket.status);

              return (
                <div
                  key={ticket.id}
                  onClick={() => onTicketClick?.(ticket)}
                  className="p-5 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: Main Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        {/* Status Badge */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 ${statusConfig.bgColor} ${statusConfig.textColor} rounded-full text-xs font-semibold`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${statusConfig.dotColor}`}
                          ></span>
                          {ticket.status === "closed" && (
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          {statusConfig.label}
                        </span>

                        {/* Category Badge */}
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                          {getCategoryIcon(ticket.category)}
                          {ticket.category}
                        </span>

                        {/* Priority Badge (if high) */}
                        {ticket.priority === "high" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            High Priority
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-semibold text-gray-800 mb-1 truncate">
                        {ticket.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {ticket.description}
                      </p>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        {ticket.technician && (
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
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            <span>
                              Assigned to:{" "}
                              <strong className="text-gray-700">
                                {ticket.technician}
                              </strong>
                              {ticket.technicianType && (
                                <span className="text-gray-400">
                                  {" "}
                                  ({ticket.technicianType})
                                </span>
                              )}
                            </span>
                          </div>
                        )}
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
                          <span>Created {getTimeAgo(ticket.madeAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Arrow */}
                    <div className="flex-shrink-0 pt-2">
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
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketHistoryFeed;
