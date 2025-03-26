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
      {courses.map((course) => (
        <Link
          key={course.id}
          href={`/courses/${course.id}`}
          className="bg-white dark:bg-[#444654] rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="relative h-40 w-full">
            <Image
              src={
                course.image && course.image.trim() !== ""
                  ? course.image
                  : "/assets/kurdistan_flag.svg"
              }
              alt={course.title}
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <span className="inline-block text-xs font-bold px-2 py-1 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-full">
                {course.level}
              </span>
              <span className="ml-2 text-xs font-medium text-white">
                {course.language.name}
              </span>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">
              {course.title}
            </h3>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <span className="inline-block">
                {course.author && `Von ${course.author}`}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
