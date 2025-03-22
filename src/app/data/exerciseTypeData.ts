// data/exerciseTypeData.ts
import { StepType } from "../types/model";
import { ExerciseType } from "../components/ExerciseType";

export const availableStepTypes: ExerciseType[] = [
  {
    type: StepType.ListenVocabulary,
    title: "Vokabeln hören",
    description: "Höre und lerne Vokabeln.",
    color: "bg-blue-100",
    icon: "🔊",
  },
  {
    type: StepType.FillInTheBlanks,
    title: "Lückentext",
    description: "Fülle die Lücke in einem Satz aus.",
    color: "bg-green-100",
    icon: "📝",
  },
  {
    type: StepType.TrueFalse,
    title: "Wahr/Falsch",
    description: "Entscheide, ob die Aussage korrekt ist.",
    color: "bg-yellow-100",
    icon: "✅",
  },
  {
    type: StepType.LanguageQuestion,
    title: "Frage & Antwort",
    description: "Beantworte eine Sprachfrage.",
    color: "bg-purple-100",
    icon: "❓",
  },
  {
    type: StepType.SentenceCompletion,
    title: "Satz vervollständigen",
    description:
      "Vervollständige den Satz durch Klicken auf das fehlende Wort.",
    color: "bg-indigo-100",
    icon: "✍️",
  },
  {
    type: StepType.WordOrdering,
    title: "Wörter ordnen",
    description: "Ordne die Wörter in die richtige Reihenfolge.",
    color: "bg-red-100",
    icon: "🔄",
  },
  {
    type: StepType.LessonInformation,
    title: "Lektioneninfo",
    description: "Füge zusätzliche Informationen zur Lektion hinzu.",
    color: "bg-blue-100",
    icon: "ℹ️",
  },
  {
    type: StepType.LanguagePhrases,
    title: "Sprachwendungen",
    description: "Lerne wichtige Redewendungen.",
    color: "bg-green-100",
    icon: "💬",
  },
  {
    type: StepType.MatchingPairs,
    title: "Paare zuordnen",
    description: "Ordne Begriffe und Übersetzungen zu.",
    color: "bg-yellow-100",
    icon: "🔗",
  },
  {
    type: StepType.FillInChat,
    title: "Chat ausfüllen",
    description: "Erstelle eine Chat-Konversation mit interaktiven Lücken.",
    color: "bg-purple-100",
    icon: "💬",
  },
];
