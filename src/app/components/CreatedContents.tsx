"use client";
import React from "react";

interface Example {
  text: string;
  translation: string;
}

export interface EnhancedContentItem {
  id: string;
  text: string;
  translation?: string;
  examples?: Example[];
}

interface CreatedContentsProps {
  contentItems: EnhancedContentItem[];
  onRemoveItem: (id: string) => void;
}

const CreatedContents: React.FC<CreatedContentsProps> = ({
  contentItems,
  onRemoveItem,
}) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 cursor-pointer">
        Erstellte Inhalte
      </h2>
      {contentItems.length === 0 ? (
        <p className="text-gray-500 italic cursor-pointer">
          Noch keine Inhalte hinzugefügt.
        </p>
      ) : (
        <ul className="space-y-4">
          {contentItems.map((item) => (
            <li
              key={item.id}
              className="relative p-3 bg-gray-50 dark:bg-gray-800 rounded cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">Text: {item.text}</div>
                  {item.translation && (
                    <div className="text-gray-600">
                      Übersetzung: {item.translation}
                    </div>
                  )}
                  {item.examples && item.examples.length > 0 && (
                    <div className="mt-2">
                      <strong>Beispielsätze:</strong>
                      <ul className="list-disc ml-4">
                        {item.examples.map((ex, idx) => (
                          <li key={idx} className="text-sm">
                            {ex.text} – {ex.translation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="ml-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
                  title="Item entfernen"
                >
                  X
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CreatedContents;
