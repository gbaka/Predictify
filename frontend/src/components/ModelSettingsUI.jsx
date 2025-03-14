import { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { ARIMA_DEFAULTS, SARIMA_DEFAULTS } from "./DefaultModelSettings";

export function ARIMASettings({ onChange }) {
    const settingsRef = useRef({ ...ARIMA_DEFAULTS });
    const { theme } = useTheme();

    const handleInputChange = (e, key) => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        settingsRef.current[key] = value;
        onChange(settingsRef.current); // Вызываем onChange сразу после изменения
    };

    useEffect(() => {
        onChange(settingsRef.current); // Отправляем начальные настройки при монтировании
    }, []);

    return (
        <div className="max-h-[200px] flex-grow space-y-4">
            <div className="flex flex-col space-y-2">
                <label className="font-medium">Параметр P :</label>
                <input
                    type="number"
                    defaultValue={settingsRef.current.p}
                    onChange={(e) => handleInputChange(e, "p")}
                    className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-sky-500 ${
                        theme === 'dark' ? 'border-gray-600' : 'border-gray-400'
                    }`}
                />
            </div>
            
            <div className="flex flex-col space-y-2">
                <label className="font-medium">Параметр D :</label>
                <input
                    type="number"
                    defaultValue={settingsRef.current.d}
                    onChange={(e) => handleInputChange(e, "d")}
                    className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-sky-500 ${
                        theme === 'dark' ? 'border-gray-600' : 'border-gray-400'
                    }`}
                />
            </div>
            
            <div className="flex flex-col space-y-2">
                <label className="font-medium">Параметр Q :</label>
                <input
                    type="number"
                    defaultValue={settingsRef.current.q}
                    onChange={(e) => handleInputChange(e, "q")}
                    className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-sky-500 ${
                        theme === 'dark' ? 'border-gray-600' : 'border-gray-400'
                    }`}
                />
            </div>
            
            <div className="flex flex-col space-y-2">
                <label className="font-medium">Тип тренда:</label>
                <select
                    defaultValue={settingsRef.current.trend}
                    onChange={(e) => handleInputChange(e, "trend")}
                    className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-sky-500 ${
                        theme === 'dark' ? 'border-gray-600' : 'border-gray-400'
                    }`}
                >
                    <option value="n">Нет тренда</option>
                    <option value="c">Постоянный тренд</option>
                    <option value="t">Линейный тренд</option>
                    <option value="ct">Линейный тренд с постоянным значением</option>
                </select>
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    defaultChecked={settingsRef.current.enforceStationarity}
                    onChange={(e) => handleInputChange(e, "enforceStationarity")}
                    className="h-5 w-5"
                />
                <label className="font-medium">Принудительная стационарность</label>
            </div>
        </div>
    );
}

export function SARIMASettings({ onChange }) {
    const settingsRef = useRef({ ...SARIMA_DEFAULTS });
    const { theme } = useTheme();

    const handleInputChange = (e, key) => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
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
                        theme === 'dark' ? 'border-gray-600' : 'border-gray-400'
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
                        theme === 'dark' ? 'border-gray-600' : 'border-gray-400'
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
                        theme === 'dark' ? 'border-gray-600' : 'border-gray-400'
                    }`}
                />
            </div>
        </div>
    );
}
