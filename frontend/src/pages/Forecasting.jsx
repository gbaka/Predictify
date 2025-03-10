import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import BaseChart from "../components/charts/BaseChart";
import ForecastingPanel from "../components/ForecastingPanel";

export default function Forecasting() {
    const [activeTab, setActiveTab] = useState("parsedData");
    const { theme } = useTheme();

    const options = {
        title: { text: "Простой график №1" },
        tooltip: { trigger: "axis" },
        xAxis: { type: "category", data: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] },
        yAxis: { type: "value" },
        series: [
            { name: "Значения 1", type: "line", data: [120, 200, 150, 190, 70, 110, 130], smooth: true, lineStyle: { width: 2 }, itemStyle: { color: "#42A5F5" } },
            { name: "Значения 2", type: "line", data: [120, 20, 160, 80, 60, 110, 130], smooth: true, lineStyle: { width: 2 }, itemStyle: { color: "#4245F5" } },
            { name: "Значения 3", type: "line", data: [120, 20, 1, 140, 10, 110, 190], smooth: true, lineStyle: { width: 2 }, itemStyle: { color: "#2245F5" } },
            { name: "Значения 4", type: "line", data: [110, 20, 1, 10, 60, 110, 190], smooth: true, lineStyle: { width: 2 }, itemStyle: { color: "#AA45F5" } }
        ]
    };

    return (
      <div className="w-full">
        <div
          className={`w-full flex items-center p-4 mt-2 top-0 z-10 ${
            theme === "dark"
              ? "shadow-[0_2px_4px_-1px_rgba(0,0,0,0.1)] bg-gray-850 text-gray-100"
              : "shadow-[0_2px_4px_-1px_rgba(0,0,0,0.07)] bg-gray-150 text-gray-900"
          }`}
        >
          <div className="flex space-x-4 ml-4">
            <button
              className={`px-4 py-2 transition-all border-b-2 ${
                activeTab === "parsedData"
                  ? "border-blue-500"
                  : "border-transparent opacity-50 hover:opacity-75"
              }`}
              onClick={() => setActiveTab("parsedData")}
            >
              Парсинг
            </button>
            <button
              className={`px-4 py-2 transition-all border-b-2 ${
                activeTab === "forecasting"
                  ? "border-blue-500"
                  : "border-transparent opacity-50 hover:opacity-75"
              }`}
              onClick={() => setActiveTab("forecasting")}
            >
              Попробовать
            </button>
          </div>
        </div>

        <div className="container mx-auto p-6 px-8">
          {activeTab === "parsedData" ? (
            <>
              <h1 className="text-3xl font-bold mb-4">Графики прогнозов</h1>
              <BaseChart options={options} />
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-4 text-center">
                Прогнозирование
              </h1>
              <p className="text-center mb-10">
                Здесь будет интерфейс для прогнозирования. Lorem ipsum, dolor
                sit amet consectetur adipisicing elit. Labore maxime, soluta
                ratione hic libero vero ducimus illum voluptatem aut quos.
              </p>
              <ForecastingPanel />

              {/* Добавленные параграфы о сервисе */}
              <div className="mt-12 space-y-6">
                <h2 className="text-2xl font-semibold text-center">
                  О нашем сервисе
                </h2>

                {/* Блок про безопасность */}
                <div
                  className={`p-6 rounded-lg shadow-sm ${
                    theme === "dark"
                      ? "bg-gray-850 text-gray-200"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <h3 className="text-xl font-medium mb-2">
                    Безопасность данных
                  </h3>
                  <p className="text-gray-600">
                    Мы уделяем особое внимание безопасности ваших данных. Все
                    файлы, загруженные в наш сервис, обрабатываются в
                    зашифрованном виде и хранятся на защищенных серверах. Мы не
                    передаем ваши данные третьим лицам и гарантируем их
                    конфиденциальность.
                  </p>
                </div>

                {/* Блок про время обработки */}
                <div
                  className={`p-6 rounded-lg shadow-sm ${
                    theme === "dark"
                      ? "bg-gray-850 text-gray-200"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <h3 className="text-xl font-medium mb-2">Время обработки</h3>
                  <p className="text-gray-600">
                    Наш сервис обеспечивает быструю обработку данных. В
                    зависимости от объема загруженного файла, прогнозы будут
                    готовы в течение нескольких минут. Мы используем современные
                    алгоритмы и мощные серверы для ускорения обработки.
                  </p>
                </div>

                {/* Блок про точность прогнозов */}
                <div
                  className={`p-6 rounded-lg shadow-sm ${
                    theme === "dark"
                      ? "bg-gray-850 text-gray-200"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <h3 className="text-xl font-medium mb-2">
                    Точность прогнозов
                  </h3>
                  <p className="text-gray-600">
                    Мы используем передовые методы машинного обучения и
                    статистического анализа для обеспечения высокой точности
                    прогнозов. Наши модели постоянно улучшаются, чтобы
                    предоставлять вам наиболее достоверные результаты.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
}

