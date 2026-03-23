import { useState, useEffect } from 'react';

const KEY = 'udaan_lead_dismissed';

export function useLeadCapture() {
  const [isDismissedState, setIsDismissedState] = useState(true); // default true until mounted

  useEffect(() => {
    try {
      setIsDismissedState(sessionStorage.getItem(KEY) === 'true');
    } catch (e) {
      console.error('sessionStorage access denied', e);
    }
  }, []);

  const dismiss = () => {
    try {
      sessionStorage.setItem(KEY, 'true');
    } catch (e) {
      console.error('sessionStorage access denied', e);
    }
    setIsDismissedState(true);
  };

  return { isDismissed: isDismissedState, dismiss };
}
