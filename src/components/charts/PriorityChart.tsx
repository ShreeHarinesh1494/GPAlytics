import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Course } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PriorityChartProps {
  courses: Course[];
  importanceValues: Record<string, number>;
}

const PriorityChart: React.FC<PriorityChartProps> = ({ courses, importanceValues }) => {
  // Sort courses by importance
  const sortedCourses = [...courses].sort((a, b) => 
    (importanceValues[b.id] || 0) - (importanceValues[a.id] || 0)
  );
  
  // Limit to top 10 courses for readability
  const topCourses = sortedCourses.slice(0, 10);
  
  const labels = topCourses.map(course => course.name);
  const importanceData = topCourses.map(course => importanceValues[course.id] || 0);
  
  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Importance (% Impact on CGPA)',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Course Impact on CGPA',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Impact: ${context.raw.toFixed(1)}%`;
          }
        }
      }
    },
    animation: {
      duration: 2000,
    },
  };
  
  const data = {
    labels,
    datasets: [
      {
        data: importanceData,
        backgroundColor: importanceData.map(value => 
          value > 12 ? 'rgba(255, 99, 132, 0.8)' : // High impact
          value > 8 ? 'rgba(255, 159, 64, 0.8)' : // Medium impact
          'rgba(75, 192, 192, 0.8)' // Low impact
        ),
        borderColor: importanceData.map(value => 
          value > 12 ? 'rgba(255, 99, 132, 1)' :
          value > 8 ? 'rgba(255, 159, 64, 1)' :
          'rgba(75, 192, 192, 1)'
        ),
        borderWidth: 1,
      },
    ],
  };
  
  return (
    <div className="h-80">
      <Bar options={options} data={data} />
    </div>
  );
};

export default PriorityChart;