import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { AspectRatio } from '@/components/ui/aspect-ratio.tsx';
// import TimeSeriesChart from '@/components/TimeSeries.tsx';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

export default function Graph({ data }: { data: { index: number, desktop: number }[] }) {
    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig;

    return (
        <AspectRatio ratio={16 / 9} className="p-4 flex flex-col">
            <ChartContainer config={chartConfig}>
                <AreaChart
                    accessibilityLayer
                    data={data}
                    margin={{
                        left: 12,
                        right: 12,
                    }}
                >
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="index"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                    />
                    <YAxis />
                    <Area
                        dataKey="desktop"
                        type="linear"
                        fill="var(--color-desktop)"
                        fillOpacity={0.4}
                        stroke="var(--color-desktop)"
                        isAnimationActive={false}
                    />
                </AreaChart>
            </ChartContainer>
        </AspectRatio>
    );
}