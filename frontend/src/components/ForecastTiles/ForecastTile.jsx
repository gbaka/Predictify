import { useTranslation } from "react-i18next";
import BaseChart from "../shared/BaseChart";


const I18nNamespace = "common";


/**
 * Компонент плитки прогноза, отображающий график временного ряда (фактические и предсказанные значения),
 * а также статус соединения (online/offline).
 * 
 * @component
 * @param {Object} props - Объект с данными прогноза, включая даты, фактические значения, предсказания и интервалы доверия.
 * @param {string} props.title - Заголовок плитки.
 * @param {Function} props.onClick - Обработчик клика по плитке (активен, если `isClickable` === true).
 * @param {boolean} props.isLoading - Флаг состояния загрузки, влияет на индикатор состояния.
 * @param {boolean} props.isClickable - Делает плитку кликабельной, если true.
 * @param {"dark"|"light"} props.theme - Тема оформления (тёмная или светлая)
 * @returns {JSX.Element} JSX элемент
 */
export default function ForecastTile({ data, title, onClick, isLoading, isClickable, theme }) {
  const { t } = useTranslation(I18nNamespace);
  const isDarkMode = theme == "dark"
  const visiblePoints = 200; 

  data = data
    ? data
    : {
        summary: "Nothing here yet.",
        full_dates: [],
        endog: [],
        confidence_intervals: [],
        confidence_level: null,
        prediction: [],
        absolute_error: [],
        last_update: null,
      }

  const startPercentage = data.full_dates.length > visiblePoints 
    ? ((data.full_dates.length - visiblePoints) / data.full_dates.length) * 100 
    : 0;

  const allSeries = [
    {
      data: data.endog,
      type: "line",
      smooth: true,
      lineStyle: {
        width: 2,
      },
      itemStyle: { color: "#3582FF"},
    },
    {
      data: data.prediction,
      type: "line",
      smooth: true,
      lineStyle: { width: 2, type: "dashed" },
      itemStyle: { color: "#F54242"},
    },
  ]

  const options = {
    title: {
      text: title,
      show: false, 
    },
    xAxis: {
      type: "category",
      data: data?.full_dates,
      show: true, 
      splitLine: {
        show: true
      },
      axisLabel: {
        show: false
      },
      axisLine: {
        show: false
      }
    },
    yAxis: {
      type: "value",
      show: true, 
      splitLine: {
        show: true
      },
      axisLabel: {
        show: false
      },
      axisLine: {
        show: false
      }
    },
    series: allSeries,
    legend: {
      show: false,
    },
    tooltip: {
      show: false,
    },
    toolbox: {
      show: false,
    },
    dataZoom: {
      start: startPercentage,
      end: 100,
      show: false,
    },
    grid: {
      show: true,
      borderColor: isDarkMode ? "#000" : "#ccc",
      top: "2%",
      left: "1%",
      right: "1%",
      bottom: "8%"
    },
  };

  return (
    <div
      className={`rounded-xl p-4 transition-all mx-1 h-[300px] relative ${isClickable ? "cursor-pointer hover:scale-[1.01]" : ""} 
        ${isDarkMode ? "bg-gray-850 border-gray-700 shadow-md border" : "bg-gray-50 border-gray-300 shadow-md border "}`}
      onClick={isClickable ? onClick : undefined}
    >
      <div className="flex flex-col h-full">
        <div className="relative flex justify-between items-center pb-2">
          <h3 className={`text-lg font-semibold ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}>
            {title}
          </h3>
          
          <div className="flex items-center ml-auto">
            <span className={`relative flex h-3 w-3 mr-0.5 ${
              isLoading ? "text-yellow-500" : "text-green-500"
            }`}>
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isLoading ? "bg-yellow-400" : "bg-green-400"
              }`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${
                isLoading ? "bg-yellow-500" : "bg-green-500"
              }`}></span>
            </span>
            <span className={`ml-1 text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}>
              {isLoading ? t("forecast-tile.connection"): t("forecast-tile.online")}
            </span>
          </div>

          <div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{
              marginLeft: "-1rem",
              marginRight: "-1rem",
              backgroundColor: isDarkMode ? "#374151" : "#e5e7eb",
            }}
          />
        </div>
        
        <div className="flex-1 h-[220px] overflow-y-hidden">
          <BaseChart
            options={options}
            isLoading={isLoading}
            theme={theme}
            bordered={false}
          />
        </div>
      </div>
    </div>
  );
}