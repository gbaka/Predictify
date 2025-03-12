import { useState } from "react";
import { useTheme } from "../context/ThemeContext";



export function ARIMASettings() {
    const [p, setP] = useState(1);  
    const [d, setD] = useState(1);  
    const [q, setQ] = useState(1);  

    const { theme } = useTheme()
  
    // Функция для обработки изменения значения в поле ввода
    const handleInputChange = (e, setter) => {
      const value = e.target.value;
      setter(value !== "" ? value : 1); // Если поле пустое, ставим значение по умолчанию
    };
  
    return (
      <div className="max-h-[200px] flex-grow space-y-4"> {/* Уменьшили отступы между полями */}
        <div className="flex flex-col space-y-2">
          <label className="font-medium">Параметр P :</label>
          <input
            type="number"
            value={p}
            onChange={(e) => handleInputChange(e, setP)}
            className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-sky-500 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-400'}`}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="font-medium">Параметр d :</label>
          <input
            type="number"
            value={d}
            onChange={(e) => handleInputChange(e, setD)}
            className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-sky-500 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-400'}`}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="font-medium">Параметр q :</label>
          <input
            type="number"
            value={q}
            onChange={(e) => handleInputChange(e, setQ)}
            className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-sky-500 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-400'}`}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="font-medium">Параметр q:</label>
          <input
            type="number"
            value={q}
            onChange={(e) => handleInputChange(e, setQ)}
            className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-sky-500 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-400'}`}
          />
        </div>
      </div>
    );
  }

export function SARIMASettings() {
    const [p, setP] = useState(1);  
    const [d, setD] = useState(1);  
    const [q, setQ] = useState(1);  

    const { theme } = useTheme()
  
    // Функция для обработки изменения значения в поле ввода
    const handleInputChange = (e, setter) => {
      const value = e.target.value;
      setter(value !== "" ? value : 1); // Если поле пустое, ставим значение по умолчанию
    };
  
    return (
      <div className="max-h-[200px] flex-grow space-y-4"> {/* Уменьшили отступы между полями */}
        <div className="flex flex-col space-y-2">
          <label className="font-medium">Параметр P Sarima:</label>
          <input
            type="number"
            value={p}
            onChange={(e) => handleInputChange(e, setP)}
            className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-sky-500 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-400'}`}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="font-medium">Параметр d Sarima:</label>
          <input
            type="number"
            value={d}
            onChange={(e) => handleInputChange(e, setD)}
            className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-sky-500 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-400'}`}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="font-medium">Параметр q Sarima:</label>
          <input
            type="number"
            value={q}
            onChange={(e) => handleInputChange(e, setQ)}
            className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-sky-500 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-400'}`}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="font-medium">Параметр q:</label>
          <input
            type="number"
            value={q}
            onChange={(e) => handleInputChange(e, setQ)}
            className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-sky-500 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-400'}`}
          />
        </div>
      </div>
    );
  }