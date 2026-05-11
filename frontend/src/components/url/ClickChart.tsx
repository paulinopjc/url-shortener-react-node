import { ClickStats } from '../../types'

export default function ClickChart({ stats }: { stats: ClickStats }) {
  const maxCount = Math.max(...stats.clicks_per_day.map(d => d.count), 1)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-3xl font-bold text-indigo-600">{stats.total_clicks}</p>
          <p className="text-sm text-gray-500 mt-1">Total clicks</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-3xl font-bold text-indigo-600">{stats.clicks_today}</p>
          <p className="text-sm text-gray-500 mt-1">Clicks today</p>
        </div>
      </div>

      {stats.clicks_per_day.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Clicks per day (last 30 days)</h3>
          <div className="flex items-end gap-1 h-32">
            {[...stats.clicks_per_day].reverse().map((day) => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1" title={`${day.date}: ${day.count}`}>
                <span className="text-xs text-gray-500">{day.count}</span>
                <div
                  className="w-full bg-indigo-500 rounded-t min-h-[2px]"
                  style={{ height: `${(day.count / maxCount) * 100}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.top_referrers.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Top referrers</h3>
          <div className="space-y-2">
            {stats.top_referrers.map(ref => (
              <div key={ref.referrer} className="flex justify-between text-sm">
                <span className="text-gray-600 truncate">{ref.referrer}</span>
                <span className="text-gray-900 font-medium ml-4">{ref.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
