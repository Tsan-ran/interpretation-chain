import React, { useState } from "react";
import { Paintbrush, ArrowDown, Sparkles } from "lucide-react";
import DrawingCanvas from "./DrawingCanvas";
import LargeButton from "./LargeButton";

interface DrawPageProps {
  previousText: string;
  onSaveDrawing: (dataUrl: string) => void;
}

export default function DrawPage({ previousText, onSaveDrawing }: DrawPageProps) {
  const [drawingUrl, setDrawingUrl] = useState<string>("");
  const [isEmpty, setIsEmpty] = useState<boolean>(true);

  const handleCanvasChange = (dataUrl: string) => {
    setDrawingUrl(dataUrl);
    setIsEmpty(!dataUrl); // If dataUrl is empty string, canvas is blank
  };

  const handleSubmit = () => {
    if (isEmpty) {
      alert("你的畫紙好像還是一片空白。請動筆畫點東西再送出喔！");
      return;
    }
    onSaveDrawing(drawingUrl);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-2 py-4 space-y-6 animate-in fade-in duration-200">
      <div className="text-center space-y-3 select-none">
        <div className="inline-flex items-center gap-1.5 bg-[#47624F]/10 border border-[#47624F]/20 text-[#47624F] rounded-full py-1.5 px-4">
          <Paintbrush className="w-4 h-4" />
          <span className="text-xs font-sans font-bold">繪圖紀錄任務</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-sans font-extrabold text-[#2C2A26]">
          請依文字進行描繪：
        </h2>
        
        {/* elegant specimen card sticker style */}
        <div className="inline-block bg-white border border-[#2C2A26]/15 rounded-xl px-8 py-5 shadow-sm relative max-w-xl mx-auto mt-2">
          <p className="text-xl sm:text-2xl font-sans font-extrabold text-[#2C2A26] tracking-wide select-text leading-relaxed">
            「 {previousText} 」
          </p>
          {/* bubble arrow tip */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-t-8 border-t-white border-x-8 border-x-transparent" />
        </div>
      </div>

      {/* Pointer/Stylus Enabled Interactive Drawing Canvas Box */}
      <div className="pt-2">
        <DrawingCanvas
          onSave={handleCanvasChange}
          initialDataUrl={drawingUrl}
        />
      </div>

      <div className="flex justify-center pt-2">
        <LargeButton
          id="btn-submit-masterpiece"
          variant="primary"
          onClick={handleSubmit}
          disabled={isEmpty}
          className="max-w-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          手繪完成，送出畫作
        </LargeButton>
      </div>
    </div>
  );
}
