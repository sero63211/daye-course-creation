// components/ContentTypeSelector.tsx
import React from "react";

interface ContentTypeSelectorProps {
  contentType: string;
  setContentType: (type: string) => void;
}

const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({
  contentType,
  setContentType,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-black mb-1">
        Inhaltstyp
      </label>
      <div className="flex space-x-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="contentType"
            value="vocabulary"
            checked={contentType === "vocabulary"}
            onChange={() => setContentType("vocabulary")}
            className="form-radio h-4 w-4 text-blue-600"
          />
          <span className="ml-2 text-black">Vokabel</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="contentType"
            value="sentence"
            checked={contentType === "sentence"}
            onChange={() => setContentType("sentence")}
            className="form-radio h-4 w-4 text-blue-600"
          />
          <span className="ml-2 text-black">Satz</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="contentType"
            value="information"
            checked={contentType === "information"}
            onChange={() => setContentType("information")}
            className="form-radio h-4 w-4 text-blue-600"
          />
          <span className="ml-2 text-black">Erklärungstext</span>
        </label>
      </div>
    </div>
  );
};

export default ContentTypeSelector;
