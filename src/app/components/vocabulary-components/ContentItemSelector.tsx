// vocabulary-components/ContentItemSelector.tsx
import React, { useCallback } from "react";
import { CheckCircle2 } from "lucide-react";
import { ContentItem, ProcessingStatus } from "../../types/model";

interface ContentItemSelectorProps {
  orderedItems: ContentItem[];
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  setOrderedItems: (items: ContentItem[]) => void;
  processingStatus: ProcessingStatus;
}

const ContentItemSelector: React.FC<ContentItemSelectorProps> = ({
  orderedItems,
  selectedIds,
  setSelectedIds,
  processingStatus,
}) => {
  // Completely new select function - sets only the clicked item
  const selectItem = useCallback(
    (id: string) => {
      setSelectedIds([id]);
    },
    [setSelectedIds]
  );

  // Process examples for display
  const getProcessedExamples = useCallback((item: ContentItem) => {
    if (
      !item._examples ||
      !Array.isArray(item._examples) ||
      item._examples.length === 0
    ) {
      return [];
    }

    try {
      return processExamples(item._examples);
    } catch (error) {
      console.error("Error processing examples:", error);
      return [];
    }
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg mb-6">
      <h2 className="text-xl font-bold text-center mb-4 text-black">
        Wähle eine Vokabel aus
      </h2>
      <p className="text-center mb-4 text-black">
        Klicke auf eine Karte, um sie auszuwählen.
      </p>

      {processingStatus.isProcessing ? (
        <div className="text-center py-4 text-black">
          {processingStatus.message}
        </div>
      ) : orderedItems.length === 0 ? (
        <div className="text-center py-4 text-black">
          Keine Inhalte verfügbar
        </div>
      ) : (
        <div className="space-y-4">
          {orderedItems.map((item) => {
            const examples = getProcessedExamples(item);
            const isSelected = selectedIds.includes(item.id);

            return (
              <div
                key={item.id}
                className={`
                  border-2 rounded-lg overflow-hidden cursor-pointer
                  ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }
                `}
                onClick={() => selectItem(item.id)}
              >
                <div className="p-4">
                  <div className="flex items-start">
                    {isSelected && (
                      <CheckCircle2
                        className="text-blue-500 mr-2 mt-1 flex-shrink-0"
                        size={20}
                      />
                    )}

                    <div className="flex-grow">
                      <h3 className="font-bold text-lg text-black">
                        {item.text}
                      </h3>
                      {item.translation && (
                        <p className="text-black text-sm">{item.translation}</p>
                      )}

                      {examples.length > 0 && (
                        <ul className="list-disc list-inside text-black text-sm mt-2">
                          {examples.slice(0, 3).map((ex, idx) => (
                            <li key={idx}>{ex}</li>
                          ))}
                          {examples.length > 3 && <li>...</li>}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Helper function to process examples
const processExamples = (examples: any[]): string[] => {
  if (!Array.isArray(examples) || examples.length === 0) return [];

  return examples
    .map((ex) => {
      if (typeof ex === "string") return ex;
      if (ex && typeof ex === "object") {
        if ("text" in ex) return ex.text;
        if ("translation" in ex) return ex.translation;
      }
      return "";
    })
    .filter(Boolean);
};

export default ContentItemSelector;
