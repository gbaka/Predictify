import * as echarts from "echarts";
import { useRef, useEffect } from "react";
import BaseChart from "../charts/BaseChart";

export default function ForecastTile({ data, onClick, isLoading, theme }) {
    // Настроим options для графика
    const options = {
      title: { 
        text: data.title,
        show: false  // Скрываем название
      },
      xAxis: { 
        type: "category", 
        data: data.x,
        show: false  // Скрываем ось X
      },
      yAxis: { 
        type: "value", 
        show: false,  // Скрываем ось Y
      },
      series: [
        {
          data: data.y,
          type: "line",
          smooth: true,  // Чтобы линия была плавной
          lineStyle: {
            width: 2,  // Ширина линии
            color: theme === "dark" ? "#409EFF" : "#1E90FF"  // Цвет линии в зависимости от темы
          }
        }
      ],
      legend: {
        show: false,  // Отключаем легенду
      },
      tooltip: {
        show: false,  // Скрываем tooltip
      },
      toolbox: {
        show: false,
      },
      dataZoom: false,
    };
  
    return (
      <div
        className="bg-gray-50 border border-gray-300 shadow-md rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all mx-1 h-[300px]"
        onClick={onClick}
      >
        <h3 className="text-lg font-semibold mb-4">{data.title}</h3>
        {/* Отправляем настройки в BaseChart */}
        <div className="h-[220px]">
            <BaseChart options={options} isLoading={isLoading} theme={theme} />
        </div>
      </div>
    );
  }