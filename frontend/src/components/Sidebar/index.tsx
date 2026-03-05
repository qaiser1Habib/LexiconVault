import type { Dispatch, SetStateAction } from 'react';
import { ALPHABET, mockWords } from '../../App';

interface SidebarProps {
  dark: boolean;
  setActiveLetter: (letter: string | null) => void;
  setSearch: Dispatch<SetStateAction<string>>;
  letterCounts: Record<string, number>;
  activeLetter: string | null;
  search: string;
}

const Sidebar = ({
  dark,
  activeLetter,
  search,
  setActiveLetter,
  setSearch,
  letterCounts,
}: SidebarProps) => {
  return (
    <div className="sticky top-20 self-start">
      <div
        className={`rounded-2xl border overflow-hidden ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
      >
        <div className={`px-3.5 py-3 border-b ${dark ? 'border-slate-700' : 'border-slate-100'}`}>
          <p
            className={`text-[11px] font-bold uppercase tracking-widest ${dark ? 'text-slate-500' : 'text-slate-400'}`}
          >
            A–Z Index
          </p>
        </div>
        <div className="p-2 max-h-[calc(100vh-160px)] overflow-y-auto">
          <button
            onClick={() => {
              setActiveLetter(null);
              setSearch('');
            }}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg border-none cursor-pointer text-[13px] font-medium mb-1 flex justify-between transition-colors ${
              !activeLetter && !search
                ? 'bg-amber-500 text-white'
                : dark
                  ? 'bg-transparent text-slate-400 hover:bg-slate-700'
                  : 'bg-transparent text-slate-600 hover:bg-slate-50'
            }`}
          >
            All words
            <span className="text-[11px] opacity-70">{mockWords.length}</span>
          </button>
          {ALPHABET.map((l) => (
            <button
              key={l}
              onClick={() => {
                setActiveLetter(l);
                setSearch('');
              }}
              className={`w-full text-left px-2.5 py-1 rounded-md border-none text-[13px] flex justify-between transition-colors ${
                activeLetter === l
                  ? 'bg-amber-500 text-white font-semibold cursor-pointer'
                  : letterCounts[l] > 0
                    ? dark
                      ? 'bg-transparent text-slate-100 font-semibold cursor-pointer hover:bg-slate-700'
                      : 'bg-transparent text-slate-800 font-semibold cursor-pointer hover:bg-slate-50'
                    : dark
                      ? 'bg-transparent text-slate-600 opacity-50 cursor-default'
                      : 'bg-transparent text-slate-300 opacity-50 cursor-default'
              }`}
            >
              {l}
              {letterCounts[l] > 0 && (
                <span className="text-[11px] opacity-60">{letterCounts[l]}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
