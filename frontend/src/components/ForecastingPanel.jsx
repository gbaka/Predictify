import { useState, useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { FileText, Sheet, X, Maximize2, Minimize2  } from "lucide-react";
import Split from "react-split";
import * as echarts from "echarts";



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
      <div className="p-1 w-full">
        {selectedModel || "Выберите модель"}
      </div>

      {/* Выпадающий список */}
      {isOpen && (
        <div
          className={`absolute top-full left-0 w-full mt-1 border  ${theme === "dark" ? "text-gray-300 border-gray-600 bg-gray-850" : "text-gray-900 border-gray-400 bg-gray-50"} rounded-lg shadow-lg z-10`}
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


// Настройки модели
function ModelSettings({ model, onStart }) {
  const {theme} = useTheme()
  return (
    <div className={`p-2 border  ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} rounded-lg w-full h-full flex flex-col`}>
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
      <div ref={chartRef} className="w-full h-full mt-3" />
    </div>
  );
}


function FullScreenToggleButton({ isFullScreen, onClick, theme }) {
  return (
    <button
      onClick={onClick}
      className={`${
        theme === 'dark' ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
      } relative ml-2 mb-3 transition-colors p-2.5 rounded-lg`}
    >
      {isFullScreen ? (
        <Minimize2 className="w-5 h-5" /> // Иконка для сворачивания
      ) : (
        <Maximize2 className="w-5 h-5" /> // Иконка для разворачивания
      )}
    </button>
  );
}


export default function ForecastingPanel() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [uploadedData, setUploadedData] = useState(null);
  const [dataSummary, setDataSummary] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(true);
  const { theme } = useTheme();

  const [verticalSizes, setVerticalSizes] = useState([80, 20]);
  const [horizontalSizes, setHorizontalSizes] = useState([15, 70, 15]);

  const handleModelChange = (model) => setSelectedModel(model);
  const handleFileUpload = (event) => setUploadedData(event.target.files[0]);
  const handleStartForecast = () =>
    setDataSummary("Здесь будет сводка данных...");

  const options = {
    title: { text: "Простой график №1" },
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    },
    yAxis: { type: "value" },
    series: [
      {
        name: "Значения 1",
        type: "line",
        data: [120, 200, 150, 190, 70, 110, 130],
        smooth: true,
        lineStyle: { width: 2 },
        itemStyle: { color: "#42A5F5" },
      },
      {
        name: "Значения 2",
        type: "line",
        data: [120, 20, 160, 80, 60, 110, 130],
        smooth: true,
        lineStyle: { width: 2 },
        itemStyle: { color: "#4245F5" },
      },
      {
        name: "Значения 3",
        type: "line",
        data: [120, 20, 1, 140, 10, 110, 190],
        smooth: true,
        lineStyle: { width: 2 },
        itemStyle: { color: "#2245F5" },
      },
      {
        name: "Значения 4",
        type: "line",
        data: [110, 20, 1, 10, 60, 110, 190],
        smooth: true,
        lineStyle: { width: 2 },
        itemStyle: { color: "#AA45F5" },
      },
    ],
  };

  const createGutter = (direction) => {
    const gutter = document.createElement("div");
    gutter.className = `gutter gutter-${direction} ${
      theme === "dark"
        ? "bg-gray-700 hover:bg-gray-600"
        : "bg-gray-200 hover:bg-gray-300"
    } transition-colors rounded-lg`;
    if (direction === "vertical") {
      gutter.style.height = "8px";
    }
    return gutter;
  };

  return (
    <>
      {/* Затемнение фона */}
      {isFullScreen && (
        <div
          className="fixed inset-0 z-100 bg-gray-500/75  backdrop-blur-sm "
          onClick={() => setIsFullScreen(false)} // Закрыть по клику на затемнение
        />
      )}
      <div
        className={`shadow-md p-4 border border-gray-300 rounded-xl ${
          isFullScreen
            ? "fixed inset-4  h-[calc(100vh-2rem)] z-150 bg-black bg-opacity-10 backdrop-blur-sm" // Отступы по 1rem и затемнение
            : "h-[82vh]"
        } flex flex-col ${
          theme === "dark"
            ? "bg-gray-850 border-gray-700"
            : "bg-gray-50 border-gray-300"
        } transition-all duration-300`} // Анимация перехода
      >
        <div className="flex justify-between items-center">
          <ModelSelector onChange={handleModelChange} />
          <FullScreenToggleButton
            isFullScreen={isFullScreen}
            onClick={() => setIsFullScreen(!isFullScreen)}
            theme={theme}
          />
        </div>

        <Split
          key={theme}
          className="flex-grow flex flex-col w-full"
          direction="vertical"
          sizes={verticalSizes}
          minSize={[200, 100]}
          gutterSize={7}
          snapOffset={0}
          onDragEnd={(sizes) => setVerticalSizes(sizes)}
          gutter={(index, direction) => createGutter(direction)}
        >
          <Split
            key={theme}
            className="flex w-full mb-2"
            sizes={horizontalSizes}
            minSize={[200, 300, 210]}
            gutterSize={7}
            snapOffset={0}
            onDragEnd={(sizes) => setHorizontalSizes(sizes)}
            gutter={(index, direction) => createGutter(direction)}
          >
            <div className="h-full mr-1">
              <DataUploader onUpload={handleFileUpload} />
            </div>
            <div className="h-full mx-1">
              <BaseChart options={options} />
            </div>
            <div className="h-full ml-1">
              <ModelSettings
                model={selectedModel}
                onStart={handleStartForecast}
              />
            </div>
          </Split>

          <div className="w-full h-full mt-2">
            <DataSummary summary={dataSummary} />
          </div>
        </Split>
      </div>
    </>
  );
}