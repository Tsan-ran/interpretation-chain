import React from "react";

interface NicknameFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export default function NicknameField({ value, onChange }: NicknameFieldProps) {
  return (
    <div className="nickname-field">
      <label htmlFor="input-nickname-box">留下你的暱稱</label>
      <input
        id="input-nickname-box"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 24))}
        placeholder="可不填"
        maxLength={24}
        autoComplete="off"
      />
      <small>暱稱只會出現在這次留下的詮釋紀錄中。</small>
    </div>
  );
}
