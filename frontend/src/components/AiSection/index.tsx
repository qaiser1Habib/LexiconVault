import { useState } from 'react';
import type { AiData } from '../../types/AiDataType';
import type { Word } from '../../types/WordType';

interface AiSectionProps {
  word: Word;
  aiData: AiData | null;
  dark: boolean;
  onSave: (ai: AiData) => void;
}

export function AiSection({ word, aiData, dark, onSave }: AiSectionProps) {
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState<AiData>(
    aiData ?? { explanation: '', examples: [], synonyms: [], tips: '' }
  );
  const [error, setError] = useState('');

  const generate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `For the English word "${word.word}" (meaning: ${word.meaning}), respond ONLY with valid JSON (no markdown, no backticks):
{
  "explanation": "a 1-2 sentence plain-English explanation",
  "examples": ["example sentence 1", "example sentence 2"],
  "synonyms": ["synonym1", "synonym2", "synonym3"],
  "tips": "a short tip on when or how to use this word"
}`,
            },
          ],
        }),
      });
      const data = await res.json();
      const text: string =
        (data.content as Array<{ text?: string }>)?.map((b) => b.text ?? '').join('') ?? '';
      const parsed: AiData = JSON.parse(text.replace(/```json|```/g, '').trim());
      setDraft(parsed);
      setEditMode(false);
    } catch {
      setError('Could not generate AI content. Please try again.');
    }
    setLoading(false);
  };

  const handleSave = () => {
    onSave(draft);
    setEditMode(false);
  };

  const sectionBg = dark ? 'bg-slate-800 border-slate-600' : 'bg-slate-50 border-slate-200';
  const labelClass = `text-[11px] font-semibold uppercase tracking-wide mb-1 block opacity-60 ${dark ? 'text-slate-400' : 'text-slate-500'}`;
  const miniBtnClass = `px-2.5 py-1 rounded-md border text-xs font-medium cursor-pointer transition-colors bg-transparent ${dark ? 'border-slate-600 text-slate-400 hover:bg-slate-700' : 'border-slate-200 text-slate-500 hover:bg-slate-100'}`;
  const editInputClass = `w-full px-3 py-2 rounded-lg border text-[13px] outline-none resize-y min-h-[52px] ${dark ? 'bg-slate-700 border-slate-600 text-slate-200' : 'bg-white border-slate-200 text-slate-900'}`;

  if (!aiData && !draft.explanation) {
    return (
      <div className={`mt-4 p-4 rounded-xl border border-dashed ${sectionBg}`}>
        <div className="flex items-center gap-2.5">
          <span className="text-lg">✨</span>
          <div>
            <p
              className={`text-[13px] font-semibold ${dark ? 'text-slate-300' : 'text-slate-600'}`}
            >
              AI Insights available
            </p>
            <p className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
              Generate explanation, examples, synonyms & tips
            </p>
          </div>
          <button
            onClick={generate}
            disabled={loading}
            className="ml-auto px-3.5 py-1.5 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white text-[13px] font-semibold border-none cursor-pointer disabled:opacity-60 hover:from-amber-400 hover:to-orange-400 transition-all"
          >
            {loading ? 'Generating…' : 'Generate ✨'}
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
        <span
          className={`text-[13px] font-bold uppercase tracking-wide ${dark ? 'text-slate-400' : 'text-slate-500'}`}
        >
          ✨ AI Insights
        </span>
        <div className="flex gap-2">
          <button onClick={generate} disabled={loading} className={miniBtnClass}>
            ↻ Regenerate
          </button>
          {!editMode ? (
            <button onClick={() => setEditMode(true)} className={miniBtnClass}>
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="px-2.5 py-1 rounded-md border border-emerald-400 bg-emerald-500 text-white text-xs font-medium cursor-pointer hover:bg-emerald-400 transition-colors"
              >
                Save
              </button>
              <button onClick={() => setEditMode(false)} className={miniBtnClass}>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

      {editMode ? (
        <div className="flex flex-col gap-2.5">
          <label className={labelClass}>Explanation</label>
          <textarea
            value={draft.explanation}
            onChange={(e) => setDraft((d) => ({ ...d, explanation: e.target.value }))}
            rows={2}
            className={editInputClass}
          />
          <label className={labelClass}>Examples (one per line)</label>
          <textarea
            value={draft.examples?.join('\n')}
            onChange={(e) => setDraft((d) => ({ ...d, examples: e.target.value.split('\n') }))}
            rows={2}
            className={editInputClass}
          />
          <label className={labelClass}>Synonyms (comma separated)</label>
          <input
            value={draft.synonyms?.join(', ')}
            onChange={(e) =>
              setDraft((d) => ({ ...d, synonyms: e.target.value.split(',').map((s) => s.trim()) }))
            }
            className={`w-full px-3 py-2 rounded-lg border text-[13px] outline-none ${dark ? 'bg-slate-700 border-slate-600 text-slate-200' : 'bg-white border-slate-200 text-slate-900'}`}
          />
          <label className={labelClass}>Usage Tip</label>
          <textarea
            value={draft.tips}
            onChange={(e) => setDraft((d) => ({ ...d, tips: e.target.value }))}
            rows={2}
            className={editInputClass}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {d.explanation && (
            <div>
              <span className={labelClass}>Explanation</span>
              <p
                className={`text-[14px] leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-800'}`}
              >
                {d.explanation}
              </p>
            </div>
          )}
          {d.examples?.filter(Boolean).length > 0 && (
            <div>
              <span className={labelClass}>Examples</span>
              {d.examples.filter(Boolean).map((ex, i) => (
                <p
                  key={i}
                  className={`text-[13px] leading-snug pl-2.5 border-l-2 mb-1 ${dark ? 'border-slate-500 text-slate-400' : 'border-slate-300 text-slate-500'}`}
                >
                  {ex}
                </p>
              ))}
            </div>
          )}
          {d.synonyms?.filter(Boolean).length > 0 && (
            <div>
              <span className={labelClass}>Synonyms</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {d.synonyms.filter(Boolean).map((s, i) => (
                  <span
                    key={i}
                    className={`text-xs px-2.5 py-0.5 rounded-full ${dark ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'}`}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
          {d.tips && (
            <div>
              <span className={labelClass}>Usage Tip</span>
              <p
                className={`text-[13px] leading-relaxed px-3 py-2 rounded-lg ${dark ? 'bg-amber-500/10 text-amber-300' : 'bg-yellow-50 text-yellow-800'}`}
              >
                💡 {d.tips}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
