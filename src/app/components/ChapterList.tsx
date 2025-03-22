// src/components/ChapterList.tsx
"use client";

import { Chapter } from "../types/model";
import Link from "next/link";

interface ChapterListProps {
  chapters: Chapter[];
  courseId: string;
}

export default function ChapterList({ chapters, courseId }: ChapterListProps) {
  return (
    <div className="space-y-4">
      {chapters.map((chapter) => (
        <Link
          key={chapter.id}
          href={`/courses/${courseId}/chapters/${chapter.id}`}
          className="block bg-white rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-50"
        >
          <h3 className="text-lg font-bold mb-2">{chapter.title}</h3>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {chapter.completedLessons} / {chapter.totalLessons} lessons
              completed
            </div>
            <div className="relative w-32 h-2 bg-gray-200 rounded-full">
              <div
                className="absolute left-0 top-0 h-full bg-green-500 rounded-full"
                style={{
                  width: `${Math.round(
                    (chapter.completedLessons / chapter.totalLessons) * 100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
