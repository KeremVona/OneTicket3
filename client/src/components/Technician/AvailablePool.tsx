import React, { useState } from "react";

interface Ticket {
  id: number;
  title: string;
  description: string;
  category: "hardware" | "software";
  priority: "low" | "medium" | "high";
  status: string;
  makerName: string;
  madeAt: string;
  assigneeId?: number | null;
}

interface AvailablePoolProps {
  tickets: Ticket[];
  technicianField: "hardware" | "software";
  onClaimTicket: (ticketId: number) => void;
  isLoading?: boolean;
}

const AvailablePool: React.FC<AvailablePoolProps> = ({
  tickets,
  technicianField,
  onClaimTicket,
  isLoading = false,
}) => {
  const [claimingId, setClaimingId] = useState<number | null>(null);

  // Field-based theme colors
  const fieldTheme = {
    hardware: {
      primary: "from-orange-500 to-amber-600",
      light: "bg-orange-50",
      text: "text-orange-600",
      button:
        "from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700",
      border: "border-orange-200",
    },
    software: {
      primary: "from-cyan-500 to-teal-600",
      light: "bg-cyan-50",
      text: "text-cyan-600",
      button: "from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700",
      border: "border-cyan-200",
    },
  };

  const theme = fieldTheme[technicianField];

  // Calculate time elapsed
  const getTimeElapsed = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) {
      const mins = Math.floor(seconds / 60);
      return `${mins} ${mins === 1 ? "min" : "mins"} ago`;
    }
    if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    }
    const days = Math.floor(seconds / 86400);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  };

  // Check if ticket is old (more than 2 hours)
  const isOldTicket = (dateString: string): boolean => {
    const date = new Date(dateString);
    const now = new Date();
    const hours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    return hours > 2;
  };

  // Handle claim action
  const handleClaim = async (ticketId: number) => {
    setClaimingId(ticketId);
    await onClaimTicket(ticketId);
    setClaimingId(null);
  };

  // Filter tickets by field and status
  const availableTickets = tickets
    .filter(
      (ticket) =>
        ticket.status === "open" &&
        ticket.assigneeId === null &&
        ticket.category === technicianField,
    )
    .sort((a, b) => {
      // Sort by creation time (oldest first) to prioritize waiting tickets
      return new Date(a.madeAt).getTime() - new Date(b.madeAt).getTime();
    });

  // Empty state
  if (availableTickets.length === 0) {
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
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Available Pool</h2>
            <p className="text-gray-600 text-sm">
              {technicianField === "hardware" ? "Hardware" : "Software"} tickets
              waiting to be claimed
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            All caught up!
          </h3>
          <p className="text-gray-600">
            The {technicianField} queue is currently empty. Great work!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Section Header */}
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
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Available Pool</h2>
            <p className="text-gray-600 text-sm">
              {availableTickets.length} {technicianField}{" "}
              {availableTickets.length === 1 ? "ticket" : "tickets"} waiting
            </p>
          </div>
        </div>

        {/* Urgency Indicator */}
        {availableTickets.some((t) => isOldTicket(t.madeAt)) && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-sm font-medium">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            Urgent tickets waiting
          </div>
        )}
      </div>

      {/* Ticket List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {availableTickets.map((ticket) => {
            const timeElapsed = getTimeElapsed(ticket.madeAt);
            const isOld = isOldTicket(ticket.madeAt);
            const isClaiming = claimingId === ticket.id;

            return (
              <div
                key={ticket.id}
                className={`p-5 transition-colors ${
                  isOld ? "bg-red-50 hover:bg-red-100" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Ticket Info */}
                  <div className="flex-1 min-w-0">
                    {/* Badges Row */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {isOld && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Waiting {timeElapsed}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      {ticket.title}
                    </h3>

                    {/* Description Preview */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-1">
                      {ticket.description}
                    </p>

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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span>
                          <strong className="text-gray-700">
                            {ticket.makerName}
                          </strong>
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
                        <span>Posted {timeElapsed}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Claim Button */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleClaim(ticket.id)}
                      disabled={isClaiming || isLoading}
                      className={`bg-gradient-to-r ${theme.button} text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap`}
                    >
                      {isClaiming ? (
                        <>
                          <svg
                            className="animate-spin w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Claiming...
                        </>
                      ) : (
                        <>
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
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                          Accept Ticket
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AvailablePool;
