/* eslint-disable react/prop-types */
export default function DonutChart({ data }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  return (
    <div className="w-full h-full gap-4 flex flex-col items-center justify-center">
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="transparent"
          stroke="#e5e7eb"
          strokeWidth="16"
        />
        {data.map((segment, index) => {
          const strokeDasharray = (segment.value / 100) * circumference;
          const circleSegment = (
            <circle
              key={index}
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke={segment.color}
              strokeWidth="24"
              strokeDasharray={`${strokeDasharray} ${circumference}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 80 80)"
            />
          );
          offset += strokeDasharray;
          return circleSegment;
        })}
      </svg>

      <div className="flex flex-wrap justify-center mt-4 gap-x-4 gap-y-2 text-xs">
        {data.map((segment, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: segment.color }}
            ></span>
            <span>{segment.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
