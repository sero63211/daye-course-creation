// components/ExplanationForm.tsx
import React, { useState, useRef } from "react";
import { Bold, Italic, Underline } from "lucide-react";

interface ExplanationFormProps {
  newTitle: string;
  setNewTitle: (title: string) => void;
  newText: string;
  setNewText: (text: string) => void;
}

const ExplanationForm: React.FC<ExplanationFormProps> = ({
  newTitle,
  setNewTitle,
  newText,
  setNewText,
}) => {
  // State for text formatting
  const [selectedText, setSelectedText] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Text formatting handlers
  const handleTextSelect = () => {
    if (textAreaRef.current) {
      const start = textAreaRef.current.selectionStart;
      const end = textAreaRef.current.selectionEnd;
      if (start !== end) {
        setSelectedText({ start, end });
      } else {
        setSelectedText(null);
      }
    }
  };

  const applyFormatting = (format: "bold" | "italic" | "underline") => {
    if (!textAreaRef.current || !selectedText) return;

    const text = newText;
    const selectedContent = text.substring(
      selectedText.start,
      selectedText.end
    );
    let formattedText = "";

    switch (format) {
      case "bold":
        formattedText = `<b>${selectedContent}</b>`;
        break;
      case "italic":
        formattedText = `<i>${selectedContent}</i>`;
        break;
      case "underline":
        formattedText = `<u>${selectedContent}</u>`;
        break;
    }

    const newContent =
      text.substring(0, selectedText.start) +
      formattedText +
      text.substring(selectedText.end);

    setNewText(newContent);

    // Reset selection after formatting
    setSelectedText(null);
  };

  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-black mb-1">
          Überschrift
        </label>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="z.B. 'Grammatik: Der Plural'"
          className="text-black w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-black mb-1">
          Erklärungstext
        </label>
        <div className="flex space-x-2 mb-2">
          <button
            type="button"
            onClick={() => applyFormatting("bold")}
            disabled={!selectedText}
            className={`p-1.5 rounded-md ${
              selectedText
                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                : "bg-gray-100 text-gray-400"
            }`}
            title="Fett"
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            onClick={() => applyFormatting("italic")}
            disabled={!selectedText}
            className={`p-1.5 rounded-md ${
              selectedText
                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                : "bg-gray-100 text-gray-400"
            }`}
            title="Kursiv"
          >
            <Italic size={16} />
          </button>
          <button
            type="button"
            onClick={() => applyFormatting("underline")}
            disabled={!selectedText}
            className={`p-1.5 rounded-md ${
              selectedText
                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                : "bg-gray-100 text-gray-400"
            }`}
            title="Unterstreichen"
          >
            <Underline size={16} />
          </button>
        </div>
        <textarea
          ref={textAreaRef}
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onSelect={handleTextSelect}
          placeholder="Gib hier deinen Erklärungstext ein..."
          rows={8}
          className="text-black w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {selectedText && (
          <p className="text-xs text-black mt-1">
            Text markiert. Wähle ein Formatierungswerkzeug oben, um es
            anzuwenden.
          </p>
        )}
      </div>
    </>
  );
};

export default ExplanationForm;
