import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function RevenueChart({ monthlyRevenue }) {
  const data = monthlyRevenue.map((revenue, index) => ({
    month: `M${index + 1}`,
    revenue: Math.round(revenue / 1000), // Convert to thousands for readability
  }))

  return (
    <div className="card-premium">
      <h3 className="text-xl font-bold text-white mb-4">Proyección de Ingresos (24 meses)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="month"
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `$${value}K`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value) => [`$${value}K MXN`, 'Ingresos']}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#275b35"
            strokeWidth={3}
            dot={{ fill: '#275b35', r: 4 }}
            activeDot={{ r: 6 }}
            name="Ingresos Mensuales"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RevenueChart
