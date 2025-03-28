// utils/stepTypeUtils.ts
import { v4 as uuid } from "uuid";
import {
  StepType,
  ListenVocabularyModel,
  FillInTheBlanksModel,
  QuestionModel,
  LanguageQuestionModel,
  SentenceCompletionModel,
  WordOrderingModel,
  LessonInformationModel,
  LanguagePhrasesModel,
  MatchingPairsModel,
  ConversationModel,
  CompletedModel,
  PronunciationPracticeModel,
  GrammarExplanationModel,
  VocabularyMatchingModel,
  AudioComprehensionModel,
  WritingExerciseModel,
  VideoLessonModel,
  CulturalInsightModel,
} from "../types/model";

/**
 * Erstellt ein leeres Modell basierend auf dem StepType
 * Diese Funktion kann überall in der Anwendung verwendet werden,
 * um konsistente Standardwerte für jeden StepType zu erhalten.
 */
export const getEmptyModelForStepType = (type: StepType, items: any[] = []) => {
  switch (type) {
    case StepType.ListenVocabulary:
      return {
        imageUrl: "",
        soundFileName: "",
        mainText: "",
        secondaryText: "",
        descriptionText: "",
        facts: [],
        examples: [],
        partOfSpeech: "",
        relatedWords: [],
        selectedItems: [],
      } as ListenVocabularyModel;

    case StepType.FillInTheBlanks:
      return {
        question: "",
        imageUrl: "",
        soundFileName: "",
        options: items.map((item) => item.text) || [],
        correctAnswer: "",
        translation: "",
        pronunciationTip: "",
        facts: [],
        context: "",
        hint: "",
        explanation: "",
      } as FillInTheBlanksModel;

    case StepType.TrueFalse:
      return {
        id: uuid(),
        questionText: "",
        imageUrl: "",
        soundFileName: "",
        prompt: "",
        statement: "",
        isTrueStatement: false,
        correctAnswer: "",
        translation: "",
        pronunciationTip: "",
        facts: [],
        explanation: "",
      } as QuestionModel;

    case StepType.LanguageQuestion:
      return {
        questionText: "",
        imageUrl: "",
        soundFileName: "",
        options: [],
        correctOption: "",
        facts: [],
        explanation: "",
        translations: {},
        hint: "",
        category: "",
      } as LanguageQuestionModel;

    case StepType.SentenceCompletion:
      return {
        instructionText: "",
        imageUrl: "",
        soundFileName: "",
        sentenceParts: [],
        blankIndex: 0,
        correctAnswer: "",
        facts: [],
        translations: [],
        context: "",
        hint: "",
        explanation: "",
      } as SentenceCompletionModel;

    case StepType.WordOrdering:
      return {
        instructionText: "",
        imageUrl: "",
        soundFileName: "",
        wordOptions: [],
        correctSentence: "",
        facts: [],
        translation: "",
        context: "",
        hint: "",
      } as WordOrderingModel;

    case StepType.LessonInformation:
      return {
        title: "",
        mainText: "",
        imageUrl: "",
        videoUrl: "",
        audioUrl: "",
        additionalResources: [],
        keyPoints: [],
      } as LessonInformationModel;

    case StepType.LanguagePhrases:
      return {
        title: "",
        explanation: "",
        phrases: [],
        facts: [],
        category: "",
        culturalNotes: "",
      } as LanguagePhrasesModel;

    case StepType.MatchingPairs:
      return {
        title: "",
        pairs: [],
        facts: [],
        instructions: "",
        category: "",
        timeLimit: 0,
      } as MatchingPairsModel;

    case StepType.FillInChat:
      return {
        title: "",
        conversations: [],
        options: [],
        facts: [],
        context: "",
        category: "",
        culturalNotes: "",
      } as ConversationModel;

    case StepType.Completed:
      return {
        completionMessage: "",
        learnedVocabulary: [],
        score: 0,
        correctAnswers: 0,
        totalQuestions: 0,
        timeSpent: 0,
        nextLessonId: "",
        awards: [],
        xpEarned: 0,
      } as CompletedModel;

    case StepType.PronunciationPractice:
      return {
        text: "",
        audioUrl: "",
        phonetics: "",
        tips: [],
        imageUrl: "",
        wordBreakdown: [],
        facts: [],
      } as PronunciationPracticeModel;

    case StepType.GrammarExplanation:
      return {
        title: "",
        explanation: "",
        examples: [],
        rules: [],
        exercises: [],
        imageUrl: "",
        videoUrl: "",
        relatedTopics: [],
        facts: [],
      } as GrammarExplanationModel;

    case StepType.VocabularyMatching:
      return {
        words: [],
        instructions: "",
        timeLimit: 0,
        category: "",
        facts: [],
      } as VocabularyMatchingModel;

    case StepType.AudioComprehension:
      return {
        audioUrl: "",
        questions: [],
        transcript: "",
        translation: "",
        context: "",
        facts: [],
      } as AudioComprehensionModel;

    case StepType.WritingExercise:
      return {
        prompt: "",
        minWords: 0,
        maxWords: 0,
        exampleAnswer: "",
        rubric: [],
        resources: [],
        timeLimit: 0,
        facts: [],
      } as WritingExerciseModel;

    case StepType.VideoLesson:
      return {
        title: "",
        videoUrl: "",
        description: "",
        transcript: "",
        translations: "",
        questions: [],
        keyPoints: [],
        duration: 0,
        facts: [],
      } as VideoLessonModel;

    case StepType.CulturalInsight:
      return {
        title: "",
        content: "",
        imageUrls: [],
        videoUrl: "",
        relatedVocabulary: [],
        quizQuestions: [],
        references: [],
        facts: [],
      } as CulturalInsightModel;

    default:
      return {}; // Standardmäßig ein leeres Objekt zurückgeben
  }
};

/**
 * Gibt einen benutzerfreundlichen Namen für jeden StepType zurück
 */
export const getStepTypeName = (type: StepType): string => {
  switch (type) {
    case StepType.ListenVocabulary:
      return "Vokabeln hören";
    case StepType.FillInTheBlanks:
      return "Lückentext";
    case StepType.TrueFalse:
      return "Wahr/Falsch";
    case StepType.LanguageQuestion:
      return "Frage & Antwort";
    case StepType.SentenceCompletion:
      return "Satz vervollständigen";
    case StepType.WordOrdering:
      return "Wörter ordnen";
    case StepType.LessonInformation:
      return "Lektioneninfo";
    case StepType.LanguagePhrases:
      return "Sprachwendungen";
    case StepType.MatchingPairs:
      return "Paare zuordnen";
    case StepType.FillInChat:
      return "Chat ausfüllen";
    case StepType.Completed:
      return "Abschluss";
    case StepType.PronunciationPractice:
      return "Ausspracheübung";
    case StepType.GrammarExplanation:
      return "Grammatikerklärung";
    case StepType.VocabularyMatching:
      return "Vokabeln zuordnen";
    case StepType.AudioComprehension:
      return "Hörverstehen";
    case StepType.WritingExercise:
      return "Schreibübung";
    default:
      return type;
  }
};

/**
 * Erstellt eine tiefe Kopie eines Objekts
 */
export const createDeepCopy = <T>(data: T): T => {
  try {
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Fehler beim Erstellen einer Tiefenkopie:", error);
    return { ...(data as any) } as T;
  }
};

/**
 * Prüft, ob alle erforderlichen Felder für einen bestimmten StepType ausgefüllt sind
 */
export const isDataCompleteForStepType = (
  type: StepType,
  data: any
): boolean => {
  switch (type) {
    case StepType.ListenVocabulary:
      return !!data.mainText && !!data.secondaryText;

    case StepType.FillInTheBlanks:
      return !!data.question && !!data.correctAnswer;

    case StepType.TrueFalse:
      return !!data.statement && !!data.correctAnswer;

    case StepType.LanguageQuestion:
      return (
        !!data.questionText &&
        !!data.correctOption &&
        Array.isArray(data.options) &&
        data.options.length > 0
      );

    case StepType.SentenceCompletion:
      return (
        !!data.instructionText &&
        Array.isArray(data.sentenceParts) &&
        data.sentenceParts.length > 0
      );

    case StepType.WordOrdering:
      return (
        !!data.instructionText &&
        !!data.correctSentence &&
        Array.isArray(data.wordOptions) &&
        data.wordOptions.length > 0
      );

    case StepType.LessonInformation:
      return !!data.title && !!data.mainText;

    case StepType.LanguagePhrases:
      return (
        !!data.title && Array.isArray(data.phrases) && data.phrases.length > 0
      );

    case StepType.MatchingPairs:
      return !!data.title && Array.isArray(data.pairs) && data.pairs.length > 0;

    case StepType.FillInChat:
      return (
        !!data.title &&
        Array.isArray(data.conversations) &&
        data.conversations.length > 0
      );

    case StepType.Completed:
      return !!data.completionMessage;

    default:
      return true;
  }
};
