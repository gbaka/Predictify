import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  SARIMA_DEFAULTS,
  ARIMA_DEFAULTS,
  ARMA_DEFAULTS,
  AR_DEFAULTS,
  MA_DEFAULTS,
  SES_DEFAULTS,
  HES_DEFAULTS,
  HWES_DEFAULTS
} from "./defaultModelSettings";

const I18nNamespace = "common";


/**
 * Компонент интерфейса настроек модели SARIMA.
 * @component
 * @param {Object} props
 * @param {Function} props.onChange - Callback, вызываемый при изменении настроек, передаёт объект параметров.
 * @param {"dark"|"light"} props.theme - Тема оформления (тёмная или светлая)
 * @returns {JSX.Element} JSX элемент.
 */
export function SARIMASettings({ onChange, theme }) {
    const { t } = useTranslation(I18nNamespace);
    const [settings, setSettings] = useState({ ...SARIMA_DEFAULTS });
    const isDarkMode = theme === "dark";

    const handleInputChange = (e, key) => {
        let { value, type } = e.target;

        if (type === "checkbox") {
            value = e.target.checked;
        } else if (type === "number") {
            if (key === "steps") {
                value = value.replace(/\D/g, ""); 
                value = value ? Number(value) : "";
                value = Math.max(1, Math.min(30, value || 1)); // Ограничение для steps
            }
            if (key === "significanceLevel") {
                value = value.replace(/[^\d.]/g, "");
                value = value.replace(/^(\d*\.?)|(\d*)\.?/g, "$1$2");
                value = value ? parseFloat(value) : "";
                value = Math.max(0.01, Math.min(0.99, value || 0.05));
            }
            if (['p', 'q', 'd', 'P', 'D', 'Q', 's'].includes(key)) {
                value = value.replace(/\D/g, ""); 
                value = value ? Number(value) : "";
                value = Math.max(0, value || 0)
            }
        } 

        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        onChange(newSettings); // Передаём актуальные данные в родительский компонент
    };

    useEffect(() => {
        onChange(settings); // Передаём начальные настройки
    }, []);

    return (
        <div className="max-h-[200px] flex-grow space-y-4">
            {/* Поле ввода количества шагов */}
            <div className="flex flex-col space-y-2">
                <label className="font-medium">{t("model-settings.steps")}</label>
                <input
                    type="number"
                    value={settings.steps}
                    min={1}
                    max={30}
                    onChange={(e) => handleInputChange(e, "steps")}
                    className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? "border-gray-600" : "border-gray-400"
                    }`}
                />
            </div>

            {/* Остальные параметры SARIMAX */}
            {["p", "d", "q", "P", "D", "Q", "s"].map((param) => (
                <div key={param} className="flex flex-col space-y-2">
                    <label className="font-medium">{t("model-settings.param")} {param}:</label>
                    <input
                        type="number"
                        min={0}
                        value={settings[param]}
                        onChange={(e) => handleInputChange(e, param)}
                        className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-blue-500 ${
                            isDarkMode ? "border-gray-600" : "border-gray-400"
                        }`}
                    />
                </div>
            ))}

            {/* Уровень значимости */}
            <div className="flex flex-col space-y-2">
                <label className="font-medium">{t("model-settings.conf-level")}</label>
                <input
                    type="number"
                    step={0.01}
                    min={0.01}
                    max={0.99}
                    value={settings.significanceLevel}
                    onChange={(e) => handleInputChange(e, "significanceLevel")}
                    className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? "border-gray-600" : "border-gray-400"
                    }`}
                />
            </div>

            {/* Тип тренда */}
            <div className="flex flex-col space-y-2">
                <label className="font-medium">{t("model-settings.trend-type")}</label>
                <select
                    value={settings.trend}
                    onChange={(e) => handleInputChange(e, "trend")}
                    className={`border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? "bg-gray-850 border-gray-600" : "bg-gray-50 border-gray-400"
                    }`}
                >
                    <option value="n">{t("model-settings.no-trend")}</option>
                    <option value="c">{t("model-settings.const-trend")}</option>
                    <option value="t">{t("model-settings.linear-trend")}</option>
                    <option value="ct">{t("model-settings.linear-const-trend")}</option>
                </select>
            </div>

            {/* Чекбоксы */}
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={settings.enforceStationarity || false}
                    onChange={(e) => handleInputChange(e, "enforceStationarity")}
                    className="h-5 w-5 flex-shrink-0"
                />
                <label className="font-medium">{t("model-settings.stationarity")}</label>
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={settings.enforceInvertibility || false}
                    onChange={(e) => handleInputChange(e, "enforceInvertibility")}
                    className="h-5 w-5 flex-shrink-0"
                />
                <label className="font-medium">{t("model-settings.invertibility")}</label>
            </div>
        </div>
    );
}


/**
 * Компонент интерфейса настроек модели ARIMA.
 * @component
 * @param {Object} props
 * @param {Function} props.onChange - Callback, вызываемый при изменении настроек, передаёт объект параметров.
 * @param {"dark"|"light"} props.theme - Тема оформления (тёмная или светлая)
 * @returns {JSX.Element} JSX элемент.
 */
export function ARIMASettings({ onChange, theme }) {
    const { t } = useTranslation(I18nNamespace);
    const [settings, setSettings] = useState({ ...ARIMA_DEFAULTS });
    const isDarkMode = theme === "dark";

    const handleInputChange = (e, key) => {
        let { value, type } = e.target;

        if (type === "checkbox") {
            value = e.target.checked;
        } else if (type === "number") {
            if (key === "steps") {
                value = value.replace(/\D/g, ""); 
                value = value ? Number(value) : "";
                value = Math.max(1, Math.min(30, value || 1)); // Ограничение для steps
            }
            if (key === "significanceLevel") {
                value = value.replace(/[^\d.]/g, "");
                value = value.replace(/^(\d*\.?)|(\d*)\.?/g, "$1$2");
                value = value ? parseFloat(value) : "";
                value = Math.max(0.01, Math.min(0.99, value || 0.05));
            }
            if (['p', 'q', 'd'].includes(key)) {
                value = value.replace(/\D/g, ""); 
                value = value ? Number(value) : "";
                value = Math.max(0, value || 0)
            }
        } 

        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        onChange(newSettings); // Передаём актуальные данные в родительский компонент
    };

    useEffect(() => {
        onChange(settings); // Передаём начальные настройки
    }, []);

    return (
        <div className="max-h-[200px] flex-grow space-y-4">
            {/* Поле ввода количества шагов */}
            <div className="flex flex-col space-y-2">
                <label className="font-medium">{t("model-settings.steps")}</label>
                <input
                    type="number"
                    value={settings.steps}
                    min={1}
                    max={30}
                    onChange={(e) => handleInputChange(e, "steps")}
                    className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? "border-gray-600" : "border-gray-400"
                    }`}
                />
            </div>

            {/* Остальные параметры ARIMA */}
            {["p", "d", "q"].map((param) => (
                <div key={param} className="flex flex-col space-y-2">
                    <label className="font-medium">{t("model-settings.param")} {param}:</label>
                    <input
                        type="number"
                        min={0}
                        value={settings[param]}
                        onChange={(e) => handleInputChange(e, param)}
                        className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-blue-500 ${
                            isDarkMode ? "border-gray-600" : "border-gray-400"
                        }`}
                    />
                </div>
            ))}

            {/* Уровень значимости */}
            <div className="flex flex-col space-y-2">
                <label className="font-medium">{t("model-settings.conf-level")}</label>
                <input
                    type="number"
                    step={0.01}
                    min={0.01}
                    max={0.99}
                    value={settings.significanceLevel}
                    onChange={(e) => handleInputChange(e, "significanceLevel")}
                    className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? "border-gray-600" : "border-gray-400"
                    }`}
                />
            </div>

            {/* Тип тренда */}
            <div className="flex flex-col space-y-2">
                <label className="font-medium">{t("model-settings.trend-type")}</label>
                <select
                    value={settings.trend}
                    onChange={(e) => handleInputChange(e, "trend")}
                    className={`border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? "bg-gray-850 border-gray-600" : "bg-gray-50 border-gray-400"
                    }`}
                >
                    <option value="n">{t("model-settings.no-trend")}</option>
                    <option value="c">{t("model-settings.const-trend")}</option>
                    <option value="t">{t("model-settings.linear-trend")}</option>
                    <option value="ct">{t("model-settings.linear-const-trend")}</option>
                </select>
            </div>

            {/* Чекбоксы */}
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={settings.enforceStationarity || false}
                    onChange={(e) => handleInputChange(e, "enforceStationarity")}
                    className="h-5 w-5 flex-shrink-0"
                />
                <label className="font-medium">{t("model-settings.stationarity")}</label>
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={settings.enforceInvertibility || false}
                    onChange={(e) => handleInputChange(e, "enforceInvertibility")}
                    className="h-5 w-5 flex-shrink-0"
                />
                <label className="font-medium">{t("model-settings.invertibility")}</label>
            </div>
        </div>
    );
}


/**
 * Компонент интерфейса настроек модели ARMA.
 * 
 * @component
 * @param {Object} props
 * @param {Function} props.onChange - Callback, вызываемый при изменении настроек, передаёт объект параметров.
 * @param {"dark"|"light"} props.theme - Тема оформления (тёмная или светлая)
 * @returns {JSX.Element} JSX элемент.
 */
export function ARMASettings({ onChange, theme }) {
    const { t } = useTranslation(I18nNamespace);
    const [settings, setSettings] = useState({ ...ARMA_DEFAULTS });

    const isDarkMode = theme === "dark";

    const handleInputChange = (e, key) => {
        let { value, type } = e.target;

        if (type === "checkbox") {
            value = e.target.checked;
        } else if (type === "number") {
            if (key === "steps") {
                value = value.replace(/\D/g, ""); 
                value = value ? Number(value) : "";
                value = Math.max(1, Math.min(30, value || 1)); // Ограничение для steps
            }
            if (key === "significanceLevel") {
                value = value.replace(/[^\d.]/g, "");
                value = value.replace(/^(\d*\.?)|(\d*)\.?/g, "$1$2");
                value = value ? parseFloat(value) : "";
                value = Math.max(0.01, Math.min(0.99, value || 0.05));
            }
            if (['p', 'q'].includes(key)) {
                value = value.replace(/\D/g, ""); 
                value = value ? Number(value) : "";
                value = Math.max(0, value || 0)
            }
        } 

        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        onChange(newSettings); // Передаём актуальные данные в родительский компонент
    };

    useEffect(() => {
        onChange(settings); // Передаём начальные настройки
    }, []);

    return (
        <div className="max-h-[200px] flex-grow space-y-4">
            {/* Поле ввода количества шагов */}
            <div className="flex flex-col space-y-2">
                <label className="font-medium">{t("model-settings.steps")}</label>                
                <input
                    type="number"
                    value={settings.steps}
                    min={1}
                    max={30}
                    onChange={(e) => handleInputChange(e, "steps")}
                    className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? "border-gray-600" : "border-gray-400"
                    }`}
                />
            </div>

            {/* Остальные параметры ARMA */}
            {["p", "q"].map((param) => (
                <div key={param} className="flex flex-col space-y-2">
                    <label className="font-medium">{t("model-settings.param")} {param}:</label>
                    <input
                        type="number"
                        min={0}
                        value={settings[param]}
                        onChange={(e) => handleInputChange(e, param)}
                        className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-blue-500 ${
                            isDarkMode ? "border-gray-600" : "border-gray-400"
                        }`}
                    />
                </div>
            ))}

            {/* Уровень значимости */}
            <div className="flex flex-col space-y-2">
                <label className="font-medium">{t("model-settings.conf-level")}</label>
                <input
                    type="number"
                    step={0.01}
                    min={0.01}
                    max={0.99}
                    value={settings.significanceLevel}
                    onChange={(e) => handleInputChange(e, "significanceLevel")}
                    className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? "border-gray-600" : "border-gray-400"
                    }`}
                />
            </div>

            {/* Тип тренда */}
            <div className="flex flex-col space-y-2">
                <label className="font-medium">{t("model-settings.trend-type")}</label>
                <select
                    value={settings.trend}
                    onChange={(e) => handleInputChange(e, "trend")}
                    className={`border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? "bg-gray-850 border-gray-600" : "bg-gray-50 border-gray-400"
                    }`}
                >
                    <option value="n">{t("model-settings.no-trend")}</option>
                    <option value="c">{t("model-settings.const-trend")}</option>
                    <option value="t">{t("model-settings.linear-trend")}</option>
                    <option value="ct">{t("model-settings.linear-const-trend")}</option>
                </select>
            </div>

            {/* Чекбоксы */}
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={settings.enforceStationarity || false}
                    onChange={(e) => handleInputChange(e, "enforceStationarity")}
                    className="h-5 w-5 flex-shrink-0"
                />
                <label className="font-medium">{t("model-settings.stationarity")}</label>
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={settings.enforceInvertibility || false}
                    onChange={(e) => handleInputChange(e, "enforceInvertibility")}
                    className="h-5 w-5 flex-shrink-0"
                />
                <label className="font-medium">{t("model-settings.invertibility")}</label>
            </div>
        </div>
    );
}


/**
 * Компонент интерфейса настроек модели AR.
 * 
 * @component
 * @param {Object} props
 * @param {Function} props.onChange - Callback, вызываемый при изменении настроек, передаёт объект параметров.
 * @param {"dark"|"light"} props.theme - Тема оформления (тёмная или светлая)
 * @returns {JSX.Element} JSX элемент.
 */
export function ARSettings({ onChange, theme }) {
    const { t } = useTranslation(I18nNamespace);
    const [settings, setSettings] = useState({ ...AR_DEFAULTS });
    const isDarkMode = theme === "dark";

    const handleInputChange = (e, key) => {
        let { value, type } = e.target;

        if (type === "checkbox") {
            value = e.target.checked;
        } else if (type === "number") {
            if (key === "steps") {
                value = value.replace(/\D/g, ""); 
                value = value ? Number(value) : "";
                value = Math.max(1, Math.min(30, value || 1)); // Ограничение для steps
            }
            if (key === "significanceLevel") {
                value = value.replace(/[^\d.]/g, "");
                value = value.replace(/^(\d*\.?)|(\d*)\.?/g, "$1$2");
                value = value ? parseFloat(value) : "";
                value = Math.max(0.01, Math.min(0.99, value || 0.05));
            }
            if (['p'].includes(key)) {
                value = value.replace(/\D/g, ""); 
                value = value ? Number(value) : "";
                value = Math.max(0, value || 0)
            }
        } 

        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        onChange(newSettings); // Передаём актуальные данные в родительский компонент
    };

    useEffect(() => {
        onChange(settings); // Передаём начальные настройки
    }, []);

    return (
        <div className="max-h-[200px] flex-grow space-y-4">
            {/* Поле ввода количества шагов */}
            <div className="flex flex-col space-y-2">
                <label className="font-medium">{t("model-settings.steps")}</label>
                <input
                    type="number"
                    value={settings.steps}
                    min={1}
                    max={30}
                    onChange={(e) => handleInputChange(e, "steps")}
                    className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? "border-gray-600" : "border-gray-400"
                    }`}
                />
            </div>

            {/* Остальные параметры AR */}
            {["p"].map((param) => (
                <div key={param} className="flex flex-col space-y-2">
                    <label className="font-medium">{t("model-settings.param")} {param}:</label>
                    <input
                        type="number"
                        min={0}
                        value={settings[param]}
                        onChange={(e) => handleInputChange(e, param)}
                        className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-blue-500 ${
                            isDarkMode ? "border-gray-600" : "border-gray-400"
                        }`}
                    />
                </div>
            ))}

            {/* Уровень значимости */}
            <div className="flex flex-col space-y-2">
                <label className="font-medium">{t("model-settings.conf-level")}</label>
                <input
                    type="number"
                    step={0.01}
                    min={0.01}
                    max={0.99}
                    value={settings.significanceLevel}
                    onChange={(e) => handleInputChange(e, "significanceLevel")}
                    className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? "border-gray-600" : "border-gray-400"
                    }`}
                />
            </div>

            {/* Тип тренда */}
            <div className="flex flex-col space-y-2">
                <label className="font-medium">{t("model-settings.trend-type")}</label>
                <select
                    value={settings.trend}
                    onChange={(e) => handleInputChange(e, "trend")}
                    className={`border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? "bg-gray-850 border-gray-600" : "bg-gray-50 border-gray-400"
                    }`}
                >
                    <option value="n">{t("model-settings.no-trend")}</option>
                    <option value="c">{t("model-settings.const-trend")}</option>
                    <option value="t">{t("model-settings.linear-trend")}</option>
                    <option value="ct">{t("model-settings.linear-const-trend")}</option>
                </select>
            </div>

            {/* Чекбоксы */}
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={settings.enforceStationarity || false}
                    onChange={(e) => handleInputChange(e, "enforceStationarity")}
                    className="h-5 w-5 flex-shrink-0"
                />
                <label className="font-medium">{t("model-settings.stationarity")}</label>
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={settings.enforceInvertibility || false}
                    onChange={(e) => handleInputChange(e, "enforceInvertibility")}
                    className="h-5 w-5 flex-shrink-0"
                />
                <label className="font-medium">{t("model-settings.invertibility")}</label>
            </div>
        </div>
    );
}


/**
 * Компонент интерфейса настроек модели MA.
 * 
 * @component
 * @param {Object} props
 * @param {Function} props.onChange - Callback, вызываемый при изменении настроек, передаёт объект параметров.
 * @param {"dark"|"light"} props.theme - Тема оформления (тёмная или светлая)
 * @returns {JSX.Element} JSX элемент.
 */
export function MASettings({ onChange, theme }) {
    const { t } = useTranslation(I18nNamespace);
    const [settings, setSettings] = useState({ ...MA_DEFAULTS });
    const isDarkMode = theme === "dark";

    const handleInputChange = (e, key) => {
        let { value, type } = e.target;

        if (type === "checkbox") {
            value = e.target.checked;
        } else if (type === "number") {
            if (key === "steps") {
                value = value.replace(/\D/g, ""); 
                value = value ? Number(value) : "";
                value = Math.max(1, Math.min(30, value || 1)); // Ограничение для steps
            }
            if (key === "significanceLevel") {
                value = value.replace(/[^\d.]/g, "");
                value = value.replace(/^(\d*\.?)|(\d*)\.?/g, "$1$2");
                value = value ? parseFloat(value) : "";
                value = Math.max(0.01, Math.min(0.99, value || 0.05));
            }
            if (['q'].includes(key)) {
                value = value.replace(/\D/g, ""); 
                value = value ? Number(value) : "";
                value = Math.max(0, value || 0)
            }
        } 

        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        onChange(newSettings); // Передаём актуальные данные в родительский компонент
    };

    useEffect(() => {
        onChange(settings); // Передаём начальные настройки
    }, []);

    return (
        <div className="max-h-[200px] flex-grow space-y-4">
            {/* Поле ввода количества шагов */}
            <div className="flex flex-col space-y-2">
                <label className="font-medium">{t("model-settings.steps")}</label>
                <input
                    type="number"
                    value={settings.steps}
                    min={1}
                    max={30}
                    onChange={(e) => handleInputChange(e, "steps")}
                    className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? "border-gray-600" : "border-gray-400"
                    }`}
                />
            </div>

            {/* Остальные параметры MA */}
            {["q"].map((param) => (
                <div key={param} className="flex flex-col space-y-2">
                    <label className="font-medium">{t("model-settings.param")} {param}:</label>
                    <input
                        type="number"
                        min={0}
                        value={settings[param]}
                        onChange={(e) => handleInputChange(e, param)}
                        className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-blue-500 ${
                            isDarkMode ? "border-gray-600" : "border-gray-400"
                        }`}
                    />
                </div>
            ))}

            {/* Уровень значимости */}
            <div className="flex flex-col space-y-2">
                <label className="font-medium">{t("model-settings.conf-level")}</label>
                <input
                    type="number"
                    step={0.01}
                    min={0.01}
                    max={0.99}
                    value={settings.significanceLevel}
                    onChange={(e) => handleInputChange(e, "significanceLevel")}
                    className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? "border-gray-600" : "border-gray-400"
                    }`}
                />
            </div>

            {/* Тип тренда */}
            <div className="flex flex-col space-y-2">
                <label className="font-medium">{t("model-settings.trend-type")}</label>
                <select
                    value={settings.trend}
                    onChange={(e) => handleInputChange(e, "trend")}
                    className={`border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? "bg-gray-850 border-gray-600" : "bg-gray-50 border-gray-400"
                    }`}
                >
                    <option value="n">{t("model-settings.no-trend")}</option>
                    <option value="c">{t("model-settings.const-trend")}</option>
                    <option value="t">{t("model-settings.linear-trend")}</option>
                    <option value="ct">{t("model-settings.linear-const-trend")}</option>
                </select>
            </div>

            {/* Чекбоксы */}
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={settings.enforceStationarity || false}
                    onChange={(e) => handleInputChange(e, "enforceStationarity")}
                    className="h-5 w-5 flex-shrink-0"
                />
                <label className="font-medium">{t("model-settings.stationarity")}</label>
            </div>
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={settings.enforceInvertibility || false}
                    onChange={(e) => handleInputChange(e, "enforceInvertibility")}
                    className="h-5 w-5 flex-shrink-0"
                />
                <label className="font-medium">{t("model-settings.invertibility")}</label>
            </div>
        </div>
    );
}


/**
 * Компонент интерфейса настроек модели SES (Simple Exponential Smoothing).
 * 
 * @component
 * @param {Object} props
 * @param {Function} props.onChange - Callback, вызываемый при изменении настроек, передаёт объект параметров.
 * @param {"dark"|"light"} props.theme - Тема оформления (тёмная или светлая)
 * @returns {JSX.Element} JSX элемент.
 */
export function SESSettings({ onChange, theme }) {
    const { t } = useTranslation(I18nNamespace)
    const [settings, setSettings] = useState({ ...SES_DEFAULTS });
    const isDarkMode = theme === "dark";

    const handleInputChange = (e, key) => {
        let { value, type } = e.target;

        if (type === "checkbox") {
            value = e.target.checked;
        } else if (type === "number") {
            if (key === "steps") {
                value = value.replace(/\D/g, ""); 
                value = value ? Number(value) : "";
                value = Math.max(1, Math.min(30, value || 1)); // Ограничение для steps
            }
            if (key === "initialLevel") {
                value = value.replace(/[^-0-9.]/g, "")
                    .replace(/(?!^)-/g, "")   
                    .replace(/(\..*)\./g, '$1');  
                value = value ? parseFloat(value) : "";
                value = Math.max(-100, Math.min(100, value === "" ? 1 : value));
            }
        } 

        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        onChange(newSettings); // Передаём актуальные данные в родительский компонент
    };

    useEffect(() => {
        onChange(settings); // Передаём начальные настройки
    }, []);

    return (
        <div className="max-h-[200px] flex-grow space-y-4">
            {/* Поле ввода количества шагов */}
            <div className="flex flex-col space-y-2">
                <label className="font-medium">{t("model-settings.steps")}</label>
                <input
                    type="number"
                    value={settings.steps}
                    min={1}
                    max={30}
                    onChange={(e) => handleInputChange(e, "steps")}
                    className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? "border-gray-600" : "border-gray-400"
                    }`}
                />
            </div>

            {/* Метод инициализации */}
            <div className="flex flex-col space-y-2">
                <label className="font-medium">{t("model-settings.init-method")}</label>
                <select
                    value={settings.initializationMethod}
                    onChange={(e) => handleInputChange(e, "initializationMethod")}
                    className={`border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? "bg-gray-850 border-gray-600" : "bg-gray-50 border-gray-400"
                    }`}
                >
                    <option value="estimated">{t("model-settings.estimated")}</option>
                    <option value="heuristic">{t("model-settings.heuristic")}</option>
                    <option value="legacy-heuristic">{t("model-settings.legacy-heuristic")}</option>
                    <option value="known">{t("model-settings.known")}</option>
                </select>
            </div>

            {/* Начальный уровень */}
            <div className="flex flex-col space-y-2">
                <label className="font-medium">{t("model-settings.init-level")}</label>
                <input
                    type="number"
                    step={0.1}
                    min={-100}
                    max={100}
                    value={settings.initialLevel}
                    onChange={(e) => handleInputChange(e, "initialLevel")}
                    disabled={settings.initializationMethod !== "known"} 
                    className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-blue-500 ${
                            isDarkMode 
                            ? settings.initializationMethod !== "known" 
                                ? "border-gray-700 text-gray-500 bg-gray-800" 
                                : "border-gray-600" 
                            : settings.initializationMethod !== "known" 
                                ? "border-gray-300 text-gray-400 bg-gray-100" 
                                : "border-gray-400"
                    }`}
                />
            </div>
        </div>
    );
}


/**
 * Компонент интерфейса настроек модели HES (Holt's Exponential Smoothing).
 * 
 * @component
 * @param {Object} props
 * @param {Function} props.onChange - Callback, вызываемый при изменении настроек, передаёт объект параметров.
 * @param {"dark"|"light"} props.theme - Тема оформления (тёмная или светлая)
 * @returns {JSX.Element} JSX элемент
 */
export function HESSettings({ onChange, theme }) {
    const { t } = useTranslation(I18nNamespace)
    const [settings, setSettings] = useState({ ...HES_DEFAULTS });
    const isDarkMode = theme === "dark";

    const handleInputChange = (e, key) => {
        let { value, type } = e.target;

        if (type === "checkbox") {
            value = e.target.checked;
        } else if (type === "number") {
            if (key === "steps") {
                value = value.replace(/\D/g, ""); 
                value = value ? Number(value) : "";
                value = Math.max(1, Math.min(30, value || 1)); // Ограничение для steps
            }
            if (key === "initialLevel") {
                value = value.replace(/[^-0-9.]/g, "")
                    .replace(/(?!^)-/g, "")   
                    .replace(/(\..*)\./g, '$1');  
                value = value ? parseFloat(value) : "";
                value = Math.max(-100, Math.min(100, value === "" ? 1 : value));
            }
            if (key === "initialTrend") {
                value = value.replace(/[^-0-9.]/g, "")
                    .replace(/(?!^)-/g, "")   
                    .replace(/(\..*)\./g, '$1');  
                value = value ? parseFloat(value) : "";
                value = Math.max(-1000, Math.min(1000, value === "" ? 1 : value));
            }
        } 

        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        onChange(newSettings); // Передаём актуальные данные в родительский компонент
    };

    useEffect(() => {
        onChange(settings); // Передаём начальные настройки
    }, []);

    return (
        <div className="max-h-[200px] flex-grow space-y-4">
            {/* Поле ввода количества шагов */}
            <div className="flex flex-col space-y-2">
                <label className="font-medium">{t("model-settings.steps")}</label>
                <input
                    type="number"
                    value={settings.steps}
                    min={1}
                    max={30}
                    onChange={(e) => handleInputChange(e, "steps")}
                    className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? "border-gray-600" : "border-gray-400"
                    }`}
                />
            </div>

            {/* Метод инициализации */}
            <div className="flex flex-col space-y-2">
                <label className="font-medium">{t("model-settings.init-method")}</label>
                <select
                    value={settings.initializationMethod}
                    onChange={(e) => handleInputChange(e, "initializationMethod")}
                    className={`border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? "bg-gray-850 border-gray-600" : "bg-gray-50 border-gray-400"
                    }`}
                >
                    <option value="estimated">{t("model-settings.estimated")}</option>
                    <option value="heuristic">{t("model-settings.heuristic")}</option>
                    <option value="legacy-heuristic">{t("model-settings.legacy-heuristic")}</option>
                    <option value="known">{t("model-settings.known")}</option>
                </select>
            </div>

            {/* Начальный уровень */}
            <div className="flex flex-col space-y-2">
                <label className="font-medium">{t("model-settings.init-level")}</label>
                <input
                    type="number"
                    step={0.1}
                    min={-100}
                    max={100}
                    value={settings.initialLevel}
                    onChange={(e) => handleInputChange(e, "initialLevel")}
                    disabled={settings.initializationMethod !== "known"} 
                    className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-blue-500 ${
                            isDarkMode 
                            ? settings.initializationMethod !== "known" 
                                ? "border-gray-700 text-gray-500 bg-gray-800" 
                                : "border-gray-600" 
                            : settings.initializationMethod !== "known" 
                                ? "border-gray-300 text-gray-400 bg-gray-100" 
                                : "border-gray-400"
                    }`}
                />
            </div>

            {/* Начальное значение тренда */}
            <div className="flex flex-col space-y-2">
                <label className="font-medium">{t("model-settings.init-trend")}</label>
                <input
                    type="number"
                    step={0.1}
                    min={-100}
                    max={100}
                    value={settings.initialTrend}
                    onChange={(e) => handleInputChange(e, "initialTrend")}
                    disabled={settings.initializationMethod !== "known"} 
                    className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-blue-500 ${
                            isDarkMode 
                            ? settings.initializationMethod !== "known" 
                                ? "border-gray-700 text-gray-500 bg-gray-800" 
                                : "border-gray-600" 
                            : settings.initializationMethod !== "known" 
                                ? "border-gray-300 text-gray-400 bg-gray-100" 
                                : "border-gray-400"
                    }`}
                />
            </div>

            {/* Чекбоксы */}
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={settings.exponential || false}
                    onChange={(e) => handleInputChange(e, "exponential")}
                    className="h-5 w-5 flex-shrink-0"
                />
                <label className="font-medium">{t("model-settings.exponential")}</label>
            </div>
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={settings.dampedTrend || false}
                    onChange={(e) => handleInputChange(e, "dampedTrend")}
                    className="h-5 w-5 flex-shrink-0"
                />
                <label className="font-medium">{t("model-settings.fading")}</label>
            </div>
        </div>
    );
}


/**
 * Компонент интерфейса настроек модели HWES (Holt-Winter's Exponential Smoothing).
 * 
 * @component
 * @param {Object} props
 * @param {Function} props.onChange - Callback, вызываемый при изменении настроек, передаёт объект параметров.
 * @param {"dark"|"light"} props.theme - Тема оформления (тёмная или светлая)
 * @returns {JSX.Element} JSX элемент
 */
export function HWESSettings({ onChange, theme }) {
    const { t } = useTranslation(I18nNamespace)
    const [settings, setSettings] = useState({ ...HWES_DEFAULTS });
    const isDarkMode = theme === "dark";

    const handleInputChange = (e, key) => {
        let { value, type } = e.target;

        if (type === "checkbox") {
            value = e.target.checked;
        } else if (type === "number") {
            if (key === "steps") {
                value = value.replace(/\D/g, ""); 
                value = value ? Number(value) : "";
                value = Math.max(1, Math.min(30, value || 1)); // Ограничение для steps
            }
            if (key === "seasonalPeriods") {
                value = value.replace(/\D/g, ""); 
                value = value ? Number(value) : "";
                value = Math.max(2, value || 2)
            }
        } 

        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        onChange(newSettings); // Передаём актуальные данные в родительский компонент
    };

    useEffect(() => {
        onChange(settings); // Передаём начальные настройки
    }, []);

    return (
        <div className="max-h-[200px] flex-grow space-y-4">
            {/* Поле ввода количества шагов */}
            <div className="flex flex-col space-y-2">
                <label className="font-medium">{t("model-settings.steps")}</label>
                <input
                    type="number"
                    value={settings.steps}
                    min={1}
                    max={30}
                    onChange={(e) => handleInputChange(e, "steps")}
                    className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? "border-gray-600" : "border-gray-400"
                    }`}
                />
            </div>

            {/* Метод инициализации */}
            <div className="flex flex-col space-y-2">
                <label className="font-medium">{t("model-settings.init-method")}</label>
                <select
                    value={settings.initializationMethod}
                    onChange={(e) => handleInputChange(e, "initializationMethod")}
                    className={`border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? "bg-gray-850 border-gray-600" : "bg-gray-50 border-gray-400"
                    }`}
                >
                    <option value="estimated">{t("model-settings.estimated")}</option>
                    <option value="heuristic">{t("model-settings.heuristic")}</option>
                    <option value="legacy-heuristic">{t("model-settings.legacy-heuristic")}</option>
                </select>
            </div>

            {/* Кол-во периодов в полном сезонном цикле */}
            <div className="flex flex-col space-y-2">
                <label className="font-medium">{t("model-settings.seasonal-periods")}</label>
                <input
                    type="number"
                    min={2}
                    value={settings['seasonalPeriods']}
                    onChange={(e) => handleInputChange(e, 'seasonalPeriods')}
                    className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? "border-gray-600" : "border-gray-400"
                    }`}
                />
            </div>

            {/* Тип трендовой компоненты */}
            <div className="flex flex-col space-y-2">
                <label className="font-medium">{t("model-settings.trend-component")}</label>
                <select
                    value={settings.trend}
                    onChange={(e) => handleInputChange(e, "trend")}
                    className={`border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? "bg-gray-850 border-gray-600" : "bg-gray-50 border-gray-400"
                    }`}
                >
                    <option value="add">{t("model-settings.add-trend")}</option>
                    <option value="mul">{t("model-settings.mul-trend")}</option>
                    <option value="none">{t("model-settings.no-trend")}</option>
                </select>
            </div>


            {/* Тип сезонной компоненты */}
            <div className="flex flex-col space-y-2">
                <label className="font-medium">{t("model-settings.seasonal-component")}</label>
                <select
                    value={settings.seasonal}
                    onChange={(e) => handleInputChange(e, "seasonal")}
                    className={`border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? "bg-gray-850 border-gray-600" : "bg-gray-50 border-gray-400"
                    }`}
                >
                    <option value="add">{t("model-settings.add-trend")}</option>
                    <option value="mul">{t("model-settings.mul-trend")}</option>
                    <option value="none">{t("model-settings.no-trend")}</option>
                </select>
            </div>

            {/* Чекбоксы */}
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={settings.dampedTrend || false}
                    onChange={(e) => handleInputChange(e, "dampedTrend")}
                    className="h-5 w-5 flex-shrink-0"
                />
                <label className="font-medium">{t("model-settings.fading")}</label>
            </div>
        </div>
    );
}
