import React from "react";

interface WorkloadMetric {
  label: string;
  count: number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  accentColor: string;
  subtitle?: string;
}

interface TechnicianOverviewProps {
  activeAssignments: number;
  newInField: number;
  weeklyResolutions: number;
  technicianField: "hardware" | "software";
  technicianName?: string;
}

const MetricCard: React.FC<WorkloadMetric> = ({
  label,
  count,
  icon,
  bgColor,
  textColor,
  accentColor,
  subtitle,
}) => {
  return (
    <div
      className={`${bgColor} rounded-xl p-5 shadow-lg border-l-4 ${accentColor} transition-transform hover:scale-102`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className={`text-sm font-medium ${textColor} opacity-80 mb-1`}>
            {label}
          </div>
          <div className={`text-4xl font-bold ${textColor} mb-1`}>{count}</div>
          {subtitle && (
            <div className={`text-xs ${textColor} opacity-70`}>{subtitle}</div>
          )}
        </div>
        <div className={`${textColor} opacity-70`}>{icon}</div>
      </div>
    </div>
  );
};

const TechnicianOverview: React.FC<TechnicianOverviewProps> = ({
  activeAssignments,
  newInField,
  weeklyResolutions,
  technicianField,
  technicianName,
}) => {
  // Field-based theme colors
  const fieldTheme = {
    hardware: {
      primary: "from-orange-500 to-amber-600",
      accent: "border-orange-500",
      text: "text-orange-600",
      bg: "bg-orange-50",
    },
    software: {
      primary: "from-cyan-500 to-teal-600",
      accent: "border-cyan-500",
      text: "text-cyan-600",
      bg: "bg-cyan-50",
    },
  };

  const theme = fieldTheme[technicianField];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {getGreeting()}
            {technicianName ? `, ${technicianName}` : ""}
          </h1>
          <p className="text-gray-600 mt-1">
            <span className="capitalize">{technicianField}</span> Technician
            Dashboard
          </p>
        </div>

        {/* Field Badge */}
        <div
          className={`px-4 py-2 ${theme.bg} ${theme.text} rounded-full font-semibold text-sm flex items-center gap-2`}
        >
          {technicianField === "hardware" ? (
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
          ) : (
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
          )}
          {technicianField.toUpperCase()} TEAM
        </div>
      </div>

      {/* Workload Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Assignments */}
        <MetricCard
          label="Active Assignments"
          count={activeAssignments}
          subtitle="Currently in progress"
          bgColor="bg-white"
          textColor="text-blue-600"
          accentColor="border-blue-500"
          icon={
            <svg
              className="w-10 h-10"
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
        />

        {/* New in Field */}
        <MetricCard
          label={`New ${technicianField === "hardware" ? "Hardware" : "Software"} Tickets`}
          count={newInField}
          subtitle="Waiting to be claimed"
          bgColor="bg-white"
          textColor={theme.text}
          accentColor={theme.accent}
          icon={
            <svg
              className="w-10 h-10"
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
          }
        />

        {/* Resolution Rate */}
        <MetricCard
          label="This Week's Resolutions"
          count={weeklyResolutions}
          subtitle="Keep up the great work!"
          bgColor="bg-white"
          textColor="text-green-600"
          accentColor="border-green-500"
          icon={
            <svg
              className="w-10 h-10"
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
        />
      </div>

      {/* Quick Stats Bar */}
      <div
        className={`bg-gradient-to-r ${theme.primary} rounded-xl p-4 shadow-lg`}
      >
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
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
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <div>
              <div className="text-sm opacity-90">Today's Progress</div>
              <div className="font-semibold">
                {activeAssignments} active • {weeklyResolutions} completed this
                week
              </div>
            </div>
          </div>

          {weeklyResolutions > 0 && (
            <div className="text-right">
              <div className="text-2xl font-bold">
                {Math.round(
                  (weeklyResolutions /
                    (weeklyResolutions + activeAssignments + newInField)) *
                    100,
                )}
                %
              </div>
              <div className="text-xs opacity-90">Completion Rate</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicianOverview;
