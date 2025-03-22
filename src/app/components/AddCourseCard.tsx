"use client";

import React from "react";

interface AddCourseCardProps {
  openModel: () => void;
}

export default function AddCourseCard({ openModel }: AddCourseCardProps) {
  return (
    <div className="mb-6">
      <div
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center h-48 cursor-pointer hover:border-blue-500 dark:hover:border-blue-400"
        onClick={openModel}
      >
        <span className="text-6xl text-gray-500 dark:text-gray-400">+</span>
      </div>
    </div>
  );
}
