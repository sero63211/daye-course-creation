// components/CreatedContentDisplay.tsx
import React from "react";
import { EnhancedContentItem } from "../types/ContentTypes";
import { Volume2, Upload, Play, Pause } from "lucide-react";

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
  // Helper functions for styling based on content type
  const getBorderColorByType = (type?: string) => {
    switch (type) {
      case "vocabulary":
        return "border-green-200";
      case "sentence":
        return "border-blue-200";
      case "explanation":
        return "border-purple-200";
      default:
        return "border-gray-200";
    }
  };

  const getTagColorByType = (type?: string) => {
    switch (type) {
      case "vocabulary":
        return "bg-green-100 text-green-800";
      case "sentence":
        return "bg-blue-100 text-blue-800";
      case "explanation":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get display name for content type
  const getContentTypeDisplayName = (type?: string) => {
    switch (type) {
      case "vocabulary":
        return "Vokabel";
      case "sentence":
        return "Satz";
      case "explanation":
        return "Erklärung";
      default:
        return "Inhalt";
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-black mb-4">Erstellte Inhalte</h2>
      {contentItems.length === 0 ? (
        <div className="text-center py-12 text-black">
          <div className="text-4xl mb-2">📝</div>
          <p>Noch keine Inhalte erstellt</p>
          <p className="text-sm mt-2">
            Beginne damit, Vokabeln, Sätze oder Erklärungstexte im linken
            Bereich hinzuzufügen
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto pr-2">
          {contentItems.map((item) => (
            <div
              key={item.uniqueId}
              className={`border ${getBorderColorByType(
                item.type
              )} rounded-lg p-4 hover:shadow-sm transition-shadow`}
            >
              <div className="flex justify-between">
                <div>
                  <div className="flex items-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getTagColorByType(
                        item.type
                      )} mr-2`}
                    >
                      {getContentTypeDisplayName(item.type)}
                    </span>
                    <h3 className="font-medium text-lg text-black">
                      {item.text}
                    </h3>
                  </div>
                  <p className="text-black mt-1">{item.translation}</p>
                </div>
                <button
                  onClick={() => onRemoveItem(item.uniqueId)}
                  className="text-red-500 hover:text-red-700"
                >
                  Löschen
                </button>
              </div>

              {/* Examples display */}
              {item.examples && item.examples.length > 0 && (
                <div className="mt-2 bg-gray-50 p-2 rounded">
                  <p className="text-sm font-medium text-black">Beispiele:</p>
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

              {/* Media controls */}
              <div className="mt-3 space-y-3">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onImageSelect(item.uniqueId)}
                    className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-black"
                  >
                    <Upload size={16} className="mr-1" />
                    <span>
                      {item.imageUrl ? "Bild ändern" : "Bild hinzufügen"}
                    </span>
                  </button>

                  <button
                    onClick={() => onAudioSelect(item.uniqueId)}
                    className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-black"
                  >
                    <Volume2 size={16} className="mr-1" />
                    <span>
                      {item.audioUrl ? "Audio ändern" : "Audio hinzufügen"}
                    </span>
                  </button>
                </div>

                {/* Image preview */}
                {item.imageUrl && (
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

                {/* Audio player */}
                {item.audioUrl && (
                  <div className="mt-2">
                    <div className="text-xs font-medium text-black mb-1">
                      Audio: {item.soundFileName || "Aufnahme"}
                    </div>
                    <button
                      onClick={() => onAudioPlay(item.uniqueId, item.audioUrl!)}
                      className="flex items-center px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200 text-black"
                    >
                      {audioPlaying === item.uniqueId ? (
                        <>
                          <Pause size={16} className="mr-1" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play size={16} className="mr-1" />
                          <span>Abspielen</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreatedContentDisplay;
