import { useState, useCallback } from 'react';
import { Settings } from '../types';

const STORAGE_KEY_API_KEY = 'codigos_ar_openrouter_key';
const STORAGE_KEY_MODEL = 'codigos_ar_openrouter_model';

const DEFAULT_MODEL = 'google/gemini-2.0-flash-001';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => ({
    apiKey: localStorage.getItem(STORAGE_KEY_API_KEY) || '',
    model: localStorage.getItem(STORAGE_KEY_MODEL) || DEFAULT_MODEL
  }));

  const saveSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      if (updated.apiKey !== undefined) {
        localStorage.setItem(STORAGE_KEY_API_KEY, updated.apiKey);
      }
      if (updated.model !== undefined) {
        localStorage.setItem(STORAGE_KEY_MODEL, updated.model);
      }
      return updated;
    });
  }, []);

  return {
    settings,
    saveSettings,
    hasApiKey: Boolean(settings.apiKey.trim())
  };
}
