// File: app/components/StepTypeCard.tsx
"use client";
import React from "react";
import { StepType } from "../types/lessonTypes";

interface StepTypeCardProps {
  type: StepType;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: (type: StepType) => void;
}

const StepTypeCard: React.FC<StepTypeCardProps> = ({
  type,
  title,
  description,
  icon,
  color,
  onClick,
}) => {
  return (
    <div
      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition"
      onClick={() => onClick(type)}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-md ${color}`}>{icon}</div>
        <div>
          <h3 className="font-medium text-lg">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StepTypeCard;
