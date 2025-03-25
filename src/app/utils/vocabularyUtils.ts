import { useState, useEffect } from "react";

export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  synonym: string[];
  topic: string;
  audioURL?: string;
  imageURL?: string;
}

// Überprüfe, ob die Datei existiert
const checkFileExists = async (path: string): Promise<boolean> => {
  try {
    // Im Browser kann man nicht direkt prüfen, ob eine Datei existiert
    // Daher verwenden wir einen HEAD-Request
    const response = await fetch(path, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    return false;
  }
};

export const fetchVocabularyData = async (
  languageKey: string
): Promise<Record<string, any>> => {
  console.log(`📚 fetchVocabularyData called for language: ${languageKey}`);

  // If no language key or "unbekannt", return empty data without error
  if (!languageKey || languageKey === "unbekannt") {
    console.log(
      "📚 No valid language key or 'unbekannt', returning empty data"
    );
    return { data: {} };
  }

  // Normalize language key (lowercase and remove whitespace)
  const normalizedKey = languageKey.toLowerCase().trim();

  try {
    // Try to fetch from public/assets directory
    const response = await fetch(
      `/assets/vocabulary-list-${normalizedKey}.json`,
      {
        method: "GET",
        // Don't throw an error for 404
        headers: { Accept: "application/json" },
      }
    );

    if (response.ok) {
      const jsonData = await response.json();
      console.log(`📚 Successfully loaded vocabulary for ${normalizedKey}`);
      return jsonData;
    } else {
      console.log(
        `📚 No vocabulary file found for ${normalizedKey}, returning empty data`
      );
      return { data: {} };
    }
  } catch (error) {
    console.log(
      `📚 Error loading vocabulary for ${normalizedKey}, returning empty data:`,
      error
    );
    return { data: {} };
  }
};

export const useVocabulary = (
  languageKey: string,
  targetLanguage = "german"
) => {
  console.log("📚 useVocabulary hook called with language:", languageKey);
  console.log("📚 Target language for interface:", targetLanguage);

  const [groupedItems, setGroupedItems] = useState<
    Record<string, VocabularyItem[]>
  >({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Process language key to make it usable
  const processedLanguageKey = languageKey
    ? languageKey.toLowerCase().trim()
    : "";

  // Only attempt to fetch data if we have a valid language key
  useEffect(() => {
    if (!processedLanguageKey || processedLanguageKey === "unbekannt") {
      console.log("📚 No valid language key, skipping data fetch");
      setGroupedItems({});
      setIsLoading(false);
      setError(null);
      return;
    }

    const loadVocabulary = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Determine which vocabulary file to load based on target language
        const fileLanguageKey = `${targetLanguage}-${processedLanguageKey}`;
        console.log(`📚 Loading vocabulary data for ${fileLanguageKey}`);

        const jsonData = await fetchVocabularyData(processedLanguageKey);

        // Process the data
        if (jsonData && jsonData.data) {
          const vocabularyItems: VocabularyItem[] = [];

          // Extract vocabulary items from the JSON data
          Object.entries(jsonData.data).forEach(
            ([key, value]: [string, any]) => {
              // Only include items that match our target language pattern
              if (key.includes(`${targetLanguage}-${processedLanguageKey}`)) {
                vocabularyItems.push({
                  id: value.id || key,
                  word: value.word || "",
                  translation: value.translation || "",
                  synonym: value.synonym || [],
                  topic: value.topic || "Allgemein",
                  audioURL: value.audioURL,
                  imageURL: value.imageURL,
                });
              }
            }
          );

          // Group by topic
          const grouped: Record<string, VocabularyItem[]> = {};
          vocabularyItems.forEach((item) => {
            const topic = item.topic;
            if (!grouped[topic]) {
              grouped[topic] = [];
            }
            grouped[topic].push(item);
          });

          setGroupedItems(grouped);
        } else {
          setError("Invalid vocabulary data format");
        }

        setIsLoading(false);
      } catch (err) {
        console.error(
          `📚 Error loading vocabulary for ${processedLanguageKey}:`,
          err
        );
        setError(`Error loading vocabulary data: ${err.message}`);
        setGroupedItems({}); // Clear any previous data
        setIsLoading(false);
      }
    };

    loadVocabulary();
  }, [processedLanguageKey, targetLanguage]);

  return { groupedItems, isLoading, error };
};
