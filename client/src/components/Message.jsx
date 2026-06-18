export default function Message({ type = 'info', children, onClose }) {
  return (
    <div className={`message message-${type}`}>
      <span>{children}</span>
      {onClose && (
        <button className="message-close" onClick={onClose}>
          &times;
        </button>
      )}
    </div>
  );
}
