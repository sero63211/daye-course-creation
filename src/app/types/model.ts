// src/types/models.ts

// --- Basic Models ---

/**
 * Defines the possible types of lessons
 */
export enum LessonType {
  Exercise = "exercise",
  Quiz = "quiz",
  Story = "story", // Added for narrative-based lessons
  Conversation = "conversation", // Added for conversation practice
  Grammar = "grammar", // Added for grammar-focused lessons
}

/**
 * Language model representing a supported language
 */
export interface LanguageModel {
  id: string;
  name: string;
  flagName: string;
  code?: string; // ISO language code (e.g., "en", "de", "fr")
  isRightToLeft?: boolean; // Whether the language is written right-to-left
  supportedDialects?: string[]; // Different dialects for the language
}

/**
 * Difficulty level for courses and lessons
 */
export enum DifficultyLevel {
  Beginner = "beginner",
  Elementary = "elementary",
  Intermediate = "intermediate",
  Advanced = "advanced",
  Proficient = "proficient",
}

/**
 * Model representing a single lesson
 */
export interface LearningContentItem {
  id: string;
  uniqueId: string;
  text: string;
  translation?: string;
  type: "vocabulary" | "sentence" | "information"; // Add "information" type
  title?: string;
  contentType?: string; // Optionally add this for consistency
  imageUrl?: string;
  audioUrl?: string;
  soundFileName?: string;
  examples?: {
    text: string;
    translation: string;
  }[];
}
export interface LessonModel {
  id: string;
  type: LessonType;
  title: string;
  description?: string;
  isCompleted: boolean;
  imageName: string;
  duration: string;
  category: string;
  difficulty?: DifficultyLevel;
  createdAt?: Date;
  updatedAt?: Date;
  learningOverview: LanguageLearningOverviewModel;
  learnedContent?: LearningContentItem[]; // New field to store vocabulary and sentences
}

/**
 * Represents a chapter containing multiple lessons
 */
export interface Chapter {
  id: string;
  title: string;
  completedLessons: number;
  totalLessons: number;
  lessons: LessonModel[];
  description?: string; // Added description for chapter
  unlocked?: boolean; // Whether the chapter is available to the user
  imageUrl?: string; // Chapter thumbnail image
  order?: number; // Sorting order in the course
}

/**
 * Model for a complete course
 */
export interface CourseModel {
  id?: string;
  author?: string;
  image?: string;
  level?: DifficultyLevel | string;
  title?: string;
  language?: LanguageModel;
  chapters?: Chapter[];
  description?: string;
  lastCompletedDate?: Date;
  estimatedDuration?: string; // Total estimated completion time
  totalLessons?: number; // Total number of lessons across all chapters
  rating?: number; // Course rating (e.g., 1-5)
  reviews?: number; // Number of reviews
  learningObjectives?: string[]; // What the user will learn
  requirements?: string[]; // Prerequisites for taking the course
  certificateAvailable?: boolean; // Whether a completion certificate is available
  createdAt?: Date; // Course creation date
  updatedAt?: Date; // Last update date
}

/**
 * All possible step types in the learning process
 */
export enum StepType {
  ListenVocabulary = "listenVocabulary",
  FillInTheBlanks = "fillInTheBlanks",
  TrueFalse = "trueFalse",
  LanguageQuestion = "languageQuestion",
  SentenceCompletion = "sentenceCompletion",
  WordOrdering = "wordOrdering",
  LessonInformation = "lessonInformation",
  LanguagePhrases = "languagePhrases",
  MatchingPairs = "matchingPairs",
  Conversation = "conversation",
  Completed = "completed",
  FillInChat = "fillInChat",
}

/**
 * Generic learning step interface
 */
export interface LearningStep {
  id: string;
  type: StepType;
  data: any;
  order?: number; // Order of this step in the sequence
  isOptional?: boolean; // Whether this step can be skipped
  completed?: boolean; // Whether the user has completed this step
}

/**
 * Overview model for a lesson with its learning steps
 */
export interface LanguageLearningOverviewModel {
  lessonId: string;
  learningSteps: LearningStep[];
  title?: string; // Lesson title for display
  currentStepIndex?: number; // Current step the user is on
  totalSteps?: number; // Total number of steps in this lesson
  progress?: number; // Progress percentage (0-100)
}

/**
 * Shared interface for additional information items
 */
export interface InfoItem {
  id: string;
  term: string;
  definition: string;
  usage: string;
  pronunciation: string;
  examples?: string[]; // Additional examples for context
  imageUrl?: string; // Optional illustration
  audioUrl?: string; // Optional audio pronunciation
  notes?: string; // Additional contextual notes
}

/**
 * Model for vocabulary listening exercises
 */
export interface ListenVocabularyModel {
  imageUrl: string;
  soundFileName: string;
  mainText: string;
  secondaryText: string;
  descriptionText?: string; // Additional description text
  facts?: InfoItem[];
  examples?: { text: string; translation: string }[]; // Example sentences
  partOfSpeech?: string; // Noun, verb, adjective, etc.
  relatedWords?: string[]; // Related vocabulary
  difficultyLevel?: DifficultyLevel; // Word difficulty
}

/**
 * Model for fill-in-the-blanks exercises
 */
export interface FillInTheBlanksModel {
  question: string;
  imageUrl?: string;
  soundFileName: string;
  options: string[];
  correctAnswer: string;
  translation: string;
  pronunciationTip?: string;
  facts?: InfoItem[];
  context?: string; // Additional context for the question
  hint?: string; // Optional hint for the user
  explanation?: string; // Explanation of the correct answer
}

/**
 * Model for true/false questions
 */
export interface QuestionModel {
  id: string;
  questionText: string;
  imageUrl: string;
  soundFileName: string;
  prompt: string;
  statement: string;
  isTrueStatement: boolean;
  correctAnswer: string;
  translation: string;
  pronunciationTip?: string;
  facts?: InfoItem[];
  explanation?: string; // Explanation of why the statement is true/false
  difficulty?: DifficultyLevel; // Question difficulty
}

/**
 * Model for language questions with multiple options
 */
export interface LanguageQuestionModel {
  questionText: string;
  imageUrl?: string;
  soundFileName: string;
  options: string[];
  correctOption: string;
  facts?: InfoItem[];
  explanation?: string; // Explanation of the correct answer
  translations?: Record<string, string>; // Translations of options
  hint?: string; // Optional hint
  category?: string; // Question category (e.g., "Grammar", "Vocabulary")
}

/**
 * Model for sentence completion exercises
 */
export interface SentenceCompletionModel {
  instructionText: string;
  imageUrl: string;
  soundFileName: string;
  sentenceParts: string[];
  blankIndex: number;
  correctAnswer: string;
  facts?: InfoItem[];
  translations?: string[]; // Translations of sentence parts
  context?: string; // Additional context for the sentence
  hint?: string; // Optional hint
  explanation?: string; // Explanation of the correct answer
}

/**
 * Model for word ordering exercises
 */
export interface WordOrderingModel {
  instructionText: string;
  imageUrl: string;
  soundFileName: string;
  wordOptions: string[];
  correctSentence: string;
  facts?: InfoItem[];
  translation?: string; // Translation of the correct sentence
  context?: string; // Additional context
  hint?: string; // Optional hint
  difficulty?: DifficultyLevel; // Exercise difficulty
}

/**
 * Model for lesson information screens
 */
export interface LessonInformationModel {
  title: string;
  mainText: string;
  imageUrl?: string; // Illustration image
  videoUrl?: string; // Explanatory video
  audioUrl?: string; // Narrated explanation
  additionalResources?: { title: string; url: string }[]; // Additional learning resources
  keyPoints?: string[]; // Key takeaways from the information
}

/**
 * Models for language phrases exercises
 */
export interface PhraseItem {
  foreignText: string;
  nativeText: string;
  nativePrefixText?: string;
  audioUrl?: string; // Audio pronunciation
  imageUrl?: string; // Illustrative image
  context?: string; // Usage context
  difficulty?: DifficultyLevel; // Phrase difficulty
}

export interface LanguagePhrasesModel {
  title: string;
  explanation: string;
  phrases: PhraseItem[];
  facts?: InfoItem[];
  category?: string; // Category of phrases (e.g., "Greetings", "Travel")
  culturalNotes?: string; // Cultural context for these phrases
}

/**
 * Models for matching pairs exercises
 */
export interface MatchingPair {
  id: string;
  foreignText: string;
  nativeText: string;
  audioUrl?: string; // Audio for the foreign text
  imageUrl?: string; // Optional illustrative image
  hint?: string; // Optional hint
}

export interface MatchingPairsModel {
  title: string;
  pairs: MatchingPair[];
  facts?: InfoItem[];
  instructions?: string; // Specific instructions for this exercise
  category?: string; // Category of the matching pairs
  timeLimit?: number; // Time limit in seconds (0 for unlimited)
}

/**
 * Models for conversation exercises
 */
export interface Speaker {
  id: string;
  name: string;
  avatar: string;
  role?: string; // Role in the conversation (e.g., "Native speaker", "Tourist")
  languageLevel?: string; // Speaker's proficiency level
}

export interface MissingWord {
  placeholder: string;
  correctAnswer: string;
  alternatives?: string[]; // Alternative correct answers
  hint?: string; // Hint for this specific word
}

export interface ConversationItem {
  id: string;
  speaker: Speaker;
  message: string;
  translation?: string;
  audioURL?: string;
  missingWord?: MissingWord;
  emotion?: string; // Speaker's emotion for this message
  delay?: number; // Delay before showing this message (in ms)
}

export interface ConversationModel {
  title: string;
  conversations: ConversationItem[];
  options: string[];
  facts?: InfoItem[];
  context?: string; // Setting of the conversation
  category?: string; // Type of conversation (e.g., "At restaurant", "Shopping")
  difficulty?: DifficultyLevel; // Conversation difficulty
  culturalNotes?: string; // Cultural context
}

/**
 * Model for lesson completion screens
 */
export interface CompletedModel {
  completionMessage: string;
  learnedVocabulary: { word: string; translation: string }[];
  score?: number; // User's score for this lesson
  correctAnswers?: number; // Number of correct answers
  totalQuestions?: number; // Total number of questions
  timeSpent?: number; // Time spent in minutes
  nextLessonId?: string; // ID of recommended next lesson
  awards?: string[]; // Achievements unlocked
  xpEarned?: number; // Experience points earned
}

/**
 * Model for conversation practice
 */
export interface PracticeConversationModel {
  conversationText: string;
  translations: string;
  facts?: InfoItem[];
  speakers?: Speaker[]; // Participants in the conversation
  context?: string; // Setting/context
  difficulty?: DifficultyLevel; // Conversation difficulty
  audioUrls?: string[]; // Audio files for different parts
}

/**
 * Card item for matching games
 */
export interface CardItem {
  id: string;
  text: string;
  pairId: string;
  isLeftSide: boolean;
  imageUrl?: string; // Card image
  audioUrl?: string; // Card audio
  hint?: string; // Hint for this card
}

/**
 * New: Model for pronunciation practice
 */
export interface PronunciationPracticeModel {
  text: string; // Text to pronounce
  audioUrl: string; // Reference audio
  phonetics?: string; // Phonetic transcription (IPA)
  tips?: string[]; // Pronunciation tips
  imageUrl?: string; // Illustrative image
  difficulty?: DifficultyLevel;
  wordBreakdown?: { segment: string; emphasis: boolean }[]; // Word syllables with emphasis
  facts?: InfoItem[];
}

/**
 * New: Model for grammar explanations
 */
export interface GrammarExplanationModel {
  title: string;
  explanation: string;
  examples: { text: string; translation: string }[];
  rules?: string[]; // Key grammar rules
  exercises?: { question: string; answer: string }[]; // Practice exercises
  imageUrl?: string; // Illustrative diagram
  videoUrl?: string; // Explanatory video
  difficulty?: DifficultyLevel;
  relatedTopics?: string[]; // Related grammar topics
  facts?: InfoItem[];
}

/**
 * New: Model for vocabulary matching exercises
 */
export interface VocabularyMatchingModel {
  words: { word: string; definition: string; imageUrl?: string }[];
  instructions: string;
  timeLimit?: number; // Time limit in seconds
  difficulty?: DifficultyLevel;
  category?: string; // Vocabulary category
  facts?: InfoItem[];
}

/**
 * New: Model for audio comprehension exercises
 */
export interface AudioComprehensionModel {
  audioUrl: string; // Audio clip URL
  questions: { question: string; options: string[]; correctAnswer: string }[];
  transcript?: string; // Audio transcript
  translation?: string; // Transcript translation
  context?: string; // Context of the audio
  difficulty?: DifficultyLevel;
  speakerInfo?: Speaker;
  facts?: InfoItem[];
}

/**
 * New: Model for writing exercises
 */
export interface WritingExerciseModel {
  prompt: string; // Writing prompt
  minWords?: number; // Minimum word count
  maxWords?: number; // Maximum word count
  exampleAnswer?: string; // Example of a good answer
  rubric?: { criterion: string; description: string }[]; // Evaluation criteria
  resources?: { title: string; url: string }[]; // Helpful resources
  timeLimit?: number; // Time limit in minutes
  difficulty?: DifficultyLevel;
  facts?: InfoItem[];
}

/**
 * New: Model for video lessons
 */
export interface VideoLessonModel {
  title: string;
  videoUrl: string;
  description: string;
  transcript?: string; // Video transcript
  translations?: string; // Transcript translation
  questions?: { time: number; question: string; answer: string }[]; // Questions at specific timestamps
  keyPoints?: string[]; // Key points covered
  duration?: number; // Video duration in seconds
  difficulty?: DifficultyLevel;
  facts?: InfoItem[];
}

/**
 * New: Model for cultural insights
 */
export interface CulturalInsightModel {
  title: string;
  content: string;
  imageUrls?: string[]; // Illustrative images
  videoUrl?: string; // Related video
  relatedVocabulary?: { word: string; translation: string }[]; // Culture-specific terms
  quizQuestions?: {
    question: string;
    options: string[];
    correctAnswer: string;
  }[]; // Comprehension questions
  references?: { title: string; url: string }[]; // Information sources
  facts?: InfoItem[];
}

/**
 * New: Model for user progress tracking
 */
export interface UserProgressModel {
  userId: string;
  courseId: string;
  completedLessons: string[]; // IDs of completed lessons
  currentLessonId?: string; // Currently active lesson
  lastAccessDate: Date;
  totalXp: number; // Total experience points
  streakDays: number; // Consecutive days of activity
  achievements: string[]; // Unlocked achievements
  statistics: {
    correctAnswers: number;
    incorrectAnswers: number;
    timeSpent: number; // Total time spent in minutes
    lessonsCompleted: number;
  };
}

/**
 * Interface for content items in vocabulary exercises
 */
export interface ContentItem {
  id: string;
  text: string;
  translation?: string;
  _examples?: any[];
  imageUrl?: string;
  audioUrl?: string;
}

/**
 * Interface for tracking processing status
 */
export interface ProcessingStatus {
  isProcessing: boolean;
  message: string;
}

/**
 * Discriminated union for LearningStepData with all step types
 */
export type LearningStepData =
  | { type: StepType.ListenVocabulary; data: ListenVocabularyModel }
  | { type: StepType.FillInTheBlanks; data: FillInTheBlanksModel }
  | { type: StepType.TrueFalse; data: QuestionModel }
  | { type: StepType.LanguageQuestion; data: LanguageQuestionModel }
  | { type: StepType.SentenceCompletion; data: SentenceCompletionModel }
  | { type: StepType.WordOrdering; data: WordOrderingModel }
  | { type: StepType.LessonInformation; data: LessonInformationModel }
  | { type: StepType.LanguagePhrases; data: LanguagePhrasesModel }
  | { type: StepType.MatchingPairs; data: MatchingPairsModel }
  | { type: StepType.Completed; data: CompletedModel }
  | { type: StepType.FillInChat; data: ConversationModel }
  | { type: StepType.PronunciationPractice; data: PronunciationPracticeModel }
  | { type: StepType.GrammarExplanation; data: GrammarExplanationModel }
  | { type: StepType.VocabularyMatching; data: VocabularyMatchingModel }
  | { type: StepType.AudioComprehension; data: AudioComprehensionModel }
  | { type: StepType.WritingExercise; data: WritingExerciseModel }
  | { type: StepType.VideoLesson; data: VideoLessonModel }
  | { type: StepType.CulturalInsight; data: CulturalInsightModel };

/**
 * Typed version of the LearningStep interface
 */
export interface LearningStepTyped {
  id: string;
  type: StepType;
  data: LearningStepData;
  order?: number;
  isOptional?: boolean;
  completed?: boolean;
}
