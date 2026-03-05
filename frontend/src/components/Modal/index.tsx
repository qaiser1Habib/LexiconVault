export function WordFormModal({ dark, onClose }: { dark: boolean; onClose: () => void }) {
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