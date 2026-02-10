import { useEffect, useState } from "react";
import NewTicketModal from "../components/Home/NewTicketModal";
import StatusCard from "../components/Home/StatusCard";
import ActionCenter from "../components/Home/ActionCenter";
import TicketHistoryFeed from "../components/Home/TicketHistoryFeed";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getTickets } from "../features/employee/employeeSlice";

interface TicketReview {
  reviewRating: number;
  reviewComment: string;
}

export default function Home() {
  const dispatch = useAppDispatch();

  const { tickets, isLoading } = useAppSelector((state) => state.employee);
  const [showModal, setShowModal] = useState(false);
  //const [tickets, setTickets] = useState<any[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const activeTickets = tickets.filter((t) => t.status === "OPEN").length;
  console.log(activeTickets);
  const actionRequiredTickets = tickets.filter(
    (t) => t.status === "FIXED",
  ).length;
  const resolvedTickets = tickets.filter((t) => t.status === "CLOSED").length;
  const fixedTickets = tickets.filter((t) => t.status === "FIXED");

  useEffect(() => {
    dispatch(getTickets());
  }, [dispatch]);

  const handleSubmitTicket = (ticketData: any) => {
    const newTicket = {
      id: Date.now(),
      ...ticketData,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    //setTickets([...tickets, newTicket]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCloseTicket = (ticketId: string, review: TicketReview) => {
    //setTickets(
    //  tickets.map((t) =>
    //    t.id === ticketId
    //      ? {
    //          ...t,
    //          status: "closed",
    //          rating: review.reviewRating,
    //          feedback: review.reviewComment,
    //        }
    //      : t,
    //  ),
    //);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-8">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 z-50 animate-slideIn">
          <svg
            className="w-6 h-6"
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
          <span className="font-semibold">Ticket submitted successfully!</span>
        </div>
      )}

      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            IT Support Dashboard
          </h1>
          <p className="text-gray-600">
            Track your tickets and report technical issues
          </p>
        </div>
        {/* Status Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatusCard
            title="Active"
            count={activeTickets}
            icon={
              <svg
                className="w-8 h-8"
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
            }
            bgColor="bg-gradient-to-br from-blue-500 to-blue-600"
            textColor="text-white"
          />

          <StatusCard
            title="Action Required"
            count={actionRequiredTickets}
            icon={
              <svg
                className="w-8 h-8"
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
            }
            bgColor="bg-gradient-to-br from-amber-500 to-orange-500"
            textColor="text-white"
          />

          <StatusCard
            title="Resolved"
            count={resolvedTickets}
            icon={
              <svg
                className="w-8 h-8"
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
            }
            bgColor="bg-gradient-to-br from-green-500 to-emerald-600"
            textColor="text-white"
          />
        </div>
        {/* Main Action Button */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowModal(true)}
            className="group relative bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-3"
          >
            <svg
              className="w-6 h-6 transition-transform group-hover:rotate-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span className="text-lg">Report an Issue</span>
          </button>
        </div>
        <ActionCenter
          fixedTickets={fixedTickets}
          onCloseTicket={handleCloseTicket}
        />
        <TicketHistoryFeed tickets={tickets} />
      </div>

      {/* Modal */}
      <NewTicketModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitTicket}
      />
    </div>
  );
}
