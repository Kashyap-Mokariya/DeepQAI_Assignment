import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart } from "@mui/x-charts/BarChart";

interface BarChartProps {
  data: Array<{ name: string; value: number }>;
  title: string;
}

export function CustomBarChart({ data, title }: BarChartProps) {
  const xData = data.map(point => point.name);
  const yData = data.map(point => point.value);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <BarChart
          xAxis={[{ data: xData, label: "Country" }]}
          series={[{ data: yData, label: title }]}
          height={300}
          grid={{ vertical: true, horizontal: true }}
        />
      </CardContent>
    </Card>
  );
}
