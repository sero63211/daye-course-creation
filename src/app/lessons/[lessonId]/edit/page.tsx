"use client";
import React, { useState, useRef, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { v4 as uuid } from "uuid";
import {
  StepType,
  LearningStep,
  LanguageLearningOverviewModel,
  LessonModel,
  LessonType,
  DifficultyLevel,
  CourseModel,
  Chapter,
  LearningContentItem,
} from "../../../types/model";
import StepDialog from "../../../components/StepDialog";
import lessonService from "../../../services/LessonService";
import { CourseService } from "../../../services/CourseService";
import { Save } from "lucide-react"; // Import the Save icon

// Import component files
import ContentInputSection from "../../../components/ContentInputSection";
import ExerciseTypeSection from "../../../components/ExerciseTypeSection";
import ContentDisplaySection from "../../../components/ContentDisplaySection";
import PreviewSection from "../../../components/PreviewSection";
import ExerciseSection from "../../../components/ExerciseSection";
import LessonDetailsSection from "../../../components/LessonDetailsSection";
import SaveButton from "../../../components/SaveButton";

// Exercise Types Data
import { availableStepTypes } from "../../../data/exerciseTypeData";

// Types
import { EnhancedContentItem } from "../../../types/ContentTypes";

export interface ContentManagerViewProps {
  initialItems?: EnhancedContentItem[];
  onStepsGenerated?: (steps: LearningStep[]) => void;
  lessonId: string;
  courseModel?: CourseModel | null;
  chapterId?: string;
  onLessonSaved?: (lesson: LessonModel, course: CourseModel) => void;
}

const ContentManagerView: React.FC<ContentManagerViewProps> = ({
  initialItems = [],
  onStepsGenerated,
  lessonId,
  courseModel,
  chapterId,
  onLessonSaved,
}) => {
  // Router and URL parameters
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const urlCourseId = searchParams.get("courseId");
  const urlLessonId = (params.lessonId as string) || lessonId;

  // Log initial props for debugging
  useEffect(() => {
    console.log("ContentManagerView initialized with:", {
      urlLessonId,
      lessonIdProp: lessonId,
      urlCourseId,
      hasCourseModel: !!courseModel,
    });
  }, [urlLessonId, lessonId, urlCourseId, courseModel]);

  // Lesson and course state
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [internalLessonId, setInternalLessonId] = useState<string>(
    urlLessonId || lessonId
  );
  const [lessonData, setLessonData] = useState<LessonModel | null>(null);
  const [courseData, setCourseData] = useState<CourseModel | null>(
    courseModel || null
  );
  const [isFetchingCourse, setIsFetchingCourse] = useState(false);
  const [foundChapter, setFoundChapter] = useState<Chapter | null>(null);
  const currentChapterId = chapterId || foundChapter?.id;
  const [courseLoadError, setCourseLoadError] = useState<string | null>(null);
  // Language state with better defaults
  const [languageName, setLanguageName] = useState<string>(() => {
    if (courseModel?.language?.name) {
      console.log(
        `Initial language from courseModel: ${courseModel.language.name}`
      );
      return courseModel.language.name;
    }
    console.log("No initial language found, using default");
    return "Unbekannt";
  });

  // Content items state
  const [contentItems, setContentItems] = useState<EnhancedContentItem[]>(
    initialItems.map((item) => ({
      ...item,
      uniqueId: item.uniqueId || uuid(),
    }))
  );

  // Learning steps state
  const [selectedSteps, setSelectedSteps] = useState<LearningStep[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [learningOverviewModel, setLearningOverviewModel] =
    useState<LanguageLearningOverviewModel | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [needsCourseData, setNeedsCourseData] = useState(false);

  // State to track changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [lastSavedContentItems, setLastSavedContentItems] = useState<
    EnhancedContentItem[]
  >([]);

  // Media handling
  const [audioPlaying, setAudioPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Step dialog state
  const [activeStepType, setActiveStepType] = useState<StepType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [editingStepData, setEditingStepData] = useState<any>(null);

  // Preview state
  const [previewStep, setPreviewStep] = useState<LearningStep | null>(null);

  const [selectedContentIds, setSelectedContentIds] = useState<string[]>([]);
  const [contentSelectorStatus, setContentSelectorStatus] = useState({
    isProcessing: false,
    message: "",
  });

  // 1. Effect to update from courseModel when it changes
  useEffect(() => {
    if (courseModel) {
      setCourseData(courseModel);

      if (courseModel.language?.name) {
        setLanguageName(courseModel.language.name);
      }
    }
  }, [courseModel]);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (urlCourseId) {
        try {
          setIsFetchingCourse(true);

          setCourseLoadError(null);

          console.log(`Fetching course data for ID: ${urlCourseId}`);

          const courseService = new CourseService();

          const fetchedCourse = await courseService.getCourseById(urlCourseId);

          if (fetchedCourse) {
            console.log("Successfully fetched course:", fetchedCourse);

            setCourseData(fetchedCourse);

            if (fetchedCourse.language?.name) {
              setLanguageName(fetchedCourse.language.name);
            }
          } else {
            console.error(`Course not found with ID: ${urlCourseId}`);

            setCourseLoadError(
              `Kurs mit ID ${urlCourseId} wurde nicht gefunden.`
            );
          }
        } catch (error) {
          console.error("Error fetching course:", error);

          const errorMessage =
            error instanceof Error ? error.message : String(error);

          setCourseLoadError(`Fehler beim Laden des Kurses: ${errorMessage}`);
        } finally {
          setIsFetchingCourse(false);
        }
      }
    };

    fetchCourseData();
  }, [urlCourseId]);

  // 4. Log language changes for debugging
  useEffect(() => {
    console.log(`Current language name: ${languageName}`);
  }, [languageName]);

  useEffect(() => {
    // Check if we have a course with a valid language
    if (
      courseData?.language?.name &&
      courseData.language.name !== "Unbekannt"
    ) {
      console.log(
        `Setting language from courseData: ${courseData.language.name}`
      );
      setLanguageName(courseData.language.name);
    }
  }, [courseData]);

  // 5. Lesson data loading effect
  useEffect(() => {
    const fetchData = async () => {
      if (!internalLessonId) {
        console.error("No Lesson ID available to load data");
        setIsLoading(false);
        setLoadError(
          "Keine Lektion-ID verfügbar. Bitte zurück zur Kursübersicht."
        );
        return;
      }

      if (lessonData && lessonData.id === internalLessonId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setLoadError(null);

      try {
        console.log(`Fetching lesson data for ID: ${internalLessonId}`);
        const loadedLesson = await lessonService.getLessonById(
          internalLessonId
        );
        console.log("Successfully loaded lesson:", loadedLesson);

        setLessonData(loadedLesson);

        if (
          loadedLesson.learningOverview &&
          loadedLesson.learningOverview.learningSteps
        ) {
          setSelectedSteps(loadedLesson.learningOverview.learningSteps);
        }

        setLearningOverviewModel(loadedLesson.learningOverview);

        // Initialize contentItems from learnedContent if it exists
        if (
          loadedLesson.learnedContent &&
          loadedLesson.learnedContent.length > 0
        ) {
          const initialContent = loadedLesson.learnedContent.map((item) => ({
            ...item,
            uniqueId: item.uniqueId || uuid(),
            contentType: item.type,
          }));
          setContentItems(initialContent);
          setLastSavedContentItems(initialContent);
        }

        // Find chapter if we have course data
        if (courseData) {
          console.log("Looking for lesson in course chapters");
          let foundChapterTemp: Chapter | null = null;

          if (courseData.chapters) {
            for (const chapter of courseData.chapters) {
              if (chapter.lessons) {
                const lesson = chapter.lessons.find(
                  (l) => l.id === internalLessonId
                );
                if (lesson) {
                  console.log(`Found lesson in chapter: ${chapter.title}`);
                  foundChapterTemp = chapter;
                  break;
                }
              }
            }
          }

          setFoundChapter(foundChapterTemp);
        }
      } catch (error) {
        console.error("Error loading lesson:", error);
        if (error.message && error.message.includes("not found")) {
          console.log("Creating new lesson for ID:", internalLessonId);
          const newLesson: LessonModel = {
            id: internalLessonId,
            type: LessonType.Exercise,
            title: "Neue Lektion",
            description: "",
            isCompleted: false,
            imageName: "default.png",
            duration: "10 min",
            category: "General",
            difficulty: DifficultyLevel.Beginner,
            createdAt: new Date(),
            updatedAt: new Date(),
            learningOverview: {
              lessonId: internalLessonId,
              learningSteps: [],
              title: "Neue Lektion",
            },
            learnedContent: [], // Initialize empty array for learnedContent
          };

          setLessonData(newLesson);
          setLearningOverviewModel(newLesson.learningOverview);
          if (!courseData && courseModel) {
            setCourseData(courseModel);
          }
        } else {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          setLoadError(`Fehler beim Laden der Lektion: ${errorMessage}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [internalLessonId, courseData, courseModel]);

  // 6. Update preview when steps change
  useEffect(() => {
    if (selectedSteps.length > 0 && !previewStep) {
      setPreviewStep(selectedSteps[selectedSteps.length - 1]);
    } else if (selectedSteps.length === 0) {
      setPreviewStep(null);
    }
  }, [selectedSteps, previewStep]);

  // Effect to check for unsaved changes
  useEffect(() => {
    // Check if content items have changed from last saved state
    const contentItemsChanged =
      JSON.stringify(contentItems) !== JSON.stringify(lastSavedContentItems);

    // Check if selected steps have changed
    const stepsChanged =
      learningOverviewModel?.learningSteps &&
      JSON.stringify(learningOverviewModel.learningSteps) !==
        JSON.stringify(selectedSteps);

    // Check if lesson data has changed (basic check, can be expanded)
    const lessonDataChanged =
      lessonData?.title !== learningOverviewModel?.title;

    setHasUnsavedChanges(
      contentItemsChanged || stepsChanged || lessonDataChanged
    );
  }, [
    contentItems,
    selectedSteps,
    lessonData,
    learningOverviewModel,
    lastSavedContentItems,
  ]);

  const resetContentSelection = () => {
    setSelectedContentIds([]);
    setContentSelectorStatus({
      isProcessing: false,
      message: "",
    });
    console.log("Content selection reset completed");
  };
  // Media handling methods
  const handleImageSelect = (itemId: string) => {
    setSelectedItemId(itemId);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && selectedItemId) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      updateContentItemMedia(selectedItemId, { imageUrl });
    }
  };

  const handleAudioSelect = (itemId: string) => {
    setSelectedItemId(itemId);
    if (audioInputRef.current) audioInputRef.current.click();
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && selectedItemId) {
      const file = e.target.files[0];
      const audioUrl = URL.createObjectURL(file);
      updateContentItemMedia(selectedItemId, {
        audioUrl,
        soundFileName: file.name,
      });
    }
  };

  const handleAudioPlay = (itemId: string, audioUrl: string) => {
    if (audioPlaying === itemId) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setAudioPlaying(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
      audioRef.current.onended = () => setAudioPlaying(null);
      setAudioPlaying(itemId);
    }
  };

  // Content management methods
  const addContentItem = (newItem: EnhancedContentItem) => {
    setContentItems([
      ...contentItems,
      {
        ...newItem,
        id: newItem.id || uuid(),
        uniqueId: newItem.uniqueId || uuid(),
      },
    ]);
    setHasUnsavedChanges(true);
  };

  const removeContentItem = (uniqueId: string) => {
    setContentItems(contentItems.filter((item) => item.uniqueId !== uniqueId));
    setHasUnsavedChanges(true);
  };

  const updateContentItemMedia = (
    uniqueId: string,
    mediaData: Partial<EnhancedContentItem>
  ) => {
    setContentItems(
      contentItems.map((item) =>
        item.uniqueId === uniqueId ? { ...item, ...mediaData } : item
      )
    );
    setHasUnsavedChanges(true);
  };

  // Exercise management methods
  const handleSelectExerciseType = (type: StepType) => {
    setActiveStepType(type);
    setEditingStepId(null);
    setIsDialogOpen(true);
  };

  const handleEditStep = (stepId: string) => {
    const stepToEdit = selectedSteps.find((step) => step.id === stepId);

    if (stepToEdit) {
      setActiveStepType(stepToEdit.type);
      setEditingStepId(stepId);

      try {
        const deepCopiedData = JSON.parse(JSON.stringify(stepToEdit.data));
        setEditingStepData(deepCopiedData);
        setIsDialogOpen(true);
      } catch (error) {
        console.error("Error creating deep copy:", error);
        const fallbackCopy = { ...stepToEdit.data };
        setEditingStepData(fallbackCopy);
        setIsDialogOpen(true);
      }
    } else {
      console.error("Step with ID", stepId, "not found!");
    }
  };

  const handleSaveStep = (newStep: LearningStep) => {
    let updated: LearningStep[];

    if (editingStepId) {
      const existingStep = selectedSteps.find(
        (step) => step.id === editingStepId
      );

      if (!existingStep) {
        console.error("Step to edit not found:", editingStepId);
        return;
      }

      updated = selectedSteps.map((step) =>
        step.id === editingStepId
          ? {
              ...step,
              type: newStep.type,
              data: newStep.data,
            }
          : step
      );
    } else {
      updated = [...selectedSteps, newStep];
    }

    setSelectedSteps(updated);
    setPreviewStep(
      editingStepId
        ? updated.find((step) => step.id === editingStepId)!
        : newStep
    );

    if (onStepsGenerated) onStepsGenerated(updated);
    closeStepDialog();
    setHasUnsavedChanges(true);
  };

  const closeStepDialog = () => {
    setIsDialogOpen(false);
    setActiveStepType(null);
    setEditingStepId(null);
    setEditingStepData(null);
  };

  const handleSelectPreviewStep = (step: LearningStep) => {
    setPreviewStep(step);
  };

  const getPreviewStepTitle = () => {
    if (!previewStep) return "Keine Vorschau";
    const stepType = availableStepTypes.find(
      (t) => t.type === previewStep.type
    );
    return stepType ? stepType.title : previewStep.type;
  };

  const moveStep = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === selectedSteps.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updatedSteps = [...selectedSteps];
    const stepToMove = updatedSteps[index];

    updatedSteps.splice(index, 1);
    updatedSteps.splice(newIndex, 0, stepToMove);

    setSelectedSteps(updatedSteps);
    if (onStepsGenerated) onStepsGenerated(updatedSteps);
    setHasUnsavedChanges(true);
  };

  const deleteStep = (stepId: string) => {
    const updatedSteps = selectedSteps.filter((s) => s.id !== stepId);
    setSelectedSteps(updatedSteps);

    if (previewStep?.id === stepId) {
      setPreviewStep(updatedSteps.length > 0 ? updatedSteps[0] : null);
    }

    if (onStepsGenerated) onStepsGenerated(updatedSteps);
    setHasUnsavedChanges(true);
  };

  // Handle course navigation
  const navigateToCoursePage = () => {
    if (courseData?.id) {
      router.push(`/courses/${courseData.id}`);
    } else if (urlCourseId) {
      router.push(`/courses/${urlCourseId}`);
    } else {
      router.push("/courses");
    }
  };

  // Save function
  const saveLanguageLearningOverview = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      if (!internalLessonId) {
        throw new Error(
          "Lesson ID is missing. Cannot save without a valid ID."
        );
      }

      if (!lessonData) {
        throw new Error("Lesson data is null. Cannot save.");
      }

      // Filter content items to only include vocabulary and sentences
      // Modified version of the learnedContent mapping in saveLanguageLearningOverview
      const learnedContent: LearningContentItem[] = contentItems.map((item) => {
        const baseContent = {
          id: item.id,
          uniqueId: item.uniqueId,
        };

        if (item.contentType === "information" || item.type === "information") {
          return {
            ...baseContent,
            text: item.text || "",
            title: item.title || "",
            type: "information",
            contentType: "information",
          };
        } else {
          return {
            ...baseContent,
            text: item.text,
            translation: item.translation,
            type: item.contentType as "vocabulary" | "sentence",
            imageUrl: item.imageUrl,
            audioUrl: item.audioUrl,
            soundFileName: item.soundFileName,
            examples: item.examples,
          };
        }
      });

      const finalOverviewModel: LanguageLearningOverviewModel = {
        lessonId: internalLessonId,
        learningSteps: selectedSteps,
        title: lessonData.title || "Neue Lektion",
      };

      const lessonToSave: LessonModel = {
        ...lessonData,
        id: internalLessonId,
        type: lessonData.type || LessonType.Exercise,
        title: lessonData.title || "Neue Lektion",
        description: lessonData.description || "",
        isCompleted: lessonData.isCompleted || false,
        imageName: lessonData.imageName || "default.png",
        duration: lessonData.duration || "10 min",
        category: lessonData.category || "General",
        difficulty: lessonData.difficulty || DifficultyLevel.Beginner,
        createdAt: lessonData.createdAt || new Date(),
        updatedAt: new Date(),
        learningOverview: finalOverviewModel,
        learnedContent: learnedContent,
      };

      try {
        await lessonService.updateLesson(lessonToSave);
        console.log("Lesson updated successfully");
      } catch (updateError) {
        if (updateError.message && updateError.message.includes("not found")) {
          console.log("Lesson not found, creating new one");
          await lessonService.createLesson(lessonToSave);
        } else {
          throw updateError;
        }
      }

      // Only update course if we have both course data and chapter ID
      if (currentChapterId && courseData) {
        console.log(`Updating lesson in course, chapter: ${currentChapterId}`);
        const updatedCourse = { ...courseData };

        if (updatedCourse.chapters) {
          const chapterIndex = updatedCourse.chapters.findIndex(
            (chapter) => chapter.id === currentChapterId
          );

          if (chapterIndex !== -1) {
            const chapter = updatedCourse.chapters[chapterIndex];

            if (chapter.lessons) {
              const lessonIndex = chapter.lessons.findIndex(
                (lesson) => lesson.id === internalLessonId
              );

              if (lessonIndex !== -1) {
                chapter.lessons[lessonIndex] = lessonToSave;
              } else {
                chapter.lessons.push(lessonToSave);
                chapter.totalLessons = (chapter.totalLessons || 0) + 1;
              }
            } else {
              chapter.lessons = [lessonToSave];
              chapter.totalLessons = 1;
            }

            updatedCourse.chapters[chapterIndex] = chapter;
          }
        }

        try {
          const courseService = new CourseService();
          await courseService.updateCourse(updatedCourse);
          console.log("Course updated successfully");
          setCourseData(updatedCourse);
        } catch (courseUpdateError) {
          console.error("Error updating course:", courseUpdateError);
        }
      } else {
        console.log(
          "Skipping course update, missing course data or chapter ID"
        );
      }

      setLessonData(lessonToSave);

      if (onLessonSaved) {
        onLessonSaved(lessonToSave, courseData);
      }

      if (onStepsGenerated) {
        onStepsGenerated(selectedSteps);
      }

      // Update the lastSavedContentItems state when save is successful
      setLastSavedContentItems([...contentItems]);
      setHasUnsavedChanges(false);

      return { lesson: lessonToSave, course: courseData };
    } catch (error) {
      console.error("Error saving lesson:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setSaveError("Fehler beim Speichern: " + errorMessage);

      return null;
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to check if we have a valid language
  const hasValidLanguage = () => {
    return languageName && languageName !== "Unbekannt";
  };

  // If still loading, show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-4">Lektion wird geladen...</p>
        </div>
      </div>
    );
  }

  // If we have a loading error, show error state
  if (loadError) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{loadError}</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={navigateToCoursePage}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Zurück zum Kurs
          </button>
        </div>
      </div>
    );
  }

  // If we have no lesson data, show error state
  if (!lessonData) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <p className="text-yellow-700">Keine Lektionsdaten gefunden.</p>
        </div>
        <div className="mt-4">
          <button
            onClick={navigateToCoursePage}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Zurück zum Kurs
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {isFetchingCourse && (
        <div className="flex items-center justify-center p-10">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>

            <p className="mt-4">Kurs wird geladen...</p>
          </div>
        </div>
      )}

      {/* If course loading failed, show error state */}

      {courseLoadError && !isFetchingCourse && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <div className="ml-3">
                <p className="text-sm text-red-700">{courseLoadError}</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Zurück zur Kursübersicht
            </button>
          </div>
        </div>
      )}

      {!courseLoadError && !isFetchingCourse && (
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Header section with lesson title and back button */}
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {lessonData.title || "Neue Lektion"}
              </h1>
              {courseData && (
                <p className="text-sm text-gray-500">
                  Kurs: {courseData.title}
                  {foundChapter && ` / Kapitel: ${foundChapter.title}`}
                </p>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={saveLanguageLearningOverview}
                disabled={isSaving || !hasUnsavedChanges}
                className={`px-3 py-1 rounded flex items-center ${
                  hasUnsavedChanges
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Save size={16} className="mr-1" />
                {isSaving ? "Speichern..." : "Speichern"}
              </button>
              {courseData && (
                <button
                  onClick={navigateToCoursePage}
                  className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Zurück zum Kurs
                </button>
              )}
            </div>
          </div>

          {/* Language warning if needed */}
          {!hasValidLanguage() && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 m-4">
              <p className="text-yellow-700">
                Keine Sprache erkannt für diesen Kurs. Vokabelfeatures werden
                eingeschränkt sein.
              </p>
            </div>
          )}

          {/* FIXED LAYOUT: Main three-column section with proper height constraints */}
          <div className="flex flex-col md:flex-row">
            {/* Left column: Content input and exercise types */}
            <div className="w-full md:w-1/3 flex flex-col border-r border-gray-200">
              <div className="flex-none">
                <ContentInputSection
                  showHelp={showHelp}
                  toggleHelp={() => setShowHelp(!showHelp)}
                  onAddContent={addContentItem}
                  languageName={languageName}
                  contentItems={contentItems}
                />
              </div>
              <div className="flex-none">
                <ExerciseTypeSection
                  exerciseTypes={availableStepTypes}
                  onSelect={handleSelectExerciseType}
                />
              </div>
            </div>

            {/* Middle column: Created content display */}
            <div className="w-full md:w-1/3 border-r border-gray-200">
              <ContentDisplaySection
                contentItems={contentItems}
                onRemoveItem={removeContentItem}
                onImageSelect={handleImageSelect}
                onAudioSelect={handleAudioSelect}
                audioPlaying={audioPlaying}
                onAudioPlay={handleAudioPlay}
              />
            </div>

            {/* Right column: iPhone preview */}
            <div className="w-full md:w-1/3">
              <PreviewSection
                previewStep={previewStep}
                getPreviewStepTitle={getPreviewStepTitle}
              />
            </div>
          </div>

          {/* Full width section for created exercises and learning model */}
          <div className="border-t border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-bold text-black mb-4">
                3. Erstellte Übungen
              </h2>

              <ExerciseSection
                steps={selectedSteps}
                availableStepTypes={availableStepTypes}
                previewStepId={previewStep?.id}
                onEditStep={handleEditStep}
                onDeleteStep={deleteStep}
                onMoveStep={moveStep}
                onSelectPreviewStep={handleSelectPreviewStep}
              />

              {selectedSteps.length > 0 && (
                <div className="mt-6">
                  <LessonDetailsSection
                    lessonId={internalLessonId}
                    lessonData={lessonData}
                    setLessonData={setLessonData}
                    selectedSteps={selectedSteps}
                    courseData={courseData}
                    currentChapterId={currentChapterId}
                    learningOverviewModel={learningOverviewModel}
                    setLearningOverviewModel={setLearningOverviewModel}
                  />

                  <SaveButton
                    isSaving={isSaving}
                    onSave={saveLanguageLearningOverview}
                    saveError={saveError}
                    disabled={isSaving || !hasUnsavedChanges}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Hidden file inputs */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <input
            type="file"
            ref={audioInputRef}
            onChange={handleAudioChange}
            accept="audio/x-m4a,audio/*"
            className="hidden"
          />

          {/* Step Dialog */}
          {activeStepType && isDialogOpen && (
            <StepDialog
              isOpen={true}
              stepType={activeStepType}
              contentItems={contentItems}
              onClose={closeStepDialog} // This will now reset content selection too
              onSave={handleSaveStep}
              isSaveEnabled={true}
              initialData={editingStepData}
              selectedContentIds={selectedContentIds}
              setSelectedContentIds={setSelectedContentIds}
              processingStatus={contentSelectorStatus}
            />
          )}
        </div>
      )}
    </>
  );
};

export default ContentManagerView;
