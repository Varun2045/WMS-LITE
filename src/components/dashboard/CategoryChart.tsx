import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Electronics', value: 35, color: 'hsl(226, 70%, 45%)' },
  { name: 'Mechanical', value: 28, color: 'hsl(173, 58%, 39%)' },
  { name: 'Safety', value: 15, color: 'hsl(38, 92%, 50%)' },
  { name: 'Tools', value: 12, color: 'hsl(142, 71%, 45%)' },
  { name: 'Packaging', value: 10, color: 'hsl(280, 60%, 50%)' },
];

export function CategoryChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 animate-slide-up">
      <h3 className="text-lg font-semibold text-foreground mb-4">Inventory by Category</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [`${value}%`, 'Share']}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-sm text-muted-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
