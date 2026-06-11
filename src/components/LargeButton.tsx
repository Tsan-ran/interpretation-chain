import React from "react";

interface LargeButtonProps {
  id?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  variant?: "primary" | "secondary" | "danger" | "success";
  children: React.ReactNode;
}

export default function LargeButton({
  variant = "primary",
  children,
  className = "",
  ...props
}: LargeButtonProps) {
  const baseStyle =
    "w-full h-14 sm:h-16 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-sans font-bold text-base sm:text-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] select-none outline-none border";

  const variants = {
    primary: "bg-[#2C2A26] hover:bg-[#3E3B36] text-white border-[#2C2A26] shadow-sm",
    secondary: "bg-white hover:bg-[#F8F7F3] text-[#2C2A26] border-[#2C2A26]/15 shadow-sm",
    danger: "bg-[#B34D43] hover:bg-[#9D3D34] text-white border-[#B34D43] shadow-sm",
    success: "bg-[#47624F] hover:bg-[#3D5344] text-white border-[#47624F] shadow-sm",
  };

  return (
    <button
      {...props}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
