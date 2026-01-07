import { useState } from 'react';
import { useStore, Platform, ContentType, Tone } from '@/store/useStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, Upload, Image as ImageIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from '@/hooks/use-toast';

export function GeneratorForm() {
  const { generateContent, generateImageCaption, isGenerating } = useStore();
  
  const [platform, setPlatform] = useState<Platform>('Instagram');
  const [type, setType] = useState<ContentType>('Post');
  const [tone, setTone] = useState<Tone>('Professional');
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState('English');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleGenerate = async () => {
    // Validation
    if (!topic || topic.trim().length === 0) {
      toast({ 
        title: "Topic Required", 
        description: "Please enter a topic or prompt to generate content.", 
        variant: "destructive" 
      });
      return;
    }

    if (topic.trim().length < 3) {
      toast({ 
        title: "Topic Too Short", 
        description: "Please enter at least 3 characters for better content generation.", 
        variant: "destructive" 
      });
      return;
    }

    if (topic.length > 500) {
      toast({ 
        title: "Topic Too Long", 
        description: "Please keep your topic under 500 characters.", 
        variant: "destructive" 
      });
      return;
    }

    try {
      await generateContent({ platform, type, tone, topic: topic.trim(), language });
      toast({ 
        title: "✨ Content Generated!", 
        description: `Your ${tone.toLowerCase()} ${type.toLowerCase()} for ${platform} is ready!` 
      });
      setTopic(''); // Clear form after successful generation
    } catch (error) {
      toast({ 
        title: "Generation Failed", 
        description: "Something went wrong. Please try again.", 
        variant: "destructive" 
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    // Validation
    if (!file.type.startsWith('image/')) {
      toast({ 
        title: "Invalid File", 
        description: "Please upload a valid image file (JPG, PNG, GIF, etc.)", 
        variant: "destructive" 
      });
      e.target.value = '';
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({ 
        title: "File Too Large", 
        description: "Image size should be less than 10MB.", 
        variant: "destructive" 
      });
      e.target.value = '';
      return;
    }

    try {
      setImageFile(file);
      await generateImageCaption(file);
      toast({ 
        title: "📸 Image Analyzed!", 
        description: "AI-generated caption is ready for your image!" 
      });
      setImageFile(null); // Clear after generation
      e.target.value = '';
    } catch (error: any) {
      toast({ 
        title: "Upload Failed", 
        description: error.message || "Failed to process image. Please try again.", 
        variant: "destructive" 
      });
      e.target.value = '';
    }
  };

  return (
    <GlassCard className="h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold mb-2 flex items-center gap-2">
          <Sparkles className="text-primary w-6 h-6" />
          AI Generator
        </h2>
        <p className="text-muted-foreground">Create engaging content in seconds.</p>
      </div>

      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="text">Text to Post</TabsTrigger>
          <TabsTrigger value="image">Image to Caption</TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="Twitter">Twitter</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="YouTube">YouTube</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Content Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as ContentType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Post">Post</SelectItem>
                  <SelectItem value="Reel">Reel Caption</SelectItem>
                  <SelectItem value="Story">Story</SelectItem>
                  <SelectItem value="Carousel">Carousel</SelectItem>
                  <SelectItem value="Thread">Thread</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Casual">Casual</SelectItem>
                  <SelectItem value="Funny">Funny</SelectItem>
                  <SelectItem value="Motivational">Motivational</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Spanish">Spanish</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                  <SelectItem value="German">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Topic / Prompt</Label>
            <Textarea 
              placeholder="e.g., Launching a new coffee blend called 'Morning Mist'..."
              className="h-32 resize-none bg-white/80 dark:bg-black/20"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25" 
            size="lg"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Magic...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Content
              </>
            )}
          </Button>
        </TabsContent>

        <TabsContent value="image" className="space-y-6">
          <div className="border-2 border-dashed border-primary/30 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-primary/5 transition-colors cursor-pointer relative">
            <input 
              type="file" 
              accept="image/*" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={handleImageUpload}
              disabled={isGenerating}
            />
            {imageFile ? (
              <div className="space-y-4">
                <img src={URL.createObjectURL(imageFile)} alt="Preview" className="max-h-64 rounded-lg shadow-md mx-auto" />
                <p className="text-sm text-muted-foreground">{imageFile.name}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <ImageIcon className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Upload an Image</h3>
                  <p className="text-muted-foreground text-sm">Drag & drop or click to upload</p>
                </div>
              </div>
            )}
          </div>
          
          {isGenerating && (
            <div className="text-center text-primary animate-pulse">
              Analyzing image and generating caption...
            </div>
          )}
        </TabsContent>
      </Tabs>
    </GlassCard>
  );
}
