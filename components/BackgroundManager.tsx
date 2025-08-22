import React, { useEffect } from 'react';

interface BackgroundManagerProps {
  imageUrl: string;
}

const BackgroundManager: React.FC<BackgroundManagerProps> = ({ imageUrl }) => {
  useEffect(() => {
    // A simple check to see if the URL is valid-looking before setting it.
    // This is not a foolproof validation but prevents setting "undefined" or empty strings.
    if (imageUrl && (imageUrl.startsWith('http') || imageUrl.startsWith('data:'))) {
      document.documentElement.style.setProperty('--background-image-url', `url('${imageUrl}')`);
    }
  }, [imageUrl]);

  return null; // This component does not render anything
};

export default BackgroundManager;
