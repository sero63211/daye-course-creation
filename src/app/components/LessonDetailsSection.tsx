// components/LessonDetailsSection.tsx
import React from "react";
import {
  LessonModel,
  CourseModel,
  LearningStep,
  LanguageLearningOverviewModel,
  Chapter,
} from "../types/model";
import { getStepTypeName } from "../utils/stepTypeUtils";

interface LessonDetailsSectionProps {
  lessonId: string;
  lessonData: LessonModel;
  setLessonData: React.Dispatch<React.SetStateAction<LessonModel | null>>;
  selectedSteps: LearningStep[];
  courseData: CourseModel | null;
  currentChapterId: string | undefined;
  learningOverviewModel: LanguageLearningOverviewModel | null;
  setLearningOverviewModel: React.Dispatch<
    React.SetStateAction<LanguageLearningOverviewModel | null>
  >;
}

const LessonDetailsSection: React.FC<LessonDetailsSectionProps> = ({
  lessonId,
  lessonData,
  setLessonData,
  selectedSteps,
  courseData,
  currentChapterId,
  learningOverviewModel,
  setLearningOverviewModel,
}) => {
  return (
    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-4">
      <h3 className="text-lg font-bold text-black mb-3">Lektion Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-700">Lektion-ID:</p>
          <p className="text-base mb-2">{lessonId}</p>

          <p className="text-sm font-medium text-gray-700">Titel:</p>
          <input
            type="text"
            value={lessonData.title || ""}
            onChange={(e) => {
              const newTitle = e.target.value;
              setLessonData((prev) => ({
                ...prev,
                title: newTitle,
              }));
              setLearningOverviewModel((prev) => ({
                ...prev,
                title: newTitle,
              }));
            }}
            className="w-full border border-gray-300 rounded p-2 mb-2"
          />
          <p className="text-sm font-medium text-gray-700">Kursbezug:</p>
          <p className="text-base mb-2">
            {courseData?.title || "Kein Titel"} -
            {courseData?.chapters?.find((ch) => ch.id === currentChapterId)
              ?.title || "Kein Kapitel"}
          </p>

          <p className="text-sm font-medium text-gray-700">
            Anzahl der Schritte:
          </p>
          <p className="text-base mb-2">{selectedSteps.length}</p>

          <p className="text-sm font-medium text-gray-700">Fortschritt:</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${learningOverviewModel?.progress || 0}%` }}
            ></div>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Schritte:</p>
          <ul className="text-sm bg-white p-3 rounded border border-gray-200 max-h-60 overflow-y-auto">
            {selectedSteps.map((step, index) => (
              <li
                key={step.id}
                className="mb-2 pb-2 border-b border-gray-100 last:border-0"
              >
                <span className="font-medium">
                  {index + 1}. {getStepTypeName(step.type)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LessonDetailsSection;
