import { AreaChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Area } from 'recharts';

export default function ResponseTimeContent({ data}){
    // Transform the data based on the time period
    const transformedData = data?.map(item => ({
        time: new Date(item.interval).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }),
        responseTime: item.avgResponseTimeMs,
        count: item.count
    })) || [];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 shadow-md rounded-md border border-neutral-200">
                    <p className="text-sm text-gray-600">{`Time: ${label}`}</p>
                    <p className="text-sm text-gray-600">{`Response Time: ${payload[0].value.toFixed(2)} ms`}</p>
                </div>
            );
        }
        return null;
    };

    return(
        <div className="h-72 p-4">
            <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={transformedData} margin={{ top: 30, right: 40, left: 20, bottom: 20 }}>

                    {/* Define the gradient for the shade */}
                    <defs>
                        <linearGradient id="colorResponseTime" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#60A5FA" stopOpacity={0.5}/>
                        </linearGradient>
                    </defs>

                    {/* Horizontal grid lines */}
                    <CartesianGrid stroke="#cacaca" strokeDasharray="5 0" horizontal={true} vertical={false} />
                    <XAxis 
                        dataKey="time" 
                        stroke="#bababa" 
                        tick={{ dx: 0, dy: 10, textAnchor: 'start' }}
                        interval={3}
                    />
                    <YAxis 
                        stroke="#bababa" 
                        strokeDasharray="0 1"
                        label={{ 
                            value: 'Response Time (ms)', 
                            angle: -90, 
                            position: 'insideLeft',
                            style: { textAnchor: 'middle', fontSize: '12px'},
                        }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    
                    {/* Shaded area under the line */}
                    <Area 
                        type="linear" 
                        dataKey="responseTime" 
                        stroke="#60A5FA" 
                        strokeWidth={3}
                        dot={false}
                        fill="url(#colorResponseTime)" 
                    />

                    {/* Actual line */}
                    <Line 
                        type="linear" 
                        dataKey="responseTime" 
                        stroke="#60A5FA" 
                        strokeWidth={3}
                        dot={{ 
                            r: 4,
                            fill: "#60A5FA",
                            strokeWidth: 2,
                            stroke: "#fff"
                        }}
                        activeDot={{
                            r: 6,
                            fill: "#60A5FA",
                            strokeWidth: 2,
                            stroke: "#fff"
                        }}
                    />

                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}