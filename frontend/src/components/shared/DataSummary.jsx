import { Check, ClipboardCopy } from "lucide-react";
import { useState } from "react";


export default function DataSummary({ summary, theme }) {
    const isDarkMode = theme === "dark";
  
    const [copied, setCopied] = useState(false);
  
    const handleCopy = () => {
      if (summary) {
        navigator.clipboard.writeText(summary);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      }
    };
  
    return (
      <div
        className={`${isDarkMode ? 'border-gray-700' : 'border-gray-300'} relative p-2 border rounded-lg w-full h-full line-clamp-1 overflow-y-scroll`}
      >
        {/* Иконка копирования в правом верхнем углу */}
        <button
          onClick={handleCopy}
          title="Скопировать"
          className={`absolute top-2.5 right-2.5 transition ${
            isDarkMode
              ? '[color:rgb(72,86,108)] hover:[color:rgb(115,134,161)]'
              : '[color:rgb(150,150,150)] hover:[color:rgb(111,111,111)]'
          }`}
        >
          {copied ? (
            <Check size={20} strokeWidth={1.3} />
          ) : (
            <ClipboardCopy size={20} strokeWidth={1.3} />
          )}
        </button>
  
        <div style={{ height: 0, color: 'rgba(0, 0, 0, 0)' }}><br /></div>
        <h3 className="font-bold">Сводка данных:</h3>
        <pre className={`text-center whitespace-pre-wrap text-xs ${!summary ? 'text-gray-500' : ''}`}>
          {summary || "Нет данных"}
        </pre>
      </div>
    );
  }
  