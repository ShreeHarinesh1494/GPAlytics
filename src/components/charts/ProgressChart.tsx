import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ProgressChartProps {
  percentage: number;
  label: string;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ percentage, label }) => {
  const data: ChartData<'doughnut'> = {
    labels: [label, 'Remaining'],
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: [
          percentage < 50 ? 'rgba(255, 99, 132, 0.8)' : // Red for low progress
          percentage < 75 ? 'rgba(255, 206, 86, 0.8)' : // Yellow for medium progress
          'rgba(75, 192, 192, 0.8)', // Green for high progress
          'rgba(220, 220, 220, 0.5)',
        ],
        borderColor: [
          percentage < 50 ? 'rgba(255, 99, 132, 1)' :
          percentage < 75 ? 'rgba(255, 206, 86, 1)' :
          'rgba(75, 192, 192, 1)',
          'rgba(220, 220, 220, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            return value !== null ? `${value.toFixed(1)}%` : '';
          }
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 2000,
    },
  };

  return (
    <div className="relative h-48 w-48 mx-auto">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold">{percentage.toFixed(1)}%</span>
      </div>
    </div>
  );
};

export default ProgressChart;