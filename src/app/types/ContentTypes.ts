// Update your EnhancedContentItem interface to include table type
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
  title?: string; // Title (for LessonInformation)
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
  contentType?: "vocabulary" | "sentence" | "information" | "table"; // ADDED TABLE TYPE
  // For SentenceCompletion
  sentenceParts?: string[]; // Parts of a sentence
  correctAnswer?: string; // Correct answer
  // For exercises
  options?: string[]; // Answer options
  wordOptions?: string[]; // Words to order
  correctSentence?: string; // Correct sentence order
  isTrueStatement?: boolean; // Is the statement true?
  // For UI integration
  type?: string; // Content type for UI display
}
