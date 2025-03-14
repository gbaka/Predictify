import { FileText, Sheet, X, Maximize2, Minimize2, Play } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import * as echarts from "echarts";
import Split from "react-split";
import axios from "axios"
import { useTheme } from "../context/ThemeContext";
import { ARIMASettings, SARIMASettings } from "./ModelSettingsUI"


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
      className={`min-w-[530px]
        ${isOpen ? `outline outline-2 ${theme==='dark' ? 'outline-gray-600' : 'outline-gray-300'}` : ""} // Жирная обводка при активном состоянии
        ${isHovered ? `outline outline-2 ${theme==='dark' ? 'outline-gray-600' : 'outline-gray-300'}` : ""} // Жирная обводка при наведении
        relative w-full p-1 outline  ${theme==='dark' ? "outline-gray-600" : "outline-gray-300"} rounded-lg z-20 cursor-pointer mb-3
        
      `}
      ref={selectRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Кастомный элемент для отображения выбранной модели */}
      <div className="p-1  w-full ">
        {selectedModel || "Выберите модель"}
      </div>

      {/* Выпадающий список */}
      {isOpen && (
        <div
          className={`absolute top-full left-0 w-full mt-1 border   ${theme === "dark" ? "text-gray-300 border-gray-600 bg-gray-850" : "text-gray-900 border-gray-400 bg-gray-50"} rounded-lg shadow-lg z-10`}
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
                      className={`p-1 pl-4 cursor-pointer ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100" }`}
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
  const { theme } = useTheme();
  const [selectedFile, setSelectedFile] = useState(null); // Состояние для хранения выбранного файла

  // Обработчик клика по области загрузки
  const handleClick = () => {
    document.getElementById("file-input").click(); // Программно вызываем клик по input
  };

  // Обработчик изменения файла
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ["text/csv", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file); // Сохраняем выбранный файл
        onUpload(event); // Вызываем переданный обработчик
      } else {
        alert("Пожалуйста, выберите файл в формате CSV или Excel.");
      }
    }
  };

  // Обработчик удаления файла
  const handleRemoveFile = () => {
    setSelectedFile(null); // Удаляем выбранный файл
    onUpload(null)
    document.getElementById("file-input").value = ""; // Сбрасываем значение input
  };

  // Функция для обрезки длинных имен файлов
  const truncateFileName = (fileName, maxLength = 18) => {
    if (fileName.length > maxLength) {
      return `${fileName.substring(0, maxLength)}...`; // Обрезаем имя и добавляем многоточие
    }
    return fileName;
  };

  return (
    <div
      className={`p-4 border-2 border-dashed cursor-pointer ${
        theme === "dark" ? "border-gray-600 hover:border-gray-500" : "border-gray-400 hover:border-gray-500"
      } rounded-lg w-full h-full flex flex-col justify-center items-center transition-colors`}
      onClick={handleClick} // Открываем проводник при клике на область
    >
      {/* Скрытый input для выбора файла */}
      <input
        id="file-input"
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept=".csv, .xls, .xlsx" // Указываем допустимые форматы
      />

      {/* Если файл выбран, отображаем его имя и кнопку удаления */}
      {selectedFile ? (
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-2">
            <span
              className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
              title={selectedFile.name} // Всплывающая подсказка с полным именем файла
            >
              {truncateFileName(selectedFile.name)}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Предотвращаем всплытие события
                handleRemoveFile();
              }}
              className={`p-1 rounded-full ${
                theme === "dark" ? "text-gray-400 hover:bg-gray-700" : "text-gray-500 hover:bg-gray-200"
              } transition-colors`}
            >
              <X className="w-4 h-4" /> {/* Иконка для удаления файла */}
            </button>
          </div>
          <p className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
            Файл успешно выбран
          </p>
        </div>
      ) : (
        <>
          {/* Иконки и текст, если файл не выбран */}
          <div className="flex space-x-4 text-gray-500">
            <Sheet className="w-8 h-8" /> {/* Иконка для Excel */}
            <FileText className="w-8 h-8" /> {/* Иконка для CSV */}
          </div>
          <p className={`text-center mt-2 ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
            Перетащите файл сюда или нажмите для загрузки
          </p>
          <p className={`text-center text-sm ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`}>
            Поддерживаются форматы: CSV, Excel
          </p>
        </>
      )}
    </div>
  );
}


function ModelSettingsPanel({ selectedModel, onChange }) {
  const { theme } = useTheme();

  const renderSettings = () => {
    switch (selectedModel) {
      case "ARIMA":
        return <ARIMASettings onChange={onChange} />;
      case "SARIMA":
        return <SARIMASettings onChange={onChange}/>;
      default:
        return <div className="text-center text-gray-500">Модель не выбрана</div>;
    }
  };

  return (
    <div
      className={`overflow-y-scroll parent p-4 border rounded-lg w-full h-full flex-grow flex flex-col ${theme === 'dark' ? 'border-gray-700 bg-gray-850 text-gray-100' : 'border-gray-300 bg-gray-50 text-gray-700'}`}
    >  
        {renderSettings()}       
    </div>
  );
}


// Сводка данных
function DataSummary({ summary }) {
  const {theme} = useTheme()
  return (
    <div className={`p-2 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} rounded-lg w-full h-full overflow-y-auto`}>
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
      className={`rounded-lg border transition-all ${
        theme === "dark"
          ? "bg-gray-850 border border-gray-700"
          : "bg-gray-50 border border-gray-300"
      } h-full w-full`}
    >
      <div ref={chartRef} className="flex w-full h-full mt-3" />
    </div>
  );
}


function FullScreenToggleButton({ isFullScreen, onClick, theme }) {
  return (
    <button
      onClick={onClick}
      className={`${
        theme === 'dark' ? " hover:bg-gray-700 border-gray-700 " : "border-gray-300 hover:bg-gray-200"
      } border relative ml-2 mb-3 transition-colors p-2.5 rounded-lg`}
    >
      {isFullScreen ? (
        <Minimize2 className="w-5 h-5" /> // Иконка для сворачивания
      ) : (
        <Maximize2 className="w-5 h-5" /> // Иконка для разворачивания
      )}
    </button>
  );
}


function StartButton({ onClick }) {
  const { theme } = useTheme()

  return (
    <button
      className={`w-full h-1/4 mt-2 rounded-lg font-medium flex items-center justify-center gap-2
                  shadow-md transition duration-200 border 
                  ${
                    theme === "dark"
                      ? "bg-gray-850 text-gray-100 border-gray-700 custom-dark-button"
                      : "bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100 shadow-sm"
                  }`}
      onClick={onClick}
    >
      <Play className="w-5 h-5 text-gray-600" />
      Начать
    </button>
  );
}


export default function ForecastingPanel() {
  const modelSettingsRef = useRef(null);
  const [selectedModel, setSelectedModel] = useState(null); // Возвращён useState
  const uploadedDataRef = useRef(null);

  const dataSummaryRef = useRef("");
  const [isFullScreen, setIsFullScreen] = useState(true);
  const { theme } = useTheme();

  const verticalSizesRef = useRef([80, 20]);
  const horizontalSizesRef = useRef([15, 70, 15]);

  const handleModelSettingsChange = (settings) => {
    modelSettingsRef.current = settings;
  };

  const handleModelChange = (model) => {
    setSelectedModel(model); // Обновление состояния
  };

  const handleFileUpload = (event) => {
    if (event) {
      uploadedDataRef.current = event.target.files[0];
    } else {
      uploadedDataRef.current = null
    }
  };

  const handleStartForecast = async () => {
    dataSummaryRef.current = "Здесь будет сводка данных...";
  
    if (!selectedModel || !modelSettingsRef.current || !uploadedDataRef.current) {
      alert("Please fill out all settings.");
      return;
    }
  
    const formData = new FormData();
    formData.append("selectedModel", selectedModel);
    formData.append("modelSettings", JSON.stringify(modelSettingsRef.current)); // Оборачиваем настройки в JSON строку
    formData.append("uploadedData", uploadedDataRef.current); // Файл
  
    try {
      const response = await axios.post("http://localhost:8000/api/test", formData, {
        headers: { "Content-Type": "multipart/form-data" }, // Обязательно multipart/form-data
      });
      console.log("Settings saved:", response.data);
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };  

  const options = {
    title: { text: "Простой график №1" },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] },
    yAxis: { type: "value" },
    series: [
      { name: "Значения 1", type: "line", data: [120, 200, 150, 190, 70, 110, 130], smooth: true, lineStyle: { width: 2 }, itemStyle: { color: "#42A5F5" } },
      { name: "Значения 2", type: "line", data: [120, 20, 160, 80, 60, 110, 130], smooth: true, lineStyle: { width: 2 }, itemStyle: { color: "#4245F5" } },
      { name: "Значения 3", type: "line", data: [120, 20, 1, 140, 10, 110, 190], smooth: true, lineStyle: { width: 2 }, itemStyle: { color: "#2245F5" } },
      { name: "Значения 4", type: "line", data: [110, 20, 1, 10, 60, 110, 190], smooth: true, lineStyle: { width: 2 }, itemStyle: { color: "#AA45F5" } },
    ],
  };

  const createGutter = (direction) => {
    const gutter = document.createElement("div");
    gutter.className = `gutter gutter-${direction} ${
      theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
    } transition-colors rounded-lg`;
    
    if (direction === "vertical") gutter.style.height = "8px";
    
    return gutter;
  };

  return (
    <>
      {isFullScreen && (
        <div
          className={`fixed inset-0 z-100 backdrop-blur-sm ${
            theme === "dark" ? "bg-gray-950/60" : "bg-gray-500/60"
          }`}
          onClick={() => setIsFullScreen(false)}
        />
      )}

      <div
        className={`shadow-md p-4 border border-gray-300 rounded-xl ${
          isFullScreen
            ? "fixed inset-4 h-[calc(100vh-2rem)] z-150 bg-black bg-opacity-10 backdrop-blur-sm"
            : "h-[82vh]"
        } flex flex-col ${
          theme === "dark" ? "bg-gray-850 border-gray-700" : "bg-gray-50 border-gray-300"
        } transition-all duration-300`}
        style={{ overflow: "auto" }}
      >
        <div className="flex justify-between items-center">
          <ModelSelector onChange={handleModelChange} />
          <FullScreenToggleButton isFullScreen={isFullScreen} onClick={() => setIsFullScreen(!isFullScreen)} theme={theme} />
        </div>

        <Split
          key={theme}
          className="flex-grow flex flex-col w-full"
          direction="vertical"
          sizes={verticalSizesRef.current}
          minSize={[250, 80]}
          gutterSize={7}
          snapOffset={0}
          onDragEnd={(sizes) => (verticalSizesRef.current = sizes)}
          gutter={(index, direction) => createGutter(direction)}
        >
          <Split
            key={theme}
            className="flex w-full mb-2"
            sizes={horizontalSizesRef.current}
            minSize={[200, 300, 210]}
            gutterSize={7}
            snapOffset={0}
            onDragEnd={(sizes) => (horizontalSizesRef.current = sizes)}
            gutter={(index, direction) => createGutter(direction)}
          >
            <div className="h-full mr-1 min-w-[130px] flex flex-col">
              <div className="flex-grow">
                <DataUploader onUpload={handleFileUpload} />
              </div>
              
              <StartButton onClick={handleStartForecast} />
            </div>

            <div className="h-full min-w-[300px] mx-1">
              <BaseChart options={options} />
            </div>

            <div className="h-full ml-1 min-w-[130px]">
              <ModelSettingsPanel selectedModel={selectedModel} onChange={handleModelSettingsChange} />
            </div>
          </Split>

          <div className="w-full h-full mt-2 min-w-[560px]">
            <DataSummary summary={dataSummaryRef.current} />
          </div>
        </Split>
      </div>
    </>
  );
}
