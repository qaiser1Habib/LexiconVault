import { type Dispatch, type SetStateAction } from 'react';
import type { Word } from '../../types/WordType';

interface HeaderProps {
  dark: boolean;
  setDark: Dispatch<SetStateAction<boolean>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  setActiveLetter: (letter: string | null) => void;
  setShowForm: Dispatch<SetStateAction<boolean>>;
}

const Header = ({
  dark,
  setDark,
  search,
  setSearch,
  setActiveLetter,
  setShowForm,
}: HeaderProps & {
  setShowForm: Dispatch<SetStateAction<boolean>>;
  setEditingWord: Dispatch<SetStateAction<Word | null>>;
}) => {
  return (
    <header
      className={`sticky top-0 z-40 px-5 border-b backdrop-blur-md transition-colors duration-300 ${dark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-100'}`}
    >
      <div className="max-w-[860px] mx-auto flex items-center gap-4 h-[60px]">
        <div className="flex items-baseline gap-2 flex-shrink-0">
          <span className="font-serif text-[22px] font-black text-amber-500 tracking-tight">
            Lexicon
          </span>
          <span
            className={`font-serif text-[22px] font-bold tracking-tight ${dark ? 'text-slate-100' : 'text-slate-900'}`}
          >
            Vault
          </span>
        </div>

        <div className="flex-1">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setActiveLetter(null);
            }}
            placeholder="Search words…"
            className={`w-full px-3.5 py-1.5 rounded-lg border text-[14px] outline-none transition-colors ${dark ? 'bg-slate-950 border-slate-700 text-slate-100 placeholder-slate-500' : 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400'}`}
          />
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded-lg bg-amber-500 text-white text-[14px] font-semibold border-none cursor-pointer whitespace-nowrap hover:bg-amber-400 transition-colors"
        >
          + Add Word
        </button>

        <button
          onClick={() => setDark((d) => !d)}
          className={`border rounded-lg px-2.5 py-1.5 text-base bg-transparent cursor-pointer transition-colors ${dark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
        >
          {dark ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
};

export default Header;
