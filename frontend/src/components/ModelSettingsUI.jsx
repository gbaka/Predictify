import { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { ARIMA_DEFAULTS, SARIMA_DEFAULTS } from "./DefaultModelSettings";


// import { useState, useEffect } from "react";
// import { useTheme } from "some-theme-context"; // Убедись, что импорт темы правильный

export function ARIMASettings({ onChange }) {
    const { theme } = useTheme();

    // Храним все параметры в useState, чтобы ререндер происходил корректно
    const [settings, setSettings] = useState({ ...ARIMA_DEFAULTS });

    const handleInputChange = (e, key) => {
        let { value, type } = e.target;

        if (type === "checkbox") {
            value = e.target.checked;
        } else if (type === "number") {
            value = value.replace(/\D/g, ""); // Убираем нечисловые символы
            value = value ? Number(value) : ""; // Преобразуем только если не пусто

            if (key === "steps") {
                value = Math.max(1, Math.min(30, value || 1)); // Ограничение для steps
            }
            console.log(value)
            if (['p', 'q', 'd'].includes(key)) {
                console.log('asfsafsd')
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
                    className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-sky-500 ${
                        theme === "dark" ? "border-gray-600" : "border-gray-400"
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
                        className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-sky-500 ${
                            theme === "dark" ? "border-gray-600" : "border-gray-400"
                        }`}
                    />
                </div>
            ))}

            {/* Тип тренда */}
            <div className="flex flex-col space-y-2">
                <label className="font-medium">Тип тренда:</label>
                <select
                    value={settings.trend}
                    onChange={(e) => handleInputChange(e, "trend")}
                    className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-sky-500 ${
                        theme === "dark" ? "border-gray-600" : "border-gray-400"
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


// export function ARIMASettings({ onChange }) {
//     const settingsRef = useRef({ ...ARIMA_DEFAULTS });
//     const { theme } = useTheme();

//     const handleInputChange = (e, key) => {
//         let { value, type } = e.target;
//         if (type === "checkbox") {
//             value = e.target.checked;
//         } 
//         else if (type === "number") {
//             value = value.replace(/\D/g, ""); // Убираем нечисловые символы
//             value = value ? Number(value) : ""; // Преобразуем только если не пусто
//             console.log("sljdslfjs;jfajdfl")

//             if (key === "steps") {
//                 value = Math.max(1, Math.min(30, value || 1)); // Ограничение для steps
//             }
//         }
//         settingsRef.current[key] = value;
//         onChange(settingsRef.current);
//     };

//     useEffect(() => {
//         onChange(settingsRef.current); // Отправляем начальные настройки при монтировании
//     }, []);

//     return (
//         <div className="max-h-[200px] flex-grow space-y-4">
//              {/* Поле ввода количества шагов */}
//             <div className="flex flex-col space-y-2">
//                 <label className="font-medium">Количество шагов:</label>
//                 <input
//                     type="number"
//                     defaultValue={settingsRef.current.steps || 1}
//                     min={1}
//                     max={30}
//                     onChange={(e) => handleInputChange(e, "steps")}
//                     className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-sky-500 ${
//                         theme === 'dark' ? 'border-gray-600' : 'border-gray-400'
//                     }`}
//                 />
//             </div>
//             <div className="flex flex-col space-y-2">
//                 <label className="font-medium">Параметр p:</label>
//                 <input
//                     type="number"
//                     defaultValue={settingsRef.current.p}
//                     onChange={(e) => handleInputChange(e, "p")}
//                     className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-sky-500 ${
//                         theme === 'dark' ? 'border-gray-600' : 'border-gray-400'
//                     }`}
//                 />
//             </div>
            
//             <div className="flex flex-col space-y-2">
//                 <label className="font-medium">Параметр d:</label>
//                 <input
//                     type="number"
//                     defaultValue={settingsRef.current.d}
//                     onChange={(e) => handleInputChange(e, "d")}
//                     className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-sky-500 ${
//                         theme === 'dark' ? 'border-gray-600' : 'border-gray-400'
//                     }`}
//                 />
//             </div>
            
//             <div className="flex flex-col space-y-2">
//                 <label className="font-medium">Параметр q :</label>
//                 <input
//                     type="number"
//                     defaultValue={settingsRef.current.q}
//                     onChange={(e) => handleInputChange(e, "q")}
//                     className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-sky-500 ${
//                         theme === 'dark' ? 'border-gray-600' : 'border-gray-400'
//                     }`}
//                 />
//             </div>
            
//             <div className="flex flex-col space-y-2">
//                 <label className="font-medium">Тип тренда:</label>
//                 <select
//                     defaultValue={settingsRef.current.trend}
//                     onChange={(e) => handleInputChange(e, "trend")}
//                     className={`border rounded-lg p-2 w-full bg-transparent focus:ring-2 focus:ring-sky-500 ${
//                         theme === 'dark' ? 'border-gray-600' : 'border-gray-400'
//                     }`}
//                 >
//                     <option value="n">Нет тренда</option>
//                     <option value="c">Постоянный тренд</option>
//                     <option value="t">Линейный тренд</option>
//                     <option value="ct">Линейный тренд с постоянным значением</option>
//                 </select>
//             </div>

//             <div className="flex items-center space-x-2">
//                 <input
//                     type="checkbox"
//                     defaultChecked={settingsRef.current.enforceStationarity}
//                     onChange={(e) => handleInputChange(e, "enforceStationarity")}
//                     className="h-5 w-5"
//                 />
//                 <label className="font-medium">Принудительная стационарность</label>
//             </div>


//             <div className="flex items-center space-x-2">
//                 <input
//                     type="checkbox"
//                     defaultChecked={settingsRef.current.enforceStationarity}
//                     onChange={(e) => handleInputChange(e, "enforceInvertibility")}
//                     className="h-5 w-5"
//                 />
//                 <label className="font-medium">Принудительная обратимость</label>
//             </div>
//         </div>
//     );
// }

export function SARIMASettings({ onChange }) {
    const settingsRef = useRef({ ...SARIMA_DEFAULTS });
    const { theme } = useTheme();

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
