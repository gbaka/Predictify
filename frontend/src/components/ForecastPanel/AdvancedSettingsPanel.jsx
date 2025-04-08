import { useRef, useEffect } from "react";
import { X } from "lucide-react";

import { ADVANCED_SETTINGS_DEFAULTS } from "./defaultAdvancedSettings";


export default function AdvancedSettingsPanel({ isOpen, onClose, onChange, theme }) {
  const isDarkMode = theme === "dark";

  const settingsRef = useRef({ ...ADVANCED_SETTINGS_DEFAULTS });

  const handleInputChange = (e, category, key) => {
    let { value, type } = e.target;
  
    if (type === "checkbox") {
      value = e.target.checked;
    } else if (type === "number") {
      value = value.replace(/\D/g, "");
      value = value ? Number(value) : "";
    }
  
    settingsRef.current[category][key] = value;
    onChange(settingsRef.current);
  };
  

  useEffect(() => {
    onChange(settingsRef.current);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-opacity-50 z-200 backdrop-blur-sm ${
        isDarkMode ? "bg-gray-950/60" : "bg-gray-500/60"
      }`}
      onClick={onClose}
    >
      <div
        className={`w-[80vw] h-[80vh] rounded-lg shadow-lg flex flex-col ${
          isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`flex justify-between items-center p-4 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-300"
          }`}
        >
          <h2 className="text-xl font-bold">Дополнительные настройки</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full hover:bg-gray-200 transition-colors ${
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
            }`}
          >
            <X
              className={`w-5 h-5 ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              }`}
            />
          </button>
        </div>

        <div className="p-4 flex-grow overflow-y-auto space-y-4">
          {/* Название графика */}
          <div className="flex flex-col space-y-2">
            <label className="font-medium">Название графика:</label>
            <input
              type="text"
              defaultValue={settingsRef.current.graphSettings.title}
              onChange={(e) =>
                handleInputChange(e, "graphSettings", "title")
              }
              className={`border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 ${
                isDarkMode
                  ? "bg-gray-800 border-gray-600"
                  : "bg-white border-gray-400"
              }`}
            />
          </div>

          {/* Сетка */}
          <div className="flex flex-col space-y-2">
            <label className="font-medium">Сетка:</label>
            <select
              defaultValue={settingsRef.current.graphSettings.gridType}
              onChange={(e) =>
                handleInputChange(e, "graphSettings", "gridType")
              }
              className={`border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 ${
                isDarkMode
                  ? "bg-gray-800 border-gray-600"
                  : "bg-white border-gray-400"
              }`}
            >
              <option value="regular">Обычная</option>
              <option value="vertical">Вертикальная</option>
              <option value="horizontal">Горизонтальная</option>
              <option value="missing">Отсутствует</option>
            </select>
          </div>

          {/* Поле выбора цвета для графика исходных данных */}
          <div className="flex items-center justify-between">
            <label className="font-medium">Цвет графика исходных данных:</label>
            <input
              type="color"
              defaultValue={settingsRef.current.graphSettings.dataColor}
              onChange={(e) =>
                handleInputChange(e, "graphSettings", "dataColor")
              }
              className={`h-8 w-16 cursor-pointer ${
                isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              } transition-all`}
            />
          </div>

          {/* Поле выбора цвета для графика прогноза */}
          <div className="flex items-center justify-between">
            <label className="font-medium">Цвет графика прогноза:</label>
            <input
              type="color"
              defaultValue={settingsRef.current.graphSettings.forecastColor}
              onChange={(e) =>
                handleInputChange(e, "graphSettings", "forecastColor")
              }
              className={`h-8 w-16 cursor-pointer ${
                isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              } transition-all`}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              defaultChecked={settingsRef.current.graphSettings.showEndogExtremes}
              onChange={(e) =>
                handleInputChange(e, "graphSettings", "showEndogExtremes")
              }
              className="h-5 w-5"
            />
            <label className="font-medium">
              Показывать экстремумы исходных данных
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              defaultChecked={settingsRef.current.graphSettings.showEndogAverage}
              onChange={(e) =>
                handleInputChange(e, "graphSettings", "showEndogAverage")
              }
              className="h-5 w-5"
            />
            <label className="font-medium">
              Показывать среднее исходных данных
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              defaultChecked={settingsRef.current.graphSettings.showForecastExtremes}
              onChange={(e) =>
                handleInputChange(e, "graphSettings", "showForecastExtremes")
              }
              className="h-5 w-5"
            />
            <label className="font-medium">
              Показывать экстремумы прогнозов
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              defaultChecked={settingsRef.current.graphSettings.showForecastAverage}
              onChange={(e) =>
                handleInputChange(e, "graphSettings", "showForecastAverage")
              }
              className="h-5 w-5"
            />
            <label className="font-medium">
              Показывать среднее прогнозов
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              defaultChecked={settingsRef.current.graphSettings.isSmooth}
              onChange={(e) =>
                handleInputChange(e, "graphSettings", "isSmooth")
              }
              className="h-5 w-5"
            />
            <label className="font-medium">Сглаживание графика</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              defaultChecked={settingsRef.current.graphSettings.showLegend}
              onChange={(e) =>
                handleInputChange(e, "graphSettings", "showLegend")
              }
              className="h-5 w-5"
            />
            <label className="font-medium">Показывать легенду</label>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="font-medium">Формат дат входного файла:</label>
            <select
              defaultValue={settingsRef.current.fileSettings.dateFormat}
              onChange={(e) =>
                handleInputChange(e, "fileSettings", "dateFormat")
              }
              className={`border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 ${
                isDarkMode
                  ? "bg-gray-800 border-gray-600"
                  : "bg-white border-gray-400"
              }`}
            >
              <option value="auto">Автоматически</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              <option value="DD.MM.YYYY">DD.MM.YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            </select>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="font-medium">Разделитель колонок CSV:</label>
            <select
              defaultValue={settingsRef.current.fileSettings.csvDelimiter}
              onChange={(e) =>
                handleInputChange(e, "fileSettings", "csvDelimiter")
              }
              className={`border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 ${
                isDarkMode
                  ? "bg-gray-800 border-gray-600"
                  : "bg-white border-gray-400"
              }`}
            >
              <option value="auto">Автоматически</option>
              <option value=",">Запятая &quot;,&quot;</option>
              <option value=";">Точка с запятой &quot;;&quot;</option>
              <option value=" ">Пробел &quot; &quot;</option>
              <option value="&#9;">Табуляция &quot;\t&quot;</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}