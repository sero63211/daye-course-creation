// types/ContentTypes.ts
export interface EnhancedContentItem {
  // Identification
  id: string;
  uniqueId: string;

  // Basic text data for all exercise types
  text: string; // Main text/vocabulary/question/sentence
  translation?: string; // Translation/answer/definition

  // Extended content
  description?: string; // Longer description/explanation (for LessonInformation.mainText)
  instructionText?: string; // Instruction (for SentenceCompletion, WordOrdering)
  title?: string; // Title (for LessonInformation, LanguagePhrases, MatchingPairs)
  explanation?: string; // Explanation text (for LanguagePhrases)

  // Media
  imageUrl?: string; // Image URL for all exercise types
  audioUrl?: string; // Audio URL
  soundFileName?: string; // Name of the audio file

  // Additional information
  examples?: {
    // Example sentences with translation
    text: string;
    translation: string;
  }[];

  // Special content data for different exercise types
  facts?: {
    // Additional information (for all exercise types)
    id: string;
    term: string;
    definition: string;
    usage: string;
    pronunciation: string;
  }[];

  // Flags for content type determination
  contentType?:
    | "vocabulary"
    | "phrase"
    | "sentence"
    | "conversation"
    | "information";

  // For MatchingPairs
  isPair?: boolean; // Indicates that this element is part of a pair
  pairId?: string; // ID of the associated pair

  // For SentenceCompletion
  sentenceParts?: string[]; // Parts of a sentence
  correctAnswer?: string; // Correct answer

  // For FillInTheBlanks and LanguageQuestion
  options?: string[]; // Answer options

  // For WordOrdering
  wordOptions?: string[]; // Words to order
  correctSentence?: string; // Correct sentence order

  // For TrueFalse
  isTrueStatement?: boolean; // Is the statement true?

  // For LanguagePhrases
  phrases?: {
    foreignText: string;
    nativeText: string;
    nativePrefixText?: string;
  }[];

  // For Conversation/FillInChat
  conversations?: {
    speakerName: string;
    speakerAvatar?: string;
    message: string;
    translation?: string;
    audioURL?: string;
    hasMissingWord?: boolean;
    missingWord?: string;
  }[];

  // For UI integration
  type?: string; // Content type for UI display
}
