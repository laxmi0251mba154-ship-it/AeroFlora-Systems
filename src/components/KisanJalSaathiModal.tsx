import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Languages,
  RefreshCw,
  Droplets,
  ShieldCheck,
  Sprout,
  Compass,
} from 'lucide-react';
import { SupportedLanguage } from '../utils/i18n';

interface KisanJalSaathiModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: SupportedLanguage;
  contextData?: {
    district?: string;
    crop?: string;
    acres?: number;
    dailyHarvestLiters?: number;
  };
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const PRESET_QUERIES = [
  {
    en: 'How many towers are needed for 2 acres of Pomegranate in Barmer?',
    hi: 'बाड़मेर में 2 एकड़ अनार के लिए कितने टावरों की आवश्यकता होगी?',
  },
  {
    en: 'Why is my borewell water causing white salt crust on the soil?',
    hi: 'मेरे बोरवेल के पानी से मिट्टी पर सफेद नमक की पपड़ी क्यों जम रही है?',
  },
  {
    en: 'What subsidy is available under PM-KUSUM Component B?',
    hi: 'पीएम-कुसुम कंपोनेंट B के तहत कितनी सब्सिडी उपलब्ध है?',
  },
  {
    en: 'How does MOF-801 capture moisture at 18% relative humidity?',
    hi: 'MOF-801 18% आर्द्रता पर हवा से पानी कैसे सोखता है?',
  },
];

export const KisanJalSaathiModal: React.FC<KisanJalSaathiModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  contextData,
}) => {
  const [language, setLanguage] = useState<'en' | 'hi'>(currentLanguage === 'hi' ? 'hi' : 'en');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text:
        language === 'hi'
          ? 'नमस्ते किसान भाई! मैं "किसान जल साथी" (Kisan Jal Saathi) हूँ — आपका कृषि जल व मौसम बुद्धिमत्ता सहायक। आप मुझसे एरोफ्लोरा टावर, फसलों की सिंचाई आवश्यकता (FAO-56), जल गुणवत्ता (SAR/RSC) या पीएम-कुसुम सब्सिडी के बारे में कोई भी सवाल पूछ सकते हैं।'
          : 'Namaste! I am "Kisan Jal Saathi", your AgriTech water intelligence assistant for AeroFlora Systems. Ask me anything about atmospheric water harvesting, crop evapotranspiration (FAO-56), water quality (SAR/RSC), or PM-KUSUM capital subsidies.',
      timestamp: 'Just now',
    },
  ]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Attempt server-side Gemini endpoint
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language,
          context: contextData,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error('Server AI route unavailable');
      }
    } catch {
      // Intelligent Agronomic Knowledge Fallback (Guaranteed to work everywhere including static Vercel)
      const fallbackReply = generateAgronomicKnowledgeResponse(query, language, contextData);
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col h-[640px] max-h-[90vh] overflow-hidden">
        {/* Top Bar */}
        <div className="p-4 bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <Bot className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">Kisan Jal Saathi (किसान जल साथी)</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-300 font-semibold">
                  AI AgriTech
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80">
                Farm Water Intelligence · Powered by AeroFlora Engineering
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="px-2.5 py-1 text-xs font-semibold bg-white/10 hover:bg-white/20 rounded-lg text-emerald-100 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'हिन्दी में बदलें' : 'Switch to English'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat History Stage */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs leading-relaxed ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-3.5 rounded-2xl whitespace-pre-line shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-emerald-700 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}
              >
                {msg.text}
                <span
                  className={`block text-[10px] mt-1.5 font-mono ${
                    msg.sender === 'user' ? 'text-emerald-200 text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 text-xs justify-start">
              <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 bg-white text-slate-500 border border-slate-200 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                <span>Kisan Jal Saathi is analyzing hydro-climatic data...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Suggested:
          </span>
          {PRESET_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(language === 'hi' ? q.hi : q.en)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg whitespace-nowrap transition-colors cursor-pointer border border-slate-200 shrink-0"
            >
              {language === 'hi' ? q.hi : q.en}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={
              language === 'hi'
                ? 'यहाँ अपना सवाल लिखें (जैसे: अनार के लिए कितने टावर चाहिए?)...'
                : 'Ask Kisan Jal Saathi (e.g. How many towers for my pomegranate crop?)...'
            }
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputMessage.trim() || isLoading}
            className="p-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl transition-colors cursor-pointer shadow"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Comprehensive Agronomic & Engineering Knowledge Engine Fallback
function generateAgronomicKnowledgeResponse(
  query: string,
  lang: 'en' | 'hi',
  context?: { district?: string; crop?: string; acres?: number }
): string {
  const q = query.toLowerCase();

  // 1. Pomegranate or Tree-Nut Acreage Sizing
  if (q.includes('pomegranate') || q.includes('अनार') || q.includes('tower') || q.includes('टावर')) {
    if (lang === 'hi') {
      return `📊 **अनार (भगवा) हेतु एरोफ्लोरा टावर आकलन:**
• 2 एकड़ अनार के बगीचे (लगभग 350-400 पेड़) को फल विकास चरण (Fruit Development) में प्रतिदिन लगभग 1,200 से 1,800 लीटर पूरक जल की आवश्यकता होती है।
• **अनुशंसित टावर संख्या:** **2 से 3 एरोफ्लोरा टावर**।
• प्रत्येक टावर (200 किग्रा MOF-801 अधिशोषक सहित) शुष्क मौसम में औसतन 450 लीटर/दिन शुद्ध खनिजयुक्त पानी देता है।
• 2 टावर मिलकर प्रतिदिन **900 लीटर** उच्च-गुणवत्ता (TDS <200 ppm, SAR <1.5) पानी सीधे रूट ड्रिपर्स को देते हैं, जिससे फल फटने (Cracking) का खतरा 90% तक कम हो जाता है।`;
    }
    return `📊 **Pomegranate (Bhagwa) Sizing Assessment:**
• A 2-acre pomegranate orchard (~380 trees) during the critical fruit-sizing phase requires approximately 1,400 to 1,800 L/day of supplemental high-precision root hydration.
• **Recommended Fleet:** **2 to 3 AeroFlora Mk-IV Towers**.
• Each tower with 200 kg of MOF-801 produces an engineered validation target of ~450 L/day under typical arid conditions.
• 2 towers provide **900 L/day** of remineralized, non-saline water (SAR < 1.5, zero toxic boron) directly into micro-drippers, eliminating heat-induced fruit cracking.`;
  }

  // 2. White Crust / Salinity / Borewell
  if (q.includes('salt') || q.includes('crust') || q.includes('नमक') || q.includes('borewell') || q.includes('बोरवेल') || q.includes('sar')) {
    if (lang === 'hi') {
      return `⚠️ **मिट्टी पर सफेद पपड़ी का कारण व निदान:**
• गहरा बोरवेल पानी अक्सर उच्च सोडियम (High Sodium), क्लोराइड और अवशिष्ट सोडियम कार्बोनेट (RSC > 2.5 meq/L) से ग्रस्त होता है। जब यह पानी सूखता है, तो मिट्टी की ऊपरी सतह पर क्षारीय नमक की सफेद परत जम जाती है।
• **हानि:** इससे मिट्टी की जल सोखने की क्षमता खत्म हो जाती है और जड़ों का विकास रुक जाता है।
• **एरोफ्लोरा समाधान:** एरोफ्लोरा का पानी हवा से संघनित होता है, जिसमें नमक शून्य होता है (EC ~0.3 dS/m)। यह बोरवेल के खारे पानी को डाइल्यूट (कम खारा) करने और ड्रिप लाइनों को साफ रखने के लिए आदर्श है।`;
    }
    return `⚠️ **Cause of White Soil Encrustation & Solution:**
• The white crust is caused by high Sodium Adsorption Ratio (SAR > 6) and high Residual Sodium Carbonate (RSC > 2.5 meq/L) in deep borewell water. As water evaporates in high heat, sodium salts precipitate on the topsoil, causing soil dispersion and crusting.
• **Agronomic Impact:** Seals the root zone, suffocates capillary aeration, and causes tip burn on leaves.
• **AeroFlora Advantage:** Harvested atmospheric moisture is completely salt-free (EC ~0.3 dS/m, TDS ~180 ppm post-mineralization). Blending it with borewell water leaches toxic sodium salts away from the rhizosphere.`;
  }

  // 3. PM-KUSUM Subsidy
  if (q.includes('subsidy') || q.includes('kusum') || q.includes('सब्सिडी') || q.includes('योजना') || q.includes('pm')) {
    if (lang === 'hi') {
      return `🏛️ **पीएम-कुसुम (PM-KUSUM) व सरकारी सहायता विवरण:**
1. **केंद्रीय सहायता (कम्पोनेंट B):** गैर-ग्रिड सौर कृषि अवसंरचना के तहत 30% सीधी केंद्रीय सब्सिडी।
2. **राज्य सरकार टॉप-अप:** राजस्थान, गुजरात और महाराष्ट्र में शुष्क बागवानी हेतु अतिरिक्त 20% अनुदान।
3. **कुल सब्सिडी लाभ:** कुल पूंजीगत लागत (CapEx) पर **50% तक की छूट**।
4. **किसान अंशदान:** शेष 50% राशि किसान क्रेडिट कार्ड (KCC) अथवा नाबार्ड कृषि सावधि ऋण (NABARD Term Loan) से 5 वर्ष की आसान किश्तों में वित्तपोषित की जा सकती है।`;
    }
    return `🏛️ **PM-KUSUM Scheme & Subsidy Breakdown:**
1. **Central Financial Assistance (Component B):** 30% direct benchmark capital subsidy for off-grid standalone solar agro-infrastructure.
2. **State Government Grant:** Additional 20% arid horticulture top-up grant in states like Rajasthan (Jodhpur/Barmer) and Gujarat (Banaskantha/Kutch).
3. **Net Farmer Share:** Only **50% of gross CapEx** needs to be borne by the farmer or FPO cooperative.
4. **Bank Financing:** Eligible for 5-year NABARD/SBI agricultural term loans at priority sector interest rates.`;
  }

  // 4. MOF-801 Physics & Low RH
  if (q.includes('mof') || q.includes('humidity') || q.includes('आर्द्रता') || q.includes('physics')) {
    if (lang === 'hi') {
      return `🔬 **MOF-801 की अधिशोषण कार्यप्रणाली (18% आर्द्रता पर):**
• MOF-801 (ज़िरकोनियम-फ्यूमरेट) में प्रति ग्राम 1,000 वर्ग मीटर से अधिक आंतरिक छिद्र सतह होती है।
• **टाइप-IV आइसोथर्म:** पारंपरिक सिलिका जेल कम नमी (<30%) पर पानी नहीं सोख पाता, लेकिन MOF-801 10%-20% RH पर भी हवा से जलवाष्प अणुओं को अपनी छिद्र नलिकाओं में बांध लेता है।
• **सौर पुनरुत्थान:** दिन में केवल 65°C से 80°C सौर ताप पर यह सोखा हुआ सारा पानी भाप बनकर छोड़ देता है, जिसे पैसिव प्लेटों पर इकट्ठा कर लिया जाता है।`;
    }
    return `🔬 **MOF-801 Sorption Physics under Hyper-Arid Regimes:**
• MOF-801 (Zirconium-fumarate) features sub-nanometer hydrophilic pore apertures (0.8 nm) and an internal surface area exceeding 1,000 m²/g.
• **Type-IV Isotherm:** While traditional silica gel and zeolites fail or require 150°C heat, MOF-801 exhibits a steep capillary condensation step at 15% to 25% relative humidity.
• **Low Desorption Temperature:** Fully regenerates at 65°C to 80°C, easily reachable using passive solar thermal reflection hoods without electrical heaters.`;
  }

  // Generic Polite Farmer Guidance
  if (lang === 'hi') {
    return `🌾 **किसान जल साथी परामर्श:**
एरोफ्लोरा सिस्टम्स भारत के शुष्क व अर्ध-शुष्क क्षेत्रों के किसानों के लिए हवा से पानी बनाने, सटीक सिंचाई (FAO-56) और जल गुणवत्ता सुधार हेतु बनाया गया है।
• अपनी विशिष्ट फसल या खेत के रकबे के अनुसार सटीक टावर आकलन जानने के लिए ऊपर दिए गए 'फसल जल योजनाकार' या 'एरोफ्लोरा लाइव सिम्युलेटर' का उपयोग करें।
• सहायता हेतु हमारे टोल-फ्री किसान कॉल सेंटर नंबर **1800-180-1551** पर भी संपर्क कर सकते हैं।`;
  }

  return `🌾 **Kisan Jal Saathi Advisory:**
AeroFlora Systems is designed for Indian arid agriculture, providing autonomous atmospheric water harvesting, FAO-56 irrigation planning, and salinity reduction.
• Explore the 'Crop Water Planner' tab to calculate your crop's exact evapotranspiration ($ET_c$), or use the 'AeroFlora Engineering Simulator' to configure MOF sorbent mass.
• For immediate field support, call the toll-free Kisan Call Centre at **1800-180-1551**.`;
}
