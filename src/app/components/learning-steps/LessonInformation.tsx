// src/components/learning-steps/LessonInformation.tsx
"use client";

interface LessonInformationProps {
  data: {
    title: string;
    mainText: string;
    secondaryText: string;
  };
}

export default function LessonInformation({ data }: LessonInformationProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">{data.title}</h2>
      <p className="text-lg mb-4">{data.mainText}</p>
      <p className="text-gray-600">{data.secondaryText}</p>
    </div>
  );
}
