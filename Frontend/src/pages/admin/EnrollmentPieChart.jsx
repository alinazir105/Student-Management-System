import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import api from "../../../axiosInstance";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function EnrollmentPieChart() {
  const [chartData, setChartData] = useState(null);

  const getRandomColor = (opacity = 0.2) => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/api/admin/enrollments/students-per-course"); 
        const data = res.data;

        const labels = data.map(item => item.title);
        const counts = data.map(item => item.count);

        const backgroundColors = labels.map(() => getRandomColor(0.2));
        const borderColors = backgroundColors.map(color =>
          color.replace("0.2", "1")
        );

        setChartData({
          labels,
          datasets: [
            {
              label: "Students per Course",
              data: counts,
              backgroundColor: backgroundColors,
              borderColor: borderColors,
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        console.error("Error loading chart data", err);
      }
    };

    fetchData();
  }, []);

  if (!chartData) return <p>Loading chart...</p>;

  return <Pie data={chartData} />;
}
