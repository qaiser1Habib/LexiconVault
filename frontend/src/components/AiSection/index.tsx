import { useState } from 'react';
import type { mockWords } from '../../App';

export function AiSection({ word, dark }: { word: (typeof mockWords)[0]; dark: boolean }) {
  const [editMode, setEditMode] = useState(false);

  const sectionBg = dark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200';
  const labelClass = `text-[11px] font-semibold uppercase tracking-wide mb-1 block opacity-60 ${dark ? 'text-slate-400' : 'text-slate-500'}`;
  const miniBtnClass = `px-2.5 py-1 rounded-md border text-xs font-medium cursor-pointer transition-colors bg-transparent ${dark ? 'border-slate-600 text-slate-400 hover:bg-slate-600' : 'border-slate-200 text-slate-500 hover:bg-slate-100'}`;
  const editInputClass = `w-full px-3 py-2 rounded-lg border text-[13px] outline-none resize-y min-h-[52px] ${dark ? 'bg-slate-600 border-slate-500 text-slate-200' : 'bg-white border-slate-200 text-slate-900'}`;

  if (!word.aiData) {
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
        <span
          className={`text-[13px] font-bold uppercase tracking-wide ${dark ? 'text-slate-400' : 'text-slate-500'}`}
        >
          ✨ AI Insights
        </span>
        <div className="flex gap-2">
          <button className={miniBtnClass}>↻ Regenerate</button>
          {!editMode ? (
            <button onClick={() => setEditMode(true)} className={miniBtnClass}>
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={() => setEditMode(false)}
                className="px-2.5 py-1 rounded-md border border-emerald-400 bg-emerald-500 text-white text-xs font-medium cursor-pointer"
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

      {editMode ? (
        <div className="flex flex-col gap-2.5">
          <label className={labelClass}>Explanation</label>
          <textarea rows={2} defaultValue={d.explanation} className={editInputClass} />
          <label className={labelClass}>Examples (one per line)</label>
          <textarea rows={2} defaultValue={d.examples.join('\n')} className={editInputClass} />
          <label className={labelClass}>Synonyms (comma separated)</label>
          <input
            defaultValue={d.synonyms.join(', ')}
            className={`w-full px-3 py-2 rounded-lg border text-[13px] outline-none ${dark ? 'bg-slate-600 border-slate-500 text-slate-200' : 'bg-white border-slate-200 text-slate-900'}`}
          />
          <label className={labelClass}>Usage Tip</label>
          <textarea rows={2} defaultValue={d.tips} className={editInputClass} />
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          <div>
            <span className={labelClass}>Explanation</span>
            <p
              className={`text-[14px] leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-800'}`}
            >
              {d.explanation}
            </p>
          </div>
          <div>
            <span className={labelClass}>Examples</span>
            {d.examples.map((ex, i) => (
              <p
                key={i}
                className={`text-[13px] leading-snug pl-2.5 border-l-2 mb-1 ${dark ? 'border-slate-500 text-slate-400' : 'border-slate-300 text-slate-500'}`}
              >
                {ex}
              </p>
            ))}
          </div>
          <div>
            <span className={labelClass}>Synonyms</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {d.synonyms.map((s, i) => (
                <span
                  key={i}
                  className={`text-xs px-2.5 py-0.5 rounded-full ${dark ? 'bg-slate-600 text-slate-300' : 'bg-slate-200 text-slate-500'}`}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className={labelClass}>Usage Tip</span>
            <p
              className={`text-[13px] leading-relaxed px-3 py-2 rounded-lg ${dark ? 'bg-amber-500/10 text-amber-300' : 'bg-yellow-50 text-yellow-800'}`}
            >
              💡 {d.tips}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
