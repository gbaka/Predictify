import { useState, useEffect, useRef } from "react";
import * as echarts from "echarts";
import { useTheme } from "../context/ThemeContext";
import Split from "react-split";


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
  const { theme } = useTheme();

  // Закрытие списка при клике вне области
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsHovered(false); // Сбрасываем состояние наведения
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (model) => {
    setSelectedModel(model);
    onChange(model);
    setIsOpen(false);
    setIsHovered(false); // Сбрасываем состояние наведения после выбора
  };

  return (
    <div
      className={`
        ${isOpen ? `outline outline-2 ${theme==='dark' ? 'outline-gray-100' : 'outline-gray-100'}` : ""} // Жирная обводка при активном состоянии
        ${isHovered ? "outline outline-2 outline-gray-900" : ""} // Жирная обводка при наведении
        relative w-full p-1 outline  ${theme==='dark' ? "outline-gray-600" : "outline-gray-300"} rounded-lg z-20 cursor-pointer mb-3
        
      `}
      ref={selectRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Кастомный элемент для отображения выбранной модели */}
      <div className="p-1 w-full">
        {selectedModel || "Выберите модель"}
      </div>

      {/* Выпадающий список */}
      {isOpen && (
        <div
          className="absolute top-full left-0 w-full mt-1 border border-gray-400 rounded-lg bg-white shadow-lg z-10"
          style={{ maxHeight: "60vh", overflowY: "auto" }}
        >
          {Object.keys(models).map((category) => (
            <div key={category}>
              <div className="p-1 font-bold">{category}</div>
              {Object.keys(models[category]).map((subcategory) => (
                <div key={subcategory}>
                  <div className="p-1 pl-2 font-semibold">&nbsp;&nbsp;{subcategory}</div>
                  {models[category][subcategory].map((model) => (
                    <div
                      key={model}
                      className="p-1 pl-4 cursor-pointer hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
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
    <div className="p-2 border border-dashed rounded-lg w-full h-full flex flex-col justify-center">
      <input type="file" className="w-full" onChange={onUpload} />
      <p className="text-center mt-1">Загрузите CSV или Excel файл</p>
    </div>
  );
}

// Настройки модели
function ModelSettings({ model, onStart }) {
  return (
    <div className="p-2 border rounded-lg w-full h-full flex flex-col">
      <div className="overflow-y-auto flex-grow">
        {model ? `Настройки модели: ${model}` : "Выберите модель"}
        {/* Пример длинного контента для скролла */}
        <div className="mt-2">
          <p>Параметр 1: Значение</p>
          <p>Параметр 2: Значение</p>
          <p>Параметр 3: Значение</p>
          <p>Параметр 4: Значение</p>
          <p>Параметр 5: Значение</p>
          <p>Параметр 6: Значение</p>
          <p>Параметр 7: Значение</p>
          <p>Параметр 8: Значение</p>
        </div>
      </div>
      <button
        className="p-1 w-full bg-blue-500 text-white rounded-lg mt-2"
        onClick={onStart}
      >
        Начать
      </button>
    </div>
  );
}

// Сводка данных
function DataSummary({ summary }) {
  return (
    <div className="p-2 border rounded-lg w-full h-full bg-gray-100 overflow-y-auto">
      <h3 className="font-bold">Сводка данных:</h3>
      <pre className="whitespace-pre-wrap text-sm">{summary || "Нет данных"}</pre>
    </div>
  );
}

// График
function BaseChart({ options }) {
  const chartRef = useRef(null);
  const { theme } = useTheme();
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const isDarkMode = theme === "dark";
    chartInstanceRef.current = echarts.init(chartRef.current, isDarkMode ? "dark" : null);
    const defaultFontFamily = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";
    const textColor = isDarkMode ? "#fafafa" : "#333";
    const axisColor = isDarkMode ? "#888" : "#ccc";
    const legendColor = isDarkMode ? "#fff" : "#333";

    const updatedOptions = {
        ...options,
        backgroundColor: 'transparent',
        textStyle: { fontFamily: defaultFontFamily, color: textColor },
        title: options.title ? { 
            ...options.title,  
            left: 'center', 
            textStyle: { ...options.title.textStyle, fontFamily: defaultFontFamily, color: textColor } 
        } : {},
        xAxis: options.xAxis ? { 
            ...options.xAxis, 
            axisLabel: { ...options.xAxis.axisLabel, fontFamily: defaultFontFamily, color: textColor },
            axisLine: { lineStyle: { color: axisColor } }
        } : {},
        yAxis: options.yAxis ? { 
            ...options.yAxis, 
            axisLabel: { ...options.yAxis.axisLabel, fontFamily: defaultFontFamily, color: textColor },
            axisLine: { lineStyle: { color: axisColor } }
        } : {},
        legend: {
            ...options.legend,
            textStyle: { color: legendColor, fontFamily: defaultFontFamily },
            type: 'scroll',
            orient: 'horizontal',
            top: 28,    
        },
    };

    chartInstanceRef.current.setOption(updatedOptions);

    // Используем ResizeObserver для автоматического изменения размера графика
    const resizeObserver = new ResizeObserver(() => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.resize();
      }
    });

    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
      chartInstanceRef.current.dispose();
    };
  }, [options, theme]);

  return (
    <div
      className={`p-2 rounded-lg shadow-md border transition-all ${
        theme === "dark"
          ? "bg-gray-850 border border-gray-700"
          : "bg-gray-50 border border-gray-300"
      } h-full w-full`}
    >
      <div ref={chartRef} className="w-full h-full" />
    </div>
  );
}

// Основной компонент
export default function ForecastingPanel() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [uploadedData, setUploadedData] = useState(null);
  const [dataSummary, setDataSummary] = useState("");
  const { theme } = useTheme();

  const handleModelChange = (model) => setSelectedModel(model);
  const handleFileUpload = (event) => setUploadedData(event.target.files[0]);
  const handleStartForecast = () => setDataSummary("Здесь будет сводка данных...");

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
    <div className={`p-4 border border-gray-300 rounded-xl  w-full h-screen flex flex-col ${theme === 'dark' ? "bg-gray-850 border-gray-700" : "bg-gray-50 border-gray-300"}`}>
      {/* Первый ряд: ModelSelector */}
      <div className="w-full">
        <ModelSelector onChange={handleModelChange} />
      </div>

      {/* Второй и третий ряды: DataUploader, BaseChart, ModelSettings и DataSummary */}
      <Split
        className="flex-grow flex flex-col w-full"
        direction="vertical"
        sizes={[70, 30]} // Начальные размеры (70% для второго ряда, 30% для DataSummary)
        minSize={[200, 100]} // Минимальные размеры
        gutterSize={8} // Размер перегородки
        snapOffset={0} // Отключение привязки
        gutter={(index, direction) => {
          const gutter = document.createElement("div");
          gutter.className = `gutter gutter-${direction} ${theme==='dark' ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"} transition-colors rounded-lg`;
          gutter.style.height = "8px"; // Укороченные разделители
          return gutter;
        }}
      >
        {/* Второй ряд: DataUploader, BaseChart, ModelSettings */}
        <Split
          className="flex w-full mb-2"
          sizes={[25, 50, 25]} // Начальные размеры (25%, 50%, 25%)
          minSize={[200, 300, 200]} // Минимальные размеры
          gutterSize={8} // Размер перегородки
          snapOffset={0} // Отключение привязки
          gutter={(index, direction) => {
            const gutter = document.createElement("div");
            gutter.className = `gutter gutter-${direction} ${theme==='dark' ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"} transition-colors rounded-lg`;
            return gutter;
          }}
        >
          <div className="h-full mr-1"> {/* Добавлен отступ справа */}
            <DataUploader onUpload={handleFileUpload} />
          </div>
          <div className="h-full mx-1"> {/* Добавлены отступы слева и справа */}
            <BaseChart options={options} />
          </div>
          <div className="h-full ml-1"> {/* Добавлен отступ слева */}
            <ModelSettings model={selectedModel} onStart={handleStartForecast} />
          </div>
        </Split>

        {/* Третий ряд: DataSummary */}
        <div className="w-full h-full mt-2">
          <DataSummary summary={dataSummary} />
        </div>
      </Split>
    </div>
  );
}