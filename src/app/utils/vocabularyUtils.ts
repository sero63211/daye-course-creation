// vocabularyUtils.ts
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

export const normalizeText = (text: string = ""): string => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

export const processVocabularyData = (
  jsonData: Record<string, any>,
  sourceLanguage: string
): VocabularyItem[] => {
  const vocabularyItems: VocabularyItem[] = [];
  const normalizedSourceLang = sourceLanguage.toLowerCase().trim();
  Object.entries(jsonData).forEach(([key, value]) => {
    if (!key.startsWith("vocabulary_")) return;
    const keyParts = key.split("_");
    if (keyParts.length >= 3) {
      const langPart = keyParts[keyParts.length - 1];
      const languages = langPart.split("-");
      if (languages.length === 2) {
        const keySource = languages[0].toLowerCase();
        if (keySource === normalizedSourceLang) {
          vocabularyItems.push({
            id: value.id || key,
            word: value.word || "",
            translation: value.translation || "",
            synonym: value.synonym || [],
            topic: value.topic || "General",
            audioURL: value.audioURL,
            imageURL: value.imageURL,
          });
        }
      }
    }
  });
  console.log(
    `Processed ${vocabularyItems.length} items for ${sourceLanguage}`
  );
  return vocabularyItems;
};

export const fetchVocabularyData = async (
  languageKey: string
): Promise<Record<string, any>> => {
  console.log(`fetchVocabularyData called for language: ${languageKey}`);
  if (!languageKey || languageKey === "unbekannt") {
    console.log("No valid language key or 'unbekannt', returning empty data");
    return {};
  }
  let normalizedKey = languageKey.toLowerCase().trim();
  if (normalizedKey === "kurdish") {
    normalizedKey = "kurmanji";
  }
  try {
    console.log(`Fetching from: /assets/vocabulary-list-${normalizedKey}.json`);
    const response = await fetch(
      `/assets/vocabulary-list-${normalizedKey}.json`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
      }
    );
    if (response.ok) {
      const jsonData = await response.json();
      console.log(`Successfully loaded vocabulary data for ${normalizedKey}`);
      return jsonData.data || jsonData;
    } else {
      console.log(
        `No vocabulary file found for ${normalizedKey}, returning empty data`
      );
      return {};
    }
  } catch (error) {
    console.log(
      `Error loading vocabulary for ${normalizedKey}, returning empty data:`,
      error
    );
    return {};
  }
};

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

export const useVocabulary = (languageKey: string) => {
  console.log("useVocabulary hook called with language:", languageKey);
  const [groupedItems, setGroupedItems] = useState<
    Record<string, VocabularyItem[]>
  >({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [allItems, setAllItems] = useState<VocabularyItem[]>([]);
  const processedLanguageKey = languageKey
    ? languageKey.toLowerCase().trim()
    : "";
  useEffect(() => {
    if (!processedLanguageKey || processedLanguageKey === "unbekannt") {
      console.log("No valid language key, skipping data fetch");
      setGroupedItems({});
      setAllItems([]);
      setIsLoading(false);
      setError(null);
      return;
    }
    const loadVocabulary = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log(`Loading vocabulary data for ${processedLanguageKey}`);
        const jsonData = await fetchVocabularyData(processedLanguageKey);
        if (jsonData && Object.keys(jsonData).length > 0) {
          const vocabularyItems = processVocabularyData(
            jsonData,
            processedLanguageKey
          );
          setAllItems(vocabularyItems);
          const grouped: Record<string, VocabularyItem[]> = {};
          vocabularyItems.forEach((item) => {
            const topic = item.topic;
            if (!grouped[topic]) {
              grouped[topic] = [];
            }
            grouped[topic].push(item);
          });
          setGroupedItems(grouped);
          console.log(
            `Processed ${vocabularyItems.length} vocabulary items into ${
              Object.keys(grouped).length
            } topics`
          );
          if (vocabularyItems.length === 0) {
            console.log(
              "No vocabulary items found for the specified languages"
            );
          }
        } else {
          setError("Keine Vokabeldaten gefunden");
          setGroupedItems({});
          setAllItems([]);
        }
        setIsLoading(false);
      } catch (err: any) {
        console.error(
          `Error loading vocabulary for ${processedLanguageKey}:`,
          err
        );
        setError(`Error loading vocabulary data: ${err.message}`);
        setGroupedItems({});
        setAllItems([]);
        setIsLoading(false);
      }
    };
    loadVocabulary();
  }, [processedLanguageKey]);
  return { groupedItems, allItems, isLoading, error };
};
