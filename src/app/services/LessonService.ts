// src/services/LessonService.ts
import { db } from "../../firebase/firebaseClient";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import {
  LessonModel,
  LanguageLearningOverviewModel,
  LearningStep,
  LessonType,
  DifficultyLevel,
} from "../types/model";
import { v4 as uuidv4 } from "uuid";

/**
 * Helper function to fill missing learning overview attributes with default values
 */
const fillMissingLearningOverviewAttributes = (
  overview: Partial<LanguageLearningOverviewModel>
): LanguageLearningOverviewModel => {
  return {
    lessonId: overview.lessonId || "",
    learningSteps: overview.learningSteps || [],
    title: overview.title || "",
  };
};

/**
 * Helper function to fill missing lesson attributes with default values
 */
const fillMissingLessonAttributes = (
  lesson: Partial<LessonModel>
): LessonModel => {
  return {
    id: lesson.id || uuidv4(),
    type: lesson.type || LessonType.Exercise,
    title: lesson.title || "Untitled Lesson",
    description: lesson.description || "",
    isCompleted: lesson.isCompleted ?? false,
    imageName: lesson.imageName || "default.png",
    duration: lesson.duration || "10 min",
    category: lesson.category || "General",
    difficulty: lesson.difficulty || DifficultyLevel.Beginner,
    createdAt: lesson.createdAt || new Date(),
    updatedAt: lesson.updatedAt || new Date(),
    learningOverview: lesson.learningOverview || {
      lessonId: lesson.id || uuidv4(),
      learningSteps: [],
      title: lesson.title || "Untitled Lesson",
    },
  };
};

/**
 * Service class for managing lessons in Firestore
 */
class LessonService {
  private lessonsCollection = collection(db, "lessons");

  /**
   * Get all lessons from the database
   */
  async getAllLessons(): Promise<LessonModel[]> {
    const querySnapshot = await getDocs(this.lessonsCollection);
    const lessons: LessonModel[] = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as Partial<LessonModel>;
      // Add default values for missing attributes
      const filledLesson = fillMissingLessonAttributes({
        ...data,
        id: docSnap.id,
      });
      lessons.push(filledLesson);
    });

    return lessons;
  }

  /**
   * Get a specific lesson by ID
   */
  async getLessonById(id: string): Promise<LessonModel> {
    // Get the lesson document
    const docRef = doc(db, "lessons", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error(`Lesson with ID ${id} not found`);
    }

    const lessonData = docSnap.data() as Partial<LessonModel>;
    const lesson = fillMissingLessonAttributes({
      ...lessonData,
      id: docSnap.id,
    });

    return lesson;
  }

  /**
   * Update an existing lesson
   */
  async updateLesson(lesson: LessonModel): Promise<void> {
    try {
      if (!lesson.id) {
        throw new Error("Lesson ID is required for updates");
      }

      console.log("Updating lesson with ID:", lesson.id);

      // Prüfe zuerst, ob die Lektion existiert
      const docRef = doc(db, "lessons", lesson.id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.log(
          `Lesson with ID ${lesson.id} doesn't exist, creating instead of updating`
        );
        // Die Lektion existiert nicht, erstelle sie stattdessen
        return this.createLesson(lesson).then(() => {});
      }

      // Update the lesson document
      const lessonRef = doc(db, "lessons", lesson.id);

      // Update timestamps
      lesson.updatedAt = new Date();

      // Make sure learning overview has correct lessonId
      if (lesson.learningOverview) {
        lesson.learningOverview.lessonId = lesson.id;
      }

      // Remove undefined values
      const validLessonData = Object.entries(lesson).reduce(
        (acc, [key, value]) => {
          if (value !== undefined) {
            acc[key] = value;
          }
          return acc;
        },
        {} as Partial<LessonModel>
      );

      await updateDoc(lessonRef, validLessonData);

      console.log(`Lesson with ID ${lesson.id} updated successfully.`);
    } catch (error) {
      console.error("Error updating lesson:", error);
      throw error;
    }
  }

  /**
   * Create a new lesson
   */
  async createLesson(lesson: LessonModel): Promise<LessonModel> {
    try {
      console.log("Creating new lesson", lesson);

      // Generate a new ID if one doesn't exist
      if (!lesson.id) {
        const uniqueId = uuidv4();
        const category = lesson.category || "general";
        const type = lesson.type || "exercise";

        lesson.id = `${category}_${type}_${uniqueId}`;
        console.log("Generated new lesson ID:", lesson.id);
      } else {
        console.log("Using provided lesson ID:", lesson.id);
      }

      // Ensure the learning overview has the lessonId set
      if (lesson.learningOverview) {
        lesson.learningOverview.lessonId = lesson.id;
      } else {
        lesson.learningOverview = {
          lessonId: lesson.id,
          learningSteps: [],
          title: lesson.title,
        };
      }

      // Create the lesson document
      const lessonRef = doc(this.lessonsCollection, lesson.id);

      // Prepare the lesson data by filling in missing attributes
      const filledLesson = fillMissingLessonAttributes(lesson);

      // Add/update timestamps
      filledLesson.createdAt = new Date();
      filledLesson.updatedAt = new Date();

      // Save the lesson document
      await setDoc(lessonRef, filledLesson);

      console.log(`Lesson with ID ${filledLesson.id} created successfully.`);

      return filledLesson;
    } catch (error) {
      console.error("Error creating lesson:", error);
      throw error;
    }
  }

  /**
   * Delete a lesson
   */
  async deleteLesson(id: string): Promise<void> {
    try {
      // Delete the lesson document (which now includes the learning overview)
      const lessonRef = doc(db, "lessons", id);
      await deleteDoc(lessonRef);

      console.log(`Lesson with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting lesson:", error);
      throw error;
    }
  }

  /**
   * Get lessons by category
   */
  async getLessonsByCategory(category: string): Promise<LessonModel[]> {
    const q = query(this.lessonsCollection, where("category", "==", category));

    const querySnapshot = await getDocs(q);
    const lessons: LessonModel[] = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as Partial<LessonModel>;
      const filledLesson = fillMissingLessonAttributes({
        ...data,
        id: docSnap.id,
      });
      lessons.push(filledLesson);
    });

    return lessons;
  }

  /**
   * Get lessons by difficulty level
   */
  async getLessonsByDifficulty(difficulty: string): Promise<LessonModel[]> {
    const q = query(
      this.lessonsCollection,
      where("difficulty", "==", difficulty)
    );

    const querySnapshot = await getDocs(q);
    const lessons: LessonModel[] = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as Partial<LessonModel>;
      const filledLesson = fillMissingLessonAttributes({
        ...data,
        id: docSnap.id,
      });
      lessons.push(filledLesson);
    });

    return lessons;
  }

  /**
   * Update learning steps for a lesson
   */
  async updateLearningSteps(
    lessonId: string,
    learningSteps: LearningStep[]
  ): Promise<void> {
    try {
      const lessonRef = doc(db, "lessons", lessonId);
      const lessonSnap = await getDoc(lessonRef);

      if (!lessonSnap.exists()) {
        throw new Error(`Lesson with ID ${lessonId} not found`);
      }

      const lessonData = lessonSnap.data() as LessonModel;

      // Update the learning overview with new learning steps
      if (!lessonData.learningOverview) {
        lessonData.learningOverview = {
          lessonId: lessonId,
          learningSteps: learningSteps,
          title: lessonData.title,
        };
      } else {
        lessonData.learningOverview.learningSteps = learningSteps;
      }

      // Update the lesson document
      await updateDoc(lessonRef, {
        learningOverview: lessonData.learningOverview,
        updatedAt: new Date(),
      });

      console.log(
        `Learning steps for lesson ${lessonId} updated successfully.`
      );
    } catch (error) {
      console.error("Error updating learning steps:", error);
      throw error;
    }
  }
}

// Exportiere eine Singleton-Instanz des LessonService
const lessonService = new LessonService();
export default lessonService;
