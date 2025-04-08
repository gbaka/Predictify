import { X } from "lucide-react";
import Split from "react-split";
import BaseChart from "../charts/BaseChart";


function DataSummary({ summary, theme }) {
  const isDarkMode = theme === "dark"
  return (
    <div className={`${isDarkMode ? 'border-gray-700' : 'border-gray-300'} p-2 border rounded-lg mr-3 w-full h-full line-clamp-1 overflow-y-scroll`}>
      <div style={{ height: 0, color: 'rgba(0, 0, 0, 0)' }}><br /></div>
      <h3 className="font-bold">Сводка данных:</h3>
      <pre className={`text-center whitespace-pre-wrap text-xs ${!summary ? 'text-gray-500' : ''}`}>
        {summary || "Нет данных"}
      </pre>
    </div>
  );
}


// components/StatusIndicator.jsx
function StatusIndicator({ status, label, theme }) {
  const isDarkMode = theme === "dark";
  const isOnline = status === "online";

  return (
    <div>
      {/* Подпись (аналогично InfoRow) */}
      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
        {label}
      </p>
      
      {/* Блок с индикатором и статусом */}
      <div className="flex items-center mt-1">
        <span className={`capitalize mr-1.5 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
          {status}
        </span>
        <span className={`relative flex h-3 w-3 mr-2 ${
          isOnline ? "text-green-500" : "text-red-500"
        }`}>
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isOnline ? "bg-green-400" : "bg-red-400"
          }`}></span>
          <span className={`relative inline-flex rounded-full h-3 w-3 ${
            isOnline ? "bg-green-500" : "bg-red-500"
          }`}></span>
        </span>
        
      </div>
    </div>
  );
}


// Вспомогательный компонент для строк информации
function InfoRow({ label, value, theme }) {
  const isDarkMode = theme === "dark";
  
  return (
    <div>
      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
        {label}
      </p>
      <p className={isDarkMode ? "text-gray-200" : "text-gray-800"}>
        {value}
      </p>
    </div>
  );
}


function ParserInfoPanel({ parserInfo, theme }) {
  const isDarkMode = theme === "dark";

  return (
    <div className={`rounded-lg h-full p-4 overflow-y-auto ${
      isDarkMode ? "bg-gray-800" : "bg-gray-100"
    }`}>
      <h3 className="font-semibold mb-4">Информация о парсере</h3>
      
      <div className="space-y-4">
        <StatusIndicator status="online" label="Статус:" theme={theme} />

        <InfoRow 
          label="Источник:" 
          value={parserInfo.source} 
          theme={theme} 
        />

        <InfoRow 
          label="Последнее обновление:" 
          value={parserInfo.lastUpdate} 
          theme={theme} 
        />

        <InfoRow 
          label="Интервал обновления:" 
          value={parserInfo.updateInterval} 
          theme={theme} 
        />

        <InfoRow 
          label="Следующее обновление:" 
          value={parserInfo.nextUpdate} 
          theme={theme} 
        />
      </div>
    </div>
  );
}


export default function FullscreenForecastTile({ data, onClose, theme }) {
  const isDarkMode = theme === "dark";

  // Опции для графика (адаптированные под полноэкранный режим)
  const chartOptions = {
    legend: {
      show: false,
    },
    title: {
      show: false,
    },
    xAxis: {
      type: "category",
      data: data.x,
      axisLabel: {
        color: isDarkMode ? "#9CA3AF" : "#6B7280",
      },
      splitLine: {
        show: true,
      },
    },
    yAxis: {
      type: "value",
      splitLine: {
        show: true,
      },
    },

    series: [
      {
        name: "Исходные данные",
        type: "line",
        data: data.y,
        smooth: false,
        lineStyle: { width: 2 },
        itemStyle: {
          color: "#3B82F6"
        }
      },
    ],
    grid: {
      top: "9%",
      right: "3%",
      // bottom: "17%",
      left: "9%",
      // containLabel: true,
    },
  };

  const parserInfo = {
    status: "online",
    lastUpdate: "2023-11-15 14:30:45",
    source: "Alpha Vantage API",
    updateInterval: "15 мин",
    nextUpdate: "2023-11-15 14:45:00",
    dataPoints: data.x.length,
  };


  const createGutter = (direction) => {
    console.log(direction)
    const gutter = document.createElement("div");
    gutter.className = `gutter gutter-${direction} ${direction==="vertical" ? "min-w-[430px]" : ""}`;
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
    <div
      className={`fixed inset-0 z-100 backdrop-blur-sm ${
        isDarkMode ? "bg-gray-950/60" : "bg-gray-500/60"
      }`}
      onClick={onClose}
    >
      <div
        className={`fixed inset-4 h-[calc(100vh-2rem)] z-150 bg-black bg-opacity-10 backdrop-blur-sm shadow-md border rounded-xl flex flex-col ${
          isDarkMode ? "bg-gray-850 border-gray-700" : "bg-gray-50 border-gray-300"
        }`}
        style={{ overflow: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
     
        {/* Шапка с кнопкой закрытия */}
        <div className={`flex justify-between items-center p-3.5 border-b min-w-[445px] ${
          isDarkMode ? "border-gray-700" : "border-gray-300"
        }`}>
          <h2 className="ml-1.5 text-xl font-semibold">{data.title}</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full hover:bg-gray-200 transition-colors ${
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
            }`}
          >
            <X
              className={`w-5 h-5 ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              }`}
            />
          </button>
        </div>

        {/* Основное содержимое с Split */}
        <Split
          className="px-4 pt-2 flex-grow flex flex-col w-full"
          direction="vertical"
          sizes={[80, 20]}
          minSize={[250, 80]}
          snapOffset={0}
          gutterSize={7}
          gutter={(index, direction) => createGutter(direction)}
        >
          {/* Верхний блок (график + информация о парсере) */}
          <Split
            className="flex w-full mb-2"
            sizes={[70, 30]}
            minSize={[400, 250]}
            gutterSize={7}
            snapOffset={0}
            gutter={(index, direction) => createGutter(direction)}
          >
            {/* График */}
            <div className="h-full min-w-[300px] pr-1 overflow-hidden">
              <BaseChart 
                options={chartOptions} 
                theme={theme}
                bordered={true}
              />
            </div>

            {/* Информация о парсере */}
            <div className=" h-full min-w-[130px] pl-1">
              <ParserInfoPanel parserInfo={parserInfo} theme={theme} />
            </div>
            
          </Split>

          <div className="w-full h-full mt-2 min-w-[430px] pb-4">
            <DataSummary summary={null} theme={theme} />
          </div>
        </Split>
      </div>
    </div>
  );
}

