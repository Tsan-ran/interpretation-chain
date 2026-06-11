import React, { useRef, useState, useEffect } from "react";
import { Trash2, Circle } from "lucide-react";

interface DrawingCanvasProps {
  onSave: (dataUrl: string) => void;
  initialDataUrl?: string;
}

export default function DrawingCanvas({ onSave, initialDataUrl }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState<number>(4);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Initialize and handle resize correctly
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fixed internal coordinate system for uniform quality, while filling the container visually
    canvas.width = 800;
    canvas.height = 600;

    // Fill white background initially
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // If initial drawing is loaded
    if (initialDataUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        setHasDrawn(true);
      };
      img.src = initialDataUrl;
    }

    // Set standard styles
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0d1b2a"; // Blackish / Deep slate ink
  }, []);

  // Sync stroke width to ctx
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.lineWidth = lineWidth;
    }
  }, [lineWidth]);

  // Helper to get coordinates on the internal 800x600 grid from screen pointer coordinates
  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    
    // Scale standard coordinate space mapping 
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    
    return { x, y };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const coords = getCoordinates(e);
    if (!ctx || !coords) return;

    // Capture pointer pressure if available (supporting stylus pens!)
    let pressureWidth = lineWidth;
    if (e.pointerType === "pen" && e.pressure > 0) {
      pressureWidth = lineWidth * e.pressure * 1.5;
    }
    ctx.lineWidth = pressureWidth;

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const coords = getCoordinates(e);
    if (!canvas || !ctx || !coords) return;

    let pressureWidth = lineWidth;
    if (e.pointerType === "pen" && e.pressure > 0) {
      pressureWidth = lineWidth * e.pressure * 1.5;
    }
    ctx.lineWidth = pressureWidth;

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();

    // Trigger save callback back to parent
    onSave(canvas.toDataURL("image/png"));
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      if (canvas) {
        onSave(canvas.toDataURL("image/png"));
      }
    }
  };

  // Action: Reset canvas panel back to pure white
  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onSave(""); // empty state
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col space-y-4">
      {/* Precision Frame with warm white backgrounds for canvas drawing paper */}
      <div className="relative border border-[#2C2A26]/20 bg-white rounded-xl overflow-hidden aspect-[4/3] w-full max-w-2xl mx-auto shadow-sm select-none">
        <canvas
          ref={canvasRef}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
          className="w-full h-full block cursor-crosshair bg-white touch-none"
          style={{ touchAction: "none" }}
        />
        {!hasDrawn && (
          <div className="absolute inset-0 flex items-center justify-center text-[#7A756D]/50 pointer-events-none select-none font-sans text-sm sm:text-base border border-dashed border-[#2C2A26]/10 m-4 rounded-lg">
            用手指或觸控筆在這裡畫畫...
          </div>
        )}
      </div>

      {/* Controls: Stroke Widths & Fast Clear Canvas */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-2xl w-full mx-auto bg-white border border-[#2C2A26]/12 rounded-xl p-4 select-none shadow-sm">
        {/* Stroke sizes choice */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <span className="text-xs font-sans font-bold text-[#7A756D]">筆觸：</span>
          <div className="flex items-center gap-2">
            {[2, 5, 10].map((size, index) => {
              const sizeLabel = index === 0 ? "細筆" : index === 1 ? "中筆" : "粗筆";
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setLineWidth(size)}
                  className={`h-11 px-4 rounded-lg text-xs font-bold font-sans flex items-center gap-1.5 transition-all active:scale-95 border ${
                    lineWidth === size
                      ? "bg-[#2C2A26] text-white border-[#2C2A26]"
                      : "bg-[#F8F7F3] text-[#7A756D] border-[#2C2A26]/10 hover:text-[#2C2A26]"
                  }`}
                >
                  <Circle
                    className="fill-current"
                    style={{ width: `${size + 1}px`, height: `${size + 1}px` }}
                  />
                  {sizeLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Clear Action Button */}
        <button
          type="button"
          onClick={handleClear}
          className="h-11 px-5 w-full sm:w-auto rounded-lg bg-white hover:bg-[#B34D43]/5 text-[#B34D43] border border-[#B34D43]/20 hover:border-[#B34D43]/40 transition-all text-xs font-bold font-sans flex items-center justify-center gap-1.5 active:scale-95"
        >
          <Trash2 className="w-4 h-4" />
          清除畫紙
        </button>
      </div>
    </div>
  );
}
