import { useState, useEffect, useRef } from "react";
import * as echarts from "echarts";
import { useTheme } from "../context/ThemeContext";


const ModelSelector = ({ onChange }) => {
    return (
      <select className="p-2 border" onChange={onChange}>
        <option value="arima">ARIMA</option>
        <option value="prophet">Prophet</option>
        <option value="lstm">LSTM</option>
      </select>
    );
  };
  
  const DataUploader = ({ onUpload }) => {
    return (
      <div className="p-4 border border-dashed">
        <input type="file" onChange={onUpload} />
        <p>Загрузите CSV или Excel файл</p>
      </div>
    );
  };
  
  const ModelSettings = ({ model, onChange }) => {
    if (!model) return <div className="p-4 border">Выберите модель</div>;
    return <div className="p-4 border">Настройки модели: {model}</div>;
  };
  
  const LogsDisplay = ({ logs }) => {
    return (
      <div className="p-4 border bg-gray-100">
        <h3>Логи:</h3>
        <pre>{logs.join("\n")}</pre>
      </div>
    );
  };
  
  
  function BaseChart({ options, style = { width: "100%", height: "400px" } }) {
      const chartRef = useRef(null);
      const { theme } = useTheme(); // Получаем текущую тему (dark / light)
  
      useEffect(() => {
          const isDarkMode = theme === "dark"
  
          let chartInstance = echarts.init(chartRef.current, isDarkMode ? 'dark' : null);
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
  
          chartInstance.setOption(updatedOptions);
  
          // Автоматическое изменение размера
          const handleResize = () => chartInstance.resize();
          window.addEventListener("resize", handleResize);
  
          return () => {
              window.removeEventListener("resize", handleResize);
              chartInstance.dispose();
          };
      }, [options, theme]); // Перерисовываем график при изменении темы
  
      return (
          <div
              className={`p-4 rounded-2xl shadow-md transition-all ${
                  theme === "dark" ? "bg-gray-850 border border-gray-700" : "bg-gray-50 border border-gray-300"
              }`}
          >
              <div ref={chartRef} style={style} />
          </div>
      );
  };
  
  
export default function ForecastingPanel() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [uploadedData, setUploadedData] = useState(null);
  const [modelParams, setModelParams] = useState({});
  const [logs, setLogs] = useState([]);

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setUploadedData(file);
  };

  const handleStartForecast = () => {
    setLogs([...logs, "Прогнозирование запущено..."]);
    // Здесь будет логика отправки данных на сервер
  };

  return (
    <div className="flex flex-col p-4 space-y-4">
      {/* Выбор модели */}
      <ModelSelector onChange={handleModelChange} />
      
      {/* Основная панель */}
      <div className="flex space-x-4">
        <DataUploader onUpload={handleFileUpload} />
        <BaseChart options={{}} />
        <ModelSettings model={selectedModel} onChange={setModelParams} />
      </div>
      
      {/* Логи */}
      <LogsDisplay logs={logs} />
      
      {/* Кнопка старта */}
      <button className="p-2 bg-blue-500 text-white" onClick={handleStartForecast}>
        Начать
      </button>
    </div>
  );
};
