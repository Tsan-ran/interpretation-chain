import React, { useState, useEffect } from "react";
import { 
  Paintbrush, 
  MessageSquare, 
  AlertTriangle, 
  RotateCcw, 
  Sparkles,
  Info,
  ShieldCheck,
  History
} from "lucide-react";

// Types
import { GameState, ChainItem, GameStatus, ArchiveRecord } from "./types";

// Pages & Components
import PromptSetupPage from "./components/PromptSetupPage";
import DrawPage from "./components/DrawPage";
import GuessPage from "./components/GuessPage";
import SummaryPage from "./components/SummaryPage";
import OriginCompletePage from "./components/OriginCompletePage";
import HistoryListPage from "./components/HistoryListPage";
import HistoryDetailPage from "./components/HistoryDetailPage";
import ConfirmDialog from "./components/ConfirmDialog";

const LOCAL_STORAGE_KEY = "party_drawing_chain_game_state_v2";
const DATE_STREAK_KEY = "party_drawing_chain_last_open_date";

export default function App() {
  // Parsing Error tracker
  const [hasLocalStorageError, setHasLocalStorageError] = useState(false);

  // Core game state
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      const d = new Date();
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const todayString = `${year}-${month}-${day}`;
      
      const lastOpenDate = localStorage.getItem(DATE_STREAK_KEY);
      
      // Perform automatic daily maintenance reset if opened on a new day
      if (lastOpenDate && lastOpenDate !== todayString) {
        // Archive previous day's chain if valid before deleting!
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed && typeof parsed === "object" && Array.isArray(parsed.chain) && parsed.chain.length > 0) {
              const archiveRaw = localStorage.getItem("party_drawing_chain_archives_v2");
              const archivesList = archiveRaw ? JSON.parse(archiveRaw) : [];
              const isAlreadyArchived = archivesList.some((item: any) => item.date === lastOpenDate);
              
              if (!isAlreadyArchived) {
                const firstItem = parsed.chain.find((item: any) => item.type === "text") || parsed.chain[0];
                const archiveText = firstItem ? firstItem.content : "";
                const record = {
                  id: `archive-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                  date: lastOpenDate,
                  archivedAt: Date.now(),
                  chain: parsed.chain,
                  itemCount: parsed.chain.length,
                  firstText: archiveText
                };
                archivesList.push(record);
                localStorage.setItem("party_drawing_chain_archives_v2", JSON.stringify(archivesList));
              }
            }
          } catch (err) {
            console.error("Failed to archive old day's chain", err);
          }
        }

        localStorage.setItem(DATE_STREAK_KEY, todayString);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } else {
        localStorage.setItem(DATE_STREAK_KEY, todayString);
      }

      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object" && Array.isArray(parsed.chain)) {
          return parsed as GameState;
        }
      }
    } catch (e) {
      console.error("Local storage initialization failed", e);
      setTimeout(() => setHasLocalStorageError(true), 1);
    }

    // Default clean state targeting initial setup
    return {
      id: `game-${Date.now()}`,
      status: "prompt-setup",
      chain: [],
      updatedAt: Date.now()
    };
  });

  // Admin Reset confirmations
  const [isAdminResetOpen, setIsAdminResetOpen] = useState(false);

  // States for viewing history archives
  const [viewMode, setViewMode] = useState<"current" | "archive-list" | "archive-detail">("current");
  const [selectedArchiveId, setSelectedArchiveId] = useState<string | null>(null);
  const [archives, setArchives] = useState<ArchiveRecord[]>(() => {
    try {
      const raw = localStorage.getItem("party_drawing_chain_archives_v2");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Failed to load archive list", e);
      return [];
    }
  });

  // Sync archives list to local storage
  useEffect(() => {
    try {
      localStorage.setItem("party_drawing_chain_archives_v2", JSON.stringify(archives));
    } catch (e) {
      console.error("Failed to persist archives to storage", e);
    }
  }, [archives]);

  // Navigation handlers
  const handleSelectArchive = (id: string) => {
    setSelectedArchiveId(id);
    setViewMode("archive-detail");
  };

  const handleBackToGame = () => {
    setViewMode("current");
    setSelectedArchiveId(null);
  };

  const handleClearArchives = () => {
    setArchives([]);
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameState));
    } catch (e) {
      console.error("Failed to commit game state to local storage", e);
    }
  }, [gameState]);

  // Handler: Recover from corrupt local storage state
  const handleWipeAndRecover = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setHasLocalStorageError(false);
    setGameState({
      id: `game-${Date.now()}`,
      status: "prompt-setup",
      chain: [],
      updatedAt: Date.now()
    });
  };

  // Handler: Infinite continuation restart
  const handleRestart = () => {
    setIsAdminResetOpen(false);
    setGameState({
      id: `game-${Date.now()}`,
      status: "prompt-setup",
      chain: [],
      updatedAt: Date.now()
    });
  };

  // Handlers for state transitions
  const handleInitialPromptSubmit = (promptText: string) => {
    const newItem: ChainItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      type: "text",
      content: promptText,
      createdAt: Date.now()
    };

    setGameState(prev => ({
      ...prev,
      status: "summary",
      chain: [newItem],
      updatedAt: Date.now()
    }));
  };

  const handleDrawingSave = (dataUrl: string) => {
    const newItem: ChainItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      type: "drawing",
      content: dataUrl,
      createdAt: Date.now()
    };

    setGameState(prev => ({
      ...prev,
      status: "summary",
      chain: [...prev.chain, newItem],
      updatedAt: Date.now()
    }));
  };

  const handleGuessSave = (guessText: string) => {
    const newItem: ChainItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      type: "text",
      content: guessText,
      createdAt: Date.now()
    };

    setGameState(prev => ({
      ...prev,
      status: "summary",
      chain: [...prev.chain, newItem],
      updatedAt: Date.now()
    }));
  };

  const handleHandoverToNext = () => {
    setGameState(prev => ({
      ...prev,
      status: "playing",
      updatedAt: Date.now()
    }));
  };

  // Diagnostic Recovery Render
  if (hasLocalStorageError) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full bg-slate-900 border-2 border-rose-500/30 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl">
          <div className="mx-auto w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center animate-bounce">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold font-sans">資料讀取失敗！</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-sans">
              瀏覽器儲存的遊戲檔案可能已損壞。是否清除並重新開始新遊戲？這會清空目前的接龍。
            </p>
          </div>
          <button
            onClick={handleWipeAndRecover}
            className="w-full h-14 bg-rose-600 hover:bg-rose-500 text-white font-sans font-black text-lg rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
          >
            <RotateCcw className="w-5 h-5 animate-spin" />
            清除並重新開始
          </button>
        </div>
      </div>
    );
  }

  // Determine standard current statuses
  const { status, chain } = gameState;
  const lastItem = chain.length > 0 ? chain[chain.length - 1] : null;

  // Compute the current mode dynamically to drive screen visibility
  const currentMode = (() => {
    if (chain.length === 0) {
      return "prompt-setup";
    }
    if (status === "summary") {
      if (chain.length === 1 && chain[0].type === "text") {
        return "first-prompt-complete";
      }
      return "summary";
    }
    // Automatically determine next action based on type of the last entry
    const last = chain[chain.length - 1];
    return last.type === "text" ? "draw" : "guess";
  })();

  const activeArchive = archives.find(arc => arc.id === selectedArchiveId);

  if (viewMode === "archive-list") {
    return (
      <HistoryListPage
        archives={archives}
        onSelectArchive={handleSelectArchive}
        onBackToGame={handleBackToGame}
        onClearArchives={handleClearArchives}
      />
    );
  }

  if (viewMode === "archive-detail" && activeArchive) {
    return (
      <HistoryDetailPage
        archive={activeArchive}
        onBackToList={() => setViewMode("archive-list")}
        onBackToGame={handleBackToGame}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F3] text-[#2C2A26] flex flex-col justify-between select-none font-sans relative">
      
      {/* Global Header */}
      <header className="border-b border-[#2C2A26]/10 bg-[#F8F7F3]/90 backdrop-blur-md sticky top-0 w-full z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex flex-col select-none">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#47624F]" />
            <h1 className="text-lg sm:text-xl font-sans font-extrabold tracking-tight text-[#2C2A26] flex items-center">
              詮釋的接龍
            </h1>
            <span className="hidden md:inline-block text-[10px] uppercase tracking-wider text-[#7A756D] border border-[#2C2A26]/15 px-2 py-0.5 rounded-md font-mono">
              紀錄系統
            </span>
          </div>
          <span className="text-[11px] sm:text-xs text-[#7A756D] mt-1 ml-4 font-medium italic">
            一句話、一幅圖，在傳遞中會變成什麼？
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Public Archive Button */}
          <button
            id="btn-nav-archives"
            onClick={() => {
              setViewMode("archive-list");
              setSelectedArchiveId(null);
            }}
            className="text-xs font-sans text-[#2C2A26] hover:text-[#47624F] transition-colors flex items-center gap-1.5 py-1.5 px-3 bg-[#eef2ec] border border-[#c8d0c4] rounded-lg cursor-pointer shadow-sm font-bold"
            title="歷史紀錄"
          >
            <History className="w-3.5 h-3.5 text-[#47624F]" />
            <span>歷史紀錄</span>
          </button>

          {/* Informative Step Badge */}
          {status !== "prompt-setup" && chain.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-mono text-[#7A756D] bg-white border border-[#2C2A26]/10 rounded-lg px-3 py-1.5 shadow-sm">
              <History className="w-3.5 h-3.5 text-[#47624F]" />
              <span>累積接龍：</span>
              <strong className="text-[#2C2A26]">{chain.length}</strong>
            </div>
          )}

          {/* Admin Reset Button with password confirmation */}
          <button
            id="btn-admin-reset-game"
            onClick={() => setIsAdminResetOpen(true)}
            className="text-xs font-sans text-[#7A756D] hover:text-[#B34D43] transition-colors flex items-center gap-1.5 py-1.5 px-3 bg-white border border-[#2C2A26]/10 hover:border-[#B34D43]/30 rounded-lg cursor-pointer shadow-sm"
            title="管理員重置"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重置</span>
          </button>
        </div>
      </header>

      {/* Main Dynamic Workspace Section */}
      <main className="flex-grow flex items-center justify-center p-4 md:p-8 max-w-4xl mx-auto w-full">
        <div className="w-full">
          {/* A. Prompt Setup (Initial Word) */}
          {currentMode === "prompt-setup" && (
            <PromptSetupPage onSubmit={handleInitialPromptSubmit} />
          )}

          {/* B. Drawing Page */}
          {currentMode === "draw" && lastItem && (
            <DrawPage previousText={lastItem.content} onSaveDrawing={handleDrawingSave} />
          )}

          {/* C. Guessing Description Input Page */}
          {currentMode === "guess" && lastItem && (
            <GuessPage previousDrawingUrl={lastItem.content} onSaveGuess={handleGuessSave} />
          )}

          {/* D. Turn Summary (Displaying currently created chain results) */}
          {currentMode === "first-prompt-complete" && chain.length > 0 && (
            <OriginCompletePage promptText={chain[0].content} onContinue={handleHandoverToNext} />
          )}

          {/* E. Turn Summary (Displaying currently created chain results) */}
          {currentMode === "summary" && (
            <SummaryPage chain={chain} onContinue={handleHandoverToNext} />
          )}
        </div>
      </main>

      {/* Global Interactive Dialog for Resets */}
      <ConfirmDialog
        isOpen={isAdminResetOpen}
        title="確定要重新開始接龍嗎？"
        message="這將會徹底刪除儲存的所有繪圖與文字接龍進度，並返回最初的設定題目畫面。公共空間管理員請進行密碼確認。"
        confirmText="確認重置，再度開玩"
        cancelText="暫時保留進度"
        onConfirm={handleRestart}
        onCancel={() => setIsAdminResetOpen(false)}
      />

      {/* Sleek footer adhering to public booth environment */}
      <footer className="text-center text-[10px] sm:text-xs text-[#7A756D] font-mono py-6 border-t border-[#2C2A26]/10 select-none bg-[#F8F7F3] flex flex-col sm:flex-row items-center justify-center gap-2">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#47624F]" />
          <span>公共展位互動模式</span>
        </div>
      </footer>
    </div>
  );
}
