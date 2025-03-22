// src/components/learning-steps/ListenVocabulary.tsx
"use client";

import Image from "next/image";

interface ListenVocabularyProps {
  data: {
    imageUrl: string;
    soundFileName: string;
    mainText: string;
    secondaryText: string;
    facts?: Array<{
      id: string;
      term: string;
      definition: string;
      usage: string;
      pronunciation: string;
    }>;
  };
}

export default function ListenVocabulary({ data }: ListenVocabularyProps) {
  const handlePlayAudio = () => {
    // Audio playback logic would go here
    console.log("Playing audio:", data.soundFileName);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-48 h-48 mb-4">
          <Image
            src={data.imageUrl}
            alt={data.mainText}
            fill
            className="object-cover rounded-lg"
          />
        </div>

        <button
          onClick={handlePlayAudio}
          className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full mb-4 hover:bg-blue-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{data.mainText}</h2>
          <p className="text-gray-600">{data.secondaryText}</p>
        </div>
      </div>

      {data.facts && data.facts.length > 0 && (
        <div className="mt-8 border-t pt-4">
          <h3 className="text-lg font-bold mb-3">Facts to Remember</h3>
          {data.facts.map((fact) => (
            <div key={fact.id} className="bg-blue-50 p-4 rounded-lg mb-4">
              <div className="font-bold text-blue-800">{fact.term}</div>
              <div className="mt-1">{fact.definition}</div>
              <div className="mt-2 text-sm">
                <span className="font-medium">Usage:</span> {fact.usage}
              </div>
              <div className="mt-1 text-sm">
                <span className="font-medium">Pronunciation:</span>{" "}
                {fact.pronunciation}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
