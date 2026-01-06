import { useEffect, useRef } from 'react';
import { AudioEngine } from './AudioEngine';

export const useAudio = () => {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      AudioEngine.init();
      initializedRef.current = true;
    }
  }, []);

  return AudioEngine;
};
