import { useState } from 'react';
import type { mockWords } from '../../App';
import { AiSection } from '../AiSection';

export function WordCard({
  word,
  dark,
  defaultOpen = false,
}: {
  word: (typeof mockWords)[0];
  dark: boolean;
  defaultOpen?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultOpen);
  const labelClass = `text-[11px] font-semibold uppercase tracking-wider mb-1 block opacity-60 ${dark ? 'text-slate-400' : 'text-slate-500'}`;

  return (
    <div
      className={`rounded-xl border mb-3 overflow-hidden transition-shadow duration-200 ${
        expanded
          ? dark
            ? 'shadow-[0_4px_24px_rgba(0,0,0,0.4)] border-slate-600 bg-slate-800'
            : 'shadow-[0_4px_24px_rgba(0,0,0,0.08)] border-slate-200 bg-white'
          : dark
            ? 'border-slate-700 bg-slate-800'
            : 'border-slate-200 bg-white'
      }`}
    >
      <div
        onClick={() => setExpanded((e) => !e)}
        className="px-4 py-3.5 cursor-pointer flex items-start justify-between gap-3"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <span
              className={`text-[17px] font-bold font-serif tracking-tight ${dark ? 'text-slate-100' : 'text-slate-900'}`}
            >
              {word.word}
            </span>
            {word.aiData && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold tracking-wide ${dark ? 'bg-amber-500/15 text-amber-400' : 'bg-yellow-100 text-yellow-800'}`}
              >
                AI
              </span>
            )}
          </div>
          <p
            className={`text-[13px] mt-0.5 leading-snug ${expanded ? '' : 'line-clamp-2'} ${dark ? 'text-slate-400' : 'text-slate-500'}`}
          >
            {word.meaning}
          </p>
        </div>
        <span
          className={`text-base mt-0.5 flex-shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''} ${dark ? 'text-slate-500' : 'text-slate-400'}`}
        >
          ▼
        </span>
      </div>

      {expanded && (
        <div className="px-4 pb-4">
          {word.sentence && (
            <div className="mb-2.5">
              <span className={labelClass}>Example</span>
              <p
                className={`text-[14px] italic leading-relaxed pl-2.5 border-l-[3px] ${dark ? 'border-slate-600 text-slate-400' : 'border-slate-300 text-slate-500'}`}
              >
                "{word.sentence}"
              </p>
            </div>
          )}
          {word.notes && (
            <div className="mb-2.5">
              <span className={labelClass}>Notes</span>
              <p
                className={`text-[13px] leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-500'}`}
              >
                {word.notes}
              </p>
            </div>
          )}

          <AiSection word={word} dark={dark} />

          <div className="flex gap-2 mt-3.5">
            <button className="px-3 py-1.5 rounded-lg border border-blue-200 text-blue-600 text-[13px] font-medium bg-transparent cursor-pointer hover:bg-blue-50 transition-colors">
              Edit
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-red-200 text-red-500 text-[13px] font-medium bg-transparent cursor-pointer hover:bg-red-50 transition-colors">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
