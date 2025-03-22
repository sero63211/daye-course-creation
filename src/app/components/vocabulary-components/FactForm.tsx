// vocabulary-components/FactForm.tsx
import React from "react";
import { Plus } from "lucide-react";
import { InfoItem } from "../../types/model";

interface FactFormProps {
  fact: Partial<InfoItem>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onAddFact: () => void;
}

const FactForm: React.FC<FactFormProps> = ({ fact, onChange, onAddFact }) => {
  return (
    <div className="border p-4 rounded bg-blue-50">
      <h4 className="font-medium mb-3 text-black">
        Neue Information hinzufügen
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-sm text-black mb-1" htmlFor="term">
            Begriff*
          </label>
          <input
            type="text"
            id="term"
            name="term"
            value={fact.term || ""}
            onChange={onChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-black placeholder-gray-500"
            placeholder="z.B. Artikel"
          />
        </div>
        <div>
          <label className="block text-sm text-black mb-1" htmlFor="definition">
            Definition*
          </label>
          <input
            type="text"
            id="definition"
            name="definition"
            value={fact.definition || ""}
            onChange={onChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-black placeholder-gray-500"
            placeholder="z.B. Der Artikel ist 'der'"
          />
        </div>
        <div>
          <label className="block text-sm text-black mb-1" htmlFor="usage">
            Verwendung
          </label>
          <input
            type="text"
            id="usage"
            name="usage"
            value={fact.usage || ""}
            onChange={onChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-black placeholder-gray-500"
            placeholder="z.B. Der Baum ist groß."
          />
        </div>
        <div>
          <label
            className="block text-sm text-black mb-1"
            htmlFor="pronunciation"
          >
            Aussprache
          </label>
          <input
            type="text"
            id="pronunciation"
            name="pronunciation"
            value={fact.pronunciation || ""}
            onChange={onChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-black placeholder-gray-500"
            placeholder="z.B. dɛɐ̯ baʊ̯m"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          onClick={onAddFact}
          className="flex items-center bg-blue-500 text-white py-1 px-3 rounded text-sm hover:bg-blue-600"
        >
          <Plus size={16} className="mr-1" /> Information hinzufügen
        </button>
      </div>
    </div>
  );
};

export default FactForm;
