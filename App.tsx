
import React, { useState, useEffect } from 'react';
import ZenCanvas from './components/ZenCanvas';
import { generateZenContent } from './services/geminiService';
import { ZenMode } from './types';
import { 
  Sparkles, 
  RefreshCw, 
  Trash2, 
  Info, 
  Wind,
  Settings2,
  Flower2 as LotusIcon,
  MessageCircle,
  X
} from 'lucide-react';

const App: React.FC = () => {
  const [trailText, setTrailText] = useState("一花一世界，一叶一菩提。春来花自青，秋至叶飘零。无穷般若心，自在观自在。");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [userPrompt, setUserPrompt] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  const handleGenerate = async (customPrompt?: string) => {
    setIsGenerating(true);
    const prompt = customPrompt || "Generate a short, evocative Zen poem about mindfulness and the beauty of white ink on a moonlit night.";
    const result = await generateZenContent(prompt);
    setTrailText(result);
    setHistory(prev => [result, ...prev].slice(0, 5));
    setIsGenerating(false);
    setUserPrompt("");
  };

  const clearCanvas = () => {
    setTrailText("虚空。");
  };

  return (
    <div className="relative min-h-screen font-['Noto_Serif_SC'] select-none overflow-hidden text-neutral-200">
      {/* Background Zen Canvas */}
      <ZenCanvas trailText={trailText} />

      {/* Floating UI Elements */}
      <div className="fixed top-8 left-8 z-20 pointer-events-none">
        <h1 className="text-4xl md:text-5xl font-['Ma_Shan_Zheng'] text-neutral-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] flex items-center gap-3">
          墨禅 <span className="text-xl md:text-2xl font-light opacity-40 tracking-widest font-serif text-white">MO ZEN</span>
        </h1>
        <p className="mt-2 text-neutral-400 text-sm max-w-xs leading-relaxed opacity-80">
          Find stillness in the moonlight. Each white stroke is a path to the void.
        </p>
      </div>

      {/* Bottom Hint */}
      <div className="fixed bottom-8 left-0 w-full flex justify-center z-10 pointer-events-none">
        <div className="bg-neutral-900/60 backdrop-blur-md px-6 py-2 rounded-full border border-neutral-800 shadow-xl flex items-center gap-2 text-neutral-400 text-sm animate-pulse">
          <Wind size={16} />
          <span>Move through the dark to reveal the light</span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="fixed top-8 right-8 z-30 flex flex-col gap-4">
        <button
          onClick={() => setShowChat(!showChat)}
          className={`p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 border border-neutral-700 ${
            showChat ? 'bg-white text-black' : 'bg-neutral-900/80 text-white backdrop-blur-md'
          }`}
          title="Ask the Zen Master"
        >
          <MessageCircle size={24} />
        </button>

        <button
          onClick={() => handleGenerate()}
          disabled={isGenerating}
          className="p-4 bg-neutral-900/80 backdrop-blur-md text-white rounded-full shadow-2xl hover:bg-neutral-800 transition-all duration-300 hover:scale-110 active:scale-95 border border-neutral-700"
          title="New Zen Insight"
        >
          <RefreshCw size={24} className={isGenerating ? 'animate-spin' : ''} />
        </button>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-4 bg-neutral-900/80 backdrop-blur-md text-white rounded-full shadow-2xl hover:bg-neutral-800 transition-all duration-300 hover:scale-110 active:scale-95 border border-neutral-700"
          title="Settings"
        >
          <Settings2 size={24} />
        </button>
      </div>

      {/* Chat / Interaction Overlay */}
      {showChat && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-neutral-950/95 backdrop-blur-2xl shadow-2xl z-40 border-l border-neutral-800 flex flex-col p-8 animate-in slide-in-from-right duration-300">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-neutral-100 flex items-center gap-2">
              <LotusIcon size={24} className="text-neutral-400" />
              Ask the Master
            </h2>
            <button onClick={() => setShowChat(false)} className="text-neutral-500 hover:text-neutral-300">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto mb-6 space-y-6">
            <div className="bg-neutral-900/50 p-4 rounded-2xl border border-neutral-800">
              <p className="text-neutral-400 italic text-sm">
                "In the darkness of the inkstone, the entire universe is hidden."
              </p>
            </div>

            {history.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-widest text-neutral-600 font-bold">Past Insights</h3>
                {history.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setTrailText(item)}
                    className="w-full text-left p-4 rounded-xl border border-neutral-800 hover:bg-neutral-900 transition-colors group"
                  >
                    <p className="text-neutral-300 text-sm line-clamp-2">{item}</p>
                    <span className="text-[10px] text-neutral-500 group-hover:text-neutral-400 mt-2 block">Apply to brush</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="What occupies your mind?"
              className="w-full p-4 bg-neutral-900 rounded-2xl border-none focus:ring-2 focus:ring-neutral-700 text-neutral-100 placeholder-neutral-600 resize-none h-32"
            />
            <button
              onClick={() => handleGenerate(userPrompt)}
              disabled={isGenerating || !userPrompt.trim()}
              className="w-full py-4 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              {isGenerating ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />}
              Manifest Light
            </button>
          </div>
        </div>
      )}

      {/* Simple Settings Overlay */}
      {showSettings && (
        <div className="fixed top-24 right-24 bg-neutral-950/95 backdrop-blur-md p-6 rounded-3xl shadow-2xl z-30 border border-neutral-800 w-64 animate-in fade-in zoom-in duration-200">
          <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-4 flex items-center gap-2">
            <Settings2 size={14} /> Brush Studio
          </h3>
          <div className="space-y-6">
             <button 
              onClick={clearCanvas}
              className="w-full py-3 px-4 flex items-center gap-3 text-neutral-300 hover:bg-neutral-900 rounded-xl transition-colors border border-neutral-800"
            >
              <Trash2 size={18} />
              <span>Clear Void</span>
            </button>
            <div className="pt-4 border-t border-neutral-800">
              <p className="text-xs text-neutral-600 leading-relaxed italic">
                White ink is the essence of stars in the dark night.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info Icon */}
      <div className="fixed bottom-8 right-8 z-30">
        <button className="text-neutral-700 hover:text-neutral-500 transition-colors">
          <Info size={20} />
        </button>
      </div>
    </div>
  );
};

export default App;
