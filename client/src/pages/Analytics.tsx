import { Layout } from '@/components/Layout';
import { GlassCard } from '@/components/ui/GlassCard';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const platformData = [
  { name: 'Instagram', value: 400, color: '#E1306C' },
  { name: 'LinkedIn', value: 300, color: '#0077B5' },
  { name: 'Twitter', value: 300, color: '#1DA1F2' },
  { name: 'Facebook', value: 200, color: '#1877F2' },
];

const toneData = [
  { name: 'Professional', value: 45 },
  { name: 'Casual', value: 30 },
  { name: 'Funny', value: 15 },
  { name: 'Motivational', value: 10 },
];

export default function Analytics() {
  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-display font-bold">Performance Analytics</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GlassCard>
            <h3 className="font-semibold mb-6">Platform Distribution</h3>
            <div className="h-[300px] bg-transparent">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderRadius: '8px', 
                      border: '1px solid hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }} 
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-semibold mb-6">Top Content Tones</h3>
            <div className="h-[300px] bg-transparent">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={toneData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="currentColor" />
                  <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="currentColor" />
                  <Tooltip 
                    cursor={{fill: 'transparent'}} 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderRadius: '8px', 
                      border: '1px solid hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }} 
                  />
                  <Bar dataKey="value" fill="hsl(262 83% 58%)" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      </div>
    </Layout>
  );
}
