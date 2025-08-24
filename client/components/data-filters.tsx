"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

interface DataFiltersProps {
  onFiltersChange: (filters: {
    country: string
    indicator: string
    yearRange: [number, number]
  }) => void
}

export function DataFilters({ onFiltersChange }: DataFiltersProps) {
  const [country, setCountry] = useState("USA")
  const [indicator, setIndicator] = useState("GDP")
  const [yearRange, setYearRange] = useState<[number, number]>([2010, 2022])

  const handleApplyFilters = () => {
    onFiltersChange({ country, indicator, yearRange })
  }

  const countries = [
    { value: "USA", label: "United States" },
    { value: "CHN", label: "China" },
    { value: "JPN", label: "Japan" },
    { value: "DEU", label: "Germany" },
    { value: "GBR", label: "United Kingdom" },
    { value: "FRA", label: "France" },
    { value: "IND", label: "India" },
    { value: "BRA", label: "Brazil" },
  ]

  const indicators = [
    { value: "GDP", label: "GDP (Current US$)" },
    { value: "POPULATION", label: "Population, Total" },
    { value: "INFLATION", label: "Inflation, Consumer Prices" },
    { value: "UNEMPLOYMENT", label: "Unemployment Rate" },
    { value: "EXPORTS", label: "Exports of Goods and Services" },
    { value: "IMPORTS", label: "Imports of Goods and Services" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">Data Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Country</Label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Economic Indicator</Label>
          <Select value={indicator} onValueChange={setIndicator}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {indicators.map((i) => (
                <SelectItem key={i.value} value={i.value}>
                  {i.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label>
            Year Range: {yearRange[0]} - {yearRange[1]}
          </Label>
          <Slider
            value={yearRange}
            onValueChange={(value) => setYearRange(value as [number, number])}
            min={2000}
            max={2022}
            step={1}
            className="w-full"
          />
        </div>

        <Button onClick={handleApplyFilters} className="w-full">
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  )
}
