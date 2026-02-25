"use client";

import { useState, FormEvent } from "react";

interface SearchBarProps {
  onSearch: (setNumber: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [input, setInput] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const cleaned = input.trim().replace(/[^0-9]/g, "");
    if (cleaned.length >= 4 && cleaned.length <= 7) {
      onSearch(cleaned);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md mx-auto">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter set number (e.g. 76421)"
        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || input.trim().replace(/[^0-9]/g, "").length < 4}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? "..." : "Search"}
      </button>
    </form>
  );
}
