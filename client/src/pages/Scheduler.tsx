import { Layout } from '@/components/Layout';
import { GlassCard } from '@/components/ui/GlassCard';
import { useStore } from '@/store/useStore';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';
import { format, isSameDay } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, CircleDashed } from 'lucide-react';

export default function Scheduler() {
  const { generatedContent } = useStore();
  const [date, setDate] = useState<Date | undefined>(new Date());

  const scheduledPosts = generatedContent.filter(c => c.status === 'Scheduled' || c.status === 'Posted');
  const selectedDayPosts = scheduledPosts.filter(c => 
    date && c.scheduledDate && isSameDay(new Date(c.scheduledDate), date)
  );

  return (
    <Layout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-display font-bold">Content Schedule</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Calendar View */}
          <GlassCard className="lg:col-span-5">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border-0 w-full"
              modifiers={{
                scheduled: (d) => scheduledPosts.some(p => p.scheduledDate && isSameDay(new Date(p.scheduledDate), d))
              }}
              modifiersStyles={{
                scheduled: { fontWeight: 'bold', color: 'var(--primary)', textDecoration: 'underline' }
              }}
            />
          </GlassCard>

          {/* List View for Selected Day */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              Schedule for {date ? format(date, 'MMMM do, yyyy') : 'Selected Date'}
            </h2>

            {selectedDayPosts.length === 0 ? (
              <GlassCard className="py-12 flex flex-col items-center justify-center text-muted-foreground">
                <Clock className="w-12 h-12 mb-4 opacity-20" />
                <p>No posts scheduled for this day.</p>
              </GlassCard>
            ) : (
              <div className="space-y-4">
                {selectedDayPosts.map((post) => (
                  <GlassCard key={post.id} className="flex items-start gap-4 p-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                      {post.status === 'Posted' ? <CheckCircle2 /> : <CircleDashed />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{post.platform}</Badge>
                        <span className="text-sm text-muted-foreground">{format(post.createdAt, 'h:mm a')}</span>
                      </div>
                      <p className="text-sm font-medium line-clamp-2 mb-2">{post.content}</p>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span>{post.type}</span>
                        <span>•</span>
                        <span>{post.hashtags.length} hashtags</span>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
