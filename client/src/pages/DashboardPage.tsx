import { useEffect, useState } from 'react';
import API from '../api';
import { Users, Home, Heart, Activity } from 'lucide-react';

interface Stats {
  totalFamilies: number;
  totalMembers: number;
  healthIssues: number;
  wards: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ totalFamilies: 0, totalMembers: 0, healthIssues: 0, wards: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [familyRes, memberRes] = await Promise.all([
          API.get('/families'),
          API.get('/members'),
        ]);
        const families = familyRes.data;
        const members = memberRes.data;
        const wardSet = new Set(families.map((f: any) => f.wardNumber));
        const healthIssues = members.filter((m: any) => m.health?.status && m.health.status !== 'Satisfied').length;
        setStats({
          totalFamilies: families.length,
          totalMembers: members.length,
          healthIssues,
          wards: wardSet.size,
        });
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Families', value: stats.totalFamilies, icon: Home, color: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-500/20' },
    { label: 'Total Members', value: stats.totalMembers, icon: Users, color: 'from-blue-500 to-indigo-500', shadow: 'shadow-blue-500/20' },
    { label: 'Health Issues', value: stats.healthIssues, icon: Heart, color: 'from-rose-500 to-pink-500', shadow: 'shadow-rose-500/20' },
    { label: 'Wards', value: stats.wards, icon: Activity, color: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-500/20' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        <p className="text-slate-400 mt-1">Overview of your Mahallu data</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.label}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg ${card.shadow}`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{card.value}</p>
              <p className="text-sm text-slate-400 mt-1">{card.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
