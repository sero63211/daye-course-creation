// vocabulary-components/FactsManager.tsx
import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { InfoItem } from "../../types/model";
import { v4 as uuid } from "uuid";
import FactForm from "./FactForm";

interface FactsManagerProps {
  facts: InfoItem[];
  setFacts: (facts: InfoItem[]) => void;
  isEditMode?: boolean;
}

const FactsManager: React.FC<FactsManagerProps> = ({
  facts,
  setFacts,
  isEditMode = false,
}) => {
  // State for new fact form
  const [newFact, setNewFact] = useState<Partial<InfoItem>>({
    id: "",
    term: "",
    definition: "",
    usage: "",
    pronunciation: "",
  });

  // Handler for new fact changes
  const handleNewFactChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewFact((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler for adding a new fact
  const handleAddFact = () => {
    if (!newFact.term || !newFact.definition) {
      alert("Bitte mindestens Begriff und Definition eingeben!");
      return;
    }

    const factToAdd: InfoItem = {
      id: uuid(),
      term: newFact.term || "",
      definition: newFact.definition || "",
      usage: newFact.usage || "",
      pronunciation: newFact.pronunciation || "",
    };

    setFacts([...facts, factToAdd]);

    // Reset form for new facts
    setNewFact({
      id: "",
      term: "",
      definition: "",
      usage: "",
      pronunciation: "",
    });
  };

  // Handler for removing a fact
  const handleRemoveFact = (id: string) => {
    setFacts(facts.filter((fact) => fact.id !== id));
  };

  return (
    <div className="p-6 bg-white rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-black">
        Zusätzliche Informationen
      </h3>

      {/* Debug information: Number of facts */}
      {isEditMode && facts.length > 0 && (
        <div className="mb-2 p-2 bg-purple-50 rounded text-sm text-black">
          <strong>Hinweis:</strong> Es sind {facts.length} zusätzliche
          Informationen vorhanden.
        </div>
      )}

      {/* List of existing facts */}
      {facts.length > 0 && (
        <div className="mb-4 space-y-3">
          {facts.map((fact) => (
            <div
              key={fact.id}
              className="border p-3 rounded bg-gray-50 relative"
            >
              <button
                onClick={() => handleRemoveFact(fact.id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                <X size={18} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <p className="text-sm font-medium text-black">Begriff:</p>
                  <p className="text-black">{fact.term}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-black">Definition:</p>
                  <p className="text-black">{fact.definition}</p>
                </div>
                {fact.usage && (
                  <div>
                    <p className="text-sm font-medium text-black">
                      Verwendung:
                    </p>
                    <p className="text-black">{fact.usage}</p>
                  </div>
                )}
                {fact.pronunciation && (
                  <div>
                    <p className="text-sm font-medium text-black">
                      Aussprache:
                    </p>
                    <p className="text-black">{fact.pronunciation}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form for new facts - using FactForm component */}
      <FactForm
        fact={newFact}
        onChange={handleNewFactChange}
        onAddFact={handleAddFact}
      />
    </div>
  );
};

export default FactsManager;
