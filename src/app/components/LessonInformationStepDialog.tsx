"use client";
import React, { useMemo } from "react";
import IPhonePreview from "./IPhonePreview";
import { StepType } from "../types/model";
import { X } from "lucide-react";

export interface LessonInformationModel {
  title: string;
  mainText: string;
}

interface LessonInformationStepDialogProps {
  dialogData: any;
  setDialogData: (data: any) => void;
}

const LessonInformationStepDialog: React.FC<
  LessonInformationStepDialogProps
> = ({ dialogData, setDialogData }) => {
  // Use memoized preview data to avoid unnecessary renders
  const previewData = useMemo(
    () => ({
      title: dialogData.title || "",
      mainText: dialogData.mainText || "",
    }),
    [dialogData.title, dialogData.mainText]
  );

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Linke Seite: Formular */}
      <div className="w-full md:w-3/5 space-y-6 bg-white p-4 rounded-lg">
        <div className="space-y-4">
          <label className="block text-black">
            Titel:
            <input
              type="text"
              value={dialogData.title || ""}
              onChange={(e) =>
                setDialogData({ ...dialogData, title: e.target.value })
              }
              className="mt-1 block w-full border rounded p-2 text-black"
              placeholder="Titel der Lektion"
            />
          </label>
          <label className="block text-black">
            Haupttext:
            <textarea
              value={dialogData.mainText || ""}
              onChange={(e) =>
                setDialogData({ ...dialogData, mainText: e.target.value })
              }
              className="mt-1 block w-full border rounded p-2 text-black h-64"
              placeholder="Haupttext / Inhalt der Lektion"
            />
          </label>
        </div>
      </div>

      {/* Rechte Seite: Vorschau */}
      <div className="w-full md:w-2/5 flex justify-center">
        <div className="sticky top-8">
          <IPhonePreview
            stepType={StepType.LessonInformation}
            stepData={previewData}
          />
        </div>
      </div>
    </div>
  );
};

export default LessonInformationStepDialog;
