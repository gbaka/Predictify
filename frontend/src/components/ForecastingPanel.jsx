import { useState, useEffect, useRef } from "react";
import * as echarts from "echarts";
import { useTheme } from "../context/ThemeContext";


function ModelSelector({ onChange }) {
  const models = {
    "1. Статистические методы": {
      "1.1 Линейные модели": ["ARIMA", "SARIMA"],
      "1.2 Экспоненциальное сглаживание": ["SES", "Holt-Winters"]
    },
    "2. Машинное обучение": {
      "2.1 Деревья решений": ["Random Forest", "XGBoost"],
      "2.2 Нейросети": ["LSTM", "GRU"]
    }
  };

  const [selectedModel, setSelectedModel] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const selectRef = useRef(null);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (model) => {
    setSelectedModel(model);
    onChange(model);
    setIsOpen(false);
  };

  return (
    <div
      className="relative w-full p-2 border rounded-lg z-20"
      ref={selectRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick} // Обработчик клика на весь родительский элемент
      style={{
        borderColor: isOpen ? "#6b7280" : isHovered ? "#9ca3af" : "#e5e7eb",
        transition: "border-color 0.2s ease-in-out",
        cursor: "pointer", // Курсор-указатель для всей области
      }}
    >
      {/* Кастомный элемент для отображения выбранной модели */}
      <div className="p-2 w-full">
        {selectedModel || "Выберите модель"}
      </div>

      {/* Выпадающий список */}
      {isOpen && (
        <div
          className="absolute top-full left-0 w-full mt-1 border rounded-lg bg-white shadow-lg z-10"
          style={{ maxHeight: "60vh", overflowY: "auto" }}
        >
          {Object.keys(models).map((category) => (
            <div key={category}>
              <div className="p-2 font-bold">{category}</div>
              {Object.keys(models[category]).map((subcategory) => (
                <div key={subcategory}>
                  <div className="p-2 pl-4 font-semibold">&nbsp;&nbsp;{subcategory}</div>
                  {models[category][subcategory].map((model) => (
                    <div
                      key={model}
                      className="p-2 pl-8 cursor-pointer hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation(); // Останавливаем всплытие, чтобы не закрывать список
                        handleSelect(model);
                      }}
                    >
                      &nbsp;&nbsp;&nbsp;&nbsp;{model}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// Загрузка данных
function DataUploader({ onUpload }) {
  return (
    <div className="p-4 border border-dashed rounded-lg w-full">
      <input type="file" className="w-full" onChange={onUpload} />
      <p className="text-center mt-2">Загрузите CSV или Excel файл</p>
    </div>
  );
}

// Настройки модели
function ModelSettings({ model }) {
  return (
    <div className="p-4 border rounded-lg w-full">
      {model ? `Настройки модели: ${model}` : "Выберите модель"}
    </div>
  );
}

// Сводка данных
function DataSummary({ summary }) {
  return (
    <div className="p-4 border rounded-lg w-full bg-gray-100">
      <h3 className="font-bold">Сводка данных:</h3>
      <pre className="whitespace-pre-wrap">{summary || "Нет данных"}</pre>
    </div>
  );
}

// График
function BaseChart({ options }) {
  const chartRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const isDarkMode = theme === "dark";
    const chartInstance = echarts.init(chartRef.current, isDarkMode ? "dark" : null);
    chartInstance.setOption(options);

    const handleResize = () => chartInstance.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance.dispose();
    };
  }, [options, theme]);

  return (
    <div className="p-4 rounded-lg shadow-md border w-full">
      <div ref={chartRef} style={{ width: "100%", height: "400px" }} />
    </div>
  );
}

// Основной компонент
export default function ForecastingPanel() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [uploadedData, setUploadedData] = useState(null);
  const [dataSummary, setDataSummary] = useState("");

  const handleModelChange = (model) => setSelectedModel(model);
  const handleFileUpload = (event) => setUploadedData(event.target.files[0]);
  const handleStartForecast = () => setDataSummary("Здесь будет сводка данных...");

  return (
    <div className="p-6 border rounded-xl bg-gray-50 dark:bg-gray-850 space-y-4 w-full">
      <ModelSelector onChange={handleModelChange} />

      <div className="flex space-x-4">
        <DataUploader onUpload={handleFileUpload} />
        <BaseChart options={{}} />
        <ModelSettings model={selectedModel} />
      </div>

      <DataSummary summary={dataSummary} />

      <button className="p-2 w-full bg-blue-500 text-white rounded-lg" onClick={handleStartForecast}>
        Начать
      </button>
    </div>
  );
}
