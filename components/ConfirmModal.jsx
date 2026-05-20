export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50 p-5">
      <div className="bg-nox-surface border border-nox-border rounded w-full max-w-[300px] flex flex-col gap-[18px] p-[22px] pb-3.5">
        <p className="text-sm text-nox-text leading-relaxed">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="bg-transparent border-none rounded-md text-nox-muted text-[13px] px-3.5 py-1.5 cursor-pointer hover:text-nox-text transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="bg-[#c0392b] border-none rounded-md text-white text-[13px] font-medium px-3.5 py-1.5 cursor-pointer hover:opacity-80 transition-opacity"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}
