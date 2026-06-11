import React from "react";
import { CalendarDays } from "lucide-react";
import LargeButton from "./LargeButton";

interface NewDayNoticePageProps {
  onStart: () => void;
}

export default function NewDayNoticePage({ onStart }: NewDayNoticePageProps) {
  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-2xl bg-white border border-[#2C2A26]/12 rounded-xl px-6 py-8 sm:px-10 sm:py-10 text-center shadow-sm animate-in zoom-in-95 ease-out duration-300">
        <div className="inline-flex items-center gap-1.5 bg-[#47624F]/10 border border-[#47624F]/20 text-[#47624F] rounded-full py-1.5 px-4 mb-5">
          <CalendarDays className="w-4 h-4" />
          <span className="text-xs font-sans font-bold">新的展示日</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-sans font-extrabold tracking-tight text-[#2C2A26] leading-tight mb-4">
          今天的詮釋接龍即將開始
        </h1>

        <p className="text-sm sm:text-base text-[#7A756D] leading-relaxed max-w-lg mx-auto mb-8">
          昨天留下的詮釋紀錄已封存到歷史紀錄。請由今天的第一位觀眾，留下新的起始詮釋。
        </p>

        <div className="max-w-md mx-auto">
          <LargeButton
            id="btn-start-new-day"
            variant="primary"
            onClick={onStart}
            className="w-full h-12 sm:h-14 font-sans font-bold text-base sm:text-lg shadow-sm"
          >
            開始今天的接龍
          </LargeButton>
        </div>
      </div>
    </div>
  );
}
