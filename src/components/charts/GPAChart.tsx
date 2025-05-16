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
import { Semester } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface GPAChartProps {
  completedSemesters: Semester[];
  requiredGpaPerSemester?: number[];
}

const GPAChart: React.FC<GPAChartProps> = ({ 
  completedSemesters, 
  requiredGpaPerSemester = [] 
}) => {
  const totalSemesters = completedSemesters.length + requiredGpaPerSemester.length;
  
  const labels = Array.from({ length: totalSemesters }, (_, i) => `Sem ${i + 1}`);
  
  const completedGpa = completedSemesters.map(sem => sem.gpa);
  const filledCompletedGpa = [...completedGpa, ...Array(requiredGpaPerSemester.length).fill(null)];
  
  const filledRequiredGpa = [
    ...Array(completedSemesters.length).fill(null),
    ...requiredGpaPerSemester
  ];
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'GPA Comparison by Semester',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            return value !== null ? `GPA: ${value}` : '';
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
        label: 'Current GPA',
        data: filledCompletedGpa,
        backgroundColor: 'rgba(53, 162, 235, 0.8)',
        borderColor: 'rgba(53, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Required GPA',
        data: filledRequiredGpa,
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  return (
    <div className="h-64 md:h-80">
      <Bar options={options} data={data} />
    </div>
  );
};

export default GPAChart;