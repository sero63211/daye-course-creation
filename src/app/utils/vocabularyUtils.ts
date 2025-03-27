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
  selectedLanguage: string
): VocabularyItem[] => {
  const vocabularyItems: VocabularyItem[] = [];
  const normalizedSelectedLang = selectedLanguage.toLowerCase().trim();

  let regex: RegExp;
  if (
    normalizedSelectedLang === "kurmanji" ||
    normalizedSelectedLang === "kurdish"
  ) {
    regex = /\(kurmanji\)$/i;
  } else {
    regex = new RegExp(`_${normalizedSelectedLang}-`, "i");
  }

  const filteredKeys = Object.keys(jsonData).filter((key) => regex.test(key));
  console.log(
    `[processVocabularyData] Quick filtered to ${filteredKeys.length} items for ${selectedLanguage} using regex: ${regex}`
  );

  filteredKeys.forEach((key) => {
    const value = jsonData[key];
    vocabularyItems.push({
      id: value.id || key,
      word: value.word || "",
      translation: value.translation || "",
      synonym: value.synonym || [],
      topic: value.topic || "General",
      audioURL: value.audioURL,
      imageURL: value.imageURL,
    });
  });

  console.log(
    `[processVocabularyData] Processed ${vocabularyItems.length} items for ${selectedLanguage}`
  );
  return vocabularyItems;
};

export const fetchVocabularyData = async (
  languageKey: string
): Promise<Record<string, any>> => {
  console.log("[fetchVocabularyData] called for language:", languageKey);
  if (!languageKey || languageKey === "unbekannt") {
    return {};
  }
  let normalizedKey = languageKey.toLowerCase().trim();
  if (normalizedKey === "kurdish") {
    normalizedKey = "kurmanji";
  }
  try {
    console.log(
      `[fetchVocabularyData] Fetching from: /assets/vocabulary-list-${normalizedKey}.json`
    );
    const response = await fetch(
      `/assets/vocabulary-list-${normalizedKey}.json`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
      }
    );
    if (response.ok) {
      const jsonData = await response.json();
      console.log(`[fetchVocabularyData] Successfully loaded data`);
      return jsonData.data || jsonData;
    } else {
      console.log(
        `[fetchVocabularyData] No vocabulary file found, returning empty data`
      );
      return {};
    }
  } catch (error) {
    console.log(`[fetchVocabularyData] Error loading vocabulary:`, error);
    return {};
  }
};

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  return debouncedValue;
};

export const useVocabulary = (
  fileLanguage: string,
  selectedLanguage: string
) => {
  const [groupedItems, setGroupedItems] = useState<
    Record<string, VocabularyItem[]>
  >({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [allItems, setAllItems] = useState<VocabularyItem[]>([]);
  const processedFileLanguage = fileLanguage
    ? fileLanguage.toLowerCase().trim()
    : "";

  useEffect(() => {
    if (!processedFileLanguage || processedFileLanguage === "unbekannt") {
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
        console.log(
          `[useVocabulary] Loading vocabulary data for ${processedFileLanguage}`
        );
        const jsonData = await fetchVocabularyData(processedFileLanguage);
        if (jsonData && Object.keys(jsonData).length > 0) {
          const vocabularyItems = processVocabularyData(
            jsonData,
            selectedLanguage
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
            `[useVocabulary] Processed ${vocabularyItems.length} items into ${
              Object.keys(grouped).length
            } topics`
          );
          if (vocabularyItems.length === 0) {
            console.log("[useVocabulary] No vocabulary items found");
          }
        } else {
          setError("Keine Vokabeldaten gefunden");
          setGroupedItems({});
          setAllItems([]);
        }
        setIsLoading(false);
      } catch (err: any) {
        console.error(`[useVocabulary] Error:`, err);
        setError(`Error loading vocabulary data: ${err.message}`);
        setGroupedItems({});
        setAllItems([]);
        setIsLoading(false);
      }
    };
    loadVocabulary();
  }, [processedFileLanguage, selectedLanguage]);
  return { groupedItems, allItems, isLoading, error };
};
