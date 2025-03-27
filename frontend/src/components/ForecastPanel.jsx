import * as echarts from "echarts";
import Split from "react-split";
import axios from "axios"

import { FileText, Sheet, X, Maximize2, Minimize2, Play, Settings } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { placeholderDates, placeholderValues } from './exampleChartPlaceholderData';
import { ARIMASettings, SARIMASettings } from "./ModelSettingsUI"
import { ADVANCED_SETTINGS_DEFAULTS } from "./defaultAdvancedSettings"
import AdvancedSettingsPanel from "./AdvancedSettingsPanel";
import ErrorModal from "./ErrorModal"
import BaseChart from "./charts/BaseChart";


const calculateAverage = (data) => {
  const filteredData = data.filter((value) => value !== null);
  if (filteredData.length === 0) return null;
  const sum = filteredData.reduce((acc, value) => acc + value, 0);
  return sum / filteredData.length;
};


function ModelSelector({ onChange, theme }) {
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

  const isDarkMode = theme === "dark";

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
          className={`absolute top-full left-0 w-full mt-1 border   ${isDarkMode ? "text-gray-300 border-gray-600 bg-gray-850" : "text-gray-900 border-gray-400 bg-gray-50"} rounded-lg shadow-lg z-10`}
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
                      className={`p-1 pl-4 cursor-pointer ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100" }`}
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


function DataUploader({ onUpload, theme }) {
  const [selectedFile, setSelectedFile] = useState(null); 
  const [isDragging, setIsDragging] = useState(false); 

  const isDarkMode = theme === "dark";

  // Обработчик клика по области загрузки
  const handleClick = () => {
    document.getElementById("file-input").click(); 
  };

  // Обработчик изменения файла
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    processFile(file); 
  };

  // Обработчик удаления файла
  const handleRemoveFile = () => {
    setSelectedFile(null); 
    onUpload(null);
    document.getElementById("file-input").value = "";
  };

  // Обработчик перетаскивания файла
  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    processFile(file);
  };

  // Обработчик наведения на область
  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true); 
  };

  // Обработчик выхода из области
  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  // Функция для обработки файла
  const processFile = (file) => {
    if (file) {
      const allowedTypes = ["text/csv", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file); 
        onUpload({ target: { files: [file] } });
      } else {
        alert("Пожалуйста, выберите файл в формате CSV или Excel.");
      }
    }
  };

  // Функция для обрезки длинных имен файлов
  const truncateFileName = (fileName, maxLength = 18) => {
    if (fileName.length > maxLength) {
      return `${fileName.substring(0, maxLength)}...`;
    }
    return fileName;
  };

  return (
    <div
      className={`p-4 border-2 border-dashed cursor-pointer ${
        isDarkMode ? "border-gray-600 hover:border-gray-500" : "border-gray-400 hover:border-gray-500"
      } rounded-lg w-full h-full flex flex-col justify-center items-center transition-colors ${
        isDragging ? (isDarkMode ? "bg-gray-800" : "bg-gray-100") : "" 
      }`}
      onClick={handleClick} 
      onDrop={handleDrop}
      onDragOver={handleDragOver} 
      onDragLeave={handleDragLeave}
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
              className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
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
                isDarkMode ? "text-gray-400 hover:bg-gray-700" : "text-gray-500 hover:bg-gray-200"
              } transition-colors`}
            >
              <X className="w-4 h-4" /> {/* Иконка для удаления файла */}
            </button>
          </div>
          <p className={`text-sm ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
             style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
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
          <p className={`text-center mt-2 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
             style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
            Перетащите файл сюда или нажмите для загрузки
          </p>
          <p className={`text-center text-sm ${isDarkMode ? "text-gray-600" : "text-gray-400"}`}
             style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
            Поддерживаются форматы: CSV, Excel
          </p>
        </>
      )}
    </div>
  );
}


function ModelSettingsPanel({ selectedModel, onChange, theme }) {
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


function DataSummary({ summary, theme }) {
  const isDarkMode = theme === "dark"
  return (
    <div className={`${isDarkMode ? 'border-gray-700' : 'border-gray-300'} p-2 border rounded-lg w-full h-full line-clamp-1 overflow-y-scroll`}>
      <div style={{ height: 0, color: 'rgba(0, 0, 0, 0)' }}><br /></div>
      <h3 className="font-bold">Сводка данных:</h3>
      <pre className={`text-center whitespace-pre-wrap text-xs ${!summary ? 'text-gray-500' : ''}`}>
        {summary || "Нет данных"}
      </pre>
    </div>
  );
}


function FullScreenToggleButton({ isFullScreen, onClick, theme }) {
  const isDarkMode = theme === "dark";
  return (
    <button
      onClick={onClick}
      className={`${
       isDarkMode ? " hover:bg-gray-700 border-gray-700 " : "border-gray-300 hover:bg-gray-200"
      } border relative ml-1.5 mb-3 transition-colors p-2.5 rounded-lg`}
    >
      {isFullScreen ? (
        <Minimize2 className="w-5 h-5" /> // Иконка для сворачивания
      ) : (
        <Maximize2 className="w-5 h-5" /> // Иконка для разворачивания
      )}
    </button>
  );
}

function SettingsButton({ onClick, theme }) {
  const isDarkMode = theme === "dark";
  return (
    <button
      onClick={onClick}
      className={`${
        isDarkMode ? " hover:bg-gray-700 border-gray-700 " : "border-gray-300 hover:bg-gray-200"
      } border relative ml-1.5 mb-3 transition-colors p-2.5 rounded-lg`}
    >
      <Settings className="w-5 h-5" /> {/* Иконка настроек */}
    </button>
  );
}


function StartButton({ onClick, theme }) {
  const isDarkMode = theme === "dark"

  return (
    <button
      className={`w-full h-full rounded-lg font-medium flex items-center justify-center gap-2
                  shadow-md transition duration-200 border 
                  ${
                    isDarkMode
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


export default function ForecastingPanel({ theme }) {
  // const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const modelSettingsRef = useRef(null);
  const advancedSettingsRef = useRef({ ...ADVANCED_SETTINGS_DEFAULTS });
  const uploadedDataRef = useRef(null);
  const dataSummaryRef = useRef("");
  const verticalSizesRef = useRef([80, 20]);
  const horizontalSizesRef = useRef([15, 70, 15]);

  const [selectedModel, setSelectedModel] = useState(null); 
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); 
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [chartData, setChartData] = useState({
    full_dates: [],
    endog: [],
    prediction: [],
  });

  const handleModelSettingsChange = (settings) => {
    modelSettingsRef.current = settings;
  };

  const handleAdvancedSettingsChange = (settings) => {
    advancedSettingsRef.current = settings;
  }

  const handleModelChange = (model) => {
    setSelectedModel(model); 
  };

  const handleFileUpload = (event) => {
    if (event) {
      uploadedDataRef.current = event.target.files[0];
    } else {
      uploadedDataRef.current = null
    }
  };

  const handleStartForecast = async () => {
    if (!selectedModel || !modelSettingsRef.current || !uploadedDataRef.current) {
      setErrorMessage("Пожалуйста, заполните все поля.");
      setIsErrorModalOpen(true);
      return;
    }
  
    const formData = new FormData();
    formData.append("selectedModel", selectedModel);
    formData.append("modelSettings", JSON.stringify(modelSettingsRef.current)); 
    formData.append("uploadedData", uploadedDataRef.current); 
    formData.append("fileSettings", JSON.stringify(advancedSettingsRef.current["fileSettings"]));
    
    setIsLoading(true); 
    dataSummaryRef.current = "Загрузка...";
    console.log(isLoading)

    try {
      const response = await axios.post("http://localhost:8000/api/test", formData, {
        headers: { "Content-Type": "multipart/form-data" }, // Обязательно multipart/form-data
      });
      dataSummaryRef.current = response.data.summary;
    
      const predictionStartIndex = response.data.endog.length;
      const lastEndogValue = response.data.endog[predictionStartIndex - 1];
      const smoothedPrediction = [lastEndogValue, ...response.data.prediction];
      const formattedPrediction = Array(predictionStartIndex - 1).fill(null).concat(smoothedPrediction);
      setChartData({
        full_dates: response.data.full_dates,
        endog: response.data.endog,
        prediction: formattedPrediction,
      });

      // console.log("Forecasting results:", response.data);
    } catch (error) {
      dataSummaryRef.current = ""
      console.error("Error sending request:", error);
      if (error.response && error.response.status === 400) {
        setErrorMessage("Неверные данные. Пожалуйста, проверьте введённые значения и формат данных в файле.");
      } else {
        setErrorMessage("Произошла ошибка при отправке запроса. Пожалуйста, попробуйте снова.");
      }
      setIsErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };  

  const hasData = chartData.endog.length > 0; 
  const averagePrediction = calculateAverage(chartData.prediction);
  const averageEndog = calculateAverage(chartData.endog)
  const options = {
    legend: {
      show: advancedSettingsRef.current.graphSettings.showLegend,
    },
    title: { text: hasData ? advancedSettingsRef.current.graphSettings.title : "Пример графика" },
    xAxis: {
      type: "category",
      data: hasData ? chartData.full_dates : placeholderDates,
      splitLine: {
        show: ["regular", "vertical"].includes(advancedSettingsRef.current.graphSettings.gridType),
      }
    },
    yAxis: { 
      type: "value",
      splitLine: {
        show: ["regular", "horizontal"].includes(advancedSettingsRef.current.graphSettings.gridType),
      }
     },
    
    series: hasData
      ? [
          {
            name: "",
            type: "line",
            data: [...chartData.endog, ...chartData.prediction.slice(chartData.endog.length + 1),],
            lineStyle: { opacity: 0 },
            itemStyle: { opacity: 0 },
            emphasis: { focus: "none" },
            tooltip: { show: false },
          },
          {
            name: "Исходные данные",
            type: "line",
            data: chartData.endog,
            smooth: advancedSettingsRef.current.graphSettings.isSmooth,
            lineStyle: { width: 2 },
            itemStyle: { color: advancedSettingsRef.current.graphSettings.dataColor },
            markPoint: advancedSettingsRef.current.graphSettings.showEndogExtremes
            ? {
                data: [
                  { type: "max", name: "max" },
                  { type: "min", name: "min" },
                ],
                symbol: "circle",
                symbolSize: 10,
                itemStyle: {
                  color: advancedSettingsRef.current.graphSettings.dataColor, 
                },
                label: {
                  color: "#ffffff",
                  textBorderColor: advancedSettingsRef.current.graphSettings.dataColor, 
                  textBorderWidth: 2, 
                  show: true,
                  formatter: (params) => params.name, 
                },
              }
            : undefined,
            markLine: advancedSettingsRef.current.graphSettings.showEndogAverage
            ? {
                data: [
                  {
                    yAxis: averageEndog, 
                    name: "Среднее", 
                  },
                ],
                label: {
                  show: true,
                  formatter: "Среднее:\n{c}", 
                  position: "end",
                  align: 'center',
                  padding: [0, 0, 0, 30], 
                  textBorderColor: isDarkMode ? "#172131" : "#ffffff",
                  textBorderWidth: 2,
                  color: advancedSettingsRef.current.graphSettings.dataColor,

                },
                lineStyle: {
                  color: advancedSettingsRef.current.graphSettings.dataColor, 
                  type: "dotted", 
                },
              }
            : undefined,
          },
          {
            name: "Прогноз",
            type: "line",
            data: chartData.prediction,
            smooth: advancedSettingsRef.current.graphSettings.isSmooth,
            lineStyle: { width: 2, type: "dashed" },
            itemStyle: { color: advancedSettingsRef.current.graphSettings.forecastColor },
            markPoint: advancedSettingsRef.current.graphSettings.showForecastExtremes
            ? {
                data: [
                  { type: "max", name: "max" },
                  { type: "min", name: "min" },
                ],
                symbol: "circle",
                symbolSize: 10,
                itemStyle: {
                  color: advancedSettingsRef.current.graphSettings.forecastColor, 
                },
                label: {
                  color: "#ffffff",
                  textBorderColor: advancedSettingsRef.current.graphSettings.forecastColor, 
                  textBorderWidth: 2, 
                  show: true,
                  formatter: (params) => params.name, 
                },
              }
            : undefined,
            markLine: advancedSettingsRef.current.graphSettings.showForecastAverage
            ? {
                data: [
                  {
                    type: "average", // Тип линии — среднее значение
                    yAxis: averagePrediction, // Подпись линии
                  },
                ],
                label: {
                  show: true,
                  formatter: "Среднее:\n{c}", // Отображаем значение среднего
                  position: "end", // Позиция подписи
                  align: 'center',
                  padding: [0, 0, 0, 30], // Отступ слева 20px
                  textBorderColor: isDarkMode ? "#172131" : "#ffffff",
                  textBorderWidth: 2,
                  color: advancedSettingsRef.current.graphSettings.forecastColor,
                },
                lineStyle: {
                  color: advancedSettingsRef.current.graphSettings.forecastColor, // Цвет линии
                  type: "dotted", // Тип линии (пунктирная)
                },
              }
            : undefined,
          },     
        ]
      : [
          {
            name: "Пример данных",
            type: "line",
            data: placeholderValues,
            smooth: advancedSettingsRef.current.graphSettings.isSmooth,
            lineStyle: { width: 2, type: "dotted" },
            itemStyle: { color: "gray", opacity: 0.65 },
          },
        ],
  };

  const createGutter = (direction) => {
    const gutter = document.createElement("div");
    gutter.className = `gutter gutter-${direction}`;
    gutter.style.backgroundColor = "var(--gutter-bg)";
    gutter.style.borderRadius = "var(--gutter-border-radius)";
    gutter.style.transition = "var(--gutter-transition)";

    gutter.addEventListener("mouseenter", () => {
      gutter.style.backgroundColor = "var(--gutter-hover-bg)";
    });

    gutter.addEventListener("mouseleave", () => {
      gutter.style.backgroundColor = "var(--gutter-bg)";
    });

    if (direction === "vertical") {
      gutter.style.height = "8px";
    }

    return gutter;
};

  return (
    <>
      {isFullScreen && (
        <div
          className={`fixed inset-0 z-100 backdrop-blur-sm ${
            isDarkMode ? "bg-gray-950/60" : "bg-gray-500/60"
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
          isDarkMode ? "bg-gray-850 border-gray-700" : "bg-gray-50 border-gray-300"
        } transition-all duration-300`}
        style={{ overflow: "auto" }}
      >
        <div className="flex justify-between items-center">
          <ModelSelector onChange={handleModelChange} theme={theme} />
          <SettingsButton onClick={() => setIsSettingsOpen(!isSettingsOpen)} theme={theme} />
          <FullScreenToggleButton isFullScreen={isFullScreen} onClick={() => setIsFullScreen(!isFullScreen)} theme={theme} />
        </div>

        <Split
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
            className="flex w-full mb-2 "
            sizes={horizontalSizesRef.current}
            minSize={[200, 300, 210]}
            gutterSize={7}
            snapOffset={0}
            onDragEnd={(sizes) => (horizontalSizesRef.current = sizes)}
            gutter={(index, direction) => createGutter(direction)}
          >
            <div className="h-full mr-1 min-w-[130px] flex flex-col">
              <div className="flex-grow h-2/3">
                <DataUploader onUpload={handleFileUpload} theme={theme} />
              </div>
              <div className="flex-grow h-1/3 mt-2">
              <StartButton onClick={handleStartForecast} theme={theme} />
              </div>
            </div>

            <div className="h-full min-w-[300px] mx-1">
              <BaseChart options={options} isLoading={isLoading} theme={theme} bordered={true} />
            </div>

            <div className="h-full ml-1 min-w-[130px]">
              <ModelSettingsPanel selectedModel={selectedModel} onChange={handleModelSettingsChange} theme={theme} />
            </div>
          </Split>

          <div className="w-full h-full mt-2 min-w-[560px]">
            <DataSummary summary={dataSummaryRef.current} theme={theme} />
          </div>
        </Split>
      </div>

      {/* Панель настроек */}
      <AdvancedSettingsPanel
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onChange={handleAdvancedSettingsChange}
          theme={theme}
      />

      {/* Модальное окно для ошибок */}
      <ErrorModal
        isOpen={isErrorModalOpen}
        message={errorMessage}
        onClose={() => setIsErrorModalOpen(false)}
        theme={theme}
      />
    </>
  );
}
