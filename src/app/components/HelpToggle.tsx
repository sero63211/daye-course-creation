// components/HelpToggle.tsx
import React from "react";

interface HelpToggleProps {
  showHelp: boolean;
  toggleHelp: () => void;
}

const HelpToggle: React.FC<HelpToggleProps> = ({ showHelp, toggleHelp }) => {
  return (
    <button onClick={toggleHelp} className="text-blue-500 hover:text-blue-700">
      {showHelp ? "Hilfe ausblenden" : "Hilfe anzeigen"}
    </button>
  );
};

export default HelpToggle;
