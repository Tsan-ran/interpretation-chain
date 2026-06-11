import React, { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import LargeButton from "./LargeButton";

interface PromptSetupPageProps {
  onSubmit: (prompt: string) => void;
}

export default function PromptSetupPage({ onSubmit }: PromptSetupPageProps) {
  const [prompt, setPrompt] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = prompt.trim();
    if (!clean) return;
    onSubmit(clean);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 text-center animate-in zoom-in-95 ease-out duration-300">
      <div className="flex flex-col items-center mb-8">
        <div className="inline-flex items-center gap-2 bg-[#47624F]/10 border border-[#47624F]/20 text-[#47624F] rounded-full py-1.5 px-4 mb-4 select-none">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-xs font-sans font-bold tracking-wide">第一棒開局任務</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-sans font-extrabold tracking-tight text-[#2C2A26] mb-3 leading-tight">
          你擁有第一個詮釋世界的權力
        </h1>
        <p className="text-sm sm:text-base text-[#7A756D] max-w-md">
          請寫下一句你對世界的理解。這句話會被交給下一位觀眾轉譯、描繪、猜測，也可能在一次次傳遞中被改寫。你留下的不是標準答案，而是這段接龍的第一個版本。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative rounded-2xl border border-[#2C2A26]/15 bg-white p-5 shadow-sm focus-within:border-[#2C2A26]/40 transition-all">
          <textarea
            id="input-prompt-box"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value.slice(0, 50))}
            placeholder="例如：一隻摀住嘴巴並擺動手掌跳舞的狐狸"
            className="w-full text-lg sm:text-xl font-medium text-[#2C2A26] bg-transparent resize-none border-0 outline-none p-2 focus:ring-0 placeholder-[#7A756D]/45 leading-relaxed text-center"
            maxLength={50}
            required
          />
          <div className="absolute right-4 bottom-4 text-xs font-mono text-[#7A756D]/60 font-bold">
            {prompt.length} / 50 字
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <LargeButton
            id="btn-submit-prompt"
            type="submit"
            variant="primary"
            disabled={!prompt.trim()}
            className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            開始傳遞
            <ArrowRight className="w-5 h-5 stroke-[3.5]" />
          </LargeButton>
        </div>
      </form>
    </div>
  );
}
