import React from 'react';
import { useMobileDetection } from '../hooks/useMobileDetection';
import { MobileJournal } from '../components/mobile';
import { JournalEditor } from '../components/JournalEditor';

export const JournalPage: React.FC = () => {
  const { isMobile, isTablet } = useMobileDetection();

  // Use mobile experience for phones and tablets in portrait
  const useMobileExperience = isMobile || isTablet;

  if (useMobileExperience) {
    return <MobileJournal />;
  }

  // Desktop experience - full JournalEditor
  return (
    <div className="h-[calc(100vh-64px)]">
      <JournalEditor />
    </div>
  );
};

export default JournalPage;
