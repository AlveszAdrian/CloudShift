import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, AlertOctagon, Info } from 'lucide-react';

interface SecurityIssuesChartProps {
  issues: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

const SecurityIssuesChart: React.FC<SecurityIssuesChartProps> = ({ issues }) => {
  const data = [
    {
      name: 'Crítico',
      value: issues.critical,
      color: '#EF4444',
      darkColor: '#B91C1C',
      icon: <AlertOctagon size={16} />
    },
    {
      name: 'Alto',
      value: issues.high,
      color: '#F59E0B',
      darkColor: '#D97706',
      icon: <AlertTriangle size={16} />
    },
    {
      name: 'Médio',
      value: issues.medium,
      color: '#3B82F6',
      darkColor: '#2563EB',
      icon: <AlertCircle size={16} />
    },
    {
      name: 'Baixo',
      value: issues.low,
      color: '#10B981',
      darkColor: '#059669',
      icon: <Info size={16} />
    }
  ];

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-3 shadow-lg rounded-lg border border-gray-100"
        >
          <div className="flex items-center text-gray-900 font-medium">
            <span className="mr-2" style={{ color: item.color }}>{item.icon}</span>
            <span>{item.name}</span>
          </div>
          <p className="mt-1 font-bold" style={{ color: item.color }}>
            {item.value} {item.value === 1 ? 'problema' : 'problemas'}
          </p>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      {/* Definição de gradientes */}
      <svg style={{ height: 0 }}>
        {data.map((entry, index) => (
          <defs key={`gradient-${index}`}>
            <linearGradient
              id={`gradient-${entry.name}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={entry.color} stopOpacity={0.8} />
              <stop offset="100%" stopColor={entry.darkColor} stopOpacity={1} />
            </linearGradient>
          </defs>
        ))}
      </svg>
      
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 40 }}
          barSize={40}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="#E5E7EB" 
          />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            dy={10}
            tickFormatter={(value) => value}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            allowDecimals={false}
            dx={-10}
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ fill: 'rgba(224, 231, 255, 0.2)' }}
          />
          <Bar 
            dataKey="value" 
            radius={[4, 4, 0, 0]} 
            animationDuration={1500}
            animationBegin={300}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={`url(#gradient-${entry.name})`} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Legenda */}
      <div className="flex justify-center mt-2 space-x-4">
        {data.map((item, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center"
          >
            <span 
              className="w-3 h-3 rounded-full mr-1"
              style={{ backgroundColor: item.color }}
            ></span>
            <span 
              className="text-xs font-medium"
              style={{ color: item.darkColor }}
            >
              {item.name}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SecurityIssuesChart; 