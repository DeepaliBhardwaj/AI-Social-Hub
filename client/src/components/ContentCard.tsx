import { format } from 'date-fns';
import { Calendar as CalendarIcon, Copy, Share2, Trash2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GeneratedContent, useStore } from '@/store/useStore';
import { toast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

export function ContentCard({ content }: { content: GeneratedContent }) {
  const { deleteContent, schedulePost } = useStore();

  const handleCopy = () => {
    navigator.clipboard.writeText(content.content);
    toast({ title: "Copied!", description: "Content copied to clipboard." });
  };

  const handleSchedule = (date: Date | undefined) => {
    if (date) {
      schedulePost(content.id, date);
      toast({ title: "Scheduled!", description: `Post scheduled for ${format(date, 'PPP')}` });
    }
  };

  const getPlatformColor = (p: string) => {
    switch(p) {
      case 'Instagram': return 'bg-pink-500 text-white';
      case 'Facebook': return 'bg-blue-600 text-white';
      case 'Twitter': return 'bg-sky-500 text-white';
      case 'LinkedIn': return 'bg-blue-700 text-white';
      case 'YouTube': return 'bg-red-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <GlassCard className="group hover:shadow-2xl transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Badge className={getPlatformColor(content.platform)}>{content.platform}</Badge>
          <Badge variant="outline" className="text-xs">{content.type}</Badge>
          <span className="text-xs text-muted-foreground">{format(content.createdAt, 'MMM d, yyyy')}</span>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteContent(content.id)}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>

      {content.imageUrl && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img src={content.imageUrl} alt="Post asset" className="w-full h-48 object-cover" />
        </div>
      )}

      <div className="bg-white/40 dark:bg-black/20 p-4 rounded-lg mb-4 text-sm whitespace-pre-wrap font-medium">
        {content.content}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {content.hashtags.map((tag, i) => (
          <span key={i} className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-white/20 pt-4 mt-auto">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy} className="text-xs">
            <Copy className="w-3 h-3 mr-2" /> Copy
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                <CalendarIcon className="w-3 h-3 mr-2" /> 
                {content.status === 'Scheduled' && content.scheduledDate 
                  ? format(content.scheduledDate, 'MMM d') 
                  : 'Schedule'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={content.scheduledDate}
                onSelect={handleSchedule}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <Badge variant={content.status === 'Posted' ? 'default' : content.status === 'Scheduled' ? 'secondary' : 'outline'}>
          {content.status}
        </Badge>
      </div>
    </GlassCard>
  );
}
