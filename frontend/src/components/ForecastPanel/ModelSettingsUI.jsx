import { useEffect, useRef, useState } from "react";

import { ARIMA_DEFAULTS, SARIMA_DEFAULTS } from "./defaultModelSettings";


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

export function SARIMASettings({ onChange, theme }) {
    const settingsRef = useRef({ ...SARIMA_DEFAULTS });

    const isDarkMode = theme === "dark";

    const handleInputChange = (e, key) => {
        let value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        console.log(typeof(value))
        if (e.target.type === "number") {
            value = Number(value);
        }
        console.log(typeof(value))
        settingsRef.current[key] = value;
        onChange(settingsRef.current); // Отправляем изменения сразу
    };

    useEffect(() => {
        onChange(settingsRef.current); // Отправляем настройки при монтировании
    }, []);

    return (
        <div className="max-h-[400px] flex-grow space-y-4">
            <div className="flex flex-col space-y-2">
                <label className="font-medium">Параметр P Sarima:</label>
                <input
                    type="number"
                    defaultValue={settingsRef.current.p}
                    onChange={(e) => handleInputChange(e, "p")}
                    className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-sky-500 ${
                        isDarkMode ? 'border-gray-600' : 'border-gray-400'
                    }`}
                />
            </div>
            
            <div className="flex flex-col space-y-2">
                <label className="font-medium">Параметр D Sarima:</label>
                <input
                    type="number"
                    defaultValue={settingsRef.current.d}
                    onChange={(e) => handleInputChange(e, "d")}
                    className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-sky-500 ${
                        isDarkMode ? 'border-gray-600' : 'border-gray-400'
                    }`}
                />
            </div>

            <div className="flex flex-col space-y-2">
                <label className="font-medium">Параметр Q Sarima:</label>
                <input
                    type="number"
                    defaultValue={settingsRef.current.q}
                    onChange={(e) => handleInputChange(e, "q")}
                    className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-sky-500 ${
                        isDarkMode ? 'border-gray-600' : 'border-gray-400'
                    }`}
                />
            </div>
        </div>
    );
}
