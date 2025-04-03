import BaseChart from "../charts/BaseChart";


export default function ForecastTile({ data, onClick, isLoading, theme }) {
  const isDarkMode = theme == "dark"
  const visiblePoints = 9; 
  const startPercentage = data.x.length > visiblePoints 
    ? ((data.x.length - visiblePoints) / data.x.length) * 100 
    : 0;

  const options = {
    title: {
      text: data.title,
      show: false, 
    },
    xAxis: {
      type: "category",
      data: data.x,
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
    series: [
      {
        data: data.y,
        type: "line",
        smooth: true,
        lineStyle: {
          width: 2,
        },
        itemStyle: { color: "#3582FF"},
      },
    ],
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
      className={`rounded-xl p-4 cursor-pointer hover:scale-[1.01] transition-all mx-1 h-[300px] relative ${
        isDarkMode 
          ? "bg-gray-850 border-gray-700 shadow-md border" 
          : "bg-gray-50 border-gray-300 shadow-md border "
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col h-full">
        <div className="relative flex justify-between items-center pb-2">
          <h3 className={`text-lg font-semibold ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}>
            {data.title}
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
              {isLoading ? "Соединение" : "Онлайн"}
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