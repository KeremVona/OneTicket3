import React, { useState } from "react";

interface Ticket {
  id: number;
  title: string;
  description: string;
  category: "hardware" | "software";
  priority: "low" | "medium" | "high";
  status: string;
  makerName: string;
  makerEmail?: string;
  makerPhone?: string;
  madeAt: string;
  assigneeId: number;
  internalNotes?: string;
}

interface ActiveTasksProps {
  tickets: Ticket[];
  technicianField: "hardware" | "software";
  onMarkAsFixed: (ticketId: number, internalNotes: string) => void;
  isLoading?: boolean;
}

const ActiveTasks: React.FC<ActiveTasksProps> = ({
  tickets,
  technicianField,
  onMarkAsFixed,
  isLoading = false,
}) => {
  const [expandedTicketId, setExpandedTicketId] = useState<number | null>(null);
  const [internalNotes, setInternalNotes] = useState<{ [key: number]: string }>(
    {},
  );
  const [markingAsFixed, setMarkingAsFixed] = useState<number | null>(null);

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

  // Calculate time working on ticket
  const getTimeWorking = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Started just now";
    if (seconds < 3600) {
      const mins = Math.floor(seconds / 60);
      return `Working for ${mins} ${mins === 1 ? "min" : "mins"}`;
    }
    if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      return `Working for ${hours} ${hours === 1 ? "hour" : "hours"}`;
    }
    const days = Math.floor(seconds / 86400);
    return `Working for ${days} ${days === 1 ? "day" : "days"}`;
  };

  // Handle expand/collapse
  const toggleExpand = (ticketId: number) => {
    setExpandedTicketId(expandedTicketId === ticketId ? null : ticketId);
  };

  // Handle mark as fixed
  const handleMarkAsFixed = async (ticketId: number) => {
    setMarkingAsFixed(ticketId);
    const notes = internalNotes[ticketId] || "";
    await onMarkAsFixed(ticketId, notes);
    setMarkingAsFixed(null);
    setExpandedTicketId(null);
    setInternalNotes((prev) => {
      const updated = { ...prev };
      delete updated[ticketId];
      return updated;
    });
  };

  // Update internal notes
  const updateNotes = (ticketId: number, notes: string) => {
    setInternalNotes((prev) => ({ ...prev, [ticketId]: notes }));
  };

  const activeTickets = tickets.filter(
    (ticket) => ticket.status === "in_progress",
  );

  // Empty state
  if (activeTickets.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              My Active Tasks
            </h2>
            <p className="text-gray-600 text-sm">Your current work queue</p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-12 text-center border-2 border-dashed border-blue-200">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-blue-600"
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
            No active tasks
          </h3>
          <p className="text-gray-600">
            Check the Available Pool to claim a ticket and start working!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Active Tasks</h2>
          <p className="text-gray-600 text-sm">
            {activeTickets.length}{" "}
            {activeTickets.length === 1 ? "ticket" : "tickets"} in progress
          </p>
        </div>
      </div>

      {/* Active Tasks List */}
      <div className="space-y-4">
        {activeTickets.map((ticket) => {
          const isExpanded = expandedTicketId === ticket.id;
          const isMarking = markingAsFixed === ticket.id;
          const currentNotes =
            internalNotes[ticket.id] || ticket.internalNotes || "";

          return (
            <div
              key={ticket.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-blue-200 transition-all"
            >
              {/* Collapsed View - Header */}
              <div
                onClick={() => toggleExpand(ticket.id)}
                className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        In Progress
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      {ticket.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-1">
                      {ticket.description}
                    </p>

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
                        <span>{getTimeWorking(ticket.madeAt)}</span>
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

              {/* Expanded View - Details */}
              {isExpanded && (
                <div className="border-t border-gray-200 bg-gray-50">
                  <div className="p-6 space-y-6">
                    {/* Full Description */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Problem Description
                      </label>
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-wrap">
                          {ticket.description}
                        </p>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Contact Information
                      </label>
                      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <svg
                            className="w-4 h-4 text-gray-500"
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
                          <span className="font-semibold text-gray-700">
                            Name:
                          </span>
                          <span className="text-gray-600">
                            {ticket.makerName}
                          </span>
                        </div>
                        {ticket.makerEmail && (
                          <div className="flex items-center gap-2 text-sm">
                            <svg
                              className="w-4 h-4 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            <span className="font-semibold text-gray-700">
                              Email:
                            </span>
                            <a
                              href={`mailto:${ticket.makerEmail}`}
                              className="text-blue-600 hover:underline"
                            >
                              {ticket.makerEmail}
                            </a>
                          </div>
                        )}
                        {ticket.makerPhone && (
                          <div className="flex items-center gap-2 text-sm">
                            <svg
                              className="w-4 h-4 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            <span className="font-semibold text-gray-700">
                              Phone:
                            </span>
                            <a
                              href={`tel:${ticket.makerPhone}`}
                              className="text-blue-600 hover:underline"
                            >
                              {ticket.makerPhone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Internal Notes */}
                    <div>
                      <label
                        htmlFor={`notes-${ticket.id}`}
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Internal Notes (Optional)
                      </label>
                      <textarea
                        id={`notes-${ticket.id}`}
                        value={currentNotes}
                        onChange={(e) => updateNotes(ticket.id, e.target.value)}
                        placeholder="e.g., Replaced CMOS battery, reinstalled drivers, tested functionality..."
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow placeholder-gray-400 resize-none text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        These notes are for internal use and will be visible to
                        admins and other technicians
                      </p>
                    </div>

                    {/* Mark as Fixed Button */}
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => toggleExpand(ticket.id)}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Collapse
                      </button>
                      <button
                        onClick={() => handleMarkAsFixed(ticket.id)}
                        disabled={isMarking || isLoading}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isMarking ? (
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
                            Marking as Fixed...
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
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Mark as Fixed
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveTasks;
