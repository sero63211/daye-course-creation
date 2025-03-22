"use client";

import { CourseModel } from "../types/model";
import Image from "next/image";
import Link from "next/link";

interface CourseListProps {
  courses: CourseModel[];
}

export default function CourseList({ courses }: CourseListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => {
        const completedLessons = course.chapters.reduce(
          (total, chapter) => total + chapter.completedLessons,
          0
        );
        const totalLessons = course.chapters.reduce(
          (total, chapter) => total + chapter.totalLessons,
          0
        );
        const progress =
          totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

        return (
          <Link
            key={course.id}
            href={`/courses/${course.id}`}
            className="bg-white dark:bg-[#444654] rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="relative h-32 w-full">
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center mb-2">
                <span className="text-xs font-bold px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-100 rounded-full">
                  {course.level}
                </span>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  {course.language.name}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-gray-100">
                {course.title}
              </h3>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {completedLessons} / {totalLessons} Lektionen
                </div>
                <div className="relative w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div
                    className="absolute left-0 top-0 h-full bg-green-500 rounded-full"
                    style={{ width: `${Math.round(progress)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
