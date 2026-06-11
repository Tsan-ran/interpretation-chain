import React, { useState, useEffect } from "react";
import { AlertTriangle, Lock, X } from "lucide-react";
import LargeButton from "./LargeButton";

const ADMIN_RESET_PASSWORD = "114302130413";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "確認重置",
  cancelText = "取消",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Clear states when dialog opens or closes
  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setErrorMessage("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_RESET_PASSWORD) {
      setPassword("");
      setErrorMessage("");
      onConfirm();
    } else {
      setErrorMessage("密碼錯誤，無法重置");
    }
  };

  const handleCancelClick = () => {
    setPassword("");
    setErrorMessage("");
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-[#2C2A26]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="max-w-md w-full bg-white border border-[#2C2A26]/15 rounded-2xl p-6 sm:p-8 text-center shadow-xl relative space-y-6">
        
        {/* Absolute Close button */}
        <button
          onClick={handleCancelClick}
          className="absolute right-4 top-4 text-[#7A756D] hover:text-[#2C2A26] transition-colors"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Danger/Warning Graphic Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-[#B34D43]/10 border border-[#B34D43]/20 text-[#B34D43] flex items-center justify-center">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-2 select-none">
          <h3 className="text-xl font-sans font-bold text-[#2C2A26] tracking-tight">
            {title}
          </h3>
          <p className="text-sm text-[#7A756D] leading-relaxed">
            {message}
          </p>
        </div>

        {/* Administrator Verification Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1 text-left">
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
                className="w-full h-14 rounded-xl bg-[#F8F7F3] border border-[#2C2A26]/15 focus:border-[#B34D43]/50 font-sans font-semibold text-[#2C2A26] text-lg pl-12 pr-5 focus:outline-none transition-all"
                placeholder="基本重置密碼"
                required
                autoFocus
              />
              <Lock className="w-5 h-5 text-[#7A756D] absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
            {errorMessage && (
              <p className="text-xs font-semibold text-[#B34D43] px-1 mt-1">
                {errorMessage}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <LargeButton type="button" variant="secondary" onClick={handleCancelClick}>
              {cancelText}
            </LargeButton>
            <LargeButton type="submit" variant="danger">
              {confirmText}
            </LargeButton>
          </div>
        </form>
      </div>
    </div>
  );
}
