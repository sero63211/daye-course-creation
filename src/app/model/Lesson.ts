// File: src/model/Lesson.ts
import { LessonModel, LessonType } from "../types/model";

export class Lesson implements LessonModel {
  id: string;
  type: LessonType;
  title: string;
  description?: string;
  isCompleted: boolean;
  imageName: string;
  duration: string;
  category: string;

  static empty(): LessonModel {
    return {
      id: "",
      type: LessonType.Exercise, // Default type – passe diesen Wert bei Bedarf an
      title: "Kein Titel",
      description: "",
      isCompleted: false,
      imageName: "/default.png",
      duration: "0 min",
      category: "",
    };
  }
}
