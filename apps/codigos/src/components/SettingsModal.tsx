import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Sliders, ExternalLink, Plus, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { Settings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (settings: Partial<Settings>) => void;
}

const STORAGE_KEY_SAVED_MODELS = 'codigos_ar_saved_models';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave
}) => {
  const [model, setModel] = useState(settings.model);
  const [summaryEnabled, setSummaryEnabled] = useState(settings.summaryEnabled);
  const [saved, setSaved] = useState(false);
  const [savedModels, setSavedModels] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SAVED_MODELS);
      return raw ? JSON.parse(raw) : [
        'google/gemini-2.0-flash-001',
        'meta-llama/llama-3.3-70b-instruct'
      ];
    } catch {
      return ['google/gemini-2.0-flash-001'];
    }
  });

  useEffect(() => {
    setModel(settings.model);
    setSummaryEnabled(settings.summaryEnabled);
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
    onSave({
      model: model.trim(),
      summaryEnabled
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  const hasApiKey = Boolean(settings.apiKey && settings.apiKey.trim());

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
                  <Sliders size={16} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[#F2F2F0]">Ajustes de Códigos AR</h2>
                  <p className="text-xs text-[#8A8A94]">Modelos favoritos y preferencias de IA</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-[#8A8A94] hover:bg-[#1E1E24] hover:text-[#F2F2F0] transition-colors"
                aria-label="Cerrar modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-5">
              {/* Toggle: Resumen Jurídico IA */}
              <div className="rounded-lg border border-[#1E1E24] bg-[#0C0C0E] p-3.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#D4A843]/15 text-[#D4A843]">
                      <Sparkles size={14} />
                    </div>
                    <div>
                      <label htmlFor="summary-toggle" className="text-sm font-medium text-[#F2F2F0] cursor-pointer">
                        Resumen Jurídico con IA
                      </label>
                      <p className="text-xs text-[#8A8A94] mt-0.5 leading-relaxed">
                        Genera una síntesis en texto plano de los artículos encontrados. Si lo desactivás, la búsqueda será puramente textual e inmediata.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    id="summary-toggle"
                    role="switch"
                    aria-checked={summaryEnabled}
                    onClick={() => setSummaryEnabled(!summaryEnabled)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      summaryEnabled ? 'bg-[#D4A843]' : 'bg-[#27272A]'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        summaryEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Model selection & favorites */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#8A8A94] mb-1.5">
                  Modelo de IA Activo (OpenRouter)
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
                    title={savedModels.includes(model.trim()) ? 'Modelo ya guardado en favoritos' : 'Agregar a favoritos (+)'}
                    aria-label="Guardar modelo favorito"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {/* Favorite Models List */}
                <div className="mt-3">
                  <span className="block text-[11px] font-medium text-[#8A8A94] mb-1.5">
                    Modelos favoritos guardados:
                  </span>
                  {savedModels.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {savedModels.map((m) => (
                        <div
                          key={m}
                          onClick={() => setModel(m)}
                          className={`group flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-mono cursor-pointer transition-colors ${
                            model === m
                              ? 'border border-[#D4A843]/50 bg-[#D4A843]/15 text-[#D4A843]'
                              : 'border border-[#1E1E24] bg-[#0C0C0E] text-[#8A8A94] hover:text-[#F2F2F0] hover:border-[#D4A843]/30'
                          }`}
                          title={`Seleccionar ${m}`}
                        >
                          <span className="max-w-[200px] truncate">{m}</span>
                          <button
                            type="button"
                            onClick={(e) => handleRemoveSavedModel(m, e)}
                            className="opacity-50 hover:opacity-100 hover:text-rose-400 transition-opacity p-0.5"
                            title="Eliminar de favoritos"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#8A8A94]">
                      Escribí un modelo y presioná <span className="text-[#D4A843] font-semibold">+</span> para guardarlo en favoritos.
                    </p>
                  )}
                </div>
              </div>

              {/* API Key Status Notice */}
              <div className="rounded-lg border border-[#1E1E24] bg-[#0C0C0E]/70 p-3 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {hasApiKey ? (
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle size={14} className="text-amber-400 shrink-0" />
                    )}
                    <span className="text-[#8A8A94]">
                      OpenRouter API Key:{' '}
                      <strong className={hasApiKey ? 'text-emerald-400' : 'text-amber-400'}>
                        {hasApiKey ? 'Configurada' : 'No configurada'}
                      </strong>
                    </span>
                  </div>
                  <a
                    href="../../index.html"
                    className="inline-flex items-center gap-1 text-[#D4A843] hover:underline shrink-0"
                    title="Configurar clave en el Inicio de Tools Suite"
                  >
                    <span>{hasApiKey ? 'Administrar en Inicio' : 'Configurar en Inicio'}</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
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
