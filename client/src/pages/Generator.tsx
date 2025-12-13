import { Layout } from '@/components/Layout';
import { GeneratorForm } from '@/components/GeneratorForm';
import { ContentCard } from '@/components/ContentCard';
import { useStore } from '@/store/useStore';

export default function Generator() {
  const { generatedContent } = useStore();
  // Filter only recently generated (mock logic: just take first 2)
  const recent = generatedContent.slice(0, 2);

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-8rem)]">
        {/* Left Column: Generator Form */}
        <div className="lg:col-span-5 h-full overflow-y-auto pr-2 custom-scrollbar">
          <GeneratorForm />
        </div>

        {/* Right Column: Preview/Results */}
        <div className="lg:col-span-7 space-y-6 h-full overflow-y-auto pb-8 custom-scrollbar">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-semibold">Generated Results</h2>
            <span className="text-sm text-muted-foreground">{generatedContent.length} items</span>
          </div>

          {generatedContent.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-primary/20 rounded-xl bg-white/30">
              <p>No content generated yet.</p>
              <p className="text-sm">Use the form on the left to start.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {generatedContent.map((content) => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
