"use client";
import React from "react";

interface CompletedStepDialogProps {
  dialogData: any;
  setDialogData: (data: any) => void;
}

const CompletedStepDialog: React.FC<CompletedStepDialogProps> = ({
  dialogData,
  setDialogData,
}) => {
  const handleLearnedVocabularyChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const lines = e.target.value
      .split("\n")
      .filter((line) => line.trim() !== "");
    const learnedVocabulary = lines.map((line) => {
      const [word, translation] = line.split("|").map((s) => s.trim());
      return { word, translation };
    });
    setDialogData({ ...dialogData, learnedVocabulary });
  };

  return (
    <div className="space-y-4">
      <label className="block">
        Abschlussnachricht:
        <input
          type="text"
          value={dialogData.completionMessage || ""}
          onChange={(e) =>
            setDialogData({ ...dialogData, completionMessage: e.target.value })
          }
          className="mt-1 block w-full border rounded p-2"
          placeholder="Herzlichen Glückwunsch! ..."
        />
      </label>
      <label className="block">
        Gelernte Vokabeln (jede Zeile: Wort | Übersetzung):
        <textarea
          value={
            dialogData.learnedVocabulary
              ? dialogData.learnedVocabulary
                  .map((lv: any) => `${lv.word} | ${lv.translation}`)
                  .join("\n")
              : ""
          }
          onChange={handleLearnedVocabularyChange}
          className="mt-1 block w-full border rounded p-2"
          placeholder="Beispiel: Rojbaş | Hallo/Guten Morgen"
        />
      </label>
    </div>
  );
};

export default CompletedStepDialog;
