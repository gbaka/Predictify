import { useTheme } from "../context/ThemeContext";
import { X } from "lucide-react"; // Иконка для закрытия

export default function SettingsPanel({ isOpen, onClose }) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Если панель не открыта, ничего не рендерим
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-opacity-50 z-200 backdrop-blur-sm ${
        isDarkMode ? "bg-gray-950/60" : "bg-gray-500/60"
      }`}
      onClick={onClose} // Закрываем панель при клике вне её области
    >
      {/* Контейнер панели */}
      <div
        className={`w-[80vw] h-[80vh] rounded-lg shadow-lg flex flex-col ${
          isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
        }`}
        onClick={(e) => e.stopPropagation()} // Предотвращаем закрытие при клике внутри панели
      >
        {/* Заголовок и кнопка закрытия */}
        <div
          className={`flex justify-between items-center p-4 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-300"
          }`}
        >
          <h2 className="text-xl font-bold">Настройки</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full hover:bg-gray-200 ${
              isDarkMode ? "hover:bg-gray-700" : ""
            } transition-colors`}
          >
            <X className={`w-5 h-5 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`} />
          </button>
        </div>

        {/* Содержимое панели */}
        <div className="p-4 flex-grow overflow-y-auto">
          <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
            Здесь будут дополнительные настройки.
          </p>
          {/* Добавьте сюда другие элементы настроек */}
        </div>
      </div>
    </div>
  );
}
