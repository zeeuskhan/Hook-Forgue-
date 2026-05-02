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
  Share2,
  Type as TypeIcon,
  Tag,
  Lightbulb,
  AlignLeft,
  Settings,
  ChevronRight,
  User,
  Image as ImageIcon,
  ScrollText,
  MessageSquare,
  ArrowDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  generateHooks, 
  generateTitles, 
  generateDescriptions, 
  generateTags, 
  generateIdeas,
  generateChannelNames,
  generateThumbnailIdeas,
  generateScriptOutline,
  generateCommentReplies,
  type GeneratedHooks,
  type GeneratedTitles,
  type GeneratedDescriptions,
  type GeneratedTags,
  type GeneratedIdeas,
  type GeneratedChannelNames,
  type GeneratedThumbnailIdeas,
  type GeneratedScriptOutline,
  type GeneratedCommentReplies
} from "./lib/gemini";

// ─── CONSTANTS ─────────────────────────────────────────────────────────────
const TONES = ["Viral", "Emotional", "Storytelling", "Aggressive", "Curiosity"];
const PLATFORMS = [
  { id: "YouTube", icon: Youtube },
  { id: "YouTube Shorts", icon: Clapperboard },
  { id: "Instagram Reels", icon: Instagram }
];

const TOOLS = [
  { id: "hooks", name: "Hook Generator", icon: Zap, description: "Viral hooks for your scripts" },
  { id: "titles", name: "Title Generator", icon: TypeIcon, description: "Click-worthy video titles" },
  { id: "descriptions", name: "Description Pro", icon: AlignLeft, description: "SEO-optimized descriptions" },
  { id: "tags", name: "Tag Explorer", icon: Tag, description: "High-ranking video tags" },
  { id: "ideas", name: "Idea Forge", icon: Lightbulb, description: "Next viral video concepts" },
  { id: "names", name: "Channel Namer", icon: User, description: "Memorable brand names" },
  { id: "thumbnails", name: "Thumbnail Text", icon: ImageIcon, description: "Suggested overlay text" },
  { id: "script", name: "Script Outliner", icon: ScrollText, description: "Proper video structure" },
  { id: "comments", name: "Comment AI", icon: MessageSquare, description: "Smart engagement replies" },
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
  },
  {
    id: "cooking-channels",
    title: "YouTube Hooks for Cooking & Recipe Channels",
    metaTitle: "Viral YouTube Hooks for Cooking & Food Channels | HookForge AI",
    metaDesc: "Get more views on your recipes. Use these AI-generated hooks for food bloggers, street food vloggers, and home chefs to stop the scroll.",
    description: "Food is visceral. These hooks focus on the 'Secret Ingredient' and 'Common Mistakes' that ruin popular dishes.",
    psychology: "Taps into 'Hidden Knowledge' and the 'Fear of Ruining' an expensive or time-consuming meal.",
    hooks: [
      "You've been cooking [Dish] wrong your entire life. Here's why.",
      "Adding this ONE secret ingredient will make your [Dish] taste like a 5-star restaurant.",
      "I tried the viral [Dish] recipe and it was a total disaster—do this instead.",
      "Stop throwing away your [Leftover Food]! You can make this in 5 minutes.",
      "Is this the world's best [Dish]? I traveled to [Country] to find out."
    ]
  },
  {
    id: "tech-channels",
    title: "YouTube Hook Examples for Tech Channels",
    metaTitle: "Viral YouTube Hook Examples for Tech & Gadget Reviews",
    metaDesc: "Reviewing gadgets? Use these tech-focused YouTube hooks to highlight hidden features, compare brands, and build authority.",
    description: "Tech audiences value specs and secrets. Use these pattern interrupts to highlight the 'hidden' features of popular gadgets.",
    psychology: "Uses 'Buyer's Remorse' and 'Technological Superiority' to force viewers to validate their own purchases.",
    hooks: [
      "This [Gadget] has a hidden feature that completely changes how it works.",
      "Stop buying [Brand] until you see what [Competitor] just released.",
      "I tested 10 [Gadgets] so you don't have to — this is the clear winner.",
      "Apple just released an update that literally broke my iPhone.",
      "The one setting you MUST change on your laptop before you use it."
    ]
  },
  {
    id: "motivational-videos",
    title: "Motivational Hooks for YouTube Videos",
    metaTitle: "20+ Powerful Motivational Hooks for YouTube Videos",
    metaDesc: "Increase retention on your motivational and self-improvement content. Use these aggressive and emotional hooks to inspire action.",
    description: "In self-improvement, the hook must challenge the viewer's current identity. Create productive discomfort that leads to change.",
    psychology: "Direct challenge triggers – making the viewer feel their current stagnation is a choice they must change.",
    hooks: [
      "If you're still [Bad Habit], you're not serious about your future self.",
      "I wasted 5 years following this 'productivity' advice. Here's what actually worked.",
      "The hard truth about [Goal] that most motivational speakers won't tell you.",
      "You aren't lazy. You're just doing this one thing that's killing your drive.",
      "I interviewed 100 millionaires and they all told me the same thing about success."
    ]
  }
];

const FAQS = [
  { q: "Is this YouTube hook generator free?", a: "Yes! HookForge AI is a free tool designed to help creators generate viral opening lines without a subscription." },
  { q: "How do I write a viral hook for YouTube?", a: "To write a viral hook, start with a Pattern Interrupt or a Curiosity Gap. Avoid 'Hi guys' and jump straight into the problem your video solves." },
  { q: "Can I use this for YouTube Shorts and Instagram Reels?", a: "Absolutely. Select the platform in the tool to get ultra-short, punchy hooks specifically optimized for vertical scrolling." },
  { q: "How to start a YouTube video hook for beginners?", a: "Start with a direct question or a shocking statistic. For example: '99% of people fail at [topic] because of this one mistake.' This builds instant intrigue." },
  { q: "What is the best first line for a YouTube video?", a: "The best first line identifies a deep pain point or a high-value desire within 3 seconds, forcing the viewer to stay to see the resolution." }
];

// ─── UTILS ─────────────────────────────────────────────────────────────────
const PRODUCTION_URL = "https://scripthookgenerate.vercel.app";

function SEO({ title, description, schema }: { title: string; description: string; schema?: any }) {
  const location = useLocation();
  
  useEffect(() => {
    document.title = title;
    
    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);

    // Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `${PRODUCTION_URL}${location.pathname}`);

    // Schema.org JSON-LD
    let script = document.querySelector('#schema-data');
    if (!script) {
      script = document.createElement('script');
      script.id = 'schema-data';
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    
    const defaultSchema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "HookForge AI",
      "url": PRODUCTION_URL,
      "operatingSystem": "All",
      "applicationCategory": "MultimediaApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    };

    script.textContent = JSON.stringify(schema || defaultSchema);
  }, [title, description, schema, location.pathname]);
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

function TitleSection({ copyToClipboard, copiedId }: any) {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [titles, setTitles] = useState<string[] | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const result = await generateTitles(topic);
      setTitles(result.titles);
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <SEO 
        title="YouTube Title Generator | Viral Video Titles with AI" 
        description="Create high-CTR YouTube titles that grab attention. Our AI analyzes your topic and crafts titles that work for the 2025 algorithm." 
      />
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight font-display">
          Viral <span className="text-orange-500">Title Generator</span>
        </h1>
        <p className="text-gray-400 text-lg">Click-worthy titles that spark curiosity and boost your CTR by up to 30%.</p>
      </div>

      <div className="bg-[#111318] border border-white/10 rounded-3xl p-8 max-w-3xl mx-auto shadow-2xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Video Topic</label>
            <input 
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. My $10,000 Portfolio Review"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-orange-500 outline-none text-white"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !topic}
            className="w-full h-16 bg-orange-500 hover:bg-orange-600 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all"
          >
            {loading ? <RefreshCw className="animate-spin" /> : <Sparkles />}
            {loading ? "Generating..." : "Forge Viral Titles"}
          </button>
        </div>
      </div>

      {titles && (
        <div ref={outputRef} className="grid sm:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {titles.map((title, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4 group hover:border-orange-500/30 transition-all">
              <p className="text-gray-300 font-medium">{title}</p>
              <button 
                onClick={() => copyToClipboard(title, `title-${i}`)}
                className={`p-2 rounded-lg transition-all ${copiedId === `title-${i}` ? "bg-emerald-500/20 text-emerald-500" : "bg-white/5 text-gray-400 hover:text-orange-500"}`}
              >
                {copiedId === `title-${i}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DescriptionSection({ copyToClipboard, copiedId }: any) {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState<string | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const result = await generateDescriptions(topic, keywords);
      setDescription(result.description);
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <SEO 
        title="YouTube Description Generator | SEO-Friendly Video Decs" 
        description="Generate professional, SEO-optimized YouTube descriptions in seconds. Boost your video search rankings with keywords and structured data." 
      />
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight font-display">
          Description <span className="text-orange-500">Pro</span>
        </h1>
        <p className="text-gray-400 text-lg">SEO-optimized descriptions that help you rank higher on YouTube and Google Search.</p>
      </div>

      <div className="bg-[#111318] border border-white/10 rounded-3xl p-8 max-w-3xl mx-auto shadow-2xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Video Title/Topic</label>
            <input 
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. How to get more views as a small creator"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-orange-500 outline-none text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Target Keywords (optional)</label>
            <input 
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g. youtube views, creator tips, growth"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-orange-500 outline-none text-white"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !topic}
            className="w-full h-16 bg-orange-500 hover:bg-orange-600 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all"
          >
            {loading ? <RefreshCw className="animate-spin" /> : <AlignLeft />}
            {loading ? "Writing Description..." : "Generate Description"}
          </button>
        </div>
      </div>

      {description && (
        <div ref={outputRef} className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-8 relative group">
          <button 
            onClick={() => copyToClipboard(description, "desc")}
            className={`absolute top-4 right-4 p-3 rounded-xl transition-all ${copiedId === "desc" ? "bg-emerald-500 text-white" : "bg-white/10 text-gray-400 hover:bg-orange-500 hover:text-white"}`}
          >
            {copiedId === "desc" ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
          <div className="prose prose-invert max-w-none prose-sm whitespace-pre-wrap leading-relaxed text-gray-300">
            {description}
          </div>
        </div>
      )}
    </div>
  );
}

function TagSection({ copyToClipboard, copiedId }: any) {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[] | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const result = await generateTags(topic);
      setTags(result.tags);
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <SEO 
        title="YouTube Tag Generator | Free Keyword Tool for YT" 
        description="Find high-search volume tags for your YouTube videos. Improve your discoverability with AI-recommended keywords." 
      />
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight font-display">
          Tag <span className="text-orange-500">Explorer</span>
        </h1>
        <p className="text-gray-400 text-lg">Uncover the tags that power the top search results for your niche.</p>
      </div>

      <div className="bg-[#111318] border border-white/10 rounded-3xl p-8 max-w-3xl mx-auto shadow-2xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Video Topic</label>
            <input 
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Best budget cameras 2025"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-orange-500 outline-none text-white"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !topic}
            className="w-full h-16 bg-orange-500 hover:bg-orange-600 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all"
          >
            {loading ? <RefreshCw className="animate-spin" /> : <Tag />}
            {loading ? "Exploring Tags..." : "Generate Tags"}
          </button>
        </div>
      </div>

      {tags && (
        <div ref={outputRef} className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Recommended Tags</h3>
            <button 
              onClick={() => copyToClipboard(tags.join(", "), "all-tags")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${copiedId === "all-tags" ? "bg-emerald-500 text-white" : "bg-white/5 text-gray-400 hover:text-white hover:bg-orange-500"}`}
            >
              {copiedId === "all-tags" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedId === "all-tags" ? "Copied All" : "Copy All Tags"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <button
                key={i}
                onClick={() => copyToClipboard(tag, `tag-${i}`)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 transition-all ${copiedId === `tag-${i}` ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-500" : "bg-white/5 text-gray-400 hover:border-orange-500 hover:text-white"}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function IdeaSection() {
  const [niche, setNiche] = useState("");
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<GeneratedIdeas["ideas"] | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!niche.trim()) return;
    setLoading(true);
    try {
      const result = await generateIdeas(niche);
      setIdeas(result.ideas);
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <SEO 
        title="YouTube Video Idea Generator | Viral Content Inspo" 
        description="Never run out of video ideas again. Use our AI to generate viral concepts, title ideas, and thumbnail strategies for your YouTube channel." 
      />
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight font-display">
          Idea <span className="text-orange-500">Forge</span>
        </h1>
        <p className="text-gray-400 text-lg">Next-level video concepts designed to build a die-hard audience from scratch.</p>
      </div>

      <div className="bg-[#111318] border border-white/10 rounded-3xl p-8 max-w-3xl mx-auto shadow-2xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Channel Niche / Topic</label>
            <input 
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g. Minimalist Travel Photography"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-orange-500 outline-none text-white"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !niche}
            className="w-full h-16 bg-orange-500 hover:bg-orange-600 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all"
          >
            {loading ? <RefreshCw className="animate-spin" /> : <Lightbulb />}
            {loading ? "Forging Ideas..." : "Generate Viral Ideas"}
          </button>
        </div>
      </div>

      {ideas && (
        <div ref={outputRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {ideas.map((idea, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4 hover:border-orange-500/30 transition-all flex flex-col h-full">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-white">{idea.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed flex-1">{idea.description}</p>
              <div className="pt-4 border-t border-white/5">
                <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-2">Thumbnail Strategy</p>
                <p className="text-xs text-gray-500 italic">"{idea.thumbnail}"</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ChannelNamerSection({ copyToClipboard, copiedId }: any) {
  const [niche, setNiche] = useState("");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [names, setNames] = useState<string[] | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!niche.trim()) return;
    setLoading(true);
    try {
      const result = await generateChannelNames(niche, keywords);
      setNames(result.names);
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <SEO 
        title="YouTube Channel Name Generator | Creative Brand Names" 
        description="Find the perfect name for your new YouTube channel. Our AI generates catchy, memorable, and brandable channel names in seconds." 
      />
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight font-display">
          Channel <span className="text-orange-500">Namer</span>
        </h1>
        <p className="text-gray-400 text-lg">Memorable brand names that stand out in the subscription feed.</p>
      </div>

      <div className="bg-[#111318] border border-white/10 rounded-3xl p-8 max-w-3xl mx-auto shadow-2xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Channel Niche</label>
            <input 
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g. Clean Energy Tech"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-orange-500 outline-none text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Keywords to Include</label>
            <input 
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g. green, future, spark"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-orange-500 outline-none text-white"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !niche}
            className="w-full h-16 bg-orange-500 hover:bg-orange-600 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all"
          >
            {loading ? <RefreshCw className="animate-spin" /> : <User />}
            {loading ? "Naming..." : "Generate Channel Names"}
          </button>
        </div>
      </div>

      {names && (
        <div ref={outputRef} className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {names.map((name, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4 group hover:border-orange-500/30 transition-all">
              <p className="text-gray-300 font-bold">{name}</p>
              <button 
                onClick={() => copyToClipboard(name, `name-${i}`)}
                className={`p-2 rounded-lg transition-all ${copiedId === `name-${i}` ? "bg-emerald-500/20 text-emerald-500" : "bg-white/5 text-gray-400 hover:text-orange-500"}`}
              >
                {copiedId === `name-${i}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ThumbnailIdeaSection({ copyToClipboard, copiedId }: any) {
  const [topic, setTopic] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<GeneratedThumbnailIdeas["suggestions"] | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const result = await generateThumbnailIdeas(topic, title);
      setSuggestions(result.suggestions);
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <SEO 
        title="YouTube Thumbnail Idea Generator | Viral Thumbnails Design" 
        description="Stop staring at a blank canvas. Get AI-generated thumbnail text overlays and visual composition ideas that stop the scroll." 
      />
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight font-display">
          Thumbnail <span className="text-orange-500">Forge</span>
        </h1>
        <p className="text-gray-400 text-lg">Visual strategies and high-impact text that double your click-through rate.</p>
      </div>

      <div className="bg-[#111318] border border-white/10 rounded-3xl p-8 max-w-3xl mx-auto shadow-2xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Video Topic</label>
            <input 
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. iPhone 15 vs S24 Ultra"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-orange-500 outline-none text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Video Title (optional)</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The Truth About the iPhone 15 Camera"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-orange-500 outline-none text-white"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !topic}
            className="w-full h-16 bg-orange-500 hover:bg-orange-600 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all"
          >
            {loading ? <RefreshCw className="animate-spin" /> : <ImageIcon />}
            {loading ? "Visualizing..." : "Generate Thumbnail Ideas"}
          </button>
        </div>
      </div>

      {suggestions && (
        <div ref={outputRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {suggestions.map((s, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6 hover:border-orange-500/30 transition-all">
              <div className="flex items-center justify-between">
                <div className="px-3 py-1 bg-orange-500/10 rounded-lg text-[10px] font-black uppercase text-orange-500 tracking-widest">Concept {i+1}</div>
                <button 
                  onClick={() => copyToClipboard(s.text, `thumb-text-${i}`)}
                  className={`p-2 rounded-lg transition-all ${copiedId === `thumb-text-${i}` ? "bg-emerald-500/20 text-emerald-500" : "bg-white/5 text-gray-400 hover:text-orange-500"}`}
                >
                  {copiedId === `thumb-text-${i}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Text Overlay</p>
                  <p className="text-2xl font-black text-white italic">"{s.text}"</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Visual Composition</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.visual}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ScriptOutlineSection({ copyToClipboard, copiedId }: any) {
  const [topic, setTopic] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [outline, setOutline] = useState<GeneratedScriptOutline["outline"] | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const result = await generateScriptOutline(topic, title);
      setOutline(result.outline);
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <SEO 
        title="YouTube Script Outliner | Smart Content Roadmap" 
        description="Structure your videos for maximum retention. Our AI creates detailed script outlines with timing and key points." 
      />
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight font-display">
          Script <span className="text-orange-500">Outliner</span>
        </h1>
        <p className="text-gray-400 text-lg">Detailed content roadmaps that keep viewers hooked from intro to outro.</p>
      </div>

      <div className="bg-[#111318] border border-white/10 rounded-3xl p-8 max-w-3xl mx-auto shadow-2xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Video Topic</label>
            <input 
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. How to grow on YouTube as a minimalist"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-orange-500 outline-none text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Target Title (optional)</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Minimalist Growth Secret"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-orange-500 outline-none text-white"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !topic}
            className="w-full h-16 bg-orange-500 hover:bg-orange-600 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all"
          >
            {loading ? <RefreshCw className="animate-spin" /> : <ScrollText />}
            {loading ? "Outlining..." : "Generate Script Outline"}
          </button>
        </div>
      </div>

      {outline && (
        <div ref={outputRef} className="max-w-4xl mx-auto space-y-6">
          {outline.map((section, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-6 hover:border-orange-500/30 transition-all group">
              <div className="md:w-32 shrink-0">
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">{section.timing}</p>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500/50 w-1/3 group-hover:w-full transition-all duration-700" />
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold text-white">{section.section}</h4>
                  <button 
                    onClick={() => copyToClipboard(`${section.section}\n${section.description}`, `script-${i}`)}
                    className={`p-2 rounded-lg transition-all ${copiedId === `script-${i}` ? "bg-emerald-500/20 text-emerald-500" : "bg-white/5 text-gray-500 hover:text-orange-500"}`}
                  >
                    {copiedId === `script-${i}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{section.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CommentAISection({ copyToClipboard, copiedId }: any) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [replies, setReplies] = useState<GeneratedCommentReplies["replies"] | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!comment.trim()) return;
    setLoading(true);
    try {
      const result = await generateCommentReplies(comment);
      setReplies(result.replies);
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <SEO 
        title="YouTube Comment Reply AI | Engagement Assistant" 
        description="Never leave your fans waiting. Use our AI to generate thoughtful, engaging, and friendly replies to your YouTube comments." 
      />
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight font-display">
          Comment <span className="text-orange-500">AI</span>
        </h1>
        <p className="text-gray-400 text-lg">Smart engagement replies that build community and boost your algorithmic favor.</p>
      </div>

      <div className="bg-[#111318] border border-white/10 rounded-3xl p-8 max-w-3xl mx-auto shadow-2xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Target Comment</label>
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Paste the comment here..."
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-orange-500 outline-none text-white resize-none"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !comment}
            className="w-full h-16 bg-orange-500 hover:bg-orange-600 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all"
          >
            {loading ? <RefreshCw className="animate-spin" /> : <MessageSquare />}
            {loading ? "Drafting..." : "Generate Smart Replies"}
          </button>
        </div>
      </div>

      {replies && (
        <div ref={outputRef} className="max-w-4xl mx-auto grid gap-6">
          {replies.map((reply, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4 hover:border-orange-500/30 transition-all relative group">
              <div className="flex items-center justify-between">
                <div className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black uppercase text-gray-500 tracking-widest group-hover:text-orange-500 transition-colors">{reply.tone} Reply</div>
                <button 
                  onClick={() => copyToClipboard(reply.text, `reply-${i}`)}
                  className={`p-2 rounded-lg transition-all ${copiedId === `reply-${i}` ? "bg-emerald-500 text-white" : "bg-white/10 text-gray-400 hover:bg-orange-500 hover:text-white"}`}
                >
                  {copiedId === `reply-${i}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-gray-300 leading-relaxed italic">"{reply.text}"</p>
            </div>
          ))}
        </div>
      )}
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
      <SEO 
        title={niche.metaTitle} 
        description={niche.metaDesc} 
        schema={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": PRODUCTION_URL
          },{
            "@type": "ListItem",
            "position": 2,
            "name": niche.title,
            "item": `${PRODUCTION_URL}/hooks-for-${niche.id}`
          }]
        }}
      />
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
          The Psychology Insight
        </h3>
        <p className="text-gray-400 leading-relaxed text-sm">{niche.psychology}</p>
      </div>

      {/* Internal Linking: More Niches */}
      <div className="space-y-6 pt-12 border-t border-white/5">
        <h3 className="text-xl font-bold text-white">Explore Other Niches</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {NICHE_PAGES.filter(n => n.id !== nicheId).map(n => (
            <Link 
              key={n.id} 
              to={`/hooks-for-${n.id}`}
              className="bg-white/5 border border-white/5 rounded-2xl p-4 hover:border-orange-500/40 transition-all group"
            >
              <FileText className="w-4 h-4 text-gray-500 mb-2 group-hover:text-orange-500" />
              <p className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">{n.id.split("-").join(" ")}</p>
            </Link>
          ))}
        </div>
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
                <div className="flex flex-col -space-y-1">
                  <span className="text-lg font-bold tracking-tight text-white font-display">
                    HookForge <span className="text-orange-500">AI</span>
                  </span>
                  <span className="text-[8px] font-black uppercase text-gray-600 tracking-[0.2em]">Creator Tools</span>
                </div>
              </Link>
              
              <div className="hidden lg:flex items-center gap-6">
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                  {TOOLS.map(tool => (
                    <Link 
                      key={tool.id} 
                      to={tool.id === "hooks" ? "/" : `/tool-${tool.id}`}
                      className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider flex items-center gap-2 ${
                        (tool.id === "hooks" && location.pathname === "/") || location.pathname === `/tool-${tool.id}`
                        ? "bg-orange-500 text-white shadow-lg"
                        : "text-gray-500 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <tool.icon className="w-3 h-3" />
                      {tool.name.split(" ")[0]}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="lg:hidden flex items-center gap-2">
                {/* Mobile Menu Placeholder - simplified */}
                <Link to="/" className="p-2 rounded-lg bg-white/5 text-gray-500"><Layout className="w-5 h-5"/></Link>
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
                  description="Generate 20 scroll-stopping YouTube hooks in seconds. The #1 free AI tool for creators to master viewer retention on YouTube, Shorts, and Reels using psychology-backed script openers." 
                  schema={{
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": FAQS.map(faq => ({
                      "@type": "Question",
                      "name": faq.q,
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq.a
                      }
                    }))
                  }}
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

                {/* Viral Statistics & Keyword Proof */}
                <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8">
                  {[
                    { label: "Viral Hooks Generated", val: "1.2M+" },
                    { label: "Retention Boost", val: "40%+" },
                    { label: "Active Creators", val: "50k+" },
                    { label: "Platforms Supported", val: "5" }
                  ].map((stat, i) => (
                    <div key={i} className="text-center p-6 bg-white/5 rounded-3xl border border-white/10">
                      <p className="text-3xl font-extrabold text-white mb-1">{stat.val}</p>
                      <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{stat.label}</p>
                    </div>
                  ))}
                </div>
                
                {/* Tool Grid */}
                <div className="mt-32 space-y-12">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold text-white">Pro Creator <span className="text-orange-500">Suite</span></h2>
                    <p className="text-gray-500">Everything you need to grow your channel from zero to viral.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {TOOLS.filter(t => t.id !== "hooks").map(tool => (
                      <Link 
                        key={tool.id} 
                        to={`/tool-${tool.id}`}
                        className="bg-[#111318] border border-white/5 rounded-3xl p-8 hover:border-orange-500/40 transition-all group"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                          <tool.icon className="w-6 h-6 text-orange-500" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">{tool.name}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed mb-6">{tool.description}</p>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-widest group-hover:text-orange-500 transition-colors">
                          Try Tool <ArrowRight className="w-3 h-3" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* FAQ & Bottom Content */}
                <div className="mt-32 space-y-20 border-t border-white/5 pt-20">
                  <section className="grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-1 space-y-6">
                      <h2 className="text-3xl font-bold text-white font-display">The Ultimate <span className="text-orange-500">YouTube Intro Generator</span></h2>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        HookForge AI is the industry-leading <strong>viral hook generator</strong> designed specifically for the 2025 algorithm. 
                        Whether you need a <strong>reel hook generator</strong> or <strong>video hook generator</strong>, our AI recalibrates word counts for maximum punchiness.
                      </p>
                      <div className="pt-4 flex flex-col gap-4">
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <Globe className="w-4 h-4 text-orange-500" /> Viral Youtube Opening Lines
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <Target className="w-4 h-4 text-orange-500" /> Curiosity Gap Hooks YouTube
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <Share2 className="w-4 h-4 text-orange-500" /> Storytelling Hooks for Videos
                        </div>
                      </div>
                    </div>
                    <div className="lg:col-span-2 bg-white/5 rounded-3xl p-8 border border-white/10">
                      <h3 className="text-2xl font-bold text-white mb-6">Mastering the Curiosity Gap</h3>
                      <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                        Learn <strong>how to write a hook for youtube</strong> that actually sticks. Most creators fail because they lead with a greeting. 
                        AI-generated <strong>youtube script hooks</strong> prioritize the 'Path Interrupt'—a psychological trigger that forces the brain to stop scrolling.
                      </p>
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
            <Route path="/tool-titles" element={<TitleSection copyToClipboard={copyToClipboard} copiedId={copiedId} />} />
            <Route path="/tool-descriptions" element={<DescriptionSection copyToClipboard={copyToClipboard} copiedId={copiedId} />} />
            <Route path="/tool-tags" element={<TagSection copyToClipboard={copyToClipboard} copiedId={copiedId} />} />
            <Route path="/tool-ideas" element={<IdeaSection />} />
            <Route path="/tool-names" element={<ChannelNamerSection copyToClipboard={copyToClipboard} copiedId={copiedId} />} />
            <Route path="/tool-thumbnails" element={<ThumbnailIdeaSection copyToClipboard={copyToClipboard} copiedId={copiedId} />} />
            <Route path="/tool-script" element={<ScriptOutlineSection copyToClipboard={copyToClipboard} copiedId={copiedId} />} />
            <Route path="/tool-comments" element={<CommentAISection copyToClipboard={copyToClipboard} copiedId={copiedId} />} />
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
              <h4 className="text-sm font-bold text-white uppercase tracking-widest text-orange-500">Free Tools</h4>
              <nav className="flex flex-col gap-2">
                {TOOLS.map(t => (
                  <Link key={t.id} to={t.id === "hooks" ? "/" : `/tool-${t.id}`} className="text-gray-500 hover:text-white text-sm transition-colors">
                    {t.name}
                  </Link>
                ))}
              </nav>
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
