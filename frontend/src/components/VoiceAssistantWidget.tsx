import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, X, MicOff, Globe, Send } from "lucide-react";
import { useLanguage, type Language } from "../context/LanguageContext";


const sampleQA = [
    {
        q: "Will it rain tomorrow?",
        qs: { "हिंदी": "क्या कल बारिश होगी?", "मराठी": "उद्या पाऊस पडेल का?", "తెలుగు": "రేపు వర్షం పడుతుందా?", "ਪੰਜਾਬੀ": "ਕੱਲ੍ਹ ਮੀਂਹ ਪਵੇਗਾ?" },
        a: "Yes, moderate rainfall of 12mm is expected tomorrow evening (5–8pm). Good chance to avoid irrigation tonight.",
        as: {
            "हिंदी": "हाँ, कल शाम 5–8 बजे 12mm बारिश की संभावना है। आज रात सिंचाई छोड़ें।",
            "मराठी": "होय, उद्या संध्याकाळी 5–8 वाजेपर्यंत 12mm पाऊस अपेक्षित आहे.",
            "తెలుగు": "అవును, రేపు సాయంత్రం 12mm వర్షం పడే అవకాశం ఉంది.",
            "ਪੰਜਾਬੀ": "ਹਾਂ, ਕੱਲ੍ਹ ਸ਼ਾਮ ਨੂੰ 12mm ਮੀਂਹ ਪੈਣ ਦੀ ਸੰਭਾਵਨਾ ਹੈ।"
        }
    },
    {
        q: "Should I irrigate today?",
        qs: { "हिंदी": "क्या मुझे आज सिंचाई करनी चाहिए?", "मराठी": "मला आज पाणी द्यावे का?", "తెలుగు": "నేడు నీటిపారుదల అవసరమా?", "ਪੰਜਾਬੀ": "ਕੀ ਮੈਨੂੰ ਅੱਜ ਸਿੰਚਾਈ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ?" },
        a: "Soil moisture is at 38% — below the optimal 50%. Irrigate early morning (6–8am) tomorrow before the rain arrives.",
        as: {
            "हिंदी": "मिट्टी की नमी 38% है। कल सुबह 6–8 बजे सिंचाई करें, उसके बाद बारिश आने वाली है।",
            "مراठी": "मातीतील ओलावा 38% आहे. उद्या सकाळी 6–8 दरम्यान पाणी द्या.",
            "తెలుగు": "నేల తేమ 38%. రేపు ఉదయం 6–8 గం.ల మధ్య నీరు ఇవ్వండి.",
            "ਪੰਜਾਬੀ": "ਮਿੱਟੀ ਦੀ ਨਮੀ 38% ਹੈ। ਕੱਲ੍ਹ ਸਵੇਰੇ 6–8 ਵਜੇ ਸਿੰਚਾਈ ਕਰੋ।"
        }
    },
    {
        q: "Any pest risk today?",
        qs: { "हिंदी": "आज कीट का खतरा है?", "मराठी": "आज कीटकांचा धोका आहे का?", "తెలుగు": "నేడు పురుగుల ప్రమాదం ఉందా?", "ਪੰਜਾਬੀ": "ਅੱਜ ਕੀੜਿਆਂ ਦਾ ਖਤਰਾ ਹੈ?" },
        a: "Aphid risk is HIGH (72%) due to high humidity. Spray organic neem solution tonight when wind is calm.",
        as: {
            "हिंदी": "अधिक नमी के कारण एफिड का खतरा उच्च (72%) है। आज रात नीम का तेल छिड़कें।",
            "مراठी": "जास्त आर्द्रतेमुळे ऍफिडचा धोका जास्त (72%) आहे. आज रात्री नीम फवारा मारा.",
            "తెలుగు": "అధిక తేమ వల్ల ఆఫిడ్ ప్రమాదం అధికం (72%). నేడు రాత్రి నీమ్ స్ప్రే చేయండి.",
            "ਪੰਜਾਬੀ": "ਜ਼ਿਆਦਾ ਨਮੀ ਕਾਰਨ ਐਫਿਡ ਦਾ ਖਤਰਾ ਜ਼ਿਆਦਾ (72%) ਹੈ। ਅੱਜ ਰਾਤ ਨਿੰਮ ਛਿੜਕੋ।"
        }
    },
];

const VoiceAssistantWidget = ({ weatherData }: { weatherData: any, user?: any }) => {
    const { t, language, setLanguage } = useLanguage();
    const [open, setOpen] = useState(false);
    const [listening, setListening] = useState(false);
    const [activeQ, setActiveQ] = useState<any>(null);
    const langMap = { "en": "English", "hi": "हिंदी", "mr": "मराठी" };
    const lang = langMap[language as keyof typeof langMap] || "English";
    const [textInput, setTextInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activeQ && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [activeQ]);

    const handleMic = () => {
        if (listening) {
            setListening(false);
            return;
        }
        setListening(true);
        setActiveQ(null);
        setTimeout(() => {
            setListening(false);
            // Simple logic: pick a relevant sample based on weather
            const randomPick = sampleQA[Math.floor(Math.random() * sampleQA.length)];
            processQuestion(randomPick.q);
        }, 2000);
    };

    const processQuestion = (query: string) => {
        const lowerQ = query.toLowerCase();
        let answer = "I'm not sure about that. Try asking about rain, irrigation, or pests.";
        let localizedAnswers: any = {};

        if (!weatherData) {
            answer = "I'm still fetching your farm's weather data. Please wait a moment.";
        } else {
            const current = weatherData.current;
            const tomorrow = weatherData.daily_forecast[1];

            if (lowerQ.includes("rain")) {
                if (tomorrow.rain_prob > 50) {
                    answer = `Yes, ${tomorrow.condition.toLowerCase()} with a ${tomorrow.rain_prob}% chance is expected tomorrow. You should skip irrigation tonight.`;
                    localizedAnswers = {
                        "हिंदी": `हाँ, कल ${tomorrow.rain_prob}% बारिश की संभावना है। आज सिंचाई न करें।`,
                        "मराठी": `होय, उद्या ${tomorrow.rain_prob}% पाऊस पडण्याची शक्यता आहे. आज पाणी देऊ नका.`,
                        "తెలుగు": `అవును, రేపు ${tomorrow.rain_prob}% వర్షం పడే అవకాశం ఉంది.`,
                        "ਪੰਜਾਬੀ": `ਹਾਂ, ਕੱਲ੍ਹ ${tomorrow.rain_prob}% ਮੀਂਹ ਪੈਣ ਦੀ ਸੰਭਾਵਨਾ ਹੈ।`
                    };
                } else {
                    answer = `No significant rain is expected. The chance of rain tomorrow is only ${tomorrow.rain_prob}%.`;
                    localizedAnswers = {
                        "हिंदी": `बारिश की संभावना कम है (${tomorrow.rain_prob}%)।`,
                        "मराठी": `पावसाची शक्यता कमी आहे (${tomorrow.rain_prob}%)।`,
                        "తెలుగు": `వర్షం వచ్చే అవకాశం తక్కువ (${tomorrow.rain_prob}%)।`,
                        "ਪੰਜਾਬੀ": `ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਘੱਟ ਹੈ (${tomorrow.rain_prob}%)।`
                    };
                }
            } else if (lowerQ.includes("irrigate") || lowerQ.includes("water")) {
                if (current.humidity > 80 || tomorrow.rain_prob > 40) {
                    answer = `Humidity is high (${current.humidity}%) and rain is possible (${tomorrow.rain_prob}%). I recommend waiting.`;
                    localizedAnswers = {
                        "हिंदी": `नमी अधिक है और बारिश की संभावना है। अभी रुकना बेहतर है।`,
                        "मराठी": `ओलावा जास्त आहे आणि पावसाची शक्यता आहे. थोडा वेळ थांबा.`,
                        "తెలుగు": `తేమ ఎక్కువగా ఉంది, వర్షం పడే అవకాశం ఉంది.`,
                        "ਪੰਜਾਬੀ": `ਨਮੀ ਜ਼ਿਆਦਾ ਹੈ ਅਤੇ ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਹੈ।`
                    };
                } else {
                    answer = `Conditions are dry. It's a good time to irrigate your crops.`;
                    localizedAnswers = {
                        "हिंदी": `मौसम शुष्क है। अब सिंचाई करने का अच्छा समय है।`,
                        "मराठी": `हवामान कोरडे आहे. पाणी देण्याची ही चांगली वेळ आहे.`,
                        "తెలుగు": `వాతావరణం పొడిగా ఉంది. నీటిపారుదలకి ఇదే సరైన సమయం.`,
                        "ਪੰਜਾਬੀ": `ਮੌਸਮ ਖੁਸ਼ਕ ਹੈ। ਸਿੰਚਾਈ ਲਈ ਇਹ ਸਹੀ ਸਮਾਂ ਹੈ।`
                    };
                }
            } else if (lowerQ.includes("pest")) {
                if (current.humidity > 75) {
                    answer = `High humidity (${current.humidity}%) increases pest risk. Inspect your crops for aphids today.`;
                    localizedAnswers = {
                        "हिंदी": `अधिक नमी के कारण कीटों का खतरा बढ़ गया है। आज निरीक्षण करें।`,
                        "मराठी": `जास्त आर्द्रतेमुळे कीटकांचा धोका वाढला आहे. आज तपासणी करा.`,
                        "తెలుగు": `అధిక తేమ వల్ల పురుగుల భయం ఉంది.`,
                        "ਪੰਜਾਬੀ": `ਜ਼ਿਆਦਾ ਨਮੀ ਕਾਰਨ ਕੀੜਿਆਂ ਦਾ ਖਤਰਾ ਵੱਧ ਗਿਆ ਹੈ।`
                    };
                } else {
                    answer = "Pest risk is currently low, but regular inspection is recommended.";
                    localizedAnswers = {
                        "हिंदी": "कीटों का खतरा अभी कम है।",
                        "मराठी": "कीटकांचा धोका सध्या कमी आहे.",
                        "తెలుగు": "పురుగుల భయం ప్రస్తుతం తక్కువగా ఉంది.",
                        "ਪੰਜਾਬੀ": "ਕੀੜਿਆਂ ਦਾ ਖਤਰਾ ਅਜੇ ਘੱਟ ਹੈ।"
                    };
                }
            } else if (lowerQ.includes("soil") || lowerQ.includes("temperature")) {
                answer = `The ambient temperature is ${current.temperature}°C, while soil temperature is ${current.soil_temperature}°C. This is ${current.soil_temperature > 15 ? 'good' : 'a bit low'} for seed germination.`;
            } else if (lowerQ.includes("dew") || lowerQ.includes("frost")) {
                answer = `The dew point is ${current.dew_point}°C. ${current.dew_point < 5 ? 'Risk of frost/dew is minimal.' : 'Expect some moisture on leaves early morning.'}`;
            } else if (lowerQ.includes("sun") || lowerQ.includes("uv")) {
                answer = `The UV Index is ${current.uv_index}. ${current.uv_index > 7 ? 'High sun intensity — protect sensitive crops.' : 'Sun intensity is moderate.'}`;
            }
        }

        setActiveQ({ q: query, qs: {}, a: answer, as: localizedAnswers });
    };

    const handleSend = () => {
        if (!textInput.trim()) return;
        processQuestion(textInput);
        setTextInput("");
    };

    const getQ = (qa: typeof sampleQA[0]) =>
        lang === "English" ? qa.q : (qa.qs[lang as keyof typeof qa.qs] ?? qa.q);
    const getA = (qa: typeof sampleQA[0]) =>
        lang === "English" ? qa.a : (qa.as[lang as keyof typeof qa.as] ?? qa.a);

    return (
        <>
            {/* Floating Mic Button */}
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-nature-600 hover:bg-nature-500 text-white rounded-full shadow-2xl shadow-nature-600/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                title="AI Voice Assistant"
            >
                <Mic className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-white animate-pulse" />
            </button>

            {/* Widget Panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.95 }}
                        className="fixed bottom-24 right-6 z-50 w-80 glass-card p-5 shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-nature-600 rounded-xl flex items-center justify-center">
                                    <Mic className="text-white w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-black text-slate-800 text-sm">{t('voice.title')}</p>
                                    <p className="text-xs text-nature-600 font-semibold">{t('voice.subtitle')}</p>
                                </div>
                            </div>
                            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-700">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Language Selector */}
                        <div className="flex items-center gap-2 mb-4">
                            <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                            <select
                                value={language}
                                onChange={e => setLanguage(e.target.value as Language)}
                                className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 outline-none w-full"
                            >
                                <option value="en">English</option>
                                <option value="hi">हिंदी</option>
                                <option value="mr">मराठी</option>
                            </select>
                        </div>

                        {/* Mic + Waveform */}
                        <div className="flex flex-col items-center my-4">
                            <button
                                onClick={handleMic}
                                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-105 ${listening ? "bg-red-500 shadow-red-500/30" : "bg-nature-600 shadow-nature-600/30"}`}
                            >
                                {listening ? <MicOff className="text-white w-7 h-7" /> : <Mic className="text-white w-7 h-7" />}
                            </button>

                            {listening && (
                                <div className="flex items-end gap-1 h-10 mt-3">
                                    {[3, 7, 5, 9, 4, 8, 6, 10, 5, 7, 3].map((h, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ height: [`${h * 3}px`, `${h * 6}px`, `${h * 3}px`] }}
                                            transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.06 }}
                                            className="w-1.5 bg-nature-500 rounded-full"
                                        />
                                    ))}
                                </div>
                            )}

                            <p className="text-xs text-slate-400 font-medium mt-2">
                                {listening ? t('voice.listening') : t('voice.expert_prompt')}
                            </p>
                        </div>

                        {/* Text Input Option */}
                        <div className="flex items-center gap-2 mb-4 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 focus-within:ring-2 focus-within:ring-nature-500/50 transition-all">
                            <input
                                type="text"
                                value={textInput}
                                onChange={e => setTextInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSend()}
                                placeholder={t('voice.placeholder')}
                                className="bg-transparent border-none outline-none text-xs text-slate-700 w-full py-1.5 px-2 placeholder:text-slate-400"
                            />
                            <button 
                                onClick={handleSend}
                                className="p-1.5 bg-nature-600 rounded-lg text-white hover:bg-nature-700 transition-colors"
                            >
                                <Send className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* Q&A Result */}
                        <AnimatePresence>
                            {activeQ && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-2"
                                >
                                    <div className="bg-slate-100 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700">
                                        🎙 {getQ(activeQ)}
                                    </div>
                                    <div className="bg-nature-50 border border-nature-200 rounded-xl px-3 py-2 text-sm font-medium text-nature-800">
                                        🤖 {getA(activeQ)}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Sample questions */}
                        {!activeQ && !listening && (
                            <div className="space-y-2 mt-2">
                                <p className="text-xs text-slate-400 font-semibold">Try asking:</p>
                                {sampleQA.map(qa => (
                                    <button
                                        key={qa.q}
                                        onClick={() => processQuestion(qa.q)}
                                        className="w-full text-left text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 transition-colors"
                                    >
                                        "{getQ(qa)}"
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default VoiceAssistantWidget;
