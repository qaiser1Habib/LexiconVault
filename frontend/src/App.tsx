import { useState } from 'react';
import Header from './components/Header';
import type { Word } from './types/WordType';
import { WordCard } from './components/WorkCard';
import type { FormState } from './types/FormType';
import type { AiData } from './types/AiDataType';
import Sidebar from './components/Sidebar';

const DARK_KEY = 'lexicon_vault_dark';
export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function App() {
  const [dark, setDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem(DARK_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [search, setSearch] = useState('');

  const letterCounts = ALPHABET.map((l) => ({
    letter: l,
    count: 0,
  }));

  const filteredWords = [];

  const words: Word[] = [];

  const handleSave = (form: FormState) => {
    setShowForm(false);
  };

  const handleEdit = (word: Word) => {
    setEditingWord(word);
    setShowForm(true);
  };
  const handleAiSave = (id: string, ai: AiData) => {};
  const deleteWord = (id: string, ai: AiData) => {};

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-slate-950' : 'bg-slate-50'}`}
    >
      <Header
        dark={dark}
        setDark={setDark}
        search={search}
        setSearch={setSearch}
        setActiveLetter={setActiveLetter}
        setShowForm={setShowForm}
        setEditingWord={setEditingWord}
      />

      <div
        className="max-w-[860px] mx-auto  py-6 grid gap-6"
        style={{ gridTemplateColumns: '200px 1fr' }}
      >
        <Sidebar
          dark={dark}
          setActiveLetter={setActiveLetter}
          setSearch={setSearch}
          letterCounts={letterCounts.reduce(
            (acc, { letter, count }) => ({ ...acc, [letter]: count }),
            {}
          )}
        />

        <div>
          <div className="flex items-center justify-between mb-4">
            <div
              className={`text-[15px] font-semibold ${dark ? 'text-slate-100' : 'text-slate-900'}`}
            >
              {search
                ? `Results for "${search}"`
                : activeLetter
                  ? `Words starting with ${activeLetter}`
                  : 'All Words'}
              <span
                className={`text-[13px] font-normal ml-2 ${dark ? 'text-slate-500' : 'text-slate-400'}`}
              >
                {filteredWords.length} word{filteredWords.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {filteredWords.length === 0 ? (
            <div
              className={`text-center py-16 px-5 rounded-2xl border border-dashed ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
            >
              <div className="text-[40px] mb-3">📖</div>
              <p
                className={`text-[16px] font-semibold mb-1.5 ${dark ? 'text-slate-200' : 'text-slate-800'}`}
              >
                {words.length === 0 ? 'Your vault is empty' : 'No words found'}
              </p>
              <p className={`text-[14px] mb-5 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                {words.length === 0
                  ? 'Start building your personal lexicon by adding your first word.'
                  : 'Try a different search or letter.'}
              </p>
              {words.length === 0 && (
                <button
                  onClick={() => {
                    setEditingWord(null);
                    setShowForm(true);
                  }}
                  className="px-5 py-2.5 rounded-lg bg-amber-500 text-white text-[14px] font-semibold border-none cursor-pointer hover:bg-amber-400 transition-colors"
                >
                  Add your first word
                </button>
              )}
            </div>
          ) : (
            <div>
              {!activeLetter && !search
                ? ALPHABET.filter((l) => letterCounts[l] > 0).map((l) => (
                    <div key={l} className="mb-7">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center font-serif font-black text-lg text-white flex-shrink-0">
                          {l}
                        </div>
                        <div className={`flex-1 h-px ${dark ? 'bg-slate-800' : 'bg-slate-100'}`} />
                      </div>
                      {words
                        .filter((w) => w.word.toUpperCase().startsWith(l))
                        .sort((a, b) => a.word.localeCompare(b.word))
                        .map((word) => (
                          <WordCard
                            key={word.id}
                            word={word}
                            dark={dark}
                            onEdit={handleEdit}
                            onDelete={deleteWord}
                            onAiSave={handleAiSave}
                          />
                        ))}
                    </div>
                  ))
                : [...filteredWords]
                    .sort((a, b) => a.word.localeCompare(b.word))
                    .map((word) => (
                      <WordCard
                        key={word.id}
                        word={word}
                        dark={dark}
                        onEdit={handleEdit}
                        onDelete={deleteWord}
                        onAiSave={handleAiSave}
                      />
                    ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
