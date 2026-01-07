import { Layout } from '@/components/Layout';
import { useStore } from '@/store/useStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { ContentCard } from '@/components/ContentCard';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Zap, Plus } from 'lucide-react';
import { Link } from 'wouter';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const chartData = [
  { name: 'Mon', posts: 4, engagement: 240 },
  { name: 'Tue', posts: 3, engagement: 139 },
  { name: 'Wed', posts: 7, engagement: 980 },
  { name: 'Thu', posts: 5, engagement: 390 },
  { name: 'Fri', posts: 8, engagement: 480 },
  { name: 'Sat', posts: 12, engagement: 880 },
  { name: 'Sun', posts: 9, engagement: 630 },
];

export default function Dashboard() {
  const { user, generatedContent } = useStore();
  const recentContent = generatedContent.slice(0, 3);

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Welcome back, {user?.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your content today.
            </p>
          </div>
          <Link href="/generator">
            <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
              <Plus className="w-4 h-4 mr-2" /> Create New
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard gradient className="border-l-4 border-l-primary">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Posts</p>
                <h3 className="text-2xl font-bold">{generatedContent.length}</h3>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="border-l-4 border-l-blue-500">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Reach</p>
                <h3 className="text-2xl font-bold">12.5k</h3>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="border-l-4 border-l-green-500">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/10 text-green-500">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Engagement Rate</p>
                <h3 className="text-2xl font-bold">4.8%</h3>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Chart Section */}
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Weekly Engagement</h3>
            <select className="bg-background/50 border border-input rounded-md text-sm px-3 py-1.5">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="h-[300px] w-full bg-transparent">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(262 83% 58%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(262 83% 58%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tickMargin={10} 
                  fontSize={12}
                  stroke="currentColor"
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  fontSize={12}
                  stroke="currentColor"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderRadius: '8px', 
                    border: '1px solid hsl(var(--border))', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="hsl(262 83% 58%)" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorEngagement)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Recent Activity */}
        <div>
          <h3 className="font-display font-semibold text-xl mb-4">Recent Generations</h3>
          {recentContent.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentContent.map((content) => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>
          ) : (
            <GlassCard className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Plus className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-1">No content yet</h4>
                  <p className="text-muted-foreground text-sm mb-4">
                    Create your first AI-generated content to get started
                  </p>
                  <Link href="/generator">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" /> Create Content
                    </Button>
                  </Link>
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </Layout>
  );
}
