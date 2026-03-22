import { useState, useEffect } from 'react';

const KEY = 'udaan_lead_dismissed';

export function useLeadCapture() {
  const [isDismissedState, setIsDismissedState] = useState(true); // default true until mounted

  useEffect(() => {
    setIsDismissedState(sessionStorage.getItem(KEY) === 'true');
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(KEY, 'true');
    setIsDismissedState(true);
  };

  return { isDismissed: isDismissedState, dismiss };
}
