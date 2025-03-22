// src/components/LessonList.tsx
"use client";

import { LessonModel, LessonType } from "../types/model";
import Link from "next/link";

interface LessonListProps {
  lessons: LessonModel[];
  courseId: string;
  chapterId: string;
}

export default function LessonList({
  lessons,
  courseId,
  chapterId,
}: LessonListProps) {
  const getIconForLessonType = (type: LessonType) => {
    switch (type) {
      case LessonType.Exercise:
        return "📝";
      case LessonType.Quiz:
        return "🔄";
      default:
        return "📖";
    }
  };

  return (
    <div className="space-y-4">
      {lessons.map((lesson) => (
        <Link
          key={lesson.id}
          href={`/courses/${courseId}/chapters/${chapterId}/lessons/${lesson.id}`}
          className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="flex p-4">
            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full">
              {getIconForLessonType(lesson.type)}
            </div>
            <div className="ml-4 flex-grow">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">{lesson.title}</h3>
                <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                  {lesson.duration}
                </span>
              </div>
              {lesson.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {lesson.description}
                </p>
              )}
              <div className="flex items-center mt-2">
                <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                  {lesson.category}
                </span>
                {lesson.isCompleted && (
                  <span className="ml-2 text-xs font-medium px-2 py-1 bg-green-50 text-green-700 rounded-full">
                    Completed
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
