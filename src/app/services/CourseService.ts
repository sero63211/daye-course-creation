// src/services/CourseService.ts
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
} from "firebase/firestore";
import { CourseModel } from "../types/model";
import { v4 as uuidv4 } from "uuid";
import { fillMissingLessonAttributes } from "../utils/HelperFunctions";
import { fillMissingCourseAttributes } from "../utils/HelperFunctions";

export class CourseService {
  private coursesCollection = collection(db, "courseCreation");

  // Alle Kurse abrufen
  async getAllCourses(): Promise<CourseModel[]> {
    const querySnapshot = await getDocs(this.coursesCollection);
    const courses: CourseModel[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as Partial<CourseModel>;
      // Füge die Standardwerte für fehlende Attribute hinzu
      const filledCourse = fillMissingCourseAttributes({
        ...data,
        id: docSnap.id,
      });
      courses.push(filledCourse);
    });
    return courses;
  }

  // Einzelnen Kurs anhand der ID abrufen
  async getCourseById(id: string): Promise<CourseModel | null> {
    console.log(`CourseService: Getting course with ID: ${id}`);
    const docRef = doc(db, "courseCreation", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.error(`CourseService: Course with ID ${id} does not exist`);
      return null;
    }

    const data = docSnap.data() as Partial<CourseModel>;
    console.log(`CourseService: Found course data:`, data);

    // Merge der Daten mit den Default-Werten
    return fillMissingCourseAttributes({ ...data, id: docSnap.id });
  }

  async createCourse(course: CourseModel): Promise<CourseModel> {
    if (course.id) {
      console.log(
        `Erstelle bzw. aktualisiere Kurs mit vorhandener ID: ${course.id}`
      );
      const docRef = doc(this.coursesCollection, course.id);
      await setDoc(docRef, course);
      console.log(`Kurs ${course.id} wurde erfolgreich aktualisiert.`);
      return course;
    } else {
      const languageName = course.language?.name
        ? course.language.name
        : "unknown";
      const level = course.level ? course.level : "unknown";
      const author = course.author ? course.author : "unknown";
      const unique = uuidv4();
      const generatedId = `${languageName}_${level}_${author}_${unique}`;
      course.id = generatedId;
      console.log(`Neuer Kurs wird erstellt mit ID: ${course.id}`);
      const docRef = doc(this.coursesCollection, course.id);
      await setDoc(docRef, course);
      console.log(`Neuer Kurs mit ID ${course.id} wurde erfolgreich erstellt.`);
      return course;
    }
  }

  // Bestehenden Kurs aktualisieren
  async updateCourse(course: CourseModel): Promise<void> {
    const docRef = doc(db, "courseCreation", course.id!);

    const updatedChapters = course.chapters?.map((chapter) => ({
      ...chapter,
      lessons:
        chapter.lessons?.map((lesson) => fillMissingLessonAttributes(lesson)) ||
        [],
    }));

    const updatedCourse: CourseModel = {
      ...course,
      chapters: updatedChapters,
    };

    // Entferne Felder mit undefined-Werten
    const validData = Object.entries(updatedCourse).reduce(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Partial<CourseModel>
    );

    await updateDoc(docRef, validData);
  }

  // Kurs anhand der ID löschen
  async deleteCourse(id: string): Promise<void> {
    const docRef = doc(db, "courseCreation", id);
    await deleteDoc(docRef);
  }
}
