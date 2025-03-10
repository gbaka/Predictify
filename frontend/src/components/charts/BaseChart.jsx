import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { useTheme } from "../../context/ThemeContext";

export default function BaseChart({ options, style = { width: "100%", height: "400px" } }) {
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
