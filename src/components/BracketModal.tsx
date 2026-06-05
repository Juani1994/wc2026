import type { KnockoutMatch } from "../types";
import BracketVisualizer from "./BracketVisualizer";
import { useLanguage } from "../i18n/LanguageContext";

interface BracketModalProps {
  isOpen: boolean;
  onClose: () => void;
  knockoutMatches: Record<string, KnockoutMatch>;
}

export default function BracketModal({ isOpen, onClose, knockoutMatches }: BracketModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 w-full max-w-[98vw] max-h-[95vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 p-4 sm:p-6 border-b border-slate-700 shrink-0">
          <h2 className="text-lg sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 truncate">
            {t("knockout.bracketTitle")}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-white text-2xl font-bold transition-colors shrink-0 w-8 h-8 flex items-center justify-center rounded hover:bg-slate-700"
          >
            ✕
          </button>
        </div>

        {/* Content (scrolls) */}
        <div className="flex-1 overflow-auto p-3 sm:p-6">
          <p className="text-xs text-gray-500 mb-3 sm:hidden">
            {t("knockout.bracketHint")}
          </p>
          <BracketVisualizer knockoutMatches={knockoutMatches} />
        </div>
      </div>
    </div>
  );
}
