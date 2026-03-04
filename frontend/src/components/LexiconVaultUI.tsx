import { useState } from "react";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const mockWords = [
  { id: "1", word: "agathokakological", meaning: "Something made of both good and evil; mixed qualities", sentence: "Life is inherently agathokakological — every joy carries the seed of sorrow.", notes: "Greek roots: agathos (good) + kakos (bad)", aiData: { explanation: "A rare philosophical term describing the dual nature of things containing both good and evil.", examples: ["The agathokakological nature of power means it can build or destroy.", "She had an agathokakological effect on everyone around her."], synonyms: ["dualistic", "ambivalent", "paradoxical"], tips: "Use in philosophical or literary contexts when describing moral complexity." } },
  { id: "2", word: "aroma", meaning: "A pleasant smell, especially food, coffee, or perfume", sentence: "The aroma of freshly brewed coffee filled the entire room.", notes: "", aiData: null },
  { id: "3", word: "backlash", meaning: "A strong negative reaction from many people", sentence: "The new policy faced severe backlash from the public.", notes: "Often used in politics or social media contexts", aiData: null },
  { id: "4", word: "clutter", meaning: "An untidy mess; things scattered around (بکھری ہوئی چیزیں)", sentence: "She cleared the clutter from her desk before starting work.", notes: "Verb: to clutter = make messy", aiData: null },
  { id: "5", word: "compulsion", meaning: "A strong inner urge forcing someone to act (اندرونی مجبوری)", sentence: "He felt a compulsion to check his phone every few minutes.", notes: "", aiData: null },
  { id: "6", word: "defenestrate", meaning: "To throw someone or something out of a window", sentence: "In a fit of rage, he defenestrated his old laptop.", notes: "From Latin: de (out of) + fenestra (window)", aiData: null },
  { id: "7", word: "diversity", meaning: "Variety or differences within a group or system", sentence: "The company celebrated the diversity of its workforce.", notes: "", aiData: null },
];

const letterCounts: Record<string, number> = ALPHABET.reduce((acc, l) => {
  acc[l] = mockWords.filter(w => w.word.toUpperCase().startsWith(l)).length;
  return acc;
}, {} as Record<string, number>);

// ─── Word Form Modal ──────────────────────────────────────────────────────────

function WordFormModal({ dark, onClose }: { dark: boolean; onClose: () => void }) {
  const inputClass = `w-full px-3 py-2.5 rounded-lg border text-[14px] outline-none transition-colors ${dark ? "bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"}`;
  const textareaClass = `${inputClass} resize-y min-h-[60px]`;
  const labelClass = `block text-[13px] font-semibold mb-1.5 ${dark ? "text-slate-300" : "text-gray-700"}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/50 backdrop-blur-sm">
      <div className={`rounded-2xl p-7 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.2)] ${dark ? "bg-slate-800" : "bg-white"}`}>
        <h2 className={`font-serif text-[22px] font-bold mb-5 mt-0 ${dark ? "text-slate-100" : "text-slate-900"}`}>
          Add New Word
        </h2>

        <div className="mb-4">
          <label className={labelClass}>Word *</label>
          <input placeholder="e.g. ephemeral" className={`${inputClass} border-red-400`} defaultValue="" />
          <span className="text-red-500 text-xs mt-1 block">Word is required</span>
        </div>

        <div className="mb-4">
          <label className={labelClass}>Meaning *</label>
          <textarea rows={3} placeholder="Define the word..." className={textareaClass} />
        </div>

        <div className="mb-4">
          <label className={labelClass}>
            Example Sentence <span className={`font-normal ${dark ? "text-slate-500" : "text-gray-400"}`}>(optional)</span>
          </label>
          <textarea rows={2} placeholder="Use the word in a sentence..." className={textareaClass} />
        </div>

        <div className="mb-4">
          <label className={labelClass}>
            Notes <span className={`font-normal ${dark ? "text-slate-500" : "text-gray-400"}`}>(optional)</span>
          </label>
          <textarea rows={2} placeholder="Extra notes, memory tips, etc." className={textareaClass} />
        </div>

        <div className="flex justify-end gap-2.5 mt-6">
          <button onClick={onClose}
            className={`px-4 py-2 rounded-lg border text-[14px] font-medium bg-transparent cursor-pointer transition-colors ${dark ? "border-slate-600 text-slate-400 hover:bg-slate-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
            Cancel
          </button>
          <button className="px-4 py-2 rounded-lg bg-amber-500 text-white text-[14px] font-semibold border-none cursor-pointer hover:bg-amber-400 transition-colors">
            Save Word
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── AI Section ───────────────────────────────────────────────────────────────

function AiSection({ word, dark }: { word: typeof mockWords[0]; dark: boolean }) {
  const [editMode, setEditMode] = useState(false);

  const sectionBg = dark ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200";
  const labelClass = `text-[11px] font-semibold uppercase tracking-wide mb-1 block opacity-60 ${dark ? "text-slate-400" : "text-slate-500"}`;
  const miniBtnClass = `px-2.5 py-1 rounded-md border text-xs font-medium cursor-pointer transition-colors bg-transparent ${dark ? "border-slate-600 text-slate-400 hover:bg-slate-600" : "border-slate-200 text-slate-500 hover:bg-slate-100"}`;
  const editInputClass = `w-full px-3 py-2 rounded-lg border text-[13px] outline-none resize-y min-h-[52px] ${dark ? "bg-slate-600 border-slate-500 text-slate-200" : "bg-white border-slate-200 text-slate-900"}`;

  if (!word.aiData) {
    return (
      <div className={`mt-4 p-4 rounded-xl border border-dashed ${sectionBg}`}>
        <div className="flex items-center gap-2.5">
          <span className="text-lg">✨</span>
          <div>
            <p className={`text-[13px] font-semibold ${dark ? "text-slate-300" : "text-slate-600"}`}>AI Insights available</p>
            <p className={`text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>Generate explanation, examples, synonyms & tips</p>
          </div>
          <button className="ml-auto px-3.5 py-1.5 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white text-[13px] font-semibold border-none cursor-pointer hover:from-amber-400 hover:to-orange-400 transition-all">
            Generate ✨
          </button>
        </div>
      </div>
    );
  }

  const d = word.aiData;

  return (
    <div className={`mt-4 p-4 rounded-xl border ${sectionBg}`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`text-[13px] font-bold uppercase tracking-wide ${dark ? "text-slate-400" : "text-slate-500"}`}>✨ AI Insights</span>
        <div className="flex gap-2">
          <button className={miniBtnClass}>↻ Regenerate</button>
          {!editMode
            ? <button onClick={() => setEditMode(true)} className={miniBtnClass}>Edit</button>
            : <>
                <button onClick={() => setEditMode(false)} className="px-2.5 py-1 rounded-md border border-emerald-400 bg-emerald-500 text-white text-xs font-medium cursor-pointer">Save</button>
                <button onClick={() => setEditMode(false)} className={miniBtnClass}>Cancel</button>
              </>
          }
        </div>
      </div>

      {editMode ? (
        <div className="flex flex-col gap-2.5">
          <label className={labelClass}>Explanation</label>
          <textarea rows={2} defaultValue={d.explanation} className={editInputClass} />
          <label className={labelClass}>Examples (one per line)</label>
          <textarea rows={2} defaultValue={d.examples.join("\n")} className={editInputClass} />
          <label className={labelClass}>Synonyms (comma separated)</label>
          <input defaultValue={d.synonyms.join(", ")} className={`w-full px-3 py-2 rounded-lg border text-[13px] outline-none ${dark ? "bg-slate-600 border-slate-500 text-slate-200" : "bg-white border-slate-200 text-slate-900"}`} />
          <label className={labelClass}>Usage Tip</label>
          <textarea rows={2} defaultValue={d.tips} className={editInputClass} />
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          <div>
            <span className={labelClass}>Explanation</span>
            <p className={`text-[14px] leading-relaxed ${dark ? "text-slate-300" : "text-slate-800"}`}>{d.explanation}</p>
          </div>
          <div>
            <span className={labelClass}>Examples</span>
            {d.examples.map((ex, i) => (
              <p key={i} className={`text-[13px] leading-snug pl-2.5 border-l-2 mb-1 ${dark ? "border-slate-500 text-slate-400" : "border-slate-300 text-slate-500"}`}>{ex}</p>
            ))}
          </div>
          <div>
            <span className={labelClass}>Synonyms</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {d.synonyms.map((s, i) => (
                <span key={i} className={`text-xs px-2.5 py-0.5 rounded-full ${dark ? "bg-slate-600 text-slate-300" : "bg-slate-200 text-slate-500"}`}>{s}</span>
              ))}
            </div>
          </div>
          <div>
            <span className={labelClass}>Usage Tip</span>
            <p className={`text-[13px] leading-relaxed px-3 py-2 rounded-lg ${dark ? "bg-amber-500/10 text-amber-300" : "bg-yellow-50 text-yellow-800"}`}>
              💡 {d.tips}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Word Card ────────────────────────────────────────────────────────────────

function WordCard({ word, dark, defaultOpen = false }: { word: typeof mockWords[0]; dark: boolean; defaultOpen?: boolean }) {
  const [expanded, setExpanded] = useState(defaultOpen);
  const labelClass = `text-[11px] font-semibold uppercase tracking-wider mb-1 block opacity-60 ${dark ? "text-slate-400" : "text-slate-500"}`;

  return (
    <div className={`rounded-xl border mb-3 overflow-hidden transition-shadow duration-200 ${
      expanded
        ? dark ? "shadow-[0_4px_24px_rgba(0,0,0,0.4)] border-slate-600 bg-slate-800" : "shadow-[0_4px_24px_rgba(0,0,0,0.08)] border-slate-200 bg-white"
        : dark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"
    }`}>
      <div onClick={() => setExpanded(e => !e)} className="px-4 py-3.5 cursor-pointer flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <span className={`text-[17px] font-bold font-serif tracking-tight ${dark ? "text-slate-100" : "text-slate-900"}`}>{word.word}</span>
            {word.aiData && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold tracking-wide ${dark ? "bg-amber-500/15 text-amber-400" : "bg-yellow-100 text-yellow-800"}`}>AI</span>
            )}
          </div>
          <p className={`text-[13px] mt-0.5 leading-snug ${expanded ? "" : "line-clamp-2"} ${dark ? "text-slate-400" : "text-slate-500"}`}>{word.meaning}</p>
        </div>
        <span className={`text-base mt-0.5 flex-shrink-0 transition-transform duration-200 ${expanded ? "rotate-180" : ""} ${dark ? "text-slate-500" : "text-slate-400"}`}>▼</span>
      </div>

      {expanded && (
        <div className="px-4 pb-4">
          {word.sentence && (
            <div className="mb-2.5">
              <span className={labelClass}>Example</span>
              <p className={`text-[14px] italic leading-relaxed pl-2.5 border-l-[3px] ${dark ? "border-slate-600 text-slate-400" : "border-slate-300 text-slate-500"}`}>
                "{word.sentence}"
              </p>
            </div>
          )}
          {word.notes && (
            <div className="mb-2.5">
              <span className={labelClass}>Notes</span>
              <p className={`text-[13px] leading-relaxed ${dark ? "text-slate-400" : "text-slate-500"}`}>{word.notes}</p>
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

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [dark, setDark] = useState(false);
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const filteredWords = mockWords.filter(w => {
    if (search) return w.word.toLowerCase().includes(search.toLowerCase()) || w.meaning.toLowerCase().includes(search.toLowerCase());
    if (activeLetter) return w.word.toUpperCase().startsWith(activeLetter);
    return true;
  });

  const groupedLetters = ALPHABET.filter(l => letterCounts[l] > 0);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? "bg-slate-950" : "bg-slate-50"}`}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      <style>{`.font-serif{font-family:'Playfair Display',serif!important}body{font-family:'DM Sans',sans-serif}`}</style>

      {/* ── Header ── */}
      <header className={`sticky top-0 z-40 px-5 border-b backdrop-blur-md transition-colors duration-300 ${dark ? "bg-slate-900/90 border-slate-800" : "bg-white/90 border-slate-100"}`}>
        <div className="max-w-[860px] mx-auto flex items-center gap-4 h-[60px]">
          <div className="flex items-baseline gap-2 flex-shrink-0">
            <span className="font-serif text-[22px] font-black text-amber-500 tracking-tight">Lexicon</span>
            <span className={`font-serif text-[22px] font-bold tracking-tight ${dark ? "text-slate-100" : "text-slate-900"}`}>Vault</span>
          </div>

          <div className="flex-1">
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setActiveLetter(null); }}
              placeholder="Search words…"
              className={`w-full px-3.5 py-1.5 rounded-lg border text-[14px] outline-none transition-colors ${dark ? "bg-slate-950 border-slate-700 text-slate-100 placeholder-slate-500" : "bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400"}`}
            />
          </div>

          <button onClick={() => setShowForm(true)}
            className="px-4 py-2 rounded-lg bg-amber-500 text-white text-[14px] font-semibold border-none cursor-pointer whitespace-nowrap hover:bg-amber-400 transition-colors">
            + Add Word
          </button>

          <button onClick={() => setDark(d => !d)}
            className={`border rounded-lg px-2.5 py-1.5 text-base bg-transparent cursor-pointer transition-colors ${dark ? "border-slate-700 text-slate-400 hover:bg-slate-800" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
            {dark ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="max-w-[860px] mx-auto px-5 py-6 grid gap-6" style={{ gridTemplateColumns: "200px 1fr" }}>

        {/* ── Sidebar ── */}
        <div className="sticky top-20 self-start">
          <div className={`rounded-2xl border overflow-hidden ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
            <div className={`px-3.5 py-3 border-b ${dark ? "border-slate-700" : "border-slate-100"}`}>
              <p className={`text-[11px] font-bold uppercase tracking-widest ${dark ? "text-slate-500" : "text-slate-400"}`}>A–Z Index</p>
            </div>
            <div className="p-2 max-h-[calc(100vh-160px)] overflow-y-auto">
              <button onClick={() => { setActiveLetter(null); setSearch(""); }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg border-none cursor-pointer text-[13px] font-medium mb-1 flex justify-between transition-colors ${
                  !activeLetter && !search ? "bg-amber-500 text-white" : dark ? "bg-transparent text-slate-400 hover:bg-slate-700" : "bg-transparent text-slate-600 hover:bg-slate-50"
                }`}>
                All words
                <span className="text-[11px] opacity-70">{mockWords.length}</span>
              </button>
              {ALPHABET.map(l => (
                <button key={l} onClick={() => { setActiveLetter(l); setSearch(""); }}
                  className={`w-full text-left px-2.5 py-1 rounded-md border-none text-[13px] flex justify-between transition-colors ${
                    activeLetter === l
                      ? "bg-amber-500 text-white font-semibold cursor-pointer"
                      : letterCounts[l] > 0
                        ? dark ? "bg-transparent text-slate-100 font-semibold cursor-pointer hover:bg-slate-700" : "bg-transparent text-slate-800 font-semibold cursor-pointer hover:bg-slate-50"
                        : dark ? "bg-transparent text-slate-600 opacity-50 cursor-default" : "bg-transparent text-slate-300 opacity-50 cursor-default"
                  }`}>
                  {l}
                  {letterCounts[l] > 0 && <span className="text-[11px] opacity-60">{letterCounts[l]}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main Content ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className={`text-[15px] font-semibold ${dark ? "text-slate-100" : "text-slate-900"}`}>
              {search ? `Results for "${search}"` : activeLetter ? `Words starting with ${activeLetter}` : "All Words"}
              <span className={`text-[13px] font-normal ml-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>
                {filteredWords.length} word{filteredWords.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {filteredWords.length === 0 ? (
            <div className={`text-center py-16 px-5 rounded-2xl border border-dashed ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
              <div className="text-[40px] mb-3">📖</div>
              <p className={`text-[16px] font-semibold mb-1.5 ${dark ? "text-slate-200" : "text-slate-800"}`}>No words found</p>
              <p className={`text-[14px] ${dark ? "text-slate-500" : "text-slate-400"}`}>Try a different search or letter.</p>
            </div>
          ) : (
            <div>
              {!activeLetter && !search ? (
                groupedLetters.map(l => (
                  <div key={l} className="mb-7">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center font-serif font-black text-lg text-white flex-shrink-0">{l}</div>
                      <div className={`flex-1 h-px ${dark ? "bg-slate-800" : "bg-slate-100"}`} />
                    </div>
                    {mockWords
                      .filter(w => w.word.toUpperCase().startsWith(l))
                      .sort((a, b) => a.word.localeCompare(b.word))
                      .map((word, i) => (
                        <WordCard key={word.id} word={word} dark={dark} defaultOpen={l === "A" && i === 0} />
                      ))
                    }
                  </div>
                ))
              ) : (
                [...filteredWords]
                  .sort((a, b) => a.word.localeCompare(b.word))
                  .map(word => <WordCard key={word.id} word={word} dark={dark} />)
              )}
            </div>
          )}
        </div>
      </div>

      {showForm && <WordFormModal dark={dark} onClose={() => setShowForm(false)} />}
    </div>
  );
}
