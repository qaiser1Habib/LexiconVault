import { useState, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AiData {
  explanation: string;
  examples: string[];
  synonyms: string[];
  tips: string;
}

interface Word {
  id: string;
  word: string;
  meaning: string;
  sentence: string;
  notes: string;
  aiData: AiData | null;
}

type FormState = Pick<Word, "word" | "meaning" | "sentence" | "notes">;
type FormErrors = Partial<Record<keyof FormState, string>>;

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "lexicon_vault_words";
const DARK_KEY = "lexicon_vault_dark";
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// ─── Storage Hook ─────────────────────────────────────────────────────────────

function useStorage() {
  const [words, setWords] = useState<Word[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
    catch { return []; }
  });

  const save = useCallback((updated: Word[]) => {
    setWords(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  const addWord = (word: FormState) =>
    save([...words, { ...word, id: Date.now().toString(), aiData: null }]);

  const updateWord = (id: string, data: Partial<Word>) =>
    save(words.map(w => w.id === id ? { ...w, ...data } : w));

  const deleteWord = (id: string) =>
    save(words.filter(w => w.id !== id));

  return { words, addWord, updateWord, deleteWord };
}

// ─── WordForm ─────────────────────────────────────────────────────────────────

interface WordFormProps {
  initial?: Word | null;
  onSave: (form: FormState) => void;
  onCancel: () => void;
}

function WordForm({ initial, onSave, onCancel }: WordFormProps) {
  const [form, setForm] = useState<FormState>({
    word: initial?.word ?? "",
    meaning: initial?.meaning ?? "",
    sentence: initial?.sentence ?? "",
    notes: initial?.notes ?? "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.word.trim()) e.word = "Word is required";
    if (!form.meaning.trim()) e.meaning = "Meaning is required";
    return e;
  };

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
  };

  const inputBase = "w-full px-3 py-2.5 rounded-lg border text-[14px] text-slate-900 bg-slate-50 outline-none transition-colors";
  const textareaBase = `${inputBase} resize-y min-h-[60px]`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-7 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
        <h2 className="font-serif text-[22px] font-bold text-slate-900 mb-5 mt-0">
          {initial ? "Edit Word" : "Add New Word"}
        </h2>

        <div className="mb-4">
          <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Word *</label>
          <input name="word" value={form.word} onChange={handle} placeholder="e.g. ephemeral"
            className={`${inputBase} ${errors.word ? "border-red-400" : "border-slate-200"}`} />
          {errors.word && <span className="text-red-500 text-xs mt-1 block">{errors.word}</span>}
        </div>

        <div className="mb-4">
          <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Meaning *</label>
          <textarea name="meaning" value={form.meaning} onChange={handle} rows={3} placeholder="Define the word..."
            className={`${textareaBase} ${errors.meaning ? "border-red-400" : "border-slate-200"}`} />
          {errors.meaning && <span className="text-red-500 text-xs mt-1 block">{errors.meaning}</span>}
        </div>

        <div className="mb-4">
          <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
            Example Sentence <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <textarea name="sentence" value={form.sentence} onChange={handle} rows={2} placeholder="Use the word in a sentence..."
            className={`${textareaBase} border-slate-200`} />
        </div>

        <div className="mb-4">
          <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
            Notes <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <textarea name="notes" value={form.notes} onChange={handle} rows={2} placeholder="Extra notes, memory tips, etc."
            className={`${textareaBase} border-slate-200`} />
        </div>

        <div className="flex justify-end gap-2.5 mt-6">
          <button onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-[14px] font-medium bg-transparent cursor-pointer hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button onClick={submit}
            className="px-4 py-2 rounded-lg bg-amber-500 text-white text-[14px] font-semibold border-none cursor-pointer hover:bg-amber-400 transition-colors">
            Save Word
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── AiSection ────────────────────────────────────────────────────────────────

interface AiSectionProps {
  word: Word;
  aiData: AiData | null;
  dark: boolean;
  onSave: (ai: AiData) => void;
}

function AiSection({ word, aiData, dark, onSave }: AiSectionProps) {
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState<AiData>(aiData ?? { explanation: "", examples: [], synonyms: [], tips: "" });
  const [error, setError] = useState("");

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `For the English word "${word.word}" (meaning: ${word.meaning}), respond ONLY with valid JSON (no markdown, no backticks):
{
  "explanation": "a 1-2 sentence plain-English explanation",
  "examples": ["example sentence 1", "example sentence 2"],
  "synonyms": ["synonym1", "synonym2", "synonym3"],
  "tips": "a short tip on when or how to use this word"
}`
          }]
        })
      });
      const data = await res.json();
      const text: string = (data.content as Array<{ text?: string }>)?.map(b => b.text ?? "").join("") ?? "";
      const parsed: AiData = JSON.parse(text.replace(/```json|```/g, "").trim());
      setDraft(parsed);
      setEditMode(false);
    } catch {
      setError("Could not generate AI content. Please try again.");
    }
    setLoading(false);
  };

  const handleSave = () => { onSave(draft); setEditMode(false); };

  const sectionBg = dark ? "bg-slate-800 border-slate-600" : "bg-slate-50 border-slate-200";
  const labelClass = `text-[11px] font-semibold uppercase tracking-wide mb-1 block opacity-60 ${dark ? "text-slate-400" : "text-slate-500"}`;
  const miniBtnClass = `px-2.5 py-1 rounded-md border text-xs font-medium cursor-pointer transition-colors bg-transparent ${dark ? "border-slate-600 text-slate-400 hover:bg-slate-700" : "border-slate-200 text-slate-500 hover:bg-slate-100"}`;
  const editInputClass = `w-full px-3 py-2 rounded-lg border text-[13px] outline-none resize-y min-h-[52px] ${dark ? "bg-slate-700 border-slate-600 text-slate-200" : "bg-white border-slate-200 text-slate-900"}`;

  if (!aiData && !draft.explanation) {
    return (
      <div className={`mt-4 p-4 rounded-xl border border-dashed ${sectionBg}`}>
        <div className="flex items-center gap-2.5">
          <span className="text-lg">✨</span>
          <div>
            <p className={`text-[13px] font-semibold ${dark ? "text-slate-300" : "text-slate-600"}`}>AI Insights available</p>
            <p className={`text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>Generate explanation, examples, synonyms & tips</p>
          </div>
          <button onClick={generate} disabled={loading}
            className="ml-auto px-3.5 py-1.5 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white text-[13px] font-semibold border-none cursor-pointer disabled:opacity-60 hover:from-amber-400 hover:to-orange-400 transition-all">
            {loading ? "Generating…" : "Generate ✨"}
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      </div>
    );
  }

  const d = editMode ? draft : (aiData ?? draft);

  return (
    <div className={`mt-4 p-4 rounded-xl border ${sectionBg}`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`text-[13px] font-bold uppercase tracking-wide ${dark ? "text-slate-400" : "text-slate-500"}`}>✨ AI Insights</span>
        <div className="flex gap-2">
          <button onClick={generate} disabled={loading} className={miniBtnClass}>↻ Regenerate</button>
          {!editMode
            ? <button onClick={() => setEditMode(true)} className={miniBtnClass}>Edit</button>
            : <>
                <button onClick={handleSave}
                  className="px-2.5 py-1 rounded-md border border-emerald-400 bg-emerald-500 text-white text-xs font-medium cursor-pointer hover:bg-emerald-400 transition-colors">
                  Save
                </button>
                <button onClick={() => setEditMode(false)} className={miniBtnClass}>Cancel</button>
              </>
          }
        </div>
      </div>

      {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

      {editMode ? (
        <div className="flex flex-col gap-2.5">
          <label className={labelClass}>Explanation</label>
          <textarea value={draft.explanation} onChange={e => setDraft(d => ({ ...d, explanation: e.target.value }))} rows={2} className={editInputClass} />
          <label className={labelClass}>Examples (one per line)</label>
          <textarea value={draft.examples?.join("\n")} onChange={e => setDraft(d => ({ ...d, examples: e.target.value.split("\n") }))} rows={2} className={editInputClass} />
          <label className={labelClass}>Synonyms (comma separated)</label>
          <input value={draft.synonyms?.join(", ")} onChange={e => setDraft(d => ({ ...d, synonyms: e.target.value.split(",").map(s => s.trim()) }))}
            className={`w-full px-3 py-2 rounded-lg border text-[13px] outline-none ${dark ? "bg-slate-700 border-slate-600 text-slate-200" : "bg-white border-slate-200 text-slate-900"}`} />
          <label className={labelClass}>Usage Tip</label>
          <textarea value={draft.tips} onChange={e => setDraft(d => ({ ...d, tips: e.target.value }))} rows={2} className={editInputClass} />
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {d.explanation && (
            <div>
              <span className={labelClass}>Explanation</span>
              <p className={`text-[14px] leading-relaxed ${dark ? "text-slate-300" : "text-slate-800"}`}>{d.explanation}</p>
            </div>
          )}
          {d.examples?.filter(Boolean).length > 0 && (
            <div>
              <span className={labelClass}>Examples</span>
              {d.examples.filter(Boolean).map((ex, i) => (
                <p key={i} className={`text-[13px] leading-snug pl-2.5 border-l-2 mb-1 ${dark ? "border-slate-500 text-slate-400" : "border-slate-300 text-slate-500"}`}>{ex}</p>
              ))}
            </div>
          )}
          {d.synonyms?.filter(Boolean).length > 0 && (
            <div>
              <span className={labelClass}>Synonyms</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {d.synonyms.filter(Boolean).map((s, i) => (
                  <span key={i} className={`text-xs px-2.5 py-0.5 rounded-full ${dark ? "bg-slate-700 text-slate-400" : "bg-slate-200 text-slate-500"}`}>{s}</span>
                ))}
              </div>
            </div>
          )}
          {d.tips && (
            <div>
              <span className={labelClass}>Usage Tip</span>
              <p className={`text-[13px] leading-relaxed px-3 py-2 rounded-lg ${dark ? "bg-amber-500/10 text-amber-300" : "bg-yellow-50 text-yellow-800"}`}>
                💡 {d.tips}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── WordCard ─────────────────────────────────────────────────────────────────

interface WordCardProps {
  word: Word;
  dark: boolean;
  onEdit: (w: Word) => void;
  onDelete: (id: string) => void;
  onAiSave: (id: string, ai: AiData) => void;
}

function WordCard({ word, dark, onEdit, onDelete, onAiSave }: WordCardProps) {
  const [expanded, setExpanded] = useState(false);

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
        <span className={`text-base mt-0.5 flex-shrink-0 ${dark ? "text-slate-500" : "text-slate-400"}`}>{expanded ? "▲" : "▼"}</span>
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

          <AiSection word={word} aiData={word.aiData} dark={dark} onSave={(ai) => onAiSave(word.id, ai)} />

          <div className="flex gap-2 mt-3.5">
            <button onClick={() => onEdit(word)}
              className="px-3 py-1.5 rounded-lg border border-blue-200 text-blue-600 text-[13px] font-medium bg-transparent cursor-pointer hover:bg-blue-50 transition-colors">
              Edit
            </button>
            <button onClick={() => onDelete(word.id)}
              className="px-3 py-1.5 rounded-lg border border-red-200 text-red-500 text-[13px] font-medium bg-transparent cursor-pointer hover:bg-red-50 transition-colors">
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
  const { words, addWord, updateWord, deleteWord } = useStorage();
  const [dark, setDark] = useState<boolean>(() => {
    try { return localStorage.getItem(DARK_KEY) === "true"; } catch { return false; }
  });
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => { localStorage.setItem(DARK_KEY, String(dark)); }, [dark]);

  const handleSave = (form: FormState) => {
    if (editingWord) { updateWord(editingWord.id, form); setEditingWord(null); }
    else { addWord(form); }
    setShowForm(false);
  };

  const handleEdit = (word: Word) => { setEditingWord(word); setShowForm(true); };
  const handleAiSave = (id: string, ai: AiData) => updateWord(id, { aiData: ai });

  const filteredWords = words.filter(w => {
    if (search) return w.word.toLowerCase().includes(search.toLowerCase()) || w.meaning.toLowerCase().includes(search.toLowerCase());
    if (activeLetter) return w.word.toUpperCase().startsWith(activeLetter);
    return true;
  });

  const letterCounts = ALPHABET.reduce<Record<string, number>>((acc, l) => {
    acc[l] = words.filter(w => w.word.toUpperCase().startsWith(l)).length;
    return acc;
  }, {});

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
            <input value={search} onChange={e => { setSearch(e.target.value); setActiveLetter(null); }}
              placeholder="Search words…"
              className={`w-full px-3.5 py-1.5 rounded-lg border text-[14px] outline-none transition-colors ${dark ? "bg-slate-950 border-slate-700 text-slate-100 placeholder-slate-500" : "bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400"}`}
            />
          </div>
          <button onClick={() => { setEditingWord(null); setShowForm(true); }}
            className="px-4 py-2 rounded-lg bg-amber-500 text-white text-[14px] font-semibold border-none cursor-pointer whitespace-nowrap hover:bg-amber-400 transition-colors">
            + Add Word
          </button>
          <button onClick={() => setDark(d => !d)} title="Toggle dark mode"
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
                <span className="text-[11px] opacity-70">{words.length}</span>
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
              <p className={`text-[16px] font-semibold mb-1.5 ${dark ? "text-slate-200" : "text-slate-800"}`}>
                {words.length === 0 ? "Your vault is empty" : "No words found"}
              </p>
              <p className={`text-[14px] mb-5 ${dark ? "text-slate-500" : "text-slate-400"}`}>
                {words.length === 0 ? "Start building your personal lexicon by adding your first word." : "Try a different search or letter."}
              </p>
              {words.length === 0 && (
                <button onClick={() => { setEditingWord(null); setShowForm(true); }}
                  className="px-5 py-2.5 rounded-lg bg-amber-500 text-white text-[14px] font-semibold border-none cursor-pointer hover:bg-amber-400 transition-colors">
                  Add your first word
                </button>
              )}
            </div>
          ) : (
            <div>
              {!activeLetter && !search ? (
                ALPHABET.filter(l => letterCounts[l] > 0).map(l => (
                  <div key={l} className="mb-7">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center font-serif font-black text-lg text-white flex-shrink-0">{l}</div>
                      <div className={`flex-1 h-px ${dark ? "bg-slate-800" : "bg-slate-100"}`} />
                    </div>
                    {words.filter(w => w.word.toUpperCase().startsWith(l)).sort((a, b) => a.word.localeCompare(b.word)).map(word => (
                      <WordCard key={word.id} word={word} dark={dark} onEdit={handleEdit} onDelete={deleteWord} onAiSave={handleAiSave} />
                    ))}
                  </div>
                ))
              ) : (
                [...filteredWords].sort((a, b) => a.word.localeCompare(b.word)).map(word => (
                  <WordCard key={word.id} word={word} dark={dark} onEdit={handleEdit} onDelete={deleteWord} onAiSave={handleAiSave} />
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <WordForm initial={editingWord} onSave={handleSave} onCancel={() => { setShowForm(false); setEditingWord(null); }} />
      )}
    </div>
  );
}
