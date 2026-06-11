import React from "react";
import { ArrowLeft, History, Eye, List } from "lucide-react";
import { ArchiveRecord } from "../types";
import LargeButton from "./LargeButton";

interface HistoryDetailPageProps {
  archive: ArchiveRecord;
  onBackToList: () => void;
  onBackToGame: () => void;
}

export default function HistoryDetailPage({
  archive,
  onBackToList,
  onBackToGame,
}: HistoryDetailPageProps) {
  return (
    <div className="history-detail-page fixed inset-0 w-full h-full bg-[#F8F7F3] text-[#2C2A26] z-50 flex flex-col justify-between select-none">
      <style>{`
        .history-detail-page {
          height: 100vh;
          height: 100dvh;
          display: grid;
          grid-template-rows: auto 1fr auto;
          overflow: hidden;
        }
        .detail-header {
          border-bottom: 1px solid rgba(44, 42, 38, 0.1);
          background: #F8F7F3;
          z-index: 10;
          padding: 18px 24px 14px;
        }
        .detail-scroll-area {
          min-height: 0;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          padding: 24px 16px;
        }
        .detail-footer {
          border-top: 1px solid rgba(44, 42, 38, 0.1);
          background: #F8F7F3;
          z-index: 10;
          padding: 14px 24px calc(14px + env(safe-area-inset-bottom));
        }
        .detail-content {
          max-width: 720px;
          margin: 0 auto;
          width: 100%;
        }
        .detail-card-img {
          width: 100%;
          max-height: 240px;
          object-fit: contain;
          display: block;
        }
      `}</style>

      {/* 上方固定區塊 */}
      <header className="detail-header">
        <div className="detail-content flex flex-col md:flex-row md:items-center md:justify-between gap-3 select-none">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-[#47624F]/10 border border-[#47624F]/20 text-[#47624F] rounded-full py-0.5 px-2.5">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span className="text-[10px] sm:text-xs font-sans font-bold">
                {archive.date.replace(/-/g, ".")} 存檔
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-sans font-extrabold text-[#2C2A26] tracking-tight">
              {archive.date.replace(/-/g, ".")} 的詮釋紀錄
            </h1>
            <p className="text-[11px] sm:text-xs text-[#7A756D] leading-tight">
              這一天的接龍已封存，僅供回顧，不會再被修改。
            </p>
          </div>
          
          <div className="shrink-0 flex items-center gap-2">
            <div className="inline-block bg-[#2C2A26]/5 border border-[#2C2A26]/10 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-[#2C2A26]">
              共 {archive.itemCount} 次詮釋
            </div>
          </div>
        </div>
      </header>

      {/* 中間滑動區塊 */}
      <main className="detail-scroll-area">
        <div className="detail-content space-y-8 relative before:absolute before:left-6 sm:before:left-8 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#2C2A26]/10 pb-8">
          {archive.chain.map((item, idx) => {
            const stepNumber = idx + 1;
            const isText = item.type === "text";
            const isFirst = idx === 0;

            let stepTitle = "";
            if (isFirst) {
              stepTitle = "起始題目";
            } else if (isText) {
              stepTitle = "文字理解";
            } else {
              stepTitle = "圖像詮釋";
            }

            return (
              <div
                key={item.id}
                className="relative pl-14 sm:pl-20 animate-in slide-in-from-bottom-5 duration-300"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                {/* Timeline badge node */}
                <div className="absolute left-2 sm:left-4 top-1.5 w-8 h-8 rounded-full bg-white border border-[#2C2A26]/20 flex items-center justify-center font-mono font-bold text-xs text-[#2C2A26] shadow-sm z-10">
                  {stepNumber}
                </div>

                {/* Card */}
                <div className="bg-white border border-[#2C2A26]/12 rounded-xl p-4 sm:p-5 shadow-sm hover:border-[#2C2A26]/25 transition-all">
                  <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#2C2A26]/5">
                    <span className="text-xs font-sans font-bold text-[#7A756D]">
                      {stepTitle}
                    </span>
                    <span className="text-[10px] font-mono text-[#7A756D]/60 font-medium font-bold">
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </span>
                  </div>

                  {isText ? (
                    <p className="text-base sm:text-lg font-sans font-semibold text-[#2C2A26] tracking-wide leading-relaxed">
                      「 {item.content} 」
                    </p>
                  ) : (
                    <div className="border border-[#2C2A26]/10 rounded-lg overflow-hidden bg-white max-w-sm aspect-[4/3] flex items-center justify-center p-1 mt-2 shadow-inner select-none">
                      <img
                        src={item.content}
                        alt={`第 ${stepNumber} 步`}
                        className="detail-card-img select-none pointer-events-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* 下方固定區塊 */}
      <footer className="detail-footer">
        <div className="detail-content flex flex-col sm:flex-row items-center justify-center gap-3">
          <LargeButton
            id="btn-detail-back-to-list"
            variant="secondary"
            onClick={onBackToList}
            className="w-full sm:w-60 h-12 font-sans font-bold text-sm sm:text-base"
          >
            <List className="w-4 h-4" />
            返回歷史紀錄
          </LargeButton>

          <LargeButton
            id="btn-detail-home"
            variant="primary"
            onClick={onBackToGame}
            className="w-full sm:w-60 h-12 font-sans font-bold text-sm sm:text-base shadow-sm"
          >
            回到今日接龍
          </LargeButton>
        </div>
      </footer>
    </div>
  );
}

// Inline minimalist icon to avoid complex sub-imports
function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
