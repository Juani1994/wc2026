import { useLanguage } from '../i18n/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-1 bg-slate-700/50 rounded-lg p-1">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded font-bold text-xs transition-all ${
          language === 'en'
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
            : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('es')}
        className={`px-3 py-1 rounded font-bold text-xs transition-all ${
          language === 'es'
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
            : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
        }`}
      >
        ES
      </button>
    </div>
  );
}
