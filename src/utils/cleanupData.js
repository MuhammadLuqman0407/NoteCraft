// Utility function to clean up invalid data from localStorage
export const cleanupInvalidData = () => {
  try {
    const pastesData = localStorage.getItem('pastes');
    if (!pastesData) return;

    const pastes = JSON.parse(pastesData);
    if (!Array.isArray(pastes)) {
      localStorage.removeItem('pastes');
      return;
    }

    // Filter out pastes with invalid dates or missing required fields
    const validPastes = pastes.filter(paste => {
      // Check if paste has required fields
      if (!paste.id || !paste.content) {
        return false;
      }

      // Check if createdAt is valid
      if (paste.createdAt) {
        const date = new Date(paste.createdAt);
        if (isNaN(date.getTime())) {
          // Fix invalid date by setting current date
          paste.createdAt = new Date().toISOString();
        }
      } else {
        // Add createdAt if missing
        paste.createdAt = new Date().toISOString();
      }

      return true;
    });

    // Update localStorage with cleaned data
    localStorage.setItem('pastes', JSON.stringify(validPastes));
    console.log(`Cleaned up data: ${pastes.length - validPastes.length} invalid entries removed`);
  } catch (error) {
    console.error('Error cleaning up data:', error);
    // If there's an error parsing, remove the corrupted data
    localStorage.removeItem('pastes');
  }
};

