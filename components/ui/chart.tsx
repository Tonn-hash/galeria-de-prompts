"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps, cva } from "class-variance-authority"
import {
  CartesianGrid,
  Line,
  LineChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  Area,
  AreaChart,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  ResponsiveContainer,
  type ContentProps,
} from "recharts"

import { cn } from "@/lib/utils"

// region Chart

const chartVariants = cva("h-full w-full", {
  variants: {
    variant: {
      line: "",
      bar: "",
      pie: "",
      radial: "",
      area: "",
      scatter: "",
    },
  },
})

interface ChartProps extends React.ComponentPropsWithoutRef<"div">, VariantProps<typeof chartVariants> {
  config?: ChartConfig
}

type ChartContextProps = {
  config?: ChartConfig
  data?: Record<string, any>[]
} & (
  | {
      variant: "line"
      Chart: typeof LineChart
      item: typeof Line
    }
  | {
      variant: "bar"
      Chart: typeof BarChart
      item: typeof Bar
    }
  | {
      variant: "pie"
      Chart: typeof PieChart
      item: typeof Pie
    }
  | {
      variant: "radial"
      Chart: typeof RadialBarChart
      item: typeof RadialBar
    }
  | {
      variant: "area"
      Chart: typeof AreaChart
      item: typeof Area
    }
  | {
      variant: "scatter"
      Chart: typeof ScatterChart
      item: typeof Scatter
    }
)

const ChartContext = React.createContext<ChartContextProps | null>(null)

function Chart({ variant, config, data, className, children, ...props }: ChartProps) {
  const ChartComponent = React.useMemo(() => {
    switch (variant) {
      case "line":
        return LineChart
      case "bar":
        return BarChart
      case "pie":
        return PieChart
      case "radial":
        return RadialBarChart
      case "area":
        return AreaChart
      case "scatter":
        return ScatterChart
      default:
        return LineChart
    }
  }, [variant])

  const ChartItem = React.useMemo(() => {
    switch (variant) {
      case "line":
        return Line
      case "bar":
        return Bar
      case "pie":
        return Pie
      case "radial":
        return RadialBar
      case "area":
        return Area
      case "scatter":
        return Scatter
      default:
        return Line
    }
  }, [variant])

  return (
    <ChartContext.Provider
      value={{
        config,
        data,
        variant,
        Chart: ChartComponent,
        item: ChartItem,
      }}
    >
      <div className={cn(chartVariants({ variant }), className)} {...props}>
        <ResponsiveContainer>
          <ChartComponent data={data}>{children}</ChartComponent>
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}
Chart.displayName = "Chart"

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a <Chart />")
  }
  return context
}

// endregion

// region ChartContainer

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> &
    VariantProps<typeof chartVariants> & {
      config: ChartConfig
      data: Record<string, any>[]
    }
>(({ className, children, variant, config, data, ...props }, ref) => (
  <div ref={ref} className={cn("flex h-[350px] w-full flex-col items-center justify-center", className)} {...props}>
    <Chart variant={variant} config={config} data={data}>
      {children}
    </Chart>
  </div>
))
ChartContainer.displayName = "ChartContainer"

// endregion

// region ChartTooltip

type ChartTooltipProps = ContentProps<any, any> & {
  hideLabel?: boolean
  hideIndicator?: boolean
  is
}

const ChartTooltip = ({ active, payload, label, hideLabel = false, hideIndicator = false }: ChartTooltipProps) => {
  const { config } = useChart()

  if (active && payload && payload.length) {
    return (
      <div className="grid min-w-[130px] items-center gap-1.5 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-xl">
        {!hideLabel && label ? <div className="text-muted-foreground">{label}</div> : null}
        <div className="grid gap-1">
          {payload.map((item: any) => {
            const key = item.dataKey as keyof typeof config

            const content = config[key]

            return (
              <div key={item.dataKey} className="flex items-center justify-between gap-4">
                {content?.icon && (
                  <span className="flex items-center gap-1.5">
                    <Slot className="h-3 w-3" />
                    {content.label}
                  </span>
                )}
                {!hideIndicator && (
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: item.color,
                    }}
                  />
                )}
                <div className="flex flex-1 items-center justify-between">
                  {content?.label && <span className="text-muted-foreground">{content?.label}</span>}
                  <span className="font-medium text-foreground">{item.value}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return null
}

// endregion

// region ChartLegend

const ChartLegend = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    content?: ContentProps<any, any>
  }
>(({ content, className, ...props }, ref) => {
  const { config } = useChart()

  if (!content) return null

  return (
    <div ref={ref} className={cn("flex flex-wrap items-center justify-center gap-4", className)} {...props}>
      {Object.entries(config).map(([key, item]) => (
        <div key={key} className="flex items-center gap-1.5">
          <div
            className="h-2 w-2 shrink-0 rounded-full"
            style={{
              backgroundColor: item.color,
            }}
          />
          <span className="text-xs text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  )
})
ChartLegend.displayName = "ChartLegend"

// endregion

// region ChartCrosshair

const ChartCrosshair = ({
  orientation = "vertical",
  ...props
}: { orientation?: "horizontal" | "vertical" } & React.ComponentPropsWithoutRef<typeof CartesianGrid>) => {
  return <CartesianGrid horizontal={orientation === "horizontal"} vertical={orientation === "vertical"} {...props} />
}

// endregion

// region ChartAxis

const ChartAxis = ({
  orientation,
  ...props
}: { orientation?: "left" | "right" | "top" | "bottom" } & React.ComponentPropsWithoutRef<
  typeof XAxis | typeof YAxis
>) => {
  if (orientation === "left" || orientation === "right") {
    return <YAxis orientation={orientation} {...props} />
  }

  return <XAxis orientation={orientation} {...props} />
}

// endregion

export type ChartConfig = {
  [k: string]: {
    label: string
    color: string
    icon?: React.ComponentType<{ className?: string }>
  }
}

export {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartCrosshair,
  ChartAxis,
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
}
