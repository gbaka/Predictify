import { useEffect, useState } from "react";

import {
  SARIMA_DEFAULTS,
  ARIMA_DEFAULTS,
  ARMA_DEFAULTS,
  AR_DEFAULTS,
  MA_DEFAULTS,
  SES_DEFAULTS,
} from "./defaultModelSettings";


export function SARIMASettings({ onChange, theme }) {
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
                <label className="font-medium">Количество шагов:</label>
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
                    <label className="font-medium">Параметр {param}:</label>
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
                <label className="font-medium">Уровень значимости доверительных интервалов:</label>
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
                <label className="font-medium">Тип тренда:</label>
                <select
                    value={settings.trend}
                    onChange={(e) => handleInputChange(e, "trend")}
                    className={`border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? "bg-gray-850 border-gray-600" : "bg-gray-50 border-gray-400"
                    }`}
                >
                    <option value="n">Нет тренда</option>
                    <option value="c">Постоянный тренд</option>
                    <option value="t">Линейный тренд</option>
                    <option value="ct">Линейный тренд с постоянным значением</option>
                </select>
            </div>

            {/* Чекбоксы */}
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={settings.enforceStationarity || false}
                    onChange={(e) => handleInputChange(e, "enforceStationarity")}
                    className="h-5 w-5"
                />
                <label className="font-medium">Принудительная стационарность</label>
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={settings.enforceInvertibility || false}
                    onChange={(e) => handleInputChange(e, "enforceInvertibility")}
                    className="h-5 w-5"
                />
                <label className="font-medium">Принудительная обратимость</label>
            </div>
        </div>
    );
}


export function ARIMASettings({ onChange, theme }) {
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
                <label className="font-medium">Количество шагов:</label>
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
                    <label className="font-medium">Параметр {param}:</label>
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
                <label className="font-medium">Уровень значимости доверительных интервалов:</label>
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
                <label className="font-medium">Тип тренда:</label>
                <select
                    value={settings.trend}
                    onChange={(e) => handleInputChange(e, "trend")}
                    className={`border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? "bg-gray-850 border-gray-600" : "bg-gray-50 border-gray-400"
                    }`}
                >
                    <option value="n">Нет тренда</option>
                    <option value="c">Постоянный тренд</option>
                    <option value="t">Линейный тренд</option>
                    <option value="ct">Линейный тренд с постоянным значением</option>
                </select>
            </div>

            {/* Чекбоксы */}
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={settings.enforceStationarity || false}
                    onChange={(e) => handleInputChange(e, "enforceStationarity")}
                    className="h-5 w-5"
                />
                <label className="font-medium">Принудительная стационарность</label>
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={settings.enforceInvertibility || false}
                    onChange={(e) => handleInputChange(e, "enforceInvertibility")}
                    className="h-5 w-5"
                />
                <label className="font-medium">Принудительная обратимость</label>
            </div>
        </div>
    );
}


export function ARMASettings({ onChange, theme }) {
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
                <label className="font-medium">Количество шагов:</label>
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
                    <label className="font-medium">Параметр {param}:</label>
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
                <label className="font-medium">Уровень значимости доверительных интервалов:</label>
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
                <label className="font-medium">Тип тренда:</label>
                <select
                    value={settings.trend}
                    onChange={(e) => handleInputChange(e, "trend")}
                    className={`border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? "bg-gray-850 border-gray-600" : "bg-gray-50 border-gray-400"
                    }`}
                >
                    <option value="n">Нет тренда</option>
                    <option value="c">Постоянный тренд</option>
                    <option value="t">Линейный тренд</option>
                    <option value="ct">Линейный тренд с постоянным значением</option>
                </select>
            </div>

            {/* Чекбоксы */}
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={settings.enforceStationarity || false}
                    onChange={(e) => handleInputChange(e, "enforceStationarity")}
                    className="h-5 w-5"
                />
                <label className="font-medium">Принудительная стационарность</label>
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={settings.enforceInvertibility || false}
                    onChange={(e) => handleInputChange(e, "enforceInvertibility")}
                    className="h-5 w-5"
                />
                <label className="font-medium">Принудительная обратимость</label>
            </div>
        </div>
    );
}


export function ARSettings({ onChange, theme }) {
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
                <label className="font-medium">Количество шагов:</label>
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
                    <label className="font-medium">Параметр {param}:</label>
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
                <label className="font-medium">Уровень значимости доверительных интервалов:</label>
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
                <label className="font-medium">Тип тренда:</label>
                <select
                    value={settings.trend}
                    onChange={(e) => handleInputChange(e, "trend")}
                    className={`border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? "bg-gray-850 border-gray-600" : "bg-gray-50 border-gray-400"
                    }`}
                >
                    <option value="n">Нет тренда</option>
                    <option value="c">Постоянный тренд</option>
                    <option value="t">Линейный тренд</option>
                    <option value="ct">Линейный тренд с постоянным значением</option>
                </select>
            </div>

            {/* Чекбоксы */}
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={settings.enforceStationarity || false}
                    onChange={(e) => handleInputChange(e, "enforceStationarity")}
                    className="h-5 w-5"
                />
                <label className="font-medium">Принудительная стационарность</label>
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={settings.enforceInvertibility || false}
                    onChange={(e) => handleInputChange(e, "enforceInvertibility")}
                    className="h-5 w-5"
                />
                <label className="font-medium">Принудительная обратимость</label>
            </div>
        </div>
    );
}


export function MASettings({ onChange, theme }) {
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
                <label className="font-medium">Количество шагов:</label>
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
                    <label className="font-medium">Параметр {param}:</label>
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
                <label className="font-medium">Уровень значимости доверительных интервалов:</label>
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
                <label className="font-medium">Тип тренда:</label>
                <select
                    value={settings.trend}
                    onChange={(e) => handleInputChange(e, "trend")}
                    className={`border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? "bg-gray-850 border-gray-600" : "bg-gray-50 border-gray-400"
                    }`}
                >
                    <option value="n">Нет тренда</option>
                    <option value="c">Постоянный тренд</option>
                    <option value="t">Линейный тренд</option>
                    <option value="ct">Линейный тренд с постоянным значением</option>
                </select>
            </div>

            {/* Чекбоксы */}
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={settings.enforceStationarity || false}
                    onChange={(e) => handleInputChange(e, "enforceStationarity")}
                    className="h-5 w-5"
                />
                <label className="font-medium">Принудительная стационарность</label>
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={settings.enforceInvertibility || false}
                    onChange={(e) => handleInputChange(e, "enforceInvertibility")}
                    className="h-5 w-5"
                />
                <label className="font-medium">Принудительная обратимость</label>
            </div>
        </div>
    );
}


export function SESSettings({ onChange, theme }) {
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
                <label className="font-medium">Количество шагов:</label>
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
                <label className="font-medium">Метод инициализации:</label>
                <select
                    value={settings.initializationMethod}
                    onChange={(e) => handleInputChange(e, "initializationMethod")}
                    className={`border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? "bg-gray-850 border-gray-600" : "bg-gray-50 border-gray-400"
                    }`}
                >
                    <option value="estimated">Оценка</option>
                    <option value="heuristic">Эвристически [1]</option>
                    <option value="legacy-heuristic">Эвристически [2]</option>
                    <option value="known">Известное значение</option>
                </select>
            </div>

            {/* Начальный уровень */}
            <div className="flex flex-col space-y-2">
                <label className="font-medium">Начальный уровень</label>
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
