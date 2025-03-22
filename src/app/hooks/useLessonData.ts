// hooks/useLessonData.ts
import { useState, useEffect } from "react";
import {
  LessonModel,
  CourseModel,
  Chapter,
  LessonType,
  DifficultyLevel,
  LanguageLearningOverviewModel,
} from "../types/model";
import lessonService from "../services/LessonService";

/**
 * Custom hook to handle lesson data loading and management
 */
export const useLessonData = (lessonId: string, courseModel: CourseModel) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [internalLessonId, setInternalLessonId] = useState<string>(() => {
    if (lessonId) return lessonId;

    // Try to extract the lesson ID from the URL
    if (typeof window !== "undefined") {
      const pathParts = window.location.pathname.split("/");
      const lessonIndex = pathParts.indexOf("lessons");
      if (lessonIndex !== -1 && pathParts.length > lessonIndex + 1) {
        return pathParts[lessonIndex + 1];
      }
    }
    return "";
  });

  const [lessonData, setLessonData] = useState<LessonModel | null>(null);
  const [courseData, setCourseData] = useState<CourseModel | null>(null);
  const [foundChapter, setFoundChapter] = useState<Chapter | null>(null);
  const [learningOverviewModel, setLearningOverviewModel] =
    useState<LanguageLearningOverviewModel | null>(null);

  // Load data on first render
  useEffect(() => {
    const fetchData = async () => {
      // Check if the URL has changed but props haven't been updated yet
      let effectiveId = lessonId || internalLessonId;

      // If we're in a client environment, extract the ID again from the URL
      if (typeof window !== "undefined") {
        const pathParts = window.location.pathname.split("/");
        const lessonIndex = pathParts.indexOf("lessons");
        if (lessonIndex !== -1 && pathParts.length > lessonIndex + 1) {
          const urlLessonId = pathParts[lessonIndex + 1];
          // If the ID from the URL is different from the one we know, set it
          if (urlLessonId && urlLessonId !== effectiveId) {
            effectiveId = urlLessonId;
            // Also update the internal ID
            setInternalLessonId(urlLessonId);
          }
        }
      }

      if (!effectiveId) {
        console.error("No Lesson ID available to load data");
        setIsLoading(false);
        return;
      }

      // Check if we've already loaded the data and the ID has remained the same
      if (lessonData && lessonData.id === effectiveId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setLoadError(null);

      try {
        // Try to load the lesson from Firestore
        const loadedLesson = await lessonService.getLessonById(effectiveId);

        setLessonData(loadedLesson);

        // Set the Learning Steps, if available
        if (
          loadedLesson.learningOverview &&
          loadedLesson.learningOverview.learningSteps
        ) {
          // We'll return these steps to be set in the parent component
        }

        // Set the Learning Overview Model
        setLearningOverviewModel(loadedLesson.learningOverview);

        // Find the lesson and chapter in the course object
        if (courseModel) {
          setCourseData(courseModel);

          let foundChapterTemp: Chapter | null = null;

          // Search for the chapter that contains the lesson
          if (courseModel.chapters) {
            for (const chapter of courseModel.chapters) {
              if (chapter.lessons) {
                const lesson = chapter.lessons.find(
                  (l) => l.id === effectiveId
                );
                if (lesson) {
                  foundChapterTemp = chapter;
                  break;
                }
              }
            }
          }

          setFoundChapter(foundChapterTemp);
        }

        return loadedLesson;
      } catch (error) {
        console.log("Error loading lesson:", error);

        // If the lesson wasn't found, create a new one with the ID
        if (error.message && error.message.includes("not found")) {
          const newLesson: LessonModel = {
            id: effectiveId,
            type: LessonType.Exercise,
            title: "Neue Lektion",
            description: "",
            isCompleted: false,
            imageName: "default.png",
            duration: "10 min",
            category: "General",
            difficulty: DifficultyLevel.Beginner,
            tags: [],
            prerequisites: [],
            availableOffline: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            learningOverview: {
              lessonId: effectiveId,
              learningSteps: [],
              title: "Neue Lektion",
            },
          };

          setLessonData(newLesson);
          setLearningOverviewModel(newLesson.learningOverview);
          setCourseData(courseModel || { id: "", title: "", chapters: [] });

          return newLesson;
        } else {
          // Another error occurred
          setLoadError(
            "Error loading lesson: " +
              (error instanceof Error ? error.message : String(error))
          );
          return null;
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [lessonId, internalLessonId, courseModel]);

  // Also: Add an additional useEffect that responds to URL changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleUrlChange = () => {
      const pathParts = window.location.pathname.split("/");
      const lessonIndex = pathParts.indexOf("lessons");
      if (lessonIndex !== -1 && pathParts.length > lessonIndex + 1) {
        const urlLessonId = pathParts[lessonIndex + 1];
        if (urlLessonId && urlLessonId !== internalLessonId) {
          setInternalLessonId(urlLessonId);
        }
      }
    };

    // Initial check on mount
    handleUrlChange();
  }, []);

  return {
    isLoading,
    loadError,
    lessonData,
    setLessonData,
    courseData,
    setCourseData,
    foundChapter,
    learningOverviewModel,
    setLearningOverviewModel,
    internalLessonId,
    currentChapterId: foundChapter?.id,
  };
};
