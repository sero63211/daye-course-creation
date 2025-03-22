import { CourseModel } from "../types/model";
import { Course } from "../model/Course";
import { LessonModel } from "../types/model";
import { Lesson } from "../model/Lesson";

export function fillMissingCourseAttributes(
  courseData: Partial<CourseModel>
): CourseModel {
  const defaults = Course.empty();
  return {
    id: courseData.id ?? defaults.id,
    author: courseData.author ?? defaults.author,
    image: courseData.image ?? defaults.image,
    level: courseData.level ?? defaults.level,
    title: courseData.title ?? defaults.title,
    language: courseData.language ?? defaults.language,
    chapters: courseData.chapters ?? defaults.chapters,
    description: courseData.description ?? defaults.description,
    lastCompletedDate:
      courseData.lastCompletedDate ?? defaults.lastCompletedDate,
  };
}

export function fillMissingLessonAttributes(
  lessonData: Partial<LessonModel>
): LessonModel {
  const defaults = Lesson.empty();
  return {
    id: lessonData.id ?? defaults.id,
    type: lessonData.type ?? defaults.type,
    title: lessonData.title ?? defaults.title,
    description: lessonData.description ?? defaults.description,
    isCompleted: lessonData.isCompleted ?? defaults.isCompleted,
    imageName: lessonData.imageName ?? defaults.imageName,
    duration: lessonData.duration ?? defaults.duration,
    category: lessonData.category ?? defaults.category,
  };
}
