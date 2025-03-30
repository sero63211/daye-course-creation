import React, { useCallback, useMemo, useEffect, useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import { ContentItem } from "../types/model";

interface ContentItemSelectorProps {
  orderedItems: ContentItem[];
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  processingStatus: { isProcessing: boolean; message: string };
  allowedContentTypes?: string[];
  title?: string;
  description?: string;
}

const ContentItemSelector: React.FC<ContentItemSelectorProps> = ({
  orderedItems,
  selectedIds,
  setSelectedIds,
  processingStatus,
  allowedContentTypes = ["vocabulary", "sentence", "information"],
  title = "Wähle einen Inhalt aus",
  description = "Klicke auf ein Element, um es auszuwählen.",
}) => {
  const selectItem = useCallback(
    (id: string) => {
      setSelectedIds([id]);
    },
    [setSelectedIds]
  );

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

  const filteredItems = useMemo(() => {
    if (!allowedContentTypes || allowedContentTypes.length === 0) {
      return orderedItems;
    }
    return orderedItems.filter((item) => {
      const itemType = item.type;
      const itemContentType = item.contentType;
      if (itemContentType && allowedContentTypes.includes(itemContentType)) {
        return true;
      }
      if (itemType && allowedContentTypes.includes(itemType)) {
        return true;
      }
      return false;
    });
  }, [orderedItems, allowedContentTypes]);

  const renderItemContent = (item: ContentItem) => {
    const examples = getProcessedExamples(item);
    return (
      <div className="flex items-center">
        {/* Image first (if exists) */}
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt={item.text || "Bild"}
            className="h-12 w-12 object-cover rounded flex-shrink-0 mr-3"
          />
        )}

        {/* Text content */}
        <div className="flex-grow overflow-hidden">
          {item.title && (
            <h3 className="font-bold text-sm text-black truncate">
              {item.title}
            </h3>
          )}

          {item.text && (
            <p className="text-black text-xs truncate">{item.text}</p>
          )}

          {item.translation && (
            <p className="text-gray-600 text-xs italic truncate">
              {item.translation}
            </p>
          )}

          {/* Audio icon instead of full player */}
          {item.audioUrl && (
            <span className="text-blue-500 text-xs inline-flex items-center mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
              </svg>
              <span className="ml-1">Audio verfügbar</span>
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-4">
      <div className="px-4 py-2 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-black">{title}</h2>
        <p className="text-xs text-gray-600">{description}</p>
      </div>

      {processingStatus.isProcessing ? (
        <div className="text-center py-3 text-gray-600">
          {processingStatus.message}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-3 text-gray-600">
          Keine passenden Inhalte verfügbar
        </div>
      ) : (
        <div className="p-2 max-h-60 overflow-y-auto">
          <div className="grid grid-cols-1 gap-2">
            {filteredItems.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`
                    border rounded overflow-hidden cursor-pointer transition-colors
                    ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }
                  `}
                  onClick={() => selectItem(item.id)}
                >
                  <div className="p-2">
                    <div className="flex items-center">
                      {isSelected && (
                        <CheckCircle2
                          className="text-blue-500 mr-2 flex-shrink-0"
                          size={16}
                        />
                      )}
                      <div className="flex-grow">{renderItemContent(item)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

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
