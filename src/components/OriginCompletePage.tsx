import React from "react";
import { Check, ArrowRight } from "lucide-react";
import LargeButton from "./LargeButton";
import { ANONYMOUS_AUTHOR_NAME } from "../constants";

interface OriginCompletePageProps {
  promptText: string;
  authorName?: string;
  onContinue: () => void;
}

export default function OriginCompletePage({ promptText, authorName, onContinue }: OriginCompletePageProps) {
  const displayAuthorName = authorName?.trim() || ANONYMOUS_AUTHOR_NAME;

  return (
    <div className="origin-complete-page w-full min-h-[70vh] flex items-center justify-center p-4 sm:p-6 select-none">
      <style>{`
        .origin-complete-page {
          background: #F8F7F3;
        }
        .origin-card {
          width: 100%;
          max-width: 760px;
          background: #ffffff;
          border: 1px solid rgba(44, 42, 38, 0.12);
          border-radius: 12px;
          padding: 36px 32px;
          text-align: center;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
        }
        .origin-card h1 {
          font-size: 28px;
          sm:font-size: 32px;
          line-height: 1.25;
          color: #2C2A26;
          margin: 16px 0;
          font-weight: 800;
          font-family: sans-serif;
        }
        .origin-card p.desc-text {
          color: #7A756D;
          font-size: 15px;
          line-height: 1.7;
          margin-bottom: 24px;
          max-width: 580px;
          margin-left: auto;
          margin-right: auto;
        }
        .origin-prompt-card {
          margin: 24px auto;
          padding: 20px 24px;
          border: 1px solid #d8d8d2;
          background: #f8f8f5;
          border-radius: 8px;
          text-align: left;
        }
        .origin-prompt-card span {
          display: block;
          color: #7A756D;
          font-size: 14px;
          margin-bottom: 8px;
          font-weight: bold;
        }
        .origin-author {
          color: #7A756D;
          font-size: 13px;
          line-height: 1.5;
          margin-top: 12px;
          font-weight: 600;
        }
        .origin-prompt-card strong {
          display: block;
          color: #2C2A26;
          font-size: 22px;
          line-height: 1.5;
          font-weight: 700;
        }
        .section-pill {
          display: inline-block;
          color: #2f332f;
          background: #eef2ec;
          border: 1px solid #c8d0c4;
          border-radius: 999px;
          padding: 6px 14px;
          font-size: 13px;
          font-weight: bold;
          text-transform: uppercase;
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
          max-width: 480px;
          margin: 0 auto 14px;
        }
        .daily-reset-note {
          color: #6f6f6f;
          font-size: 13px;
          line-height: 1.4;
          text-align: center;
          margin-top: 10px;
        }
      `}</style>

      <div className="origin-card animate-in zoom-in-95 ease-out duration-300">
        <span className="section-pill">起點已建立</span>

        <h1>第一個世界版本已經留下</h1>

        <p className="desc-text">
          你寫下的這句話，將成為這段詮釋接龍的起點。下一位觀眾不會看到任何解釋，只會根據這句話，把它轉成圖像。
        </p>

        <div className="origin-prompt-card max-w-md">
          <span>你留下的起始詮釋</span>
          <strong>「 {promptText} 」</strong>
          <p className="origin-author">由 {displayAuthorName} 留下的起始詮釋</p>
        </div>

        <p className="next-invite-note">
          邀請下一位來把這句話畫出來。
        </p>

        <div className="flex flex-col items-center">
          <LargeButton
            id="btn-origin-confirm"
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
      </div>
    </div>
  );
}
