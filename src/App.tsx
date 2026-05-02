import { useState, useRef, useEffect } from "react";
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useLocation,
  useParams
} from "react-router-dom";
import { 
  Zap, 
  Copy, 
  Check, 
  RefreshCw, 
  Layout, 
  Search, 
  ShieldCheck, 
  ArrowRight,
  Youtube,
  Instagram,
  Clapperboard,
  Sparkles,
  TrendingUp,
  Target,
  FileText,
  DollarSign,
  ChevronDown,
  Info,
  Globe,
  Share2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { generateHooks, type GeneratedHooks } from "./lib/gemini";

// ─── CONSTANTS ─────────────────────────────────────────────────────────────
const TONES = ["Viral", "Emotional", "Storytelling", "Aggressive", "Curiosity"];
const PLATFORMS = [
  { id: "YouTube", icon: Youtube },
  { id: "YouTube Shorts", icon: Clapperboard },
  { id: "Instagram Reels", icon: Instagram }
];

const CATEGORY_META = {
  viral: { label: "Viral Hooks", icon: Sparkles, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  curiosity: { label: "Curiosity Hooks", icon: Search, color: "text-indigo-400", bg: "bg-indigo-400/10", border: "border-indigo-400/20" },
  emotional: { label: "Emotional Hooks", icon: Target, color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  shocking: { label: "Shocking Hooks", icon: Zap, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
  storytelling: { label: "Storytelling Hooks", icon: Layout, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
};

const NICHE_PAGES = [
  {
    id: "beginner-gamers",
    title: "YouTube Hooks for Beginner Gamers",
    metaTitle: "20+ Viral YouTube Hooks for Beginner Gamers | HookForge AI",
    metaDesc: "Struggling to grow your new gaming channel? Use these AI-generated YouTube hooks designed specifically for beginner gamers to stop the scroll.",
    description: "If you're just starting out, you need to prove your value instantly. Use these hooks to build authority even with zero subscribers.",
    psychology: "Focuses on 'Hidden Secrets' and 'Instant Fixes' to level the playing field against bigger creators.",
    hooks: [
      "I found a secret in [Game] that 99% of players completely missed.",
      "Stop using [Weapon/Item]. It's actually the worst choice in the game.",
      "This one setting change will instantly double your FPS in [Game].",
      "I spent 100 hours in [Game] so you don't have to. Here's what I found.",
      "The pros are hiding this [Game] exploit, but I'm showing you today.",
      "Your [Game] aim is bad because you're making this one amateur mistake.",
      "I played [Game] with zero knowledge and actually found a way to win.",
      "Don't buy [Early Game Item]! It's a total trap for new players.",
      "This is how I hit [High Rank] in just one week as a total beginner.",
      "The algorithm loves this [Game] trend—here's how to hijack it."
    ]
  },
  {
    id: "fitness-influencers",
    title: "Instagram Reels Hooks for Fitness Influencers",
    metaTitle: "Scroll-Stopping Instagram Reels Hooks for Fitness Influencers",
    metaDesc: "Boost your Reels engagement with these fitness-focused hooks. Perfect for gym motivation, nutrition tips, and workout routines.",
    description: "On Instagram, you have less than 2 seconds. These hooks are optimized for high-impact visual storytelling and curiosity gaps.",
    psychology: "Leverages 'Biological Urgency' and 'Identity Defense' – making the viewer feel their current routine is a personal risk.",
    hooks: [
      "Stop doing [Exercise] until you watch this 30-second fix.",
      "I ate [Food] every day for a week and this is what happened to my body.",
      "The real reason you're not seeing results at the gym isn't your workout.",
      "You're killing your gains by following this 'expert' fitness advice.",
      "The 3-minute morning routine that burned more fat than my 1-hour cardio.",
      "I stopped taking [Popular Supplement] and my energy levels exploded.",
      "Stop working out for your 'dream body'. Start working out for this instead.",
      "I tried [Viral Fitness Hack] and it's actually dangerous. Please watch.",
      "If you can't do [Specific Movement], your mobility is at serious risk.",
      "This is exactly what I eat in a day to stay under 12% body fat."
    ]
  },
  {
    id: "tech-reviewers",
    title: "YouTube Shorts Hooks for Tech Reviewers",
    metaTitle: "Punchy YouTube Shorts Hooks for Tech & Gadget Reviewers",
    metaDesc: "Short, sharp, and shocking. Use these tech hooks to showcase gadgets and software in under 60 seconds.",
    description: "Tech audiences value specs and secrets. Use these pattern interrupts to highlight the 'hidden' features of popular gadgets.",
    psychology: "Uses 'Buyer's Remorse' and 'Technological Superiority' to force viewers to validate their own purchases.",
    hooks: [
      "This [Gadget] has a hidden feature that completely changes how it works.",
      "Stop buying [Brand] until you see what [Competitor] just released.",
      "I tested 10 [Gadgets] so you don't have to — this is the clear winner.",
      "Apple just released an update that literally broke my iPhone.",
      "The one setting you MUST change on your laptop before you use it.",
      "I built a $2,000 PC for only $800. Here is the secret part I used.",
      "Don't buy the [Newest Model]! The [Previous Model] is actually better.",
      "I found the ultimate productivity hack for [Software] that saves 2 hours.",
      "This gadget is illegal in 5 countries, but you can buy it on Amazon.",
      "Is the [Popular Product] worth it? I used it for 30 days and here is the truth."
    ]
  },
  {
    id: "travel-vloggers",
    title: "Instagram Reels Hooks for Travel Vloggers",
    metaTitle: "Viral Travel Hooks for Instagram Reels & TikTok",
    metaDesc: "Make your travel content trend. Viral hooks for budget travelers, luxury vloggers, and solo explorers.",
    description: "Travel is visual, but the hook provides the context. Open a narrative loop that forces the viewer to see the payoff.",
    psychology: "Triggers 'Escapism' and 'Exclusive Access' – making the viewer feel they have discovered a hidden portal.",
    hooks: [
      "Everything they told you about [Destination] is a lie. Here's the truth.",
      "I found a secret spot in [City] where tourists aren't allowed.",
      "This is how I traveled to [Country] for less than ₹5,000.",
      "Stop visiting [Main Tourist Attraction]. Go here instead for zero crowds.",
      "I spent a night in the world's most dangerous hotel and lived.",
      "The one travel app that just saved me $1,200 on my flight to Asia.",
      "I quit my 9-5 to travel the world. Here was my biggest regret.",
      "Don't travel to [Continent] until you know these 3 safety rules.",
      "I found a way to live in [Expensive City] for free for a month.",
      "If you love [Popular Destination], you will absolutely hate this place."
    ]
  },
  {
    id: "finance-experts",
    title: "YouTube Hooks for Personal Finance Experts",
    metaTitle: "High-Authority YouTube Hooks for Finance & Crypto Channels",
    metaDesc: "Establish trust and trigger FOMO with these professional finance hooks. Optimized for investing and crypto niches.",
    description: "In finance, proximity to power and money is the trigger. Use numbers and time-sensitive threats to keep viewers watching.",
    psychology: "Relies on 'Loss Aversion' and 'Economic FOMO' – emphasizing what the viewer is losing by being passive.",
    hooks: [
      "I saved ₹10,000 this month by changing one simple habit. Here's how.",
      "Most financial advisors won't tell you this about [Investment].",
      "If you have ₹5,000 sitting in your bank, you're losing money every day.",
      "The massive market crash nobody is talking about happens in 30 days.",
      "I built a 7-figure portfolio using this one 'boring' index fund.",
      "Stop paying interest! Use this credit card hack to get free flights.",
      "I was $50,000 in debt. Here is the exact system I used to get out.",
      "The rich don't work for money. Here is what they actually work for.",
      "If you don't buy [Asset] now, you will never be able to afford it.",
      "I studied the top 1% of earners. They all have this one habit in common."
    ]
  }
];

const FAQS = [
  { q: "Is this the best AI hook generator for YouTube?", a: "Based on creator feedback, HookForge AI provides the most psychologically-grounded hooks by using advanced triggers like FOMO, Path Interrupt, and Narrative Loops." },
  { q: "Does this work for YouTube Shorts and Instagram Reels?", a: "Yes. The tool recalibrates the word count and punchiness based on your platform selection to ensure hooks fit on-screen as text overlays." },
  { q: "How do I rank my video using these hooks?", a: "Always place your hook in the first 3 seconds of audio and as a high-contrast text overlay to catch viewers who watch with sound off." }
];

// ─── UTILS ─────────────────────────────────────────────────────────────────
function SEO({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", description);
  }, [title, description]);
  return null;
}

// ─── COMPONENTS ────────────────────────────────────────────────────────────
function CollapsibleFAQ({ faq }: { faq: { q: string; a: string }, key?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/5 last:border-0 py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left group"
      >
        <span className="font-semibold text-gray-200 group-hover:text-orange-500 transition-colors">{faq.q}</span>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pt-4 text-gray-500 leading-relaxed text-sm">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ToolSection({ 
  topic, setTopic, tone, setTone, platform, setPlatform, handleGenerate, loading, hooks, outputRef, CATEGORY_META, copyToClipboard, copiedId 
}: any) {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold tracking-widest uppercase"
        >
          <Sparkles className="w-3 h-3" />
          Powered by Gemini 2.0 Flash
        </motion.div>
        <motion.h1 
          className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight font-display"
        >
          Halt the Scroll with <span className="text-orange-500">Viral Hooks</span>
        </motion.h1>
        <motion.p className="text-gray-400 text-lg">
          Stop losing viewers in the first 3 seconds. Transform your niche into an attention magnet.
        </motion.p>
      </div>

      {/* Input Form */}
      <div className="bg-[#111318] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
        <div className="space-y-8 relative z-10">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Concept or Topic</label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
              <input 
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. My $10k morning routine..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Mood & Tone</label>
              <div className="flex flex-wrap gap-2">
                {TONES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      tone === t ? "bg-orange-500 text-white shadow-lg" : "bg-white/5 text-gray-400 hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Canvas / Platform</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setPlatform(p.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        platform === p.id ? "bg-orange-500 text-white shadow-lg" : "bg-white/5 text-gray-400 hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {p.id}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
            className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:scale-[1.01] active:scale-[0.99] h-16 rounded-2xl text-white font-bold text-lg shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center gap-3"
          >
            {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6" />}
            {loading ? "Forging 20 Hooks..." : "Generate Hooks"}
          </button>
        </div>
      </div>

      {hooks && (
        <div ref={outputRef} className="space-y-12 pt-12 border-t border-white/5">
          <div className="grid gap-12">
            {(Object.keys(CATEGORY_META) as Array<keyof GeneratedHooks>).map((category) => {
              const meta = CATEGORY_META[category];
              const Icon = meta.icon;
              const items = hooks[category];
              return (
                <section key={category} className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className={`${meta.bg} p-2 rounded-lg`}><Icon className={`w-5 h-5 ${meta.color}`} /></div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-wider">{meta.label}</h3>
                  </div>
                  <div className="grid gap-3">
                    {items.map((hook, idx) => (
                      <div key={idx} className="bg-[#111318] border border-white/5 rounded-2xl p-5 flex items-center justify-between gap-4 group hover:border-orange-500/30 transition-all">
                        <p className="text-gray-300 leading-relaxed flex-1 italic">"{hook}"</p>
                        <button 
                          onClick={() => copyToClipboard(hook, `${category}-${idx}`)}
                          className={`p-2.5 rounded-xl transition-all ${copiedId === `${category}-${idx}` ? "bg-emerald-500/20 text-emerald-500" : "bg-white/5 text-gray-500 hover:text-orange-500"}`}
                        >
                          {copiedId === `${category}-${idx}` ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function NichePage({ copyToClipboard, copiedId }: any) {
  const { nicheId } = useParams();
  const niche = NICHE_PAGES.find(n => n.id === nicheId);

  if (!niche) return <div className="py-20 text-center text-gray-500">Page not found</div>;

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      <SEO title={niche.metaTitle} description={niche.metaDesc} />
      <nav className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-12">
        <Link to="/" className="hover:text-orange-500">Home</Link>
        <ArrowRight className="w-3 h-3" />
        <span className="text-orange-500">{niche.title}</span>
      </nav>

      <div className="space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-8">
          <Target className="w-8 h-8 text-orange-500" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-display">{niche.title}</h1>
        <p className="text-gray-400 text-xl leading-relaxed">{niche.description}</p>
      </div>

      <div className="grid gap-4">
        {niche.hooks.map((hook, i) => (
          <div key={i} className="bg-[#111318] border border-white/5 rounded-2xl p-6 flex items-center justify-between gap-6 group hover:border-orange-500/40 transition-all">
            <p className="text-gray-200 text-lg italic leading-relaxed">"{hook}"</p>
            <button 
              onClick={() => copyToClipboard(hook, `niche-${niche.id}-${i}`)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                copiedId === `niche-${niche.id}-${i}` 
                  ? "bg-emerald-500/10 text-emerald-500" 
                  : "bg-white/5 text-gray-500 hover:text-white"
              }`}
            >
              {copiedId === `niche-${niche.id}-${i}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedId === `niche-${niche.id}-${i}` ? "Copied" : "Copy"}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-3xl p-8 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          The Psychology Instead
        </h3>
        <p className="text-gray-400 leading-relaxed text-sm">{niche.psychology}</p>
      </div>

      <div className="py-20 text-center space-y-6 border-t border-white/5 mt-20">
        <h3 className="text-2xl font-bold text-white">Need Custom Hooks for Your Niche?</h3>
        <p className="text-gray-500">Our AI can generate unique variations for your specific video topic in seconds.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white font-bold rounded-2xl shadow-xl shadow-orange-500/20 hover:scale-[1.02] transition-all">
          Try the AI Hook Generator <Zap className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Viral");
  const [platform, setPlatform] = useState("YouTube");
  const [loading, setLoading] = useState(false);
  const [hooks, setHooks] = useState<GeneratedHooks | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const outputRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const result = await generateHooks(topic, tone, platform);
      setHooks(result);
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#0b0c0f] text-gray-200 selection:bg-orange-500/30 font-sans">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-[#0b0c0f]/80 backdrop-blur-md border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center transition-transform group-hover:scale-110">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white font-display">
                  HookForge <span className="text-orange-500">AI</span>
                </span>
              </Link>
              <div className="hidden lg:flex items-center gap-6">
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                  {NICHE_PAGES.map(page => (
                    <Link 
                      key={page.id} 
                      to={`/hooks-for-${page.id}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 hover:text-white hover:bg-white/5 transition-all uppercase tracking-tighter"
                    >
                      {page.id.split("-")[0]}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={
              <>
                <SEO 
                  title="YouTube Hook Generator | Free Viral Hook AI Tool" 
                  description="Generate 20 scroll-stopping YouTube hooks in seconds. The #1 free AI tool for creators to master viewer retention on YouTube, Shorts, and Reels." 
                />
                <ToolSection 
                  topic={topic} setTopic={setTopic} 
                  tone={tone} setTone={setTone} 
                  platform={platform} setPlatform={setPlatform} 
                  handleGenerate={handleGenerate} loading={loading} 
                  hooks={hooks} outputRef={outputRef} 
                  CATEGORY_META={CATEGORY_META} 
                  copyToClipboard={copyToClipboard} 
                  copiedId={copiedId} 
                />
                
                {/* FAQ & Bottom Content */}
                <div className="mt-32 space-y-20 border-t border-white/5 pt-20">
                  <section className="grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-1 space-y-4">
                      <h2 className="text-3xl font-bold text-white font-display">Engineered for <span className="text-orange-500">Attention</span></h2>
                      <p className="text-gray-500">HookForge isn't a text generator—it's a psychological simulation of your audience's curiosity gap.</p>
                      <div className="pt-4 flex flex-col gap-3">
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <Globe className="w-4 h-4 text-orange-500" /> Multi-Platform Support
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <Target className="w-4 h-4 text-orange-500" /> Psychological Frameworks
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <Share2 className="w-4 h-4 text-orange-500" /> Viral Strategy Guide
                        </div>
                      </div>
                    </div>
                    <div className="lg:col-span-2 bg-white/5 rounded-3xl p-8 border border-white/10">
                      <h3 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h3>
                      <div className="divide-y divide-white/5">
                        {FAQS.map((faq, i) => (
                          <CollapsibleFAQ key={i} faq={faq} />
                        ))}
                      </div>
                    </div>
                  </section>
                </div>
              </>
            } />
            <Route path="/hooks-for-:nicheId" element={<NichePage copyToClipboard={copyToClipboard} copiedId={copiedId} />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 mt-32 py-16 bg-black/40">
          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-orange-500" />
                <span className="text-xl font-bold text-white font-display">HookForge AI</span>
              </div>
              <p className="text-gray-500 max-w-sm leading-relaxed">
                Empowering storytellers to win the war for attention. 
                Optimized for the 2025 creator economy.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-widest text-orange-500">Niche Guides</h4>
              <nav className="flex flex-col gap-2">
                {NICHE_PAGES.map(p => (
                  <Link key={p.id} to={`/hooks-for-${p.id}`} className="text-gray-500 hover:text-white text-sm transition-colors">
                    Hooks for {p.id.split("-").join(" ")}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-widest text-orange-500">Legal</h4>
              <nav className="flex flex-col gap-2">
                <a href="#" className="text-gray-500 hover:text-white text-sm">Privacy</a>
                <a href="#" className="text-gray-500 hover:text-white text-sm">Terms</a>
                <span className="text-gray-800 text-xs mt-4 block">Built with Gemini 2.0</span>
              </nav>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-white/5 text-center text-[10px] uppercase font-bold tracking-[0.3em] text-gray-700">
            © 2026 HookForge AI · Master the Hook
          </div>
        </footer>
      </div>
    </Router>
  );
}
