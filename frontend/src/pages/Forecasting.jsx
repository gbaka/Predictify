import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import ForecastPanel from "../components/ForecastPanel";
import ForecastTiles from "../components/ForecastTiles/ForecastTiles";

export default function Forecasting() {
    const [activeTab, setActiveTab] = useState("parsedData");
    const { theme } = useTheme();

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
              <h1 className="text-3xl font-bold mb-4 mt-2 text-center">
                Парсеры
              </h1>
              <p className="text-center mb-14 mt-2 mx-4 sm:mx-6 md:mx-8 lg:mx-12 xl:mx-16">
                Здесь будет что-то. Lorem ipsum, dolor
                sit amet consectetur adipisicing elit. Labore maxime, soluta
                ratione hic libero vero ducimus illum voluptatem aut quos.
              </p>
              <ForecastTiles theme={theme} />

               {/* Добавленные параграфы о сервисе */}
               <div className="p-6 text-center text-gray-500 mt-12 mx-4 sm:mx-6 md:mx-8 lg:mx-12 xl:mx-16 space-y-6">
                <p>
                  Мы уделяем особое внимание безопасности ваших данных. Все
                  файлы, загруженные в наш сервис, обрабатываются в
                  зашифрованном виде и хранятся на защищенных серверах. Мы не
                  передаем ваши данные третьим лицам и гарантируем их
                  конфиденциальность.
                </p>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-4 mt-2 text-center">
                Прогнозирование
              </h1>
              <p className="text-center mb-14 mt-2 mx-4 sm:mx-6 md:mx-8 lg:mx-12 xl:mx-16">
                Здесь будет интерфейс для прогнозирования. Lorem ipsum, dolor
                sit amet consectetur adipisicing elit. Labore maxime, soluta
                ratione hic libero vero ducimus illum voluptatem aut quos.
              </p>
              <ForecastPanel theme={theme}/>

              {/* Добавленные параграфы о сервисе */}
              <div className="p-6 text-center text-gray-500 mt-12 mx-4 sm:mx-6 md:mx-8 lg:mx-12 xl:mx-16 space-y-6">
                <p>
                  Мы уделяем особое внимание безопасности ваших данных. Все
                  файлы, загруженные в наш сервис, обрабатываются в
                  зашифрованном виде и хранятся на защищенных серверах. Мы не
                  передаем ваши данные третьим лицам и гарантируем их
                  конфиденциальность.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    );
}

