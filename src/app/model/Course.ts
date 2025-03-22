// In src/model/Course.ts
import { CourseModel } from "../types/model";
import { LanguageModel } from "../types/model";
import { Chapter } from "../types/model";

export class Course implements CourseModel {
  id?: string;
  author?: string;
  image?: string;
  level?: string;
  title?: string;
  language?: LanguageModel;
  chapters?: Chapter[];
  description?: string;
  lastCompletedDate?: Date;

  // Gibt Standardwerte zurück – hier wird ein absoluter URL verwendet,
  // der auf eine gültige Bildressource zeigt.
  static empty(): CourseModel {
    return {
      id: "",
      author: "Unbekannt",
      image: "",
      level: "Anfänger",
      title: "Kein Titel",
      language: { id: "", name: "Unbekannt", flagName: "default" },
      chapters: [],
      description: "Keine Beschreibung vorhanden",
      lastCompletedDate: new Date(0),
    };
  }
}
