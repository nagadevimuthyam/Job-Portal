export default function FieldError({ message, className = "" }) {
  if (!message) return null;
  return <p className={`mt-1 text-xs text-danger ${className}`}>{message}</p>;
}
