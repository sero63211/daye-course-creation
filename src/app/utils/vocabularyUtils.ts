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

  // Wenn die Sprache "unbekannt" ist, geben wir leere Daten zurück
  if (languageKey === "unbekannt") {
    console.log("📚 'unbekannt' language detected, returning empty data");
    return { data: {} };
  }

  // Check if language key is valid
  if (!languageKey || languageKey.trim() === "") {
    throw new Error("No valid language key provided");
  }

  // Normalize language key (lowercase and remove whitespace)
  const normalizedKey = languageKey.toLowerCase().trim();

  try {
    // Versuche zuerst, die Datei zu importieren
    let vocabularyData;

    try {
      // Vorsichtiger dynamischer Import mit einem Try-Catch-Block
      vocabularyData = await import(
        `/assets/vocabulary-list-${normalizedKey}.json`
      );
    } catch (importError) {
      console.log(`📚 Import error, trying alternative path: ${importError}`);

      try {
        // Alternativer Pfad
        vocabularyData = await import(
          `../assets/vocabulary-list-${normalizedKey}.json`
        );
      } catch (alternativeImportError) {
        console.log(`📚 Alternative import error: ${alternativeImportError}`);

        // Versuche einen absoluten Pfad
        try {
          vocabularyData = await import(
            `/src/app/assets/vocabulary-list-${normalizedKey}.json`
          );
        } catch (absoluteImportError) {
          console.log(`📚 Absolute import error: ${absoluteImportError}`);

          // Als letzten Ausweg versuche, die Datei über fetch zu laden
          const publicPath = `/vocabulary-list-${normalizedKey}.json`;
          if (await checkFileExists(publicPath)) {
            const response = await fetch(publicPath);
            vocabularyData = await response.json();
          } else {
            throw new Error(
              `Vocabulary file not found for language: ${normalizedKey}`
            );
          }
        }
      }
    }

    const jsonData = vocabularyData.default || vocabularyData;
    console.log("📚 JSON data imported successfully");
    return jsonData;
  } catch (error) {
    console.error(
      `📚 Error loading vocabulary data for ${normalizedKey}:`,
      error
    );

    // Für "unbekannt" und andere Fehler einfach leere Daten zurückgeben
    if (normalizedKey === "unbekannt") {
      return { data: {} };
    }

    // Bei anderen Sprachen einen Fehler werfen
    throw new Error(
      `Failed to load vocabulary data for ${languageKey}. Make sure the vocabulary file exists.`
    );
  }
};

// Hook for using vocabulary data
export const useVocabulary = (languageKey: string) => {
  console.log("📚 useVocabulary hook called with language:", languageKey);

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
    if (!processedLanguageKey) {
      console.log("📚 No language key provided, skipping data fetch");
      setGroupedItems({});
      setIsLoading(false);
      return;
    }

    // Spezialfall für "unbekannt" - überspringe das Laden und gib leere Daten zurück
    if (processedLanguageKey === "unbekannt") {
      console.log("📚 'unbekannt' language detected, skipping fetch");
      setGroupedItems({});
      setIsLoading(false);
      setError(null);
      return;
    }

    const loadVocabulary = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log(`📚 Loading vocabulary data for ${processedLanguageKey}`);
        const jsonData = await fetchVocabularyData(processedLanguageKey);

        // Process the data
        if (jsonData && jsonData.data) {
          const vocabularyItems: VocabularyItem[] = [];

          // Extract vocabulary items from the JSON data
          Object.entries(jsonData.data).forEach(
            ([key, value]: [string, any]) => {
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
  }, [processedLanguageKey]);

  return { groupedItems, isLoading, error };
};
