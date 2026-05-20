export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal confirm-modal">
        <p className="confirm-message">{message}</p>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onCancel}>Annuler</button>
          <button className="btn-danger" onClick={onConfirm}>Supprimer</button>
        </div>
      </div>
    </div>
  )
}
