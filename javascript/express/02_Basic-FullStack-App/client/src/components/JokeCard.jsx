import { useState } from "react";

export const JokeCard = ({ joke }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${joke.name}\n\n${joke.content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="group relative rounded-2xl p-[1px] bg-gradient-to-r from-sky-500/40 via-indigo-500/40 to-purple-500/40 transition">
      <div className="rounded-2xl bg-[#0b102a]/90 backdrop-blur-xl p-6 transition-all duration-300 group-hover:scale-[1.015] group-hover:shadow-lg group-hover:shadow-indigo-500/10">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold text-sky-300">{joke.name}</h2>

          <button
            onClick={handleCopy}
            className="text-xs px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700"
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>

        <p className="mt-3 text-slate-300 leading-relaxed">{joke.content}</p>
      </div>
    </div>
  );
};
