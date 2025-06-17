import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import ForecastPanel from "../components/ForecastPanel/ForecastPanel";
import ForecastTiles from "../components/ForecastTiles/ForecastTiles";
import { useTranslation } from "react-i18next";
import createI18nText from "../i18n/createI18nText";

const I18nNamespace = "forecasting";
const I18nText = createI18nText(I18nNamespace);

export default function Forecasting() {
  useTranslation(I18nNamespace);
  const [activeTab, setActiveTab] = useState("parsedData");
  const { theme } = useTheme();

  return (
    <>
      <title>Predictify | Forecasting</title>

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
              <I18nText textKey={"tab-1"} />
            </button>
            <button
              className={`px-4 py-2 transition-all border-b-2 ${
                activeTab === "forecasting"
                  ? "border-blue-500"
                  : "border-transparent opacity-50 hover:opacity-75"
              }`}
              onClick={() => setActiveTab("forecasting")}
            >
              <I18nText textKey={"tab-2"} />
            </button>
          </div>
        </div>

        <div className="container mx-auto p-6 px-8">
          {activeTab === "parsedData" ? (
            <>
              <h1 className="text-3xl font-bold mb-4 mt-2 text-center">
                <I18nText textKey={"tab-1.title"} />
              </h1>
              <p className="text-center mb-14 mt-2 mx-4 sm:mx-6 md:mx-8 lg:mx-12 xl:mx-16">
                <I18nText textKey={"tab-1.descr"} />
              </p>
              <ForecastTiles theme={theme} />

              {/* Добавленные параграфы о сервисе */}
              <div className="p-6 text-center text-gray-500 mt-12 mx-4 sm:mx-6 md:mx-8 lg:mx-12 xl:mx-16 space-y-6">
                <p>
                  <I18nText textKey={"tab-1.footer"} />
                </p>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-4 mt-2 text-center">
                <I18nText textKey={"tab-2.title"} />
              </h1>
              <p className="text-center mb-14 mt-2 mx-4 sm:mx-6 md:mx-8 lg:mx-12 xl:mx-16">
                <I18nText textKey={"tab-2.descr"} />
              </p>
              <ForecastPanel theme={theme} />

              {/* Добавленные параграфы о сервисе */}
              <div className="p-6 text-center text-gray-500 mt-12 mx-4 sm:mx-6 md:mx-8 lg:mx-12 xl:mx-16 space-y-6">
                <p>
                  <I18nText textKey={"tab-2.footer"} />
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
