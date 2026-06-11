import React, { useState } from "react";
import { MessageSquare, ArrowRight } from "lucide-react";
import LargeButton from "./LargeButton";

interface GuessPageProps {
  previousDrawingUrl: string;
  onSaveGuess: (guessText: string) => void;
}

export default function GuessPage({ previousDrawingUrl, onSaveGuess }: GuessPageProps) {
  const [guess, setGuess] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = guess.trim();
    if (!clean) return;
    onSaveGuess(clean);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 space-y-6 animate-in fade-in duration-250">
      <div className="text-center select-none space-y-1">
        <div className="inline-flex items-center gap-1.5 bg-[#47624F]/10 border border-[#47624F]/20 text-[#47624F] rounded-full py-1.5 px-4">
          <MessageSquare className="w-4 h-4" />
          <span className="text-xs font-sans font-bold">看圖猜題任務</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-sans font-extrabold text-[#2C2A26] pt-2">
          請猜這張圖是什麼
        </h2>
        <p className="text-xs sm:text-sm text-[#7A756D]">
          請仔細觀看手繪圖作，發揮你的直覺，寫下最符合的猜測。
        </p>
      </div>

      {/* Picture Viewer aspect locked and centered */}
      <div className="border border-[#2C2A26]/25 bg-white rounded-xl overflow-hidden aspect-[4/3] w-full max-w-lg mx-auto flex items-center justify-center p-2 shadow-sm relative select-none">
        <img
          src={previousDrawingUrl}
          alt="上一頁的手繪畫作"
          className="w-full h-auto object-contain max-h-full block select-none pointer-events-none"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Input box form */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#2C2A26]/15 rounded-xl p-6 shadow-sm space-y-4 max-w-lg mx-auto">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-sans font-bold text-[#7A756D] px-1">
            你的答案是：
          </label>
          <input
            id="input-guess-box"
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value.slice(0, 50))}
            placeholder="例如：一條在衝浪的熱狗"
            maxLength={50}
            required
            autoComplete="off"
            className="w-full h-14 rounded-lg bg-[#F8F7F3] border border-[#2C2A26]/15 focus:border-[#2C2A26]/40 font-sans font-bold text-[#2C2A26] text-lg px-5 focus:outline-none transition-all text-center"
          />
        </div>

        <LargeButton
          id="btn-submit-guess"
          type="submit"
          variant="primary"
          disabled={!guess.trim()}
          className="disabled:opacity-50"
        >
          送出猜測
          <ArrowRight className="w-5 h-5 stroke-[3.5]" />
        </LargeButton>
      </form>
    </div>
  );
}
