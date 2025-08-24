// World Bank API integration utilities
export interface WorldBankDataPoint {
  indicator: {
    id: string
    value: string
  }
  country: {
    id: string
    value: string
  }
  countryiso3code: string
  date: string
  value: number | null
  unit: string
  obs_status: string
  decimal: number
}

export interface WorldBankResponse {
  metadata: {
    page: number
    pages: number
    per_page: number
    total: number
    sourceid?: string
    lastupdated?: string
  }
  data: WorldBankDataPoint[]
}

// World Bank indicator mappings
export const WORLD_BANK_INDICATORS = {
  GDP: "NY.GDP.MKTP.CD",
  POPULATION: "SP.POP.TOTL",
  INFLATION: "FP.CPI.TOTL.ZG",
  UNEMPLOYMENT: "SL.UEM.TOTL.ZS",
  EXPORTS: "NE.EXP.GNFS.CD",
  IMPORTS: "NE.IMP.GNFS.CD",
} as const

// Country code mappings for World Bank API
export const COUNTRY_CODES = {
  USA: "US",
  CHN: "CN",
  JPN: "JP",
  DEU: "DE",
  GBR: "GB",
  FRA: "FR",
  IND: "IN",
  BRA: "BR",
} as const

export async function fetchWorldBankData(
  countries: string[],
  indicator: string,
  startYear: number,
  endYear: number,
): Promise<WorldBankDataPoint[]> {
  const countryString = countries.map((c) => COUNTRY_CODES[c as keyof typeof COUNTRY_CODES] || c).join(";")
  const indicatorCode = WORLD_BANK_INDICATORS[indicator as keyof typeof WORLD_BANK_INDICATORS] || indicator
  const dateRange = `${startYear}:${endYear}`

  const url = `https://api.worldbank.org/v2/country/${countryString}/indicator/${indicatorCode}?format=json&date=${dateRange}&per_page=1000`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`World Bank API error: ${response.status}`)
    }

    const data = await response.json()

    // World Bank API returns [metadata, data] array
    if (!Array.isArray(data) || data.length < 2) {
      throw new Error("Invalid World Bank API response format")
    }

    const [metadata, dataPoints] = data

    // Filter out null values and sort by date
    return (dataPoints || [])
      .filter((point: WorldBankDataPoint) => point.value !== null)
      .sort((a: WorldBankDataPoint, b: WorldBankDataPoint) => Number.parseInt(a.date) - Number.parseInt(b.date))
  } catch (error) {
    console.error("Error fetching World Bank data:", error)
    throw error
  }
}

export function processTimeSeriesData(
  data: WorldBankDataPoint[],
  country: string,
): Array<{ year: number; value: number }> {
  const countryCode = COUNTRY_CODES[country as keyof typeof COUNTRY_CODES] || country

  return data
    .filter((point) => point.country.id === countryCode || point.countryiso3code === countryCode)
    .map((point) => ({
      year: Number.parseInt(point.date),
      value: point.value || 0,
    }))
    .sort((a, b) => a.year - b.year)
}

export function processComparisonData(
  data: WorldBankDataPoint[],
  latestYear: number,
): Array<{ name: string; value: number }> {
  const latestData = data.filter((point) => Number.parseInt(point.date) === latestYear)

  const countryData = new Map<string, number>()

  latestData.forEach((point) => {
    const countryName = point.country.value
    if (point.value !== null) {
      countryData.set(countryName, point.value)
    }
  })

  return Array.from(countryData.entries()).map(([name, value]) => ({
    name,
    value,
  }))
}
