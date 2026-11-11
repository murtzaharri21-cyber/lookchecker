export type Locale = "en" | "es-ES" | "es-AR" | "fr" | "hi" | "ar-SA" | "ar-MA" | "pt-BR" | "de" | "it" | "ja" | "ko" | "zh-CN" | "ur" | "ru" | "bn" | "id" | "ms" | "sw";

export const locales: { code: Locale; flag: string; label: string; nativeLabel: string; direction?: "rtl" }[] = [
  { code: "en", flag: "🇬🇧", label: "English", nativeLabel: "English" },
  { code: "es-ES", flag: "🇪🇸", label: "Spanish (Spain)", nativeLabel: "Español (España)" },
  { code: "es-AR", flag: "🇦🇷", label: "Spanish (Argentina)", nativeLabel: "Español (Argentina)" },
  { code: "fr", flag: "🇫🇷", label: "French", nativeLabel: "Français" },
  { code: "hi", flag: "🇮🇳", label: "Hindi", nativeLabel: "हिन्दी" },
  { code: "ar-SA", flag: "🇸🇦", label: "Arabic (Saudi Arabia)", nativeLabel: "العربية (السعودية)", direction: "rtl" },
  { code: "ar-MA", flag: "🇲🇦", label: "Arabic (Morocco)", nativeLabel: "العربية (المغرب)", direction: "rtl" },
  { code: "pt-BR", flag: "🇧🇷", label: "Portuguese (Brazil)", nativeLabel: "Português (Brasil)" },
  { code: "de", flag: "🇩🇪", label: "German", nativeLabel: "Deutsch" },
  { code: "it", flag: "🇮🇹", label: "Italian", nativeLabel: "Italiano" },
  { code: "ja", flag: "🇯🇵", label: "Japanese", nativeLabel: "日本語" },
  { code: "ko", flag: "🇰🇷", label: "Korean", nativeLabel: "한국어" },
  { code: "zh-CN", flag: "🇨🇳", label: "Chinese (Simplified)", nativeLabel: "简体中文" },
  { code: "ur", flag: "🇵🇰", label: "Urdu", nativeLabel: "اردو", direction: "rtl" },
  { code: "ru", flag: "🇷🇺", label: "Russian", nativeLabel: "Русский" },
  { code: "bn", flag: "🇧🇩", label: "Bengali", nativeLabel: "বাংলা" },
  { code: "id", flag: "🇮🇩", label: "Indonesian", nativeLabel: "Bahasa Indonesia" },
  { code: "ms", flag: "🇲🇾", label: "Malay", nativeLabel: "Bahasa Melayu" },
  { code: "sw", flag: "🇰🇪", label: "Swahili", nativeLabel: "Kiswahili" },
];

const supportedLocaleCodes: Locale[] = ["en", "es-ES", "fr", "de", "pt-BR", "ar-SA", "hi", "zh-CN", "ja", "ru"];

export const availableLocales = locales.filter(({ code }) => supportedLocaleCodes.includes(code));

export const localeSettingsCopy: Record<Locale, { language: string; rollout: string }> = {
  en: { language: "Website language", rollout: "Translations are rolling out across the site." },
  "es-ES": { language: "Idioma del sitio", rollout: "La traducción de todo el sitio está en curso." },
  "es-AR": { language: "Idioma del sitio", rollout: "La traducción de todo el sitio está en curso." },
  fr: { language: "Langue du site", rollout: "La traduction de l’ensemble du site est en cours." },
  hi: { language: "वेबसाइट की भाषा", rollout: "पूरी साइट का अनुवाद चरणों में उपलब्ध कराया जा रहा है।" },
  "ar-SA": { language: "لغة الموقع", rollout: "تتم ترجمة الموقع بالكامل على مراحل." },
  "ar-MA": { language: "لغة الموقع", rollout: "تتم ترجمة الموقع بالكامل على مراحل." },
  "pt-BR": { language: "Idioma do site", rollout: "A tradução de todo o site está sendo feita por etapas." },
  de: { language: "Website-Sprache", rollout: "Die Übersetzung der gesamten Website erfolgt schrittweise." },
  it: { language: "Lingua del sito", rollout: "La traduzione dell'intero sito viene completata gradualmente." },
  ja: { language: "ウェブサイトの言語", rollout: "サイト全体の翻訳を段階的に進めています。" },
  ko: { language: "웹사이트 언어", rollout: "사이트 전체 번역을 단계적으로 진행하고 있습니다." },
  "zh-CN": { language: "网站语言", rollout: "全站翻译正在分阶段推出。" },
  ur: { language: "ویب سائٹ کی زبان", rollout: "پوری ویب سائٹ کا ترجمہ مرحلہ وار جاری ہے۔" },
  ru: { language: "Язык сайта", rollout: "Перевод всего сайта выполняется поэтапно." },
  bn: { language: "ওয়েবসাইটের ভাষা", rollout: "সম্পূর্ণ সাইটের অনুবাদ ধাপে ধাপে প্রকাশ করা হচ্ছে।" },
  id: { language: "Bahasa situs", rollout: "Terjemahan seluruh situs sedang diluncurkan secara bertahap." },
  ms: { language: "Bahasa laman", rollout: "Terjemahan seluruh laman sedang dilaksanakan secara berperingkat." },
  sw: { language: "Lugha ya tovuti", rollout: "Tafsiri ya tovuti nzima inatolewa kwa awamu." },
};

type HeaderCopy = {
  tools: string;
  howItWorks: string;
  sample: string;
  guides: string;
  free: string;
  scan: string;
  freeScan: string;
  switchDark: string;
  switchLight: string;
};

export const headerCopy: Record<Locale, HeaderCopy> = {
  en: { tools: "Free tools", howItWorks: "How it works", sample: "Sample report", guides: "Guides", free: "Always free", scan: "Start a free scan", freeScan: "Free scan", switchDark: "Switch to dark mode", switchLight: "Switch to light mode" },
  "es-ES": { tools: "Herramientas gratis", howItWorks: "Cómo funciona", sample: "Informe de ejemplo", guides: "Guías", free: "Siempre gratis", scan: "Iniciar análisis gratis", freeScan: "Análisis gratis", switchDark: "Activar modo oscuro", switchLight: "Activar modo claro" },
  "es-AR": { tools: "Herramientas gratis", howItWorks: "Cómo funciona", sample: "Informe de ejemplo", guides: "Guías", free: "Siempre gratis", scan: "Empezar análisis gratis", freeScan: "Análisis gratis", switchDark: "Activar modo oscuro", switchLight: "Activar modo claro" },
  fr: { tools: "Outils gratuits", howItWorks: "Fonctionnement", sample: "Rapport exemple", guides: "Guides", free: "Toujours gratuit", scan: "Lancer une analyse gratuite", freeScan: "Analyse gratuite", switchDark: "Activer le mode sombre", switchLight: "Activer le mode clair" },
  hi: { tools: "मुफ़्त टूल", howItWorks: "यह कैसे काम करता है", sample: "नमूना रिपोर्ट", guides: "गाइड", free: "हमेशा मुफ़्त", scan: "मुफ़्त स्कैन शुरू करें", freeScan: "मुफ़्त स्कैन", switchDark: "डार्क मोड चालू करें", switchLight: "लाइट मोड चालू करें" },
  "ar-SA": { tools: "أدوات مجانية", howItWorks: "كيف يعمل", sample: "تقرير تجريبي", guides: "أدلة", free: "مجاني دائمًا", scan: "ابدأ فحصًا مجانيًا", freeScan: "فحص مجاني", switchDark: "تفعيل الوضع الداكن", switchLight: "تفعيل الوضع الفاتح" },
  "ar-MA": { tools: "أدوات مجانية", howItWorks: "كيف يعمل", sample: "تقرير تجريبي", guides: "أدلة", free: "مجاني دائمًا", scan: "ابدأ فحصًا مجانيًا", freeScan: "فحص مجاني", switchDark: "تفعيل الوضع الداكن", switchLight: "تفعيل الوضع الفاتح" },
  "pt-BR": { tools: "Ferramentas grátis", howItWorks: "Como funciona", sample: "Relatório de exemplo", guides: "Guias", free: "Sempre grátis", scan: "Começar análise grátis", freeScan: "Análise grátis", switchDark: "Ativar modo escuro", switchLight: "Ativar modo claro" },
  de: { tools: "Kostenlose Tools", howItWorks: "So funktioniert es", sample: "Beispielbericht", guides: "Ratgeber", free: "Immer kostenlos", scan: "Kostenlosen Scan starten", freeScan: "Kostenloser Scan", switchDark: "Dunkelmodus aktivieren", switchLight: "Hellmodus aktivieren" },
  it: { tools: "Strumenti gratuiti", howItWorks: "Come funziona", sample: "Report di esempio", guides: "Guide", free: "Sempre gratis", scan: "Avvia scansione gratuita", freeScan: "Scansione gratis", switchDark: "Attiva modalità scura", switchLight: "Attiva modalità chiara" },
  ja: { tools: "無料ツール", howItWorks: "使い方", sample: "レポート例", guides: "ガイド", free: "ずっと無料", scan: "無料スキャンを開始", freeScan: "無料スキャン", switchDark: "ダークモードに切り替え", switchLight: "ライトモードに切り替え" },
  ko: { tools: "무료 도구", howItWorks: "사용 방법", sample: "샘플 보고서", guides: "가이드", free: "항상 무료", scan: "무료 분석 시작", freeScan: "무료 분석", switchDark: "다크 모드 켜기", switchLight: "라이트 모드 켜기" },
  "zh-CN": { tools: "免费工具", howItWorks: "使用方式", sample: "示例报告", guides: "指南", free: "永久免费", scan: "开始免费分析", freeScan: "免费分析", switchDark: "开启深色模式", switchLight: "开启浅色模式" },
  ur: { tools: "مفت ٹولز", howItWorks: "یہ کیسے کام کرتا ہے", sample: "نمونہ رپورٹ", guides: "رہنما", free: "ہمیشہ مفت", scan: "مفت اسکین شروع کریں", freeScan: "مفت اسکین", switchDark: "ڈارک موڈ آن کریں", switchLight: "لائٹ موڈ آن کریں" },
  ru: { tools: "Бесплатные инструменты", howItWorks: "Как это работает", sample: "Пример отчёта", guides: "Руководства", free: "Всегда бесплатно", scan: "Начать бесплатный анализ", freeScan: "Бесплатный анализ", switchDark: "Включить тёмную тему", switchLight: "Включить светлую тему" },
  bn: { tools: "বিনামূল্যের টুল", howItWorks: "যেভাবে কাজ করে", sample: "নমুনা প্রতিবেদন", guides: "গাইড", free: "সবসময় বিনামূল্যে", scan: "বিনামূল্যে স্ক্যান শুরু করুন", freeScan: "বিনামূল্যে স্ক্যান", switchDark: "ডার্ক মোড চালু করুন", switchLight: "লাইট মোড চালু করুন" },
  id: { tools: "Alat gratis", howItWorks: "Cara kerja", sample: "Contoh laporan", guides: "Panduan", free: "Selalu gratis", scan: "Mulai pemindaian gratis", freeScan: "Pemindaian gratis", switchDark: "Aktifkan mode gelap", switchLight: "Aktifkan mode terang" },
  ms: { tools: "Alat percuma", howItWorks: "Cara ia berfungsi", sample: "Contoh laporan", guides: "Panduan", free: "Sentiasa percuma", scan: "Mulakan imbasan percuma", freeScan: "Imbasan percuma", switchDark: "Hidupkan mod gelap", switchLight: "Hidupkan mod cerah" },
  sw: { tools: "Zana za bure", howItWorks: "Jinsi inavyofanya kazi", sample: "Ripoti ya mfano", guides: "Miongozo", free: "Bure kila wakati", scan: "Anza uchanganuzi wa bure", freeScan: "Uchanganuzi wa bure", switchDark: "Washa hali nyeusi", switchLight: "Washa hali nyepesi" },
};
