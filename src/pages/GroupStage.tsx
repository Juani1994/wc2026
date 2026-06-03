import { useState } from "react";
import type { GroupId } from "../data/groups";
import { useLanguage } from "../i18n/LanguageContext";
import LanguageToggle from "../components/LanguageToggle";
import GroupNav from "../components/GroupNav";
import GroupCard from "../components/GroupCard";
import BestThirds from "../components/BestThirds";
import KnockoutStage from "./KnockoutStage";
import ShareModal from "../components/ShareModal";
import useStore from "../store/useStore";

type ViewMode = GroupId | "THIRDS" | "KNOCKOUT";

export default function GroupStage() {
  const [activeView, setActiveView] = useState<ViewMode>("A");
  const [showShareModal, setShowShareModal] = useState(false);
  const matches = useStore((s) => s.matches);
  const resetAll = useStore((s) => s.resetAll);
  const { t } = useLanguage();

  const handleResetAll = () => {
    if (confirm(t("groupStage.resetConfirm"))) {
      resetAll();
    }
  };

  return (
    <div className="min-h-screen pb-16 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-900/90 backdrop-blur border-b-2 border-blue-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                {t("header.title")}
              </h1>
            </div>
            <div className="flex gap-2 items-center">
              <LanguageToggle />
              <button
                onClick={() => setShowShareModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-lg hover:shadow-blue-600/50"
              >
                {t("header.share")}
              </button>
              <button
                onClick={handleResetAll}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors shadow-lg hover:shadow-red-600/50"
              >
                {t("header.resetAll")}
              </button>
            </div>
          </div>
          <GroupNav activeView={activeView} onSelectView={setActiveView} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-12">
        {activeView === "THIRDS" ? (
          <BestThirds />
        ) : activeView === "KNOCKOUT" ? (
          <KnockoutStage />
        ) : (
          <GroupCard groupId={activeView} />
        )}
      </main>

      {/* Share Modal */}
      <ShareModal
        matches={matches}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
}
