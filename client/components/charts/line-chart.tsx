import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart } from "@mui/x-charts/LineChart";

interface LineChartProps {
  data: Array<{ year: number; value: number }>;
  title: string;
  color?: string;
}

export function CustomLineChart({ data, title }: LineChartProps) {
  const xData = data.map(point => point.year);
  const yData = data.map(point => point.value);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <LineChart
          xAxis={[
            {
              data: data.map(point => point.year),
              label: "Year",
              valueFormatter: (value: number) => Number(value).toFixed(0),
              tickMinStep: 1,
              min: Math.min(...data.map(d => d.year)),
              max: Math.max(...data.map(d => d.year)),
            }
          ]}
          series={[{ data: yData, label: title }]}
          height={300}
          grid={{ vertical: true, horizontal: true }}
        />
      </CardContent>
    </Card>
  );
}
