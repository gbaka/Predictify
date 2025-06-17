import { useTranslation } from "react-i18next";

const I18nNamespace = "common";

export default function ErrorModal({ isOpen, message, onClose, theme }) {
  const { t } = useTranslation(I18nNamespace);
  const isDarkMode = theme === "dark";

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-opacity-50 z-200 backdrop-blur-sm ${
        isDarkMode ? "bg-gray-950/60" : "bg-gray-500/60"
      }`}
    >
      <div
        className={`p-6 rounded-lg shadow-lg max-w-md w-full ${
          isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
        }`}
      >
        <h2 className="text-xl font-bold mb-4">{t("modal.error")}</h2>
        <p className="mb-4">{message.title}</p>

        {message.detail && (
          <div className="mb-4">
            <p className="font-semibold mb-2 flex items-center">
              {t("modal.details")}
            </p>
            <div
              className={`p-2.5 rounded text-sm ${
                isDarkMode
                  ? "bg-gray-700/40 border border-gray-600"
                  : "bg-gray-100/80 border border-gray-200"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.detail}</p>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className={`w-full px-4 py-2 rounded-lg transition-colors ${
            isDarkMode
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {t("modal.close")}
        </button>
      </div>
    </div>
  );
}
