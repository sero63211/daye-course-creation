"use client";
import React, { useEffect } from "react";
import { Volume2, Upload } from "lucide-react";
import TableContent from "./TableContent";

// EnhancedContentItem Interface based on provided definition
interface EnhancedContentItem {
  id: string;
  uniqueId: string;
  text: string;
  translation?: string;
  description?: string;
  instructionText?: string;
  title?: string;
  imageUrl?: string;
  audioUrl?: string;
  soundFileName?: string;
  examples?: {
    text: string;
    translation: string;
  }[];
  facts?: {
    id: string;
    term: string;
    definition: string;
    usage: string;
    pronunciation: string;
  }[];
  contentType?: string;
  type?: string;
}

interface CreatedContentDisplayProps {
  contentItems: EnhancedContentItem[];
  onRemoveItem: (uniqueId: string) => void;
  onImageSelect: (itemId: string) => void;
  onAudioSelect: (itemId: string) => void;
  audioPlaying: string | null;
  onAudioPlay: (itemId: string, audioUrl: string) => void;
}

const CreatedContentDisplay: React.FC<CreatedContentDisplayProps> = ({
  contentItems,
  onRemoveItem,
  onImageSelect,
  onAudioSelect,
  audioPlaying,
  onAudioPlay,
}) => {
  // Log when component receives new props - check if tables exist
  useEffect(() => {
    console.log("DISPLAY-COMPARE: Content items received:", contentItems);

    // Check if there are any table items
    const tableItems = contentItems.filter(
      (item) => item.type === "table" || item.contentType === "table"
    );

    // Count items by type
    const typeCounts = contentItems.reduce((counts, item) => {
      const type = item.contentType || item.type || "unknown";
      counts[type] = (counts[type] || 0) + 1;
      return counts;
    }, {});

    console.log("DISPLAY-COMPARE: Items by type:", typeCounts);
    console.log(
      "DISPLAY-COMPARE: Table items found:",
      tableItems.length,
      tableItems
    );
  }, [contentItems]);

  // Helper functions for styling based on content type
  const getBorderColorByType = (type?: string, contentType?: string) => {
    // First check the specific contentType
    if (contentType) {
      switch (contentType) {
        case "vocabulary":
          return "border-green-200";
        case "sentence":
          return "border-blue-200";
        case "information":
          return "border-purple-200";
        case "table":
          return "border-yellow-200";
        default:
          break;
      }
    }

    // Fall back to type if contentType is not set
    switch (type) {
      case "vocabulary":
        return "border-green-200";
      case "sentence":
        return "border-blue-200";
      case "information":
        return "border-purple-200";
      case "table":
        return "border-yellow-200";
      default:
        return "border-gray-200";
    }
  };

  const getTagColorByType = (type?: string, contentType?: string) => {
    // First check the specific contentType
    if (contentType) {
      switch (contentType) {
        case "vocabulary":
          return "bg-green-100 text-green-800";
        case "sentence":
          return "bg-blue-100 text-blue-800";
        case "information":
          return "bg-purple-100 text-purple-800";
        case "table":
          return "bg-yellow-100 text-yellow-800";
        default:
          break;
      }
    }

    // Fall back to type if contentType is not set
    switch (type) {
      case "vocabulary":
        return "bg-green-100 text-green-800";
      case "sentence":
        return "bg-blue-100 text-blue-800";
      case "information":
        return "bg-purple-100 text-purple-800";
      case "table":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get display name for content type
  const getContentTypeDisplayName = (type?: string, contentType?: string) => {
    // First check the specific contentType
    if (contentType) {
      switch (contentType) {
        case "vocabulary":
          return "Vokabel";
        case "sentence":
          return "Satz";
        case "information":
          return "Erklärung";
        case "table":
          return "Tabelle";
        default:
          break;
      }
    }

    // Fall back to type if contentType is not set
    switch (type) {
      case "vocabulary":
        return "Vokabel";
      case "sentence":
        return "Satz";
      case "information":
        return "Erklärung";
      case "table":
        return "Tabelle";
      default:
        return "Inhalt";
    }
  };

  // Helper function to check content types
  const isExplanation = (item: EnhancedContentItem) => {
    return (
      (item.contentType === "information" || item.type === "information") &&
      !(
        item.contentType === "vocabulary" ||
        item.type === "vocabulary" ||
        item.contentType === "sentence" ||
        item.type === "sentence" ||
        item.contentType === "table" ||
        item.type === "table"
      )
    );
  };

  const isTable = (item: EnhancedContentItem) => {
    const result = item.contentType === "table" || item.type === "table";
    console.log(
      `DISPLAY-COMPARE: isTable check for ${item.uniqueId} (type=${item.type}, contentType=${item.contentType}): ${result}`
    );
    return result;
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-black mb-4">Erstellte Inhalte</h2>
      {contentItems.length === 0 ? (
        <div className="text-center py-12 text-black">
          <div className="text-4xl mb-2">📝</div>
          <p>Noch keine Inhalte erstellt</p>
          <p className="text-sm mt-2">
            Beginne damit, Vokabeln, Sätze, Tabellen oder Erklärungstexte im
            linken Bereich hinzuzufügen
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto pr-2">
          {contentItems.map((item) => {
            console.log(
              `DISPLAY-COMPARE: Rendering item ${item.uniqueId}, type=${item.type}, contentType=${item.contentType}`
            );
            return (
              <div
                key={item.uniqueId}
                className={`border ${getBorderColorByType(
                  item.type,
                  item.contentType
                )} rounded-lg p-4 hover:shadow-sm transition-shadow`}
              >
                <div className="flex justify-between">
                  <div className="w-full">
                    <div className="flex items-center mb-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getTagColorByType(
                          item.type,
                          item.contentType
                        )} mr-2`}
                      >
                        {getContentTypeDisplayName(item.type, item.contentType)}
                      </span>

                      {/* Display appropriate content based on type */}
                      {!isTable(item) && (
                        <h3 className="font-medium text-lg text-black">
                          {item.text}
                        </h3>
                      )}
                    </div>

                    {/* Show translation for non-table items */}
                    {!isTable(item) && item.translation && (
                      <p className="text-black mt-1">{item.translation}</p>
                    )}

                    {/* Display table content for table items */}
                    {isTable(item) && (
                      <>
                        {console.log(
                          `DISPLAY-COMPARE: About to render TableContent for ${item.uniqueId}`
                        )}
                        <TableContent item={item} />
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.uniqueId)}
                    className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
                  >
                    Löschen
                  </button>
                </div>

                {/* Beispiele - nur für nicht-Tabellen */}
                {!isTable(item) &&
                  item.examples &&
                  item.examples.length > 0 && (
                    <div className="mt-2 bg-gray-50 p-2 rounded">
                      <p className="text-sm font-medium text-black">
                        Beispiele:
                      </p>
                      <ul className="text-sm">
                        {item.examples.map((example, idx) => (
                          <li key={idx} className="mt-1">
                            <span className="text-black">{example.text}</span>
                            <span className="text-black">
                              {" "}
                              - {example.translation}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Media Controls - Only show for vocabulary and sentences, not for explanations or tables */}
                {!isExplanation(item) && !isTable(item) && (
                  <div className="mt-3 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => onImageSelect(item.uniqueId)}
                        className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-black"
                      >
                        <Upload size={16} className="mr-1" />
                        <span>
                          {item.imageUrl && item.imageUrl.trim() !== ""
                            ? "Bild ändern"
                            : "Bild hinzufügen"}
                        </span>
                      </button>

                      <button
                        onClick={() => onAudioSelect(item.uniqueId)}
                        className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-black"
                      >
                        <Volume2 size={16} className="mr-1" />
                        <span>
                          {item.audioUrl && item.audioUrl.trim() !== ""
                            ? "Audio ändern"
                            : "Audio hinzufügen"}
                        </span>
                      </button>
                    </div>

                    {/* Bildvorschau */}
                    {item.imageUrl && item.imageUrl.trim() !== "" && (
                      <div className="mt-2 relative">
                        <div className="text-xs font-medium text-black mb-1">
                          Bildvorschau:
                        </div>
                        <img
                          src={item.imageUrl}
                          alt={item.text}
                          className="rounded-md max-h-24 object-cover border border-gray-200"
                        />
                      </div>
                    )}

                    {/* Audio-Player */}
                    {item.audioUrl && item.audioUrl.trim() !== "" && (
                      <div className="mt-2">
                        <div className="text-xs font-medium text-black mb-1">
                          Audio: {item.soundFileName || "Aufnahme"}
                        </div>

                        <audio
                          src={item.audioUrl}
                          controls
                          className="mt-2 w-full"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CreatedContentDisplay;
