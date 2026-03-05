import { useState } from 'react';
import { WordCard } from './components/WorkCard';
import { WordFormModal } from './components/Modal';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const mockWords = [
  {
    id: '1',
    word: 'agathokakological',
    meaning: 'Something made of both good and evil; mixed qualities',
    sentence: 'Life is inherently agathokakological — every joy carries the seed of sorrow.',
    notes: 'Greek roots: agathos (good) + kakos (bad)',
    aiData: {
      explanation:
        'A rare philosophical term describing the dual nature of things containing both good and evil.',
      examples: [
        'The agathokakological nature of power means it can build or destroy.',
        'She had an agathokakological effect on everyone around her.',
      ],
      synonyms: ['dualistic', 'ambivalent', 'paradoxical'],
      tips: 'Use in philosophical or literary contexts when describing moral complexity.',
    },
  },
  {
    id: '2',
    word: 'aroma',
    meaning: 'A pleasant smell, especially food, coffee, or perfume',
    sentence: 'The aroma of freshly brewed coffee filled the entire room.',
    notes: '',
    aiData: null,
  },
  {
    id: '3',
    word: 'backlash',
    meaning: 'A strong negative reaction from many people',
    sentence: 'The new policy faced severe backlash from the public.',
    notes: 'Often used in politics or social media contexts',
    aiData: null,
  },
  {
    id: '4',
    word: 'clutter',
    meaning: 'An untidy mess; things scattered around (بکھری ہوئی چیزیں)',
    sentence: 'She cleared the clutter from her desk before starting work.',
    notes: 'Verb: to clutter = make messy',
    aiData: null,
  },
  {
    id: '5',
    word: 'compulsion',
    meaning: 'A strong inner urge forcing someone to act (اندرونی مجبوری)',
    sentence: 'He felt a compulsion to check his phone every few minutes.',
    notes: '',
    aiData: null,
  },
  {
    id: '6',
    word: 'defenestrate',
    meaning: 'To throw someone or something out of a window',
    sentence: 'In a fit of rage, he defenestrated his old laptop.',
    notes: 'From Latin: de (out of) + fenestra (window)',
    aiData: null,
  },
  {
    id: '7',
    word: 'diversity',
    meaning: 'Variety or differences within a group or system',
    sentence: 'The company celebrated the diversity of its workforce.',
    notes: '',
    aiData: null,
  },
];

const letterCounts: Record<string, number> = ALPHABET.reduce(
  (acc, l) => {
    acc[l] = mockWords.filter((w) => w.word.toUpperCase().startsWith(l)).length;
    return acc;
  },
  {} as Record<string, number>
);

const App = () => {
  const [dark, setDark] = useState(false);
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const filteredWords = mockWords.filter((w) => {
    if (search)
      return (
        w.word.toLowerCase().includes(search.toLowerCase()) ||
        w.meaning.toLowerCase().includes(search.toLowerCase())
      );
    if (activeLetter) return w.word.toUpperCase().startsWith(activeLetter);
    return true;
  });

  const groupedLetters = ALPHABET.filter((l) => letterCounts[l] > 0);

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
        setEditingWord={() => {}}
      />

      <div
        className="max-w-[860px] mx-auto  py-6 grid gap-6"
        style={{ gridTemplateColumns: '200px 1fr' }}
      >
        <Sidebar
          dark={dark}
          setActiveLetter={setActiveLetter}
          setSearch={setSearch}
          letterCounts={letterCounts}
          activeLetter={activeLetter}
          search={search}
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
                No words found
              </p>
              <p className={`text-[14px] ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                Try a different search or letter.
              </p>
            </div>
          ) : (
            <div>
              {!activeLetter && !search
                ? groupedLetters.map((l) => (
                    <div key={l} className="mb-7">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center font-serif font-black text-lg text-white flex-shrink-0">
                          {l}
                        </div>
                        <div className={`flex-1 h-px ${dark ? 'bg-slate-800' : 'bg-slate-100'}`} />
                      </div>
                      {mockWords
                        .filter((w) => w.word.toUpperCase().startsWith(l))
                        .sort((a, b) => a.word.localeCompare(b.word))
                        .map((word, i) => (
                          <WordCard
                            key={word.id}
                            word={word}
                            dark={dark}
                            defaultOpen={l === 'A' && i === 0}
                          />
                        ))}
                    </div>
                  ))
                : [...filteredWords]
                    .sort((a, b) => a.word.localeCompare(b.word))
                    .map((word) => <WordCard key={word.id} word={word} dark={dark} />)}
            </div>
          )}
        </div>
      </div>

      {showForm && <WordFormModal dark={dark} onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default App;
