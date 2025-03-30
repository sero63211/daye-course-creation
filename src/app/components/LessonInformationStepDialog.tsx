"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import IPhonePreview from "./IPhonePreview";
import { StepType } from "../types/model";

export interface LessonInformationModel {
  title: string;
  mainText: string;
}

interface ContentItem {
  id: string;
  uniqueId?: string;
  text: string;
  translation?: string;
  title?: string;
  examples?: any[];
  imageUrl?: string;
  audioUrl?: string;
  type?: string;
  contentType?: string;
}

interface LessonInformationStepDialogProps {
  dialogData: any;
  setDialogData: (data: any) => void;
  contentItems?: ContentItem[];
  stepType: StepType;
  isEditMode: boolean;
}

const LessonInformationStepDialog: React.FC<
  LessonInformationStepDialogProps
> = ({
  dialogData,
  setDialogData,
  contentItems = [],
  stepType,
  isEditMode,
}) => {
  // Use memoized preview data to avoid unnecessary renders
  const previewData = useMemo(
    () => ({
      title: dialogData.title || "",
      mainText: dialogData.mainText || "",
    }),
    [dialogData.title, dialogData.mainText]
  );

  // Track when data is complete
  useEffect(() => {
    const isComplete = !!(dialogData.title && dialogData.mainText);
    if (dialogData.isComplete !== isComplete) {
      setDialogData((prevData) => ({ ...prevData, isComplete }));
    }
  }, [
    dialogData.title,
    dialogData.mainText,
    dialogData.isComplete,
    setDialogData,
  ]);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left side: Form */}
      <div className="w-full md:w-3/5 space-y-6 bg-white p-4 rounded-lg">
        <div className="space-y-4">
          <label className="block text-black">
            Titel:
            <input
              type="text"
              value={dialogData.title || ""}
              onChange={(e) =>
                setDialogData((prevData) => ({
                  ...prevData,
                  title: e.target.value,
                }))
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
                setDialogData((prevData) => ({
                  ...prevData,
                  mainText: e.target.value,
                }))
              }
              className="mt-1 block w-full border rounded p-2 text-black h-64"
              placeholder="Haupttext / Inhalt der Lektion"
            />
          </label>
        </div>
      </div>

      {/* Right side: Preview */}
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
