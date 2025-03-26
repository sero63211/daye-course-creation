// components/ExplanationInput.tsx
import React, { useState } from "react";

interface ExplanationInputProps {
  onAddContent: () => void;
}

const ExplanationInput: React.FC<ExplanationInputProps> = ({
  onAddContent,
}) => {
  const [explanationTitle, setExplanationTitle] = useState("");
  const [explanationText, setExplanationText] = useState("");

  // Text formatting functions
  const applyFormatting = (format: "bold" | "italic" | "underline") => {
    const textarea = document.getElementById(
      "explanation-text"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = explanationText.substring(start, end);

    let formattedText = "";
    let newCursorPosition = 0;

    switch (format) {
      case "bold":
        formattedText =
          explanationText.substring(0, start) +
          `**${selectedText}**` +
          explanationText.substring(end);
        newCursorPosition = end + 4;
        break;
      case "italic":
        formattedText =
          explanationText.substring(0, start) +
          `*${selectedText}*` +
          explanationText.substring(end);
        newCursorPosition = end + 2;
        break;
      case "underline":
        formattedText =
          explanationText.substring(0, start) +
          `__${selectedText}__` +
          explanationText.substring(end);
        newCursorPosition = end + 4;
        break;
    }

    setExplanationText(formattedText);

    // Set focus back to textarea after state update
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };

  return (
    <div className="flex flex-col gap-3 mb-2">
      <input
        type="text"
        className="w-full p-2 border rounded bg-white text-black text-sm"
        placeholder="Titel"
        value={explanationTitle}
        onChange={(e) => setExplanationTitle(e.target.value)}
      />

      {/* Text formatting toolbar */}
      <div className="flex gap-2 bg-gray-100 p-2 rounded">
        <button
          className="px-2 py-1 bg-white border rounded text-black hover:bg-gray-50"
          onClick={() => applyFormatting("bold")}
          title="Fett"
        >
          <strong>B</strong>
        </button>
        <button
          className="px-2 py-1 bg-white border rounded text-black hover:bg-gray-50"
          onClick={() => applyFormatting("italic")}
          title="Kursiv"
        >
          <em>I</em>
        </button>
        <button
          className="px-2 py-1 bg-white border rounded text-black hover:bg-gray-50"
          onClick={() => applyFormatting("underline")}
          title="Unterstrichen"
        >
          <span className="underline">U</span>
        </button>
      </div>

      <textarea
        id="explanation-text"
        className="w-full p-2 border rounded bg-white text-black text-sm min-h-[200px]"
        placeholder="Geben Sie hier Ihren Erklärungstext ein..."
        value={explanationText}
        onChange={(e) => setExplanationText(e.target.value)}
      ></textarea>

      <button
        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
        onClick={onAddContent}
      >
        Hinzufügen
      </button>
    </div>
  );
};

export default ExplanationInput;
