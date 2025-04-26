import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip
} from 'recharts';
import { motion } from 'framer-motion';

interface SecurityScoreChartProps {
  score: number;
}

const SecurityScoreChart: React.FC<SecurityScoreChartProps> = ({ score }) => {
  // Calculando o valor restante para completar o círculo
  const remaining = 100 - score;
  
  // Dados para o gráfico
  const data = [
    { name: 'Score', value: score },
    { name: 'Restante', value: remaining }
  ];
  
  // Definindo as cores do gráfico com gradientes
  const getScoreColor = (score: number) => {
    if (score >= 90) return ['#10B981', '#34D399']; // verde
    if (score >= 70) return ['#3B82F6', '#60A5FA']; // azul
    if (score >= 50) return ['#F59E0B', '#FBBF24']; // amarelo
    return ['#EF4444', '#F87171']; // vermelho
  };
  
  const scoreColors = getScoreColor(score);
  const COLORS = [scoreColors, ['#E5E7EB', '#F3F4F6']];
  
  // Customizando o tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length && payload[0].name === 'Score') {
      return (
        <div className="bg-white p-2 shadow-lg rounded-lg border border-gray-200 text-sm">
          <p className="font-semibold">Pontuação de segurança: <span style={{ color: scoreColors[0] }}>{payload[0].value}</span>/100</p>
        </div>
      );
    }
    return null;
  };
  
  // Classe de texto baseada no score
  const getScoreTextClass = (score: number) => {
    if (score >= 90) return "text-emerald-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-amber-600";
    return "text-rose-600";
  };
  
  // Emoji ou ícone baseado no score
  const getScoreEmoji = (score: number) => {
    if (score >= 90) return "🔒";
    if (score >= 70) return "👍";
    if (score >= 50) return "⚠️";
    return "🚨";
  };
  
  return (
    <div className="relative">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 flex items-center justify-center flex-col"
      >
        <motion.span 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className={`text-3xl font-bold ${getScoreTextClass(score)}`}
        >
          {score}
        </motion.span>
        <motion.span 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-sm font-medium text-gray-500"
        >
          /100 {getScoreEmoji(score)}
        </motion.span>
      </motion.div>
      
      <motion.div
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.7, type: "spring" }}
      >
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <defs>
              {/* Gradientes para os segmentos do gráfico */}
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={scoreColors[0]} />
                <stop offset="100%" stopColor={scoreColors[1]} />
              </linearGradient>
              <linearGradient id="remainingGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#E5E7EB" />
                <stop offset="100%" stopColor="#F3F4F6" />
              </linearGradient>
            </defs>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              animationDuration={1500}
              animationBegin={300}
              strokeWidth={0}
            >
              <Cell key="cell-0" fill="url(#scoreGradient)" />
              <Cell key="cell-1" fill="url(#remainingGradient)" />
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default SecurityScoreChart; 