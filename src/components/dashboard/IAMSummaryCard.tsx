import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Shield, AlertTriangle, User, Key, ShieldOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useIAMAlerts } from "@/hooks/useIAMAlerts";

// Componente que mostra um resumo dos alertas do IAM
export default function IAMSummaryCard() {
  const { alerts } = useIAMAlerts();
  const [chartData, setChartData] = useState([
    { name: "Usuários", value: 0, color: "#3b82f6" },
    { name: "Funções", value: 0, color: "#8b5cf6" },
    { name: "Políticas", value: 0, color: "#10b981" },
    { name: "Chaves", value: 0, color: "#f59e0b" },
    { name: "Outros", value: 0, color: "#6b7280" },
  ]);

  // Cores para o gráfico
  const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#6b7280"];

  useEffect(() => {
    if (alerts && alerts.length > 0) {
      // Contagem dos tipos de recursos
      const resourceCounts = {
        "IAM_USER": 0,
        "IAM_ROLE": 0,
        "IAM_POLICY": 0,
        "IAM_ACCESS_KEY": 0,
        "other": 0
      };

      // Calcular contagem para cada tipo
      alerts.forEach(alert => {
        if (alert.resourceType === "IAM_USER") {
          resourceCounts["IAM_USER"]++;
        } else if (alert.resourceType === "IAM_ROLE") {
          resourceCounts["IAM_ROLE"]++;
        } else if (alert.resourceType === "IAM_POLICY") {
          resourceCounts["IAM_POLICY"]++;
        } else if (alert.resourceType === "IAM_ACCESS_KEY") {
          resourceCounts["IAM_ACCESS_KEY"]++;
        } else {
          resourceCounts["other"]++;
        }
      });

      // Atualizar dados do gráfico
      setChartData([
        { name: "Usuários", value: resourceCounts["IAM_USER"], color: "#3b82f6" },
        { name: "Funções", value: resourceCounts["IAM_ROLE"], color: "#8b5cf6" },
        { name: "Políticas", value: resourceCounts["IAM_POLICY"], color: "#10b981" },
        { name: "Chaves", value: resourceCounts["IAM_ACCESS_KEY"], color: "#f59e0b" },
        { name: "Outros", value: resourceCounts["other"], color: "#6b7280" },
      ]);
    }
  }, [alerts]);

  // Verificar se existem dados para mostrar no gráfico
  const hasData = chartData.some(item => item.value > 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-500" />
          Resumo de IAM
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex flex-col items-center justify-center text-center h-[200px] text-muted-foreground">
            <ShieldOff className="h-10 w-10 mb-2 opacity-50" />
            <p>Nenhum alerta de IAM encontrado</p>
            <p className="text-xs">Os dados aparecerão aqui quando existirem alertas</p>
          </div>
        ) : (
          <>
            <div className="h-[200px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.filter(item => item.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => 
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} alertas`, 'Quantidade']}
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    wrapperStyle={{ fontSize: "12px", marginTop: "10px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-500" />
                <div className="text-sm">
                  <p>Usuários</p>
                  <p className="font-medium">{chartData[0].value} alertas</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-purple-500" />
                <div className="text-sm">
                  <p>Funções</p>
                  <p className="font-medium">{chartData[1].value} alertas</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-emerald-500" />
                <div className="text-sm">
                  <p>Políticas</p>
                  <p className="font-medium">{chartData[2].value} alertas</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-amber-500" />
                <div className="text-sm">
                  <p>Chaves</p>
                  <p className="font-medium">{chartData[3].value} alertas</p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
} 