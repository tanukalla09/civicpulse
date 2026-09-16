'use client';

export default function ImpactMetrics() {
  const metrics = [
    { category: '🕳️ Potholes', resolved: 78, color: 'bg-red-400' },
    { category: '💡 Streetlights', resolved: 85, color: 'bg-yellow-400' },
    { category: '💧 Water Leakage', resolved: 62, color: 'bg-blue-400' },
    { category: '🗑️ Waste/Garbage', resolved: 91, color: 'bg-green-400' },
    { category: '🌊 Flooding', resolved: 45, color: 'bg-purple-400' },
  ];

  return (
    <section className="py-20 px-4 bg-[#0a1628]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Our <span className="text-amber-400">Impact</span>
          </h2>
          <p className="text-gray-400 text-lg">Resolution rates by category</p>
        </div>
        <div className="space-y-6">
          {metrics.map((m) => (
            <div key={m.category}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white font-medium">{m.category}</span>
                <span className="text-amber-400 font-bold">{m.resolved}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3">
                <div
                  className={`${m.color} h-3 rounded-full transition-all duration-1000`}
                  style={{ width: `${m.resolved}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}