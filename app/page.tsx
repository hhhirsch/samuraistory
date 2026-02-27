import storyData from "@/data/story.json";

export default function Home() {
  return (
    <main className="min-h-screen bg-primary">
      <header className="border-b border-gold/30 py-8 px-6 text-center">
        <h1 className="font-heading text-4xl md:text-6xl text-gold mb-2">
          Samurai Story
        </h1>
        <p className="font-body text-paper/70 text-lg">
          Eine interaktive Reise durch die Geschichte der Samurai
        </p>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="font-heading text-2xl text-gold mb-8 border-b border-gold/30 pb-4">
          Kapitel
        </h2>
        <ul className="space-y-4">
          {storyData.map((chapter) => (
            <li
              key={chapter.id}
              className="border border-gold/20 rounded-lg p-6 bg-primary/60 hover:border-gold/60 transition-colors"
            >
              <div className="flex items-start gap-4">
                <span className="font-heading text-3xl text-accent font-bold min-w-[2rem]">
                  {chapter.id}
                </span>
                <div>
                  <h3 className="font-heading text-xl text-gold mb-1">
                    {chapter.title}
                  </h3>
                  <p className="font-body text-paper/60 text-sm mb-2">
                    {chapter.era}
                  </p>
                  <p className="font-body text-paper/80 text-sm line-clamp-3">
                    {chapter.storyText.slice(0, 180)}…
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

