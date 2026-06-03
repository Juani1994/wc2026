import { useState } from "react";
import type { Match } from "../types";
import { useLanguage } from "../i18n/LanguageContext";
import { encodeStateToUrl, getSharingUrls } from "../utils/shareState";

interface ShareModalProps {
  matches: Record<string, Match>;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ matches, isOpen, onClose }: ShareModalProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const encodedState = encodeStateToUrl(matches);
  const { whatsapp, twitter, facebook, shareLink } = getSharingUrls(encodedState);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 rounded-xl p-6 max-w-md w-full border border-slate-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">{t("share.title")}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-300 text-sm mb-6">
          {t("share.description")}
        </p>

        <div className="space-y-3 mb-6">
          {/* WhatsApp */}
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition-colors"
          >
            <span className="text-xl">💬</span>
            <span>WhatsApp</span>
          </a>

          {/* Twitter */}
          <a
            href={twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold transition-colors"
          >
            <span className="text-xl">𝕏</span>
            <span>Twitter</span>
          </a>

          {/* Facebook */}
          <a
            href={facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-blue-700 hover:bg-blue-800 rounded-lg text-white font-semibold transition-colors"
          >
            <span className="text-xl">f</span>
            <span>Facebook</span>
          </a>

          {/* Copy Link */}
          <button
            onClick={handleCopy}
            className={`w-full flex items-center gap-3 p-3 rounded-lg font-semibold transition-colors ${
              copied
                ? "bg-emerald-600 text-white"
                : "bg-slate-800 hover:bg-slate-700 text-white"
            }`}
          >
            <span className="text-xl">{copied ? "✓" : "📋"}</span>
            <span>{copied ? t("share.copied") : t("share.copyLink")}</span>
          </button>
        </div>

        <p className="text-gray-400 text-xs">
          {t("share.linkNote")}
        </p>
      </div>
    </div>
  );
}
