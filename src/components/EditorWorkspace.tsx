import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Trash2,
  Clipboard,
  BookOpen,
  Mic,
  MicOff,
  AlertCircle,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  Wand2,
  Check,
} from 'lucide-react';
import { findUzbekSpellingIssues, normalizeUzbekVoiceText } from '../utils/uzbekSpelling.ts';
import { SpellingIssue } from '../types.ts';

interface EditorWorkspaceProps {
  text: string;
  onChangeText: (val: string) => void;
  onClear: () => void;
  onOpenSamples: () => void;
  onAskSentenceAdvice: (sentence: string) => void;
  disabled?: boolean;
}

export const EditorWorkspace: React.FC<EditorWorkspaceProps> = ({
  text,
  onChangeText,
  onClear,
  onOpenSamples,
  onAskSentenceAdvice,
  disabled = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  const [selectedText, setSelectedText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechLang, setSpeechLang] = useState<string>('uz-UZ');
  const [autoCorrectVoice, setAutoCorrectVoice] = useState<boolean>(true);
  const [interimText, setInterimText] = useState<string>('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState<boolean>(true);

  // Real-time spell checking states
  const [enableSpellCheck, setEnableSpellCheck] = useState<boolean>(true);
  const [showSpellIssues, setShowSpellIssues] = useState<boolean>(true);

  // Check Web Speech API support on mount
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
    }
  }, []);

  // Compute real-time spelling issues
  const spellingIssues = useMemo(() => {
    if (!enableSpellCheck || !text) return [];
    return findUzbekSpellingIssues(text);
  }, [text, enableSpellCheck]);

  // Calculate live statistics
  const trimmed = text.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
  const charCount = text.length;
  const paragraphCount = trimmed ? trimmed.split(/\n+/).filter(Boolean).length : 0;
  const readTimeMin = Math.ceil(wordCount / 180);

  // Monitor text selection inside textarea for sentence-specific advice
  const handleSelect = () => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const sel = text.slice(start, end).trim();

    if (sel.length > 5 && sel.length < 300) {
      setSelectedText(sel);
    } else {
      setSelectedText('');
    }
  };

  const handlePaste = async () => {
    try {
      const clip = await navigator.clipboard.readText();
      if (clip) {
        onChangeText(text ? `${text}\n\n${clip}` : clip);
      }
    } catch {
      // Clipboard permissions handled gracefully
    }
  };

  // Fix single spelling issue
  const handleFixWord = (issue: SpellingIssue) => {
    if (issue.index >= 0 && issue.index + issue.length <= text.length) {
      const newText =
        text.slice(0, issue.index) + issue.suggestion + text.slice(issue.index + issue.length);
      onChangeText(newText);
    }
  };

  // Fix all detected spelling issues
  const handleFixAll = () => {
    if (spellingIssues.length === 0) return;
    let updated = text;
    // Sort descending by index so earlier indices don't shift
    const sorted = [...spellingIssues].sort((a, b) => b.index - a.index);
    for (const issue of sorted) {
      if (issue.index >= 0 && issue.index + issue.length <= updated.length) {
        updated =
          updated.slice(0, issue.index) + issue.suggestion + updated.slice(issue.index + issue.length);
      }
    }
    onChangeText(updated);
  };

  // Toggle Web Speech recognition with auto accent & dialect normalization
  const toggleListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError(
        "Brauzeringiz Web Speech API'ni qo'llab-quvvatlamaydi. Iltimos, Chrome, Edge yoki Safari brauzeridan foydalaning."
      );
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setInterimText('');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = speechLang;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let newlyFinalized = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            newlyFinalized += transcript;
          } else {
            currentInterim += transcript;
          }
        }

        if (newlyFinalized) {
          // Normalize speech output: remove dialect slurs, fix x/h and apostrophes
          const normalized = autoCorrectVoice && speechLang === 'uz-UZ'
            ? normalizeUzbekVoiceText(newlyFinalized.trim())
            : newlyFinalized.trim();

          onChangeText(
            text
              ? `${text.trimEnd()} ${normalized}`
              : normalized
          );
        }

        setInterimText(currentInterim);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === 'not-allowed') {
          setSpeechError(
            "Mikrofon ruxsati berilmadi. Iltimos brauzer sozlamalarida mikrofonga ruxsat bering."
          );
        } else if (event.error === 'network') {
          setSpeechError("Ovozni aniqlash uchun tarmoqqa ulanish zarur.");
        } else if (event.error !== 'no-speech') {
          setSpeechError(`Ovozni aniqlashda xatolik yuz berdi (${event.error}).`);
        }
        setIsListening(false);
        setInterimText('');
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimText('');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error("Speech start error:", err);
      setSpeechError(err?.message || "Mikrofonni ishga tushirishda xatolik yuz berdi.");
      setIsListening(false);
    }
  };

  // Stop listening on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
      {/* Editor Top Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Dastlabki Matn
          </span>
          <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Yozing yoki ovozda ayting
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Real-time Spell Check Indicator Toggle */}
          <button
            type="button"
            onClick={() => setEnableSpellCheck(!enableSpellCheck)}
            className={`min-h-[36px] px-2.5 py-1 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              enableSpellCheck
                ? spellingIssues.length > 0
                  ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                  : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
            title="Real vaqtda imlo tekshiruvini yoqish/o'chirish"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>
              {enableSpellCheck
                ? spellingIssues.length > 0
                  ? `${spellingIssues.length} ta imlo xatosi`
                  : 'Imlo toza'
                : 'Imlo tekshiruvi: o\'chiq'}
            </span>
          </button>

          {/* Voice to Text Button */}
          {isSpeechSupported ? (
            <div className="flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
              <button
                type="button"
                onClick={toggleListening}
                disabled={disabled}
                className={`min-h-[36px] px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                  isListening
                    ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-xs animate-pulse ring-2 ring-rose-400/50'
                    : 'text-indigo-600 dark:text-indigo-400 hover:bg-white dark:hover:bg-slate-700'
                }`}
                title={isListening ? "Ovozli kiritishni to'xtatish" : "Ovoz orqali kiritish (Voice-to-Text)"}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" />
                    <span>To'xtatish</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Ovoz</span>
                  </>
                )}
              </button>

              {/* Language selection for speech */}
              <select
                value={speechLang}
                onChange={(e) => {
                  setSpeechLang(e.target.value);
                  if (isListening && recognitionRef.current) {
                    recognitionRef.current.stop();
                  }
                }}
                disabled={disabled || isListening}
                className="text-[11px] font-medium bg-transparent text-slate-700 dark:text-slate-300 py-1 px-1 focus:outline-none cursor-pointer border-none"
                title="Ovoz tili"
              >
                <option value="uz-UZ" className="bg-white dark:bg-slate-900">O'zb</option>
                <option value="ru-RU" className="bg-white dark:bg-slate-900">Рус</option>
                <option value="en-US" className="bg-white dark:bg-slate-900">Eng</option>
              </select>
            </div>
          ) : null}

          <button
            onClick={onOpenSamples}
            disabled={disabled}
            className="min-h-[36px] px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            title="Namuna matn yuklash"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Namuna</span>
          </button>

          <button
            onClick={handlePaste}
            disabled={disabled}
            className="min-h-[36px] px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            title="Buferdan joylash"
          >
            <Clipboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Qo'yish</span>
          </button>

          {text && (
            <button
              onClick={onClear}
              disabled={disabled}
              className="min-h-[36px] px-2.5 py-1 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              title="Tozalash"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tozalash</span>
            </button>
          )}
        </div>
      </div>

      {/* Real-time Spelling Suggestions Drawer */}
      {enableSpellCheck && spellingIssues.length > 0 && (
        <div className="bg-amber-50/90 dark:bg-amber-950/50 border-b border-amber-200 dark:border-amber-900/60 px-4 py-2.5 text-xs text-amber-950 dark:text-amber-200 animate-in fade-in">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="font-semibold text-amber-900 dark:text-amber-300">
                Imlo tavsiyalari ({spellingIssues.length} ta aniqlandi):
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleFixAll}
                className="text-[11px] font-bold text-white bg-amber-600 hover:bg-amber-700 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <Wand2 className="w-3 h-3" />
                <span>Hammasini tuzatish</span>
              </button>
              <button
                onClick={() => setShowSpellIssues(!showSpellIssues)}
                className="text-amber-800 dark:text-amber-400 p-1 hover:bg-amber-100 dark:hover:bg-amber-900/60 rounded"
              >
                {showSpellIssues ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {showSpellIssues && (
            <div className="flex flex-wrap gap-2 pt-1 max-h-32 overflow-y-auto">
              {spellingIssues.slice(0, 8).map((issue, idx) => (
                <div
                  key={issue.id || idx}
                  className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/80 px-2.5 py-1.5 rounded-lg shadow-xs flex items-center gap-2 text-[11px]"
                >
                  <div>
                    <span className="line-through text-rose-500 font-medium mr-1">
                      {issue.word}
                    </span>
                    <span className="text-slate-400 font-sans mr-1">→</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {issue.suggestion}
                    </span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {issue.reason}
                    </p>
                  </div>
                  <button
                    onClick={() => handleFixWord(issue)}
                    className="shrink-0 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 p-1 rounded font-semibold transition-colors cursor-pointer"
                    title="Ushbu so'zni to'g'rilash"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {spellingIssues.length > 8 && (
                <span className="text-[11px] text-amber-700 dark:text-amber-400 self-center">
                  + yana {spellingIssues.length - 8} ta
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Active Voice Listening Banner with Auto-Normalize Indicator */}
      {isListening && (
        <div className="bg-rose-50 dark:bg-rose-950/60 border-b border-rose-200 dark:border-rose-900/60 px-4 py-2.5 flex items-center justify-between text-xs text-rose-900 dark:text-rose-200 animate-in fade-in">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
            </span>
            <div className="truncate">
              <strong>Eshitmoqdaman ({speechLang === 'uz-UZ' ? "O'zbek tili filtri faol" : speechLang})...</strong>{' '}
              {interimText ? (
                <span className="italic opacity-90 font-serif">"{interimText}"</span>
              ) : (
                <span className="opacity-75">Gapiring... og'zaki aksent va xatolar avtomatik to'g'rilanadi.</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <button
              onClick={() => setAutoCorrectVoice(!autoCorrectVoice)}
              className={`text-[10px] px-2 py-0.5 rounded font-medium cursor-pointer transition-colors ${
                autoCorrectVoice
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
              title="Og'zaki so'zlarni adabiy tilga avto-to'g'rilash"
            >
              {autoCorrectVoice ? "Avto-filtr: Yoqiq" : "Avto-filtr: O'chiq"}
            </button>
            <button
              onClick={toggleListening}
              className="text-[11px] font-semibold bg-rose-600 text-white px-2 py-0.5 rounded-md hover:bg-rose-700 transition-colors cursor-pointer"
            >
              Yakunlash
            </button>
          </div>
        </div>
      )}

      {/* Speech Error Banner */}
      {speechError && (
        <div className="bg-amber-50 dark:bg-amber-950/70 border-b border-amber-200 dark:border-amber-900/60 px-4 py-2 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200 animate-in fade-in">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{speechError}</span>
          </div>
          <button
            onClick={() => setSpeechError(null)}
            className="text-amber-800 dark:text-amber-300 font-bold px-1 hover:underline ml-2"
          >
            ×
          </button>
        </div>
      )}

      {/* Floating Sentence Advice Trigger */}
      {selectedText && (
        <div className="bg-amber-50 dark:bg-amber-950/80 border-b border-amber-200 dark:border-amber-900/60 px-4 py-2 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200 animate-in fade-in">
          <div className="flex items-center gap-2 truncate pr-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="truncate">Tanlangan jumla: <em>"{selectedText}"</em></span>
          </div>
          <button
            onClick={() => onAskSentenceAdvice(selectedText)}
            className="shrink-0 font-medium bg-amber-600 hover:bg-amber-700 text-white px-2.5 py-1 rounded-md transition-colors cursor-pointer"
          >
            Maslahat olish
          </button>
        </div>
      )}

      {/* Textarea Area */}
      <div className="relative flex-1 p-4 sm:p-5 flex flex-col min-h-[260px] sm:min-h-[340px]">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => onChangeText(e.target.value)}
          onSelect={handleSelect}
          disabled={disabled}
          placeholder="Insho, hikoya lavhasi yoki blog post matnini bu yerga yozing yoki mikrofondan foydalanib ovozda ayting...&#10;&#10;Real vaqtda imlo xatolari ta'kidlanadi, og'zaki nutqdagi aksent va dialekt xatolari avtomatik tuzatiladi."
          className="w-full h-full flex-1 resize-none bg-transparent text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 text-base leading-relaxed sm:leading-loose font-serif focus:outline-none focus:ring-0 border-none p-0"
        />
      </div>

      {/* Metadata Metrics Bar */}
      <div className="px-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-y-1 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <span><strong className="font-mono tabular-nums text-slate-700 dark:text-slate-200">{wordCount}</strong> ta so'z</span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span><strong className="font-mono tabular-nums text-slate-700 dark:text-slate-200">{charCount}</strong> ta belgi</span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span><strong className="font-mono tabular-nums text-slate-700 dark:text-slate-200">{paragraphCount}</strong> ta abzas</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <span>O'qish vaqti: ~{readTimeMin} daqiqa</span>
        </div>
      </div>
    </div>
  );
};
