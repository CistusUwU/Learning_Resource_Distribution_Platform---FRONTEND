'use client'

import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  type TooltipItem,
} from 'chart.js'
import type { RevenueTrendPoint } from '@app-types/dashboard.type'
import { formatCurrency } from '@utils/currency'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

export default function RevenueTrendChart({ data }: { data: RevenueTrendPoint[] }) {
  const chartData = {
    labels: data.map((d) => `Th.${d.month}`),
    datasets: [
      {
        label: 'Doanh thu',
        data: data.map((d) => d.revenue),
        backgroundColor: 'rgb(30 58 138 / 0.7)',
        hoverBackgroundColor: 'rgb(29 78 216)',
        borderRadius: 6,
        maxBarThickness: 48,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'bar'>) => formatCurrency(context.parsed.y),
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: string | number) => formatCurrency(Number(value)),
        },
      },
    },
  }

  return (
    <div className="bg-surface border border-border rounded-radius-lg p-5">
      <h2 className="font-bold text-text mb-4">Doanh thu theo tháng</h2>
      <div className="h-48">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  )
}