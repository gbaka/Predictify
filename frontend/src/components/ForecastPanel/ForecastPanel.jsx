import Split from "react-split";
import axios from "axios"

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FileText, Sheet, X, Maximize2, Minimize2, Play, 
         Settings } from "lucide-react";

import { placeholderDates, placeholderValues } from './exampleChartPlaceholderData';
import { SARIMASettings, ARIMASettings, ARMASettings, ARSettings, MASettings, SESSettings, HESSettings, HWESSettings } from "./ModelSettingsUI"
import { ADVANCED_SETTINGS_DEFAULTS } from "./defaultAdvancedSettings"
import { API_CONFIG } from "../../api/apiConfig";
import AdvancedSettingsPanel from "./AdvancedSettingsPanel";
import ErrorModal from "../modals/ErrorModal"
import BaseChart from "../shared/BaseChart";
import DataSummary from "../shared/DataSummary";


const I18nNamespace = "common";

const calculateAverage = (data) => {
  if (data) {
    const filteredData = data.filter((value) => value !== null);
    if (filteredData.length === 0) return null;
    const sum = filteredData.reduce((acc, value) => acc + value, 0);
    return sum / filteredData.length;
  }
};


function ModelSelector({ onChange, theme }) {
  const { t } = useTranslation(I18nNamespace);
  const models = {
    "forecast-panel.stat-methods": {
      "forecast-panel.linear-models": ["AR", "MA", "ARMA", "ARIMA", "SARIMA"],
      "forecast-panel.exp-smoothing": ["SES", "HES", "HWES"]
    },
    "forecast-panel.machine-learning": {
      "forecast-panel.decision-trees": ["Random Forest", "XGBoost"],
      "forecast-panel.neuralnetworks": ["LSTM", "GRU"]
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
      className={`min-w-[475px]
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
        {selectedModel || t("forecast-panel.choose-model")}
      </div>

      {/* Выпадающий список */}
      {isOpen && (
        <div
          className={`absolute top-full left-0 w-full mt-1 border   ${isDarkMode ? "text-gray-300 border-gray-600 bg-gray-850" : "text-gray-900 border-gray-400 bg-gray-50"} rounded-lg shadow-lg z-10`}
          style={{ maxHeight: "60vh", overflowY: "auto" }}
        >
          {Object.keys(models).map((category) => (
            <div key={category}>
              <div className="p-1 font-bold">{t(category)}</div>
              {Object.keys(models[category]).map((subcategory) => (
                <div key={subcategory}>
                  <div className="p-1 pl-2 font-semibold">&nbsp;&nbsp;{t(subcategory)}</div>
                  {models[category][subcategory].map((model) => (
                    <div
                      key={model}
                      className={`p-1 pl-4 cursor-pointer ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100" }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(model);
                      }}
                    >
                      &nbsp;&nbsp;&nbsp;&nbsp;{t(model)}
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
  const { t } = useTranslation(I18nNamespace);
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
            {t("forecast-panel.file-selected")}
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
            {t("forecast-panel.download-file")}
          </p>
          <p className={`text-center text-sm ${isDarkMode ? "text-gray-600" : "text-gray-400"}`}
             style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
            {t("forecast-panel.supported-formats")}
          </p>
        </>
      )}
    </div>
  );
}


function ModelSettingsPanel({ selectedModel, onChange, theme }) {
  const { t } = useTranslation(I18nNamespace);
  const renderSettings = () => {
    switch (selectedModel) {
      case "SARIMA":
        return <SARIMASettings onChange={onChange} theme={theme}/>;
      case "ARIMA":
        return <ARIMASettings onChange={onChange} theme={theme}/>;
      case "ARMA":
        return <ARMASettings onChange={onChange} theme={theme}/>;
      case "AR":
        return <ARSettings onChange={onChange} theme={theme}/>;
      case "MA":
        return <MASettings onChange={onChange} theme={theme}/>;

      case "SES":
        return <SESSettings onChange={onChange} theme={theme}/>;
      case "HES":
        return <HESSettings onChange={onChange} theme={theme}/>;
      case "HWES":
        return <HWESSettings onChange={onChange} theme={theme}/>;

      case "LSTM":
      case "GRU":
      case "XGBoost":
      case "Random Forest":
        return  <div className="text-center text-gray-500">{t("forecast-panel.in-next-updates")}</div>;

      default:
        return <div className="text-center text-gray-500">{t("forecast-panel.not-selected")}</div>;
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
  const { t } = useTranslation(I18nNamespace);
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
      {t("forecast-panel.start")}
    </button>
  );
}


export default function ForecastingPanel({ theme }) {
  const { t } = useTranslation(I18nNamespace);
  const isDarkMode = theme === "dark";

  const modelSettingsRef = useRef(null);
  const advancedSettingsRef = useRef({ ...ADVANCED_SETTINGS_DEFAULTS });
  const uploadedDataRef = useRef(null);
  const dataSummaryRef = useRef("");

  const [selectedModel, setSelectedModel] = useState(null); 
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); 
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    title: null,
    detail: null
  });
  const [chartData, setChartData] = useState({
    fullDates: null,
    endog: null,
    prediction: null,
    confidenceIntervals: null,
    confidenceLevel: null
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
    if (isLoading) {
      setErrorMessage({title: t("forecast-panel.wait-for-results"), detail: null});
      setIsErrorModalOpen(true);
      return
    }
    
    if (!selectedModel || !modelSettingsRef.current || !uploadedDataRef.current) {
      setErrorMessage({title: t("forecast-panel.fill-forms"), detail: null});
      setIsErrorModalOpen(true);
      return;
    }
  
    const formData = new FormData();
    formData.append("selectedModel", selectedModel);
    formData.append("modelSettings", JSON.stringify(modelSettingsRef.current)); 
    formData.append("uploadedData", uploadedDataRef.current); 
    formData.append("fileSettings", JSON.stringify(advancedSettingsRef.current["fileSettings"]));
    
    setIsLoading(true); 
    dataSummaryRef.current = t("forecast-panel.loading");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT); 
    try {
      const response = await axios.post(API_CONFIG.FORECAST_ENDPOINT , formData, {
        headers: { "Content-Type": "multipart/form-data" }, 
        signal: controller.signal
      });
      console.log("RESPONSE: ", response)
      clearTimeout(timeoutId)
      dataSummaryRef.current = response.data.summary;
    
      const predictionStartIndex = response.data.endog.length;
      const lastEndogValue = response.data.endog[predictionStartIndex - 1];
      const smoothedPrediction = [lastEndogValue, ...response.data.prediction];
      const formattedPrediction = Array(predictionStartIndex - 1).fill(null).concat(smoothedPrediction);
      setChartData({
        fullDates: response.data.full_dates,
        endog: response.data.endog,
        prediction: formattedPrediction,
        confidenceIntervals: response.data.confidence_intervals.intervals,
        confidenceLevel: response.data.confidence_intervals.confidence_level
      });

    } catch (error) {
      clearTimeout(timeoutId)
      dataSummaryRef.current = ""
      console.error("Error sending request:", error);

      if (error.name === 'AbortError' || error.code === 'ECONNABORTED' || error.code === 'ERR_CANCELED') {
        setErrorMessage({
          title: `The waiting time has been exceeded. The server did not respond for ${Math.round(API_CONFIG.TIMEOUT/1000)} seconds. Please try again later.`,
          detail: null
        });
      } else if (error.response && error.response.status === 400) {
        console.log("Detail:", error.response.data.detail)
        const detailedErrorMessage = error?.response?.data?.detail || 'Unknown error.';
        setErrorMessage({title: t("forecast-panel.input-error"), detail: detailedErrorMessage});
      } else {
        setErrorMessage({title: t("forecast-panel.sending-error"), detail: null});
      }
      setIsErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };  

  const hasData = chartData.endog !== null; 
  const averagePrediction = calculateAverage(chartData.prediction);
  const averageEndog = calculateAverage(chartData.endog)
  const allSeries = hasData
    ? [
        // Базовый невидимый ряд для правильного масштабирования
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
          name: t("forecast-panel.forecast"),
          type: "line",
          data: chartData.prediction.map((el) => el ? el.toFixed(3) : el),
          smooth: advancedSettingsRef.current.graphSettings.isSmooth,
          lineStyle: { width: 2, type: "dashed" },
          itemStyle: { color: advancedSettingsRef.current.graphSettings.forecastColor },
          animationDuration: 700,
          animationEasing: "exponentialOut",
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
                formatter: `${t("forecast-panel.average")}:\n{c}`, // Отображаем значение среднего
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
        // Вспомогательный ряд для корректного отображения подсказки
        chartData.confidenceIntervals
          ? {
              name: `${t("forecast-panel.conf-interval")} (${Math.trunc(chartData.confidenceLevel*100)}%)`,
              type: "line",
              itemStyle: { color: advancedSettingsRef.current.graphSettings.forecastColor },
              lineStyle: { width: 0 },  
              symbol: "roundRect",       
              data: [
                ...Array(chartData.endog.length - 1).fill(null),
                `[${chartData.endog[chartData.endog.length - 1].toFixed(3)}, ${chartData.endog[chartData.endog.length - 1].toFixed(3)}]`,
                ...chartData.confidenceIntervals.map(
                  ci => `[${ci[0].toFixed(3)}, ${ci[1].toFixed(3)}]`
                )
              ],         
            } : null,
        // Нижняя граница
        chartData.confidenceIntervals
          ? {
              name:`${"forecast-panel.conf-interval"} (${Math.trunc(chartData.confidenceLevel*100)}%)`,
              type: "line",
              stack: "confidence",
              itemStyle: { color: advancedSettingsRef.current.graphSettings.forecastColor },
              lineStyle: { width: 0 }, 
              symbol: "none",
              tooltip: { show: false },
              showInLegend: false,  
              animationDuration: 800,
              animationEasing: "exponentialOut",
              smooth: advancedSettingsRef.current.graphSettings.isSmooth,
              data: [
                ...Array(chartData.endog.length - 1).fill(null), 
                chartData.endog[chartData.endog.length - 1], 
                ...chartData.confidenceIntervals.map(ci => ci[0]) 
              ],
            }
        : null,   
        // Верхняя граница
        chartData.confidenceIntervals 
          ? {
              name: `${"forecast-panel.conf-interval"} (${Math.trunc(chartData.confidenceLevel*100)}%)`,
              type: "line",
              stack: "confidence",
              itemStyle: { color: advancedSettingsRef.current.graphSettings.forecastColor },
              areaStyle: {
                opacity: 0.2 
              },
              lineStyle: { width: 0 }, 
              symbol: "none",
              tooltip: { show: false },
              animationDuration: 800,
              animationEasing: "exponentialOut",
              smooth: advancedSettingsRef.current.graphSettings.isSmooth,
              data: [
                ...Array(chartData.endog.length - 1).fill(null), 
                0, 
                ...chartData.confidenceIntervals.map(ci => (ci[1] - ci[0]))
              ],
            }
          : null,
          {
            name: t("forecast-panel.initial-data"),
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
                    name: t("forecast-panel.average"), 
                  },
                ],
                label: {
                  show: true,
                  formatter: `${t("forecast-panel.average")}:\n{c}`, 
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
      ]
    : [
        {
          name: t("forecast-panel.example-data"),
          type: "line",
          data: placeholderValues,
          smooth: advancedSettingsRef.current.graphSettings.isSmooth,
          lineStyle: { width: 2, type: "dotted" },
          itemStyle: { color: "gray", opacity: 0.65 },
        },
      ]

  const chartOptions = {
    legend: {
      show: advancedSettingsRef.current.graphSettings.showLegend,
      data: hasData ? [t("forecast-panel.initial-data"), t("forecast-panel.forecast"), `${t("forecast-panel.conf-interval")} (${Math.trunc(chartData.confidenceLevel*100)}%)`] : [t("forecast-panel.example-data")]
    },
    title: { text: hasData ? advancedSettingsRef.current.graphSettings.title : t("forecast-panel.example-chart") },
    xAxis: {
      type: "category",
      data: hasData ? chartData.fullDates : placeholderDates,
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
    series: allSeries
  };

  const createGutter = (direction) => {
    const gutter = document.createElement("div");
    gutter.className = `gutter gutter-${direction}  ${direction==="vertical" ? "min-w-[575px]" : ""}`;
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
          sizes={[80, 20]}
          minSize={[250, 80]}
          gutterSize={7}
          snapOffset={0}
          // onDragEnd={(sizes) => (verticalSizesRef.current = sizes)}
          gutter={(index, direction) => createGutter(direction)}
        >
          <Split
            className="flex w-full mb-2 "
            sizes={[15, 70, 15]}
            minSize={[200, 300, 210]}
            gutterSize={7}
            snapOffset={0}
            // onDragEnd={(sizes) => (horizontalSizesRef.current = sizes)}
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
              <BaseChart options={chartOptions} isLoading={isLoading} theme={theme} bordered={true} />
            </div>

            <div className="h-full ml-1 min-w-[130px]">
              <ModelSettingsPanel selectedModel={selectedModel} onChange={handleModelSettingsChange} theme={theme} />
            </div>
          </Split>

          <div className="w-full h-full mt-2 min-w-[575px]">
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
