import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Key, ExternalLink, Eye, EyeOff, Plus } from 'lucide-react';
import { Settings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (settings: Settings) => void;
}

const STORAGE_KEY_SAVED_MODELS = 'codigos_ar_saved_models';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave
}) => {
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [model, setModel] = useState(settings.model);
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedModels, setSavedModels] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SAVED_MODELS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    setApiKey(settings.apiKey);
    setModel(settings.model);
    setSaved(false);
  }, [settings, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleAddSavedModel = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const trimmed = model.trim();
    if (!trimmed) return;
    if (!savedModels.includes(trimmed)) {
      const updated = [...savedModels, trimmed];
      setSavedModels(updated);
      try {
        localStorage.setItem(STORAGE_KEY_SAVED_MODELS, JSON.stringify(updated));
      } catch (err) {
        console.error('Error saving model to localStorage:', err);
      }
    }
  };

  const handleRemoveSavedModel = (modelToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedModels.filter(m => m !== modelToRemove);
    setSavedModels(updated);
    try {
      localStorage.setItem(STORAGE_KEY_SAVED_MODELS, JSON.stringify(updated));
    } catch (err) {
      console.error('Error removing model from localStorage:', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ apiKey: apiKey.trim(), model: model.trim() });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="relative w-full max-w-md rounded-xl border border-[#1E1E24] bg-[#131316] p-6 shadow-2xl z-10"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1E1E24] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4A843]/10 text-[#D4A843]">
                  <Key size={16} />
                </div>
                <h2 className="text-lg font-semibold text-[#F2F2F0]">Ajustes de OpenRouter</h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-[#8A8A94] hover:bg-[#1E1E24] hover:text-[#F2F2F0] transition-colors"
                aria-label="Cerrar modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* API Key */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#8A8A94] mb-1.5">
                  OpenRouter API Key
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-or-v1-..."
                    className="w-full rounded-lg border border-[#1E1E24] bg-[#0C0C0E] px-3.5 py-2.5 pr-10 text-sm font-mono text-[#F2F2F0] placeholder-[#8A8A94]/50 focus:border-[#D4A843] focus:outline-none transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A94] hover:text-[#F2F2F0] transition-colors"
                    tabIndex={-1}
                  >
                    {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="mt-1.5 text-[11px] text-[#8A8A94]">
                  La clave se almacena exclusivamente en tu navegador (localStorage). Podés obtener una en{' '}
                  <a
                    href="https://openrouter.ai/keys"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-[#D4A843] hover:underline"
                  >
                    openrouter.ai <ExternalLink size={10} className="ml-0.5" />
                  </a>
                </p>
              </div>

              {/* Model */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#8A8A94] mb-1.5">
                  Modelo de IA (OpenRouter)
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="ej: google/gemini-2.0-flash-001"
                      className="w-full rounded-lg border border-[#1E1E24] bg-[#0C0C0E] px-3.5 py-2.5 text-sm font-mono text-[#F2F2F0] placeholder-[#8A8A94]/50 focus:border-[#D4A843] focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSavedModel}
                    disabled={!model.trim() || savedModels.includes(model.trim())}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#1E1E24] bg-[#0C0C0E] text-[#D4A843] transition-colors hover:border-[#D4A843]/50 hover:bg-[#D4A843]/10 disabled:opacity-40 disabled:cursor-not-allowed"
                    title={savedModels.includes(model.trim()) ? 'Modelo ya guardado en lista' : 'Guardar este modelo (+)'}
                    aria-label="Guardar modelo"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {/* User Saved Models */}
                {savedModels.length > 0 ? (
                  <div className="mt-2.5">
                    <span className="block text-[11px] text-[#8A8A94] mb-1.5">Modelos guardados:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {savedModels.map((m) => (
                        <div
                          key={m}
                          onClick={() => setModel(m)}
                          className={`group flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-mono cursor-pointer transition-colors ${
                            model === m
                              ? 'border border-[#D4A843]/40 bg-[#D4A843]/15 text-[#D4A843]'
                              : 'border border-[#1E1E24] bg-[#0C0C0E] text-[#8A8A94] hover:text-[#F2F2F0] hover:border-[#1E1E24]/80'
                          }`}
                          title={`Seleccionar ${m}`}
                        >
                          <span className="max-w-[220px] truncate">{m}</span>
                          <button
                            type="button"
                            onClick={(e) => handleRemoveSavedModel(m, e)}
                            className="opacity-50 hover:opacity-100 hover:text-rose-400 transition-opacity p-0.5"
                            title="Eliminar de guardados"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-[11px] text-[#8A8A94]">
                    Escribí el modelo deseado y hacé click en <span className="text-[#D4A843] font-semibold">+</span> para guardarlo y reutilizarlo cuando quieras.
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-[#8A8A94] hover:text-[#F2F2F0] transition-colors"
                >
                  Cancelar
                </button>
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.96 }}
                  className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition-all ${
                    saved
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#D4A843] text-[#0C0C0E] hover:bg-[#c39736]'
                  }`}
                >
                  {saved ? (
                    <>
                      <Check size={16} /> Guardado
                    </>
                  ) : (
                    'Guardar ajustes'
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
