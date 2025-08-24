"use client"

import { useState, useEffect } from "react"
import { DataFilters } from "./data-filters"
import { CustomLineChart } from "./charts/line-chart"
import { CustomBarChart } from "./charts/bar-chart"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, DollarSign, Users, BarChart3, AlertCircle } from "lucide-react"
import { fetchWorldBankData, processTimeSeriesData, processComparisonData } from "@/lib/world-bank-api"

interface Filters {
  country: string
  indicator: string
  yearRange: [number, number]
}

export function DashboardContent() {
  const [filters, setFilters] = useState<Filters>({
    country: "USA",
    indicator: "GDP",
    yearRange: [2010, 2023],
  })
  const [timeSeriesData, setTimeSeriesData] = useState<Array<{ year: number; value: number }>>([])
  const [comparisonData, setComparisonData] = useState<Array<{ name: string; value: number }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const [startYear, endYear] = filters.yearRange
        const countries = ["USA", "CHN", "JPN", "DEU", "GBR", "FRA", "IND", "BRA"]

        console.log("[v0] Fetching World Bank data for:", {
          countries: [filters.country],
          indicator: filters.indicator,
          yearRange: filters.yearRange,
        })

        // Fetch data for time series (single country)
        const timeSeriesRawData = await fetchWorldBankData([filters.country], filters.indicator, startYear, endYear)

        // Fetch data for comparison (all countries, latest year only)
        const comparisonRawData = await fetchWorldBankData(countries, filters.indicator, endYear, endYear)

        console.log("[v0] Raw data received:", {
          timeSeriesPoints: timeSeriesRawData.length,
          comparisonPoints: comparisonRawData.length,
        })

        // Process the data
        const processedTimeSeries = processTimeSeriesData(timeSeriesRawData, filters.country)
        const processedComparison = processComparisonData(comparisonRawData, endYear)

        console.log("[v0] Processed data:", {
          timeSeriesLength: processedTimeSeries.length,
          comparisonLength: processedComparison.length,
        })

        setTimeSeriesData(processedTimeSeries)
        setComparisonData(processedComparison)
      } catch (err) {
        console.error("[v0] Error fetching World Bank data:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch data")

        // Fallback to mock data on error
        const [startYear, endYear] = filters.yearRange
        const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)

        const baseValue = filters.indicator === "GDP" ? 15e12 : filters.indicator === "POPULATION" ? 330e6 : 2.5
        const mockTimeSeries = years.map((year) => ({
          year,
          value: baseValue * (1 + Math.random() * 0.1 - 0.05) * (1 + (year - startYear) * 0.02),
        }))

        const countries = ["USA", "CHN", "JPN", "DEU", "GBR"]
        const mockComparison = countries.map((country) => ({
          name: country,
          value: baseValue * (0.8 + Math.random() * 0.4),
        }))

        setTimeSeriesData(mockTimeSeries)
        setComparisonData(mockComparison)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [filters])

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters)
  }

  const getIndicatorLabel = (indicator: string) => {
    const labels: Record<string, string> = {
      GDP: "GDP (Current US$)",
      POPULATION: "Population, Total",
      INFLATION: "Inflation, Consumer Prices (%)",
      UNEMPLOYMENT: "Unemployment Rate (%)",
      EXPORTS: "Exports of Goods and Services (US$)",
      IMPORTS: "Imports of Goods and Services (US$)",
    }
    return labels[indicator] || indicator
  }

  const getCountryLabel = (code: string) => {
    const labels: Record<string, string> = {
      USA: "United States",
      CHN: "China",
      JPN: "Japan",
      DEU: "Germany",
      GBR: "United Kingdom",
      FRA: "France",
      IND: "India",
      BRA: "Brazil",
    }
    return labels[code] || code
  }

  const currentValue = timeSeriesData[timeSeriesData.length - 1]?.value || 0
  const previousValue = timeSeriesData[timeSeriesData.length - 2]?.value || 0
  const changePercent = previousValue ? ((currentValue - previousValue) / previousValue) * 100 : 0

  return (
    <div className="p-6 space-y-6">
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">API Error: {error}. Showing fallback data.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Value</p>
                <p className="text-2xl font-bold">
                  {filters.indicator === "GDP" || filters.indicator === "EXPORTS" || filters.indicator === "IMPORTS"
                    ? currentValue >= 1e12
                      ? `$${(currentValue / 1e12).toFixed(1)}T`
                      : currentValue >= 1e9
                        ? `$${(currentValue / 1e9).toFixed(1)}B`
                        : currentValue >= 1e6
                          ? `$${(currentValue / 1e6).toFixed(1)}M`
                          : `$${currentValue.toLocaleString()}`
                    : filters.indicator === "POPULATION"
                      ? currentValue >= 1e9
                        ? `${(currentValue / 1e9).toFixed(2)}B`
                        : currentValue >= 1e6
                          ? `${(currentValue / 1e6).toFixed(1)}M`
                          : currentValue.toLocaleString()
                      : `${currentValue.toFixed(1)}%`}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Year-over-Year</p>
                <p className={`text-2xl font-bold ${changePercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {changePercent >= 0 ? "+" : ""}
                  {changePercent.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Country</p>
                <p className="text-2xl font-bold">{getCountryLabel(filters.country)}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Indicator</p>
                <p className="text-lg font-bold">{filters.indicator}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <DataFilters onFiltersChange={handleFiltersChange} />
        </div>

        {/* Charts */}
        <div className="lg:col-span-3 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-muted-foreground">Loading World Bank data...</div>
            </div>
          ) : (
            <>
              <CustomLineChart
                data={timeSeriesData}
                title={`${getIndicatorLabel(filters.indicator)} - ${getCountryLabel(filters.country)} (${filters.yearRange[0]}-${filters.yearRange[1]})`}
                color="hsl(var(--chart-1))"
              />

              <CustomBarChart
                data={comparisonData}
                title={`${getIndicatorLabel(filters.indicator)} - Country Comparison (${filters.yearRange[1]})`}
                color="hsl(var(--chart-2))"
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
