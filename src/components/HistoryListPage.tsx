import React, { useState, useEffect } from "react";
import { History, ArrowLeft, Trash2, Calendar, ChevronRight, Lock, X } from "lucide-react";
import { ArchiveRecord } from "../types";
import LargeButton from "./LargeButton";
import { ANONYMOUS_AUTHOR_NAME } from "../constants";

const ADMIN_PASSWORD = "114302130413";

interface HistoryListPageProps {
  archives: ArchiveRecord[];
  onSelectArchive: (id: string) => void;
  onBackToGame: () => void;
  onClearArchives: () => void;
}

export default function HistoryListPage({
  archives,
  onSelectArchive,
  onBackToGame,
  onClearArchives,
}: HistoryListPageProps) {
  const [isDeletingOpen, setIsDeletingOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isDeletingOpen) {
      setPassword("");
      setErrorMessage("");
    }
  }, [isDeletingOpen]);

  const handleDeleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setPassword("");
      setErrorMessage("");
      setIsDeletingOpen(false);
      onClearArchives();
    } else {
      setErrorMessage("密碼錯誤，無法刪除歷史紀錄");
    }
  };

  return (
    <div className="history-list-page fixed inset-0 w-full h-full bg-[#F8F7F3] text-[#2C2A26] z-50 flex flex-col justify-between select-none">
      <style>{`
        .history-list-page {
          height: 100vh;
          height: 100dvh;
          display: grid;
          grid-template-rows: auto 1fr auto;
          overflow: hidden;
        }
        .history-header {
          border-bottom: 1px solid rgba(44, 42, 38, 0.1);
          background: #F8F7F3;
          z-index: 10;
          padding: 18px 24px 14px;
        }
        .history-scroll-area {
          min-height: 0;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          padding: 24px 16px;
        }
        .history-footer {
          border-top: 1px solid rgba(44, 42, 38, 0.1);
          background: #F8F7F3;
          z-index: 10;
          padding: 14px 24px calc(14px + env(safe-area-inset-bottom));
        }
        .history-content {
          max-width: 720px;
          margin: 0 auto;
          width: 100%;
        }
        .history-card {
          background: #ffffff;
          border: 1px solid rgba(44, 42, 38, 0.12);
          border-radius: 10px;
          padding: 18px 20px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
        }
        .history-card:active {
          transform: scale(0.98);
          background: #fbfbfa;
        }
        .history-date {
          font-size: 20px;
          font-weight: 800;
          color: #2C2A26;
          font-family: sans-serif;
        }
        .history-meta {
          color: #5f735e;
          font-size: 13px;
          font-weight: bold;
          background: #eef2ec;
          padding: 2px 8px;
          border-radius: 6px;
          display: inline-block;
        }
        .history-preview {
          color: #7A756D;
          font-size: 14px;
          line-height: 1.5;
        }
        .delete-archive-button {
          background: transparent;
          color: #9b2f2f;
          border: 1px solid rgba(155, 47, 47, 0.25);
          border-radius: 8px;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .delete-archive-button:hover {
          background: rgba(155, 47, 47, 0.05);
          border-color: rgba(155, 47, 47, 0.6);
        }
        .delete-archive-button:active {
          background: rgba(155, 47, 47, 0.1);
          transform: scale(0.97);
        }
      `}</style>

      {/* 上方固定區塊 */}
      <header className="history-header">
        <div className="history-content flex flex-col md:flex-row md:items-center md:justify-between gap-3 select-none">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-[#47624F]/10 border border-[#47624F]/20 text-[#47624F] rounded-full py-0.5 px-2.5">
              <History className="w-3.5 h-3.5" />
              <span className="text-[10px] sm:text-xs font-sans font-bold">歷史紀錄</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-sans font-extrabold text-[#2C2A26] tracking-tight">
              詮釋紀錄庫
            </h1>
            <p className="text-[11px] sm:text-xs text-[#7A756D] leading-tight">
              這裡保存每日留下的詮釋接龍。每一天都是一段被傳遞、轉譯與改寫的世界版本。
            </p>
          </div>
          
          <button
            onClick={onBackToGame}
            className="shrink-0 self-start md:self-center h-10 px-4 bg-white border border-[#2C2A26]/12 rounded-lg text-xs font-sans font-extrabold text-[#2C2A26] flex items-center gap-1.5 active:scale-95 transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#47624F]" />
            <span>回到今日接龍</span>
          </button>
        </div>
      </header>

      {/* 中間滑動區區 */}
      <main className="history-scroll-area">
        <div className="history-content space-y-4">
          {archives.length === 0 ? (
            <div className="border border-[#2C2A26]/10 border-dashed rounded-xl p-12 text-center bg-white/50 select-none">
              <p className="text-sm sm:text-base text-[#7A756D] max-w-sm mx-auto leading-relaxed font-medium">
                目前還沒有封存的紀錄。明天第一次開啟時，今天的接龍會被保存到這裡。
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {archives.map((archive) => {
                const firstAuthorName = archive.chain[0]?.authorName?.trim() || ANONYMOUS_AUTHOR_NAME;

                return (
                  <div
                    key={archive.id}
                    onClick={() => onSelectArchive(archive.id)}
                    className="history-card flex items-center justify-between gap-4 cursor-pointer hover:border-[#47624F]/30"
                  >
                    <div className="space-y-2 flex-grow min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="history-date">{archive.date.replace(/-/g, ".")}</span>
                        <span className="history-meta">{`共 ${archive.itemCount} 次詮釋`}</span>
                      </div>
                      <p className="text-xs font-sans font-semibold text-[#7A756D]/75">
                        起點由 {firstAuthorName} 留下
                      </p>
                      {archive.firstText && (
                        <p className="history-preview truncate font-sans text-sm font-medium">
                          <span className="text-[#5f735e] font-bold">起點：</span>
                          {archive.firstText}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#7A756D] shrink-0" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* 下方固定區塊 */}
      <footer className="history-footer">
        <div className="history-content flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-auto">
            <LargeButton
              id="btn-history-back"
              variant="secondary"
              onClick={onBackToGame}
              className="w-full sm:w-60 h-12 font-sans font-bold text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 stroke-[3]" />
              回到今日接龍
            </LargeButton>
          </div>
          
          {archives.length > 0 && (
            <button
              onClick={() => setIsDeletingOpen(true)}
              className="delete-archive-button font-sans"
              type="button"
            >
              <Trash2 className="w-3.5 h-3.5 inline mr-1.5 align-text-bottom" />
              刪除歷史紀錄
            </button>
          )}
        </div>
      </footer>

      {/* 密碼驗證清除歷史紀錄 Modal */}
      {isDeletingOpen && (
        <div className="fixed inset-0 bg-[#2C2A26]/65 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="max-w-md w-full bg-white border border-[#2C2A26]/15 rounded-2xl p-6 sm:p-8 text-center shadow-xl relative space-y-6">
            <button
              onClick={() => setIsDeletingOpen(false)}
              className="absolute right-4 top-4 text-[#7A756D] hover:text-[#2C2A26] transition-colors"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mx-auto w-14 h-14 rounded-full bg-[#B34D43]/10 border border-[#B34D43]/20 text-[#B34D43] flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-2 select-none text-center">
              <h3 className="text-lg sm:text-xl font-sans font-bold text-[#2C2A26] tracking-tight">
                刪除歷史紀錄
              </h3>
              <p className="text-xs sm:text-sm text-[#7A756D] leading-relaxed max-w-xs mx-auto">
                這個操作會刪除所有已封存的歷史紀錄，但不會刪除今日正在進行的接龍。
              </p>
            </div>

            <form onSubmit={handleDeleteSubmit} className="space-y-4 pt-1 text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-sans font-bold text-[#7A756D] px-1">
                  請輸入管理員密碼
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    className="w-full h-12 rounded-xl bg-[#F8F7F3] border border-[#2C2A26]/15 focus:border-[#B34D43]/50 font-sans font-semibold text-[#2C2A26] text-base pl-10 pr-4 focus:outline-none transition-all"
                    placeholder="管理員確認密碼"
                    required
                    autoFocus
                  />
                  <Lock className="w-4 h-4 text-[#7A756D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
                {errorMessage && (
                  <p className="text-xs font-semibold text-[#B34D43] px-1 mt-1">
                    {errorMessage}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <LargeButton type="button" variant="secondary" onClick={() => setIsDeletingOpen(false)}>
                  取消
                </LargeButton>
                <LargeButton type="submit" variant="danger">
                  確認刪除
                </LargeButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
