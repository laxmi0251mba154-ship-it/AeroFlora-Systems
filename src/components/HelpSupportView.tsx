import React, { useState } from 'react';
import {
  HelpCircle,
  Phone,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Wrench,
  Languages,
  Send,
  ExternalLink,
} from 'lucide-react';
import { SupportedLanguage } from '../utils/i18n';

interface HelpSupportViewProps {
  currentLanguage: SupportedLanguage;
  onShowToast: (message: string) => void;
}

interface FAQItem {
  id: string;
  questionEn: string;
  questionHi: string;
  answerEn: string;
  answerHi: string;
  category: string;
}

const FAQ_LIST: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Engineering & Technology',
    questionEn: 'How does the AeroFlora tower harvest water with zero grid electricity?',
    questionHi: 'एरोफ्लोरा टावर बिना ग्रिड बिजली के पानी कैसे निकालता है?',
    answerEn:
      'AeroFlora utilizes a two-phase diurnal cycle inspired by nature. At night, ambient air flows passively through louvers where high-affinity Metal-Organic Framework (MOF-801) sorbent crystals adsorb water vapor from 15%-30% RH air. During the day, concentrated solar thermal hoods heat the bed to 75-80°C, releasing pure vapor that condenses on sub-surface biomimetic plates modeled after the Namib desert beetle.',
    answerHi:
      'एरोफ्लोरा एक दो-चरणीय बायोमिमेटिक चक्र पर काम करता है। रात के समय, प्राकृतिक हवा खुली खिड़कियों से होकर गुजरती है जहाँ आधुनिक MOF-801 क्रिस्टल 15%-30% नमी वाली हवा से पानी के अणुओं को सोख लेते हैं। दिन में, सौर ताप बेड को 75-80°C तक गर्म करता है, जिससे भाप निकलती है और वह ठंडी प्लेटों पर बूंदों के रूप में संघनित हो जाती है। इसमें शून्य ग्रिड बिजली की खपत होती है।',
  },
  {
    id: 'faq-2',
    category: 'Climate & Arid Performance',
    questionEn: 'Will it work in peak summer (May-June) when temperature exceeds 44°C and humidity drops to 15%?',
    questionHi: 'क्या यह मई-जून की भीषण गर्मी (44°C) में जब नमी 15% रह जाती है, तब भी काम करेगा?',
    answerEn:
      'Yes. In fact, extreme summer insolation (>6.5 kWh/m²/day) provides superior solar desorption temperatures. Because nocturnal desert air cools rapidly (often dropping by 16-20°C at night), relative humidity naturally surges between 22:00 and 05:00, allowing MOF-801 to saturate fully before sunrise.',
    answerHi:
      'हाँ! वास्तव में, गर्मियों की तेज धूप (सौर विकिरण) दिन में भाप निकालने के लिए सबसे अच्छी ऊर्जा प्रदान करती है। चूँकि रेगिस्तानी इलाकों में रातें ठंडी (16-20°C कम) होती हैं, इसलिए रात 10 बजे से सुबह 5 बजे के बीच नमी स्वाभाविक रूप से बढ़ जाती है, जिससे क्रिस्टल पूरी तरह भर जाते हैं।',
  },
  {
    id: 'faq-3',
    category: 'Hardware & Sorbent Lifespan',
    questionEn: 'How often does the MOF sorbent bed need to be replaced?',
    questionHi: 'MOF अधिशोषक सामग्री को कितने वर्षों बाद बदलना पड़ता है?',
    answerEn:
      'Zirconium-fumarate MOF-801 demonstrates exceptional hydrothermal stability. Peer-reviewed material trials confirm over 10,000 thermal cycles with under 2% capacity degradation, delivering an operational service life of 15 to 20 years with zero hazardous chemical disposal.',
    answerHi:
      'MOF-801 एक अत्यधिक टिकाऊ क्रिस्टलीय सामग्री है। वैज्ञानिक परीक्षणों में 10,000 से अधिक गर्म-ठंडे चक्रों के बाद भी इसकी क्षमता में 2% से भी कम कमी आती है। इसका परिचालन जीवनकाल 15 से 20 वर्ष का होता है।',
  },
  {
    id: 'faq-4',
    category: 'Water Quality & Mineral Balance',
    questionEn: 'Is the harvested atmospheric water safe for drip emitters and root systems?',
    questionHi: 'क्या यह पानी ड्रिप नलिकाओं और पौधों की जड़ों के लिए पूरी तरह सुरक्षित है?',
    answerEn:
      'Pure atmospheric condensate is naturally distilled and contains near-zero salts (EC < 0.1 dS/m), completely eliminating nozzle salt encrustation. Before reaching your crops, it passes through our patented solar remineralizer cartridge containing natural calcite and dolomite, providing 55 mg/L Calcium and 18 mg/L Magnesium for balanced root osmosis.',
    answerHi:
      'वायुमंडलीय संघनित पानी स्वाभाविक रूप से आसुत होता है और इसमें नमक नहीं होता, जिससे ड्रिप पाइप में कभी खारापन या चोकिंग नहीं होती। फसलों तक पहुँचने से पहले यह प्राकृतिक कैल्साइट और डोलोमाइट फिल्टर से गुजरता है, जिससे इसमें 55 mg/L कैल्शियम और 18 mg/L मैग्नीशियम मिल जाता है।',
  },
  {
    id: 'faq-5',
    category: 'Government Subsidies & Financing',
    questionEn: 'What subsidies are available for Indian farmers under PM-KUSUM?',
    questionHi: 'पीएम-कुसुम के तहत किसानों को क्या सरकारी सहायता और सब्सिडी मिलती है?',
    answerEn:
      'AeroFlora systems qualify under PM-KUSUM Component B (Off-Grid Solar Agri Infrastructure) which provides a 30% Central Financial Assistance grant. Additionally, states like Rajasthan and Gujarat provide an extra 20% arid horticulture grant, bringing total capital subsidy up to 50%. The remaining farmer share is eligible for 5-year NABARD/KCC term loans.',
    answerHi:
      'एरोफ्लोरा सिस्टम पीएम-कुसुम कम्पोनेंट B के तहत 30% केंद्रीय सब्सिडी के पात्र हैं। इसके अतिरिक्त राजस्थान और गुजरात जैसे राज्य 20% अतिरिक्त शुष्क बागवानी अनुदान देते हैं, जिससे कुल सब्सिडी 50% तक हो जाती है। शेष राशि के लिए केसीसी / नाबार्ड से 5 वर्ष का आसान ऋण मिल जाता है।',
  },
];

export const HelpSupportView: React.FC<HelpSupportViewProps> = ({ currentLanguage, onShowToast }) => {
  const [openFaqId, setOpenFaqId] = useState<string>('faq-1');
  const [supportName, setSupportName] = useState('');
  const [supportMobile, setSupportMobile] = useState('');
  const [supportIssue, setSupportIssue] = useState('');

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? '' : id);
  };

  const handleDispatchSupport = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast(`Support ticket lodged for ${supportName || 'Farmer'}. Local technician will contact via +91-${supportMobile}.`);
    setSupportName('');
    setSupportMobile('');
    setSupportIssue('');
  };

  const isHindi = currentLanguage === 'hi';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2 border border-emerald-200">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
            <span>Kisan Sahayata Kendra (किसान सहायता केंद्र)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Help, Support &amp; Kisan Field Assistance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Bilingual engineering FAQs, toll-free Kisan Call Centre integration, and on-ground technician servicing.
          </p>
        </div>

        {/* Toll-free Kisan Call Centre */}
        <div className="bg-emerald-950 text-white p-3.5 rounded-xl border border-emerald-800 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center">
            <Phone className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <span className="text-[10px] text-emerald-300 font-mono uppercase block">
              Toll-Free Kisan Call Centre
            </span>
            <span className="text-base font-extrabold font-mono text-white">1800-180-1551</span>
            <span className="text-[10px] text-emerald-300 block">Available 24x7 in 22 Languages</span>
          </div>
        </div>
      </div>

      {/* Grid: FAQs & Ticket Request Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Bilingual FAQs */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Frequently Asked Farmer Questions ({FAQ_LIST.length})
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">English / हिन्दी</span>
          </div>

          <div className="space-y-3">
            {FAQ_LIST.map((faq) => {
              const isOpen = openFaqId === faq.id;

              return (
                <div
                  key={faq.id}
                  className="rounded-xl border border-slate-200 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-4 bg-slate-50/70 hover:bg-slate-100/70 flex items-center justify-between text-left transition-colors cursor-pointer"
                  >
                    <div className="space-y-0.5 pr-4">
                      <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase block">
                        {faq.category}
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                        {isHindi ? faq.questionHi : faq.questionEn}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-sans">
                        {isHindi ? faq.questionEn : faq.questionHi}
                      </p>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="p-4 bg-white border-t border-slate-100 text-xs text-slate-700 leading-relaxed space-y-2">
                      <p className="font-medium">{isHindi ? faq.answerHi : faq.answerEn}</p>
                      <p className="text-[11px] text-slate-500 italic pt-2 border-t border-slate-100">
                        {isHindi ? faq.answerEn : faq.answerHi}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Service Request Form */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-bold text-sm">
            <Wrench className="w-4 h-4 text-amber-700" />
            <span>Request Field Service / Demo</span>
          </div>

          <form onSubmit={handleDispatchSupport} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Your Name (किसान का नाम) *</label>
              <input
                type="text"
                required
                value={supportName}
                onChange={(e) => setSupportName(e.target.value)}
                placeholder="e.g. Suresh Choudhary"
                className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Mobile Number (+91) *</label>
              <input
                type="tel"
                required
                maxLength={10}
                value={supportMobile}
                onChange={(e) => setSupportMobile(e.target.value)}
                placeholder="9876543210"
                className="w-full bg-slate-50 border border-slate-300 rounded p-2 font-mono text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Description of Issue / Inquiry</label>
              <textarea
                rows={3}
                required
                value={supportIssue}
                onChange={(e) => setSupportIssue(e.target.value)}
                placeholder="e.g. Need tower site survey for 3 acres pomegranate in Barmer..."
                className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-800"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Request to Agronomist</span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
            <p className="flex items-center gap-1.5 text-emerald-800 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direct Guarantee</span>
            </p>
            <p>
              AeroFlora certified field technicians visit within 48 hours for authorized PM-KUSUM installations across
              Rajasthan, Gujarat, and Maharashtra.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
