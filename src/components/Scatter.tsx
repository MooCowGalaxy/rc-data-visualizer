import { ChartConfig, ChartContainer } from '@/components/ui/chart.tsx';
import { AspectRatio } from '@/components/ui/aspect-ratio.tsx';
import { CartesianGrid, Dot, ReferenceLine, Scatter as ScatterPoints, ScatterChart, XAxis, YAxis } from 'recharts';

export default function Scatter({ data, linePoint }: { data: { x: number, y: number }[], linePoint: number[] | null }) {
    const point = linePoint || [0, 0];

    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig;

    return (
        <div className="p-4 flex-grow h-full">
            <AspectRatio ratio={1}>
                <ChartContainer config={chartConfig}>
                    <ScatterChart
                        accessibilityLayer
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="x"
                            type="number"
                            tickMargin={8}
                            ticks={[-400, -200, 0, 200, 400]}
                            scale="linear"
                            domain={[-500, 500]}
                            allowDataOverflow={true}
                        />
                        <YAxis
                            dataKey="y"
                            type="number"
                            tickMargin={8}
                            ticks={[-400, -200, 0, 200, 400]}
                            scale="linear"
                            domain={[-500, 500]}
                            allowDataOverflow={true}
                        />
                        <ScatterPoints
                            data={data}
                            fill="#8884d8"
                            fillOpacity={0.5}
                            shape={<Dot r={2} />}
                            isAnimationActive={false}
                        />
                        {point.filter(x => x === 0).length === 0 &&
                            <ReferenceLine stroke="#04cf04" fill="#04cf04" strokeWidth={2} segment={[{ x: 0, y: 0 }, { x: point[0], y: point[1] }]} />
                        }
                    </ScatterChart>
                </ChartContainer>
            </AspectRatio>
        </div>
    );
}