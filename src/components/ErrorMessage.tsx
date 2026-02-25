interface ErrorMessageProps {
  title: string;
  message: string;
}

export default function ErrorMessage({ title, message }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-5">
      <h3 className="font-bold text-red-800 mb-1">{title}</h3>
      <p className="text-red-700 text-sm">{message}</p>
    </div>
  );
}
