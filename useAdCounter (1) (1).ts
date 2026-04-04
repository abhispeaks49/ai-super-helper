import { useState, useCallback } from 'react';

let actionCount = 0;

export function useAdCounter() {
  const [showAd, setShowAd] = useState(false);

  const incrementAction = useCallback(() => {
    actionCount++;
  }, []);

  const showInterstitialAd = useCallback(() => {
    if (actionCount % 3 === 0 && actionCount > 0) {
      setShowAd(true);
      setTimeout(() => {
        setShowAd(false);
      }, 100);
    }
  }, []);

  return {
    incrementAction,
    showInterstitialAd,
    showAd,
  };
}
