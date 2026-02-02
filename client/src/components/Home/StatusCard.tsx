import React from "react";

interface StatusCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  count,
  icon,
  bgColor,
  textColor,
}) => {
  return (
    <div
      className={`${bgColor} ${textColor} rounded-xl p-6 shadow-lg transition-transform hover:scale-105 cursor-default`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium opacity-90">{title}</div>
        <div className="text-2xl opacity-80">{icon}</div>
      </div>
      <div className="text-4xl font-bold">{count}</div>
    </div>
  );
};

export default StatusCard;
