import { Layout } from '@/components/Layout';
import { GlassCard } from '@/components/ui/GlassCard';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useStore } from '@/store/useStore';

// Platform colors
const PLATFORM_COLORS: Record<string, string> = {
  Instagram: '#E1306C',
  LinkedIn: '#0077B5',
  Twitter: '#1DA1F2',
  Facebook: '#1877F2',
  YouTube: '#FF0000',
};

// Generate dynamic platform data from actual content
function generatePlatformData(content: any[]) {
  if (content.length === 0) {
    return [{ name: 'No Data', value: 1, color: '#cccccc' }];
  }

  const platformCounts = content.reduce((acc: any, item) => {
    acc[item.platform] = (acc[item.platform] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(platformCounts).map(([name, value]) => ({
    name,
    value,
    color: PLATFORM_COLORS[name] || '#8b5cf6',
  }));
}

// Generate dynamic tone data from actual content
function generateToneData(content: any[]) {
  if (content.length === 0) {
    return [{ name: 'No Data', value: 0 }];
  }

  // Count by content type as proxy for tone
  const typeCounts = content.reduce((acc: any, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(typeCounts).map(([name, value]) => ({
    name,
    value,
  }));
}

export default function Analytics() {
  const { generatedContent } = useStore();
  const platformData = generatePlatformData(generatedContent);
  const toneData = generateToneData(generatedContent);

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
