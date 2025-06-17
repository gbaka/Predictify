import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import Split from "react-split";
import BaseChart from "../shared/BaseChart";
import DataSummary from "../shared/DataSummary";

const I18nNamespace = "common";


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
  const { t } = useTranslation(I18nNamespace);
  const isDarkMode = theme === "dark";

  return (
    <div className={`rounded-lg h-full p-4 overflow-y-auto ${
      isDarkMode ? "bg-gray-800" : "bg-gray-100"
    }`}>
      <h3 className="font-semibold mb-4">{t("fullscreen-tile.parser-info")}</h3>
      
      <div className="max-h-[200px] flex-grow space-y-4">
        <StatusIndicator status="online" label={t("fullscreen-tile.status")} theme={theme} />

        <InfoRow 
          label={t("fullscreen-tile.source")} 
          value={parserInfo.source} 
          theme={theme} 
        />

        <InfoRow 
          label={t("fullscreen-tile.last-update")} 
          value={parserInfo.lastUpdate} 
          theme={theme} 
        />

        <InfoRow 
          label={t("fullscreen-tile.update-interval")}
          value={parserInfo.updateInterval} 
          theme={theme} 
        />

        <InfoRow 
          label={t("fullscreen-tile.model")}
          value={parserInfo.model} 
          theme={theme} 
        />

        <InfoRow 
          label={t("fullscreen-tile.values-received")}
          value={parserInfo.dataPoints} 
          theme={theme} 
        />

        <InfoRow 
          label={t("fullscreen-tile.details")}
          value={parserInfo.details} 
          theme={theme} 
        />
      </div>
    </div>
  );
}


export default function FullscreenForecastTile({ data, onClose, theme }) {
  const { t } = useTranslation(I18nNamespace);
  const isDarkMode = theme === "dark";

  const allSeries = [
        // Базовый невидимый ряд для правильного масштабирования
        {
          name: "",
          type: "line",
          data: data.full_dates.map((val, idx) => data.endog[idx] ? data.endog[idx] : data.prediction[idx]),
          lineStyle: { opacity: 0 },
          itemStyle: { opacity: 0 },
          emphasis: { focus: "none" },
          tooltip: { show: false },
        },
        // Ряд прогнозных значений
        {
          name: t("fullscreen-tile.forecast"),
          type: "line",
          data: data.prediction.map((el) => el ? el.toFixed(3) : el),
          smooth: false,
          lineStyle: { width: 2, type: "dashed" },
          itemStyle: { color: "#F54242" },
          animationDuration: 700,
          animationEasing: "exponentialOut",
        },
        // Вспомогательный ряд для корректного отображения подсказки
        {
          name: `${t("fullscreen-tile.conf-interval")} (${Math.trunc(data.confidence_level*100)}%)`,
          type: "line",
          itemStyle: { color: "#F54242" },
          lineStyle: { width: 0 },  
          symbol: "roundRect",           
          data: data.confidence_intervals.map(
              ci => (ci[0] && ci[1]) ? `[${ci[0].toFixed(3)}, ${ci[1].toFixed(3)}]` : null
            )
                    
        }, 
        // Нижняя граница
        {
          name:`${t("fullscreen-tile.conf-interval")} (${Math.trunc(data.confidence_level*100)}%)`,
          type: "line",
          stack: "confidence",
          itemStyle: { color: "#F54242" },
          lineStyle: { width: 0 }, 
          symbol: "none",
          tooltip: { show: false },
          showInLegend: false,  
          animationDuration: 800,
          animationEasing: "exponentialOut",
          smooth: false,
          data: data.confidence_intervals.map(
            ci => ci[0]
          )
        },
        // Верхняя граница
        {
          name: `${t("fullscreen-tile.conf-interval")} (${Math.trunc(data.confidence_level*100)}%)`,
          type: "line",
          stack: "confidence",
          itemStyle: { color: "#F54242" },
          areaStyle: {
            opacity: 0.2 
          },
          lineStyle: { width: 0 }, 
          symbol: "none",
          tooltip: { show: false },
          animationDuration: 800,
          animationEasing: "exponentialOut",
          smooth: false,
          data: data.confidence_intervals.map(
            ci => ci[0] ? (ci[1] - ci[0]) : undefined
          )
        }, 
        // Ряд абсолютных ошибок
        {
        name: t("fullscreen-tile.abs-error"),
        type: "line",
        data: data.absolute_error, 
        lineStyle: { width: 0 }, 
        itemStyle: { color: "#F54242" }, 
        symbol: "none",
        showInLegend: false 
        },
        // Исходные данные
        {
          name: t("fullscreen-tilel.initial-data"),
          type: "line",
          data: data.endog,
          smooth: false,
          lineStyle: { width: 2 },
          itemStyle: { color: "#3582FF" },
        },
      ]

  // Опции для графика (адаптированные под полноэкранный режим)
  const chartOptions = {
    legend: {
      show: true,
      top: '1.5%',
      data: [t("fullscreen-tilel.initial-data"), t("fullscreen-tile.forecast"), `${t("fullscreen-tile.conf-interval")} (${Math.trunc(data.confidence_level*100)}%)`]
    },
    title: {
      show: false,
    },
    xAxis: {
      type: "category",
      data: data.full_dates,
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

    series: allSeries,
    grid: {
      top: "9%",
      right: "3%",
      left: "9%",
    },
  };

  // Split-панели
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

  // console.log("FSTile: ", data)

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
          sizes={[72, 28]}
          minSize={[250, 80]}
          snapOffset={0}
          gutterSize={7}
          gutter={(index, direction) => createGutter(direction)}
        >
          {/* Верхний блок (график + информация о парсере) */}
          <Split
            className="flex w-full mb-2"
            sizes={[75, 25]}
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
              <ParserInfoPanel parserInfo={data.parserInfo} theme={theme} />
            </div>
            
          </Split>

          <div className="w-full h-full mt-2 min-w-[430px] pb-4">
            <DataSummary summary={data.summary} theme={theme} />
          </div>
        </Split>
      </div>
    </div>
  );
}

