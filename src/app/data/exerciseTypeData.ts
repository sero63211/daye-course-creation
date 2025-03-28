// data/exerciseTypeData.ts
import { StepType } from "../types/model";
import { ExerciseType } from "../components/ExerciseType";
export const availableStepTypes: ExerciseType[] = [
  {
    type: StepType.ListenVocabulary,
    title: "Hörverständnis",
    description: "Auditive Wahrnehmung und Sprachverständnis trainieren.",
    color: "bg-blue-100",
    icon: "🔊",
  },
  {
    type: StepType.FillInTheBlanks,
    title: "Lückentext",
    description: "Sprachkenntnisse durch Ergänzungsübungen festigen.",
    color: "bg-green-100",
    icon: "📝",
  },
  {
    type: StepType.TrueFalse,
    title: "Wahr oder Falsch",
    description: "Textverständnis durch Aussagenbeurteilung prüfen.",
    color: "bg-yellow-100",
    icon: "✅",
  },
  {
    type: StepType.LanguageQuestion,
    title: "Verständnisfrage",
    description: "Sprachverständnis durch gezielte Fragen überprüfen.",
    color: "bg-purple-100",
    icon: "❓",
  },
  {
    type: StepType.SentenceCompletion,
    title: "Satzergänzung",
    description: "Sprachlogik durch Vervollständigung von Sätzen üben.",
    color: "bg-indigo-100",
    icon: "✍️",
  },
  {
    type: StepType.WordOrdering,
    title: "Satzstellung",
    description: "Grammatikalisches Verständnis durch Wortordnung fördern.",
    color: "bg-red-100",
    icon: "🔄",
  },
  {
    type: StepType.LessonInformation,
    title: "Lerninhalt",
    description:
      "Kulturelle und sprachliche Hintergrundinformationen vermitteln.",
    color: "bg-blue-100",
    icon: "ℹ️",
  },
  {
    type: StepType.LanguagePhrases,
    title: "Redewendungen",
    description: "Authentische Ausdrücke und Phrasen im Kontext erlernen.",
    color: "bg-green-100",
    icon: "💬",
  },
  {
    type: StepType.MatchingPairs,
    title: "Zuordnungsübung",
    description: "Vokabelwissen durch Paarbildung vertiefen.",
    color: "bg-yellow-100",
    icon: "🔗",
  },
  {
    type: StepType.FillInChat,
    title: "Dialogergänzung",
    description:
      "Kommunikationsfähigkeit durch interaktive Gesprächssituationen fördern.",
    color: "bg-purple-100",
    icon: "💬",
  },
];
