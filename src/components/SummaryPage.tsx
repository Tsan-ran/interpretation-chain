import React, { useRef, useEffect } from "react";
import { ArrowLeftRight, Check, Eye } from "lucide-react";
import { ChainItem } from "../types";
import LargeButton from "./LargeButton";

interface SummaryPageProps {
  chain: ChainItem[];
  onContinue: () => void;
}

export default function SummaryPage({ chain, onContinue }: SummaryPageProps) {
  const lastItem = chain[chain.length - 1];
  
  let helperText = "下一位觀眾將配合進行詮釋。";
  if (lastItem) {
    if (lastItem.type === "drawing") {
      helperText = "下一位觀眾將根據這幅圖，寫下他的理解。";
    } else if (lastItem.type === "text") {
      helperText = "下一位觀眾將根據這段理解，再次轉成圖像。";
    }
  }

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        block: "end",
        behavior: "auto"
      });
    } else if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
    const timer = setTimeout(scrollToBottom, 150);
    return () => clearTimeout(timer);
  }, [chain.length]);

  return (
    <div className="summary-page fixed inset-0 w-full h-full bg-[#F8F7F3] text-[#2C2A26] z-50">
      <style>{`
        .summary-page {
          height: 100vh;
          height: 100dvh;
          display: grid;
          grid-template-rows: auto 1fr auto;
          overflow: hidden;
        }
        .summary-scroll-area {
          min-height: 0;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          padding: 24px 16px;
        }
        .summary-header {
          border-bottom: 1px solid rgba(44, 42, 38, 0.1);
          background: #F8F7F3;
          z-index: 10;
          padding: 18px 24px 14px;
        }
        .summary-footer {
          border-top: 1px solid rgba(44, 42, 38, 0.1);
          background: #F8F7F3;
          z-index: 10;
          padding: 14px 24px calc(14px + env(safe-area-inset-bottom));
        }
        .summary-content {
          max-width: 720px;
          margin: 0 auto;
          width: 100%;
        }
        .summary-card-img {
          width: 100%;
          max-height: 240px;
          object-fit: contain;
          display: block;
        }
        .next-invite-note {
          color: #2f332f;
          background: #eef2ec;
          border: 1px solid #c8d0c4;
          border-left: 5px solid #5f735e;
          border-radius: 999px;
          padding: 10px 18px;
          font-size: 15px;
          line-height: 1.5;
          font-weight: 600;
          text-align: center;
          max-width: 720px;
          margin: 0 auto 12px;
        }
        .daily-reset-note {
          color: #6f6f6f;
          font-size: 13px;
          line-height: 1.4;
          text-align: center;
          margin-top: 8px;
        }
      `}</style>

      {/* 上方固定區塊 SummaryHeader */}
      <header className="summary-header">
        <div className="summary-content flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 select-none">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-[#47624F]/10 border border-[#47624F]/20 text-[#47624F] rounded-full py-0.5 px-2.5">
              <Eye className="w-3.5 h-3.5" />
              <span className="text-[10px] sm:text-xs font-sans font-bold">目前接龍結果</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-sans font-extrabold text-[#2C2A26] tracking-tight">
              這段理解如何被改寫
            </h1>
            <p className="text-[11px] sm:text-xs text-[#7A756D] leading-tight max-w-xl">
              從第一句話開始，每一次轉譯都留下了新的理解，也帶走了一部分原意。
            </p>
          </div>
          
          <div className="shrink-0 flex items-center justify-start md:justify-end">
            <div className="inline-block bg-[#2C2A26]/5 border border-[#2C2A26]/10 rounded-lg px-3 py-1.5 text-xs font-mono font-semibold text-[#2C2A26]">
              目前已累積 <strong className="text-[#47624F] font-bold">{chain.length}</strong> 次詮釋
            </div>
          </div>
        </div>
      </header>

      {/* 中間可滑動區塊 SummaryScrollArea */}
      <main className="summary-scroll-area" ref={scrollRef}>
        <div className="summary-content space-y-8 relative before:absolute before:left-6 sm:before:left-8 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#2C2A26]/10 pb-8">
          {chain.map((item, idx) => {
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

                {/* Box Content Card */}
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
                        alt={`第 ${stepNumber} 步創作`}
                        className="summary-card-img select-none pointer-events-none"
                        onLoad={scrollToBottom}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} className="h-2" />
        </div>
      </main>

      {/* 下方固定區塊 SummaryFooter */}
      <footer className="summary-footer">
        <div className="summary-content flex flex-col items-center">
          <p className="next-invite-note w-full max-w-md font-sans font-semibold">
            {helperText}
          </p>

          <LargeButton
            id="btn-confirm-summary-to-next"
            variant="primary"
            onClick={onContinue}
            className="w-full max-w-md h-12 sm:h-14 font-sans font-bold text-base sm:text-lg shadow-sm"
          >
            <Check className="w-5 h-5 stroke-[3.5]" />
            交給下一位理解者
          </LargeButton>

          <p className="daily-reset-note font-sans font-bold">
            這份詮釋紀錄會在明天第一次開啟時重新開始。
          </p>
        </div>
      </footer>
    </div>
  );
}
