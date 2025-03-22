// components/ContentDisplaySection.tsx
import React from "react";
import CreatedContentDisplay from "./CreatedContentDisplay";
import { EnhancedContentItem } from "../types/ContentTypes";

interface ContentDisplaySectionProps {
  contentItems: EnhancedContentItem[];
  onRemoveItem: (uniqueId: string) => void;
  onImageSelect: (itemId: string) => void;
  onAudioSelect: (itemId: string) => void;
  audioPlaying: string | null;
  onAudioPlay: (itemId: string, audioUrl: string) => void;
}

const ContentDisplaySection: React.FC<ContentDisplaySectionProps> = ({
  contentItems,
  onRemoveItem,
  onImageSelect,
  onAudioSelect,
  audioPlaying,
  onAudioPlay,
}) => {
  return (
    <CreatedContentDisplay
      contentItems={contentItems}
      onRemoveItem={onRemoveItem}
      onImageSelect={onImageSelect}
      onAudioSelect={onAudioSelect}
      audioPlaying={audioPlaying}
      onAudioPlay={onAudioPlay}
    />
  );
};

export default ContentDisplaySection;
