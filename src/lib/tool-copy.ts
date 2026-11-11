import type { Locale } from "@/lib/localization";

export type ToolCopyKey =
  | "home" | "tools" | "freeDevice" | "privateCamera" | "method" | "methodTitle"
  | "methodIntro" | "measurement" | "howToRead" | "betterPhoto" | "contextMatters"
  | "consistentConditions" | "photoPrivacy" | "goodToKnow" | "faqTitle" | "stayCurious"
  | "exploreAngle" | "allTools" | "privateAnalysis" | "faceInFocus" | "scanAnother"
  | "results" | "hide" | "show" | "points" | "photoTitle" | "photoPrompt"
  | "choosePhoto" | "takeSelfie" | "openingCamera" | "samplePortrait" | "livePreview"
  | "processingTitle" | "privacyLine" | "centerFace" | "captureSelfie" | "cancel"
  | "formats" | "privateScan" | "storyTitle" | "storyDescription" | "tipStraight"
  | "tipLighting" | "tipFrame" | "deviceOnly" | "analysisReady" | "measurementReading"
  | "noAccount" | "saveMeasurements" | "saveReport" | "copyLink" | "copied"
  | "viewReport" | "removePhoto" | "uploadOutfit" | "uploadSkin" | "outfitCheck"
  | "checklistNotRating" | "choosePhotoReference" | "occasion" | "priority"
  | "quickCheck" | "beforeGo" | "allChecked" | "skinFeel" | "skinConcern"
  | "skinAdvice" | "cosmeticOnly" | "skinPhotoDisclaimer" | "glowFocus"
  | "timeBudget" | "smallExperiments" | "lowPressurePlan" | "keepIdeas"
  | "makeupFinish" | "colorPreference" | "faceShapeIdea" | "eyeShapeIdea"
  | "eyeCornerDetail" | "chosenStyle" | "mirrorTitle" | "mirrorDescription"
  | "openCamera" | "stopCamera" | "mirrorView" | "trueView" | "cameraPrivate"
  | "metricSymmetry" | "metricProportions" | "metricThirds" | "metricFifths"
  | "metricEyes" | "metricJaw" | "featureStandout" | "nextArea" | "visibleShape"
  | "harmonyProfile" | "behindNumbers" | "closerLook" | "firstStep" | "smallChange"
  | "styleNotes" | "looksToExplore" | "notMeasured" | "completeLook" | "freePreview"
  | "scanTool" | "skinTool" | "outfitTool" | "glowTool" | "mirrorTool"
  | "photoFormatsPrivate" | "outfitPhotoReady" | "skinPhotoReady"
  | "removeOutfitPhoto" | "removeSkinPhoto" | "mirrorExplanation";

export const toolUiCopy: Partial<Record<Locale, Partial<Record<ToolCopyKey, string>>>> = {
  "es-ES": {
    home: "Inicio", tools: "Herramientas gratis", freeDevice: "Gratis · en tu dispositivo", privateCamera: "Cámara privada en directo",
    method: "El método", methodTitle: "La medida detrás del significado.", methodIntro: "Sin fórmulas secretas ni cargas misteriosas. Queremos que sepas exactamente en qué se basa el resultado.",
    measurement: "LA MEDICIÓN", howToRead: "CÓMO INTERPRETARLO", betterPhoto: "UNA MEJOR FOTO", contextMatters: "El contexto lo es todo.", consistentConditions: "Mantén las condiciones constantes.",
    photoPrivacy: "El análisis se realiza en tu dispositivo. Tu foto no se envía para el análisis gratuito.", goodToKnow: "Información útil", faqTitle: "Preguntas frecuentes.",
    stayCurious: "Sigue explorando", exploreAngle: "Descubre otra perspectiva.", allTools: "Ver todas las herramientas", privateAnalysis: "Tu análisis privado", faceInFocus: "Tu rostro, en detalle.", scanAnother: "Analizar otra foto", results: "Tus resultados", hide: "Ocultar", show: "Mostrar", points: "puntos",
    photoTitle: "Empieza con una foto tuya.", photoPrompt: "Arrastra una selfie nítida y de frente aquí o elige una foto de tu dispositivo.", choosePhoto: "Elegir una foto", takeSelfie: "Hacerme un selfie", openingCamera: "Abriendo la cámara…", samplePortrait: "O prueba con nuestro retrato de ejemplo", livePreview: "Vista previa del selfie",
    processingTitle: "Analizando la imagen.", privacyLine: "Tu foto nunca sale de este navegador.", centerFace: "Centra el rostro y busca una luz suave y uniforme.", captureSelfie: "Hacer selfie", cancel: "Cancelar", formats: "JPG, PNG o WebP · hasta 15 MB",
    privateScan: "Análisis privado", storyTitle: "Tu rostro cuenta una historia única.", storyDescription: "Medimos la relación entre tus rasgos y explicamos el resultado con palabras claras.",
    tipStraight: "Mira directamente a la cámara", tipLighting: "Usa una luz suave y uniforme", tipFrame: "Mantén todo el rostro dentro del encuadre", deviceOnly: "Todo el análisis facial ocurre en este dispositivo.", analysisReady: "Análisis completado", measurementReading: "Una estimación basada en esta foto", noAccount: "No necesitas una cuenta.",
    saveMeasurements: "Guardar medidas", saveReport: "Guardar informe", copyLink: "Copiar enlace", copied: "Copiado", viewReport: "Ver informe", removePhoto: "Eliminar foto",
    uploadOutfit: "Añade una foto de tu conjunto como referencia", uploadSkin: "Añade una foto para tu revisión de piel", outfitCheck: "Tu revisión de conjunto", checklistNotRating: "Una lista de comprobación, no una valoración", choosePhotoReference: "Elegir una foto", occasion: "¿Adónde vas?", priority: "¿Qué es lo más importante hoy?", quickCheck: "Una revisión rápida antes de salir", beforeGo: "Antes de salir, comprueba:", allChecked: "Has marcado los tres puntos básicos. Si te sientes a gusto y encaja con tus planes, ya está.",
    skinFeel: "¿Cómo suele sentirse tu piel después de lavarla?", skinConcern: "¿Sobre qué tema te gustaría recibir consejos generales?", skinAdvice: "Pautas sencillas", cosmeticOnly: "Orientación cosmética, no médica", skinPhotoDisclaimer: "La foto permanece en este navegador y no se analiza automáticamente. Los consejos se basan en tus respuestas.",
    glowFocus: "¿Qué te gustaría explorar?", timeBudget: "¿Cuánto tiempo te parece realista?", smallExperiments: "Solo pequeños experimentos. No hace falta comprar nada ni hacer cambios.", lowPressurePlan: "Un plan sin presión", keepIdeas: "Quédate solo con las ideas que te resulten cómodas y adecuadas.",
    makeupFinish: "Acabado de maquillaje", colorPreference: "Preferencia de color", faceShapeIdea: "Idea para la forma del rostro", eyeShapeIdea: "Idea para la forma de los ojos", eyeCornerDetail: "Detalle del ángulo del ojo", chosenStyle: "Estilo elegido",
    mirrorTitle: "Una perspectiva diferente.", mirrorDescription: "Abre la cámara para ver el reflejo habitual y la imagen sin invertir.", openCamera: "Abrir mi cámara", stopCamera: "Detener cámara", mirrorView: "Vista reflejada", trueView: "Vista real", cameraPrivate: "En directo. Nunca se graba ni se sube.",
    metricSymmetry: "Simetría", metricProportions: "Proporciones", metricThirds: "Tercios", metricFifths: "Quintos", metricEyes: "Ojos", metricJaw: "Mandíbula",
    featureStandout: "Rasgo destacado", nextArea: "Siguiente aspecto", visibleShape: "Forma visible del rostro", harmonyProfile: "Perfil de armonía", behindNumbers: "Qué hay detrás de las cifras", closerLook: "Un análisis más detallado", firstStep: "Tu primer paso", smallChange: "Un pequeño cambio, a tu manera.", styleNotes: "Notas de estilo", looksToExplore: "Estilos para explorar", notMeasured: "No se mide con una foto frontal:",
  },
  fr: {
    home: "Accueil", tools: "Outils gratuits", freeDevice: "Gratuit · sur votre appareil", privateCamera: "Caméra privée en direct",
    method: "La méthode", methodTitle: "La mesure derrière le résultat.", methodIntro: "Pas de formule secrète ni de transfert mystérieux. Vous méritez de savoir exactement sur quoi repose le résultat.",
    measurement: "LA MESURE", howToRead: "COMMENT L’INTERPRÉTER", betterPhoto: "UNE MEILLEURE PHOTO", contextMatters: "Tout est une question de contexte.", consistentConditions: "Gardez des conditions similaires.",
    photoPrivacy: "L’analyse se déroule sur votre appareil. Votre photo n’est jamais envoyée pour une analyse gratuite.", goodToKnow: "À savoir", faqTitle: "Questions fréquentes.",
    stayCurious: "Explorez encore", exploreAngle: "Découvrez un autre angle.", allTools: "Voir tous les outils", privateAnalysis: "Votre analyse privée", faceInFocus: "Votre visage en détail.", scanAnother: "Analyser une autre photo", results: "Vos résultats", hide: "Masquer", show: "Afficher", points: "points",
    photoTitle: "Commencez par une photo de vous.", photoPrompt: "Déposez ici un selfie net de face ou choisissez une photo sur votre appareil.", choosePhoto: "Choisir une photo", takeSelfie: "Prendre un selfie", openingCamera: "Ouverture de la caméra…", samplePortrait: "Ou essayer avec notre portrait d’exemple", livePreview: "Aperçu du selfie en direct",
    processingTitle: "Analyse de l’image.", privacyLine: "Votre photo ne quitte jamais ce navigateur.", centerFace: "Centrez votre visage et choisissez une lumière douce et uniforme.", captureSelfie: "Prendre le selfie", cancel: "Annuler", formats: "JPG, PNG ou WebP · 15 Mo maximum",
    privateScan: "Analyse privée", storyTitle: "Votre visage raconte une histoire unique.", storyDescription: "Nous mesurons les relations entre les traits et expliquons les résultats clairement.",
    tipStraight: "Regardez directement l’appareil", tipLighting: "Utilisez une lumière douce et uniforme", tipFrame: "Gardez tout votre visage dans le cadre", deviceOnly: "Toute détection faciale se déroule sur cet appareil.", analysisReady: "Analyse terminée", measurementReading: "Une estimation à partir de cette photo", noAccount: "Aucun compte nécessaire.",
    saveMeasurements: "Enregistrer les mesures", saveReport: "Enregistrer le rapport", copyLink: "Copier le lien", copied: "Copié", viewReport: "Voir le rapport", removePhoto: "Supprimer la photo",
    uploadOutfit: "Ajoutez une photo de tenue comme référence", uploadSkin: "Ajoutez une photo pour votre bilan de peau", outfitCheck: "Votre bilan de tenue", checklistNotRating: "Une liste de contrôle, pas une note", choosePhotoReference: "Choisir une photo", occasion: "Où allez-vous ?", priority: "Qu’est-ce qui compte le plus aujourd’hui ?", quickCheck: "Un petit contrôle avant de partir", beforeGo: "Avant de partir, vérifiez :", allChecked: "Vous avez vérifié les trois points. Si vous êtes à l’aise et que cela convient à vos projets, vous êtes prêt·e.",
    skinFeel: "Comment votre peau se sent-elle après le lavage ?", skinConcern: "Sur quel sujet souhaitez-vous des conseils généraux ?", skinAdvice: "Conseils tout en douceur", cosmeticOnly: "Conseils cosmétiques uniquement", skinPhotoDisclaimer: "La photo reste dans ce navigateur et n’est pas analysée automatiquement. Les conseils sont basés sur vos réponses.",
    glowFocus: "Que souhaitez-vous explorer ?", timeBudget: "Quel temps vous semble réaliste ?", smallExperiments: "De petites expériences seulement. Aucun achat ni changement n’est nécessaire.", lowPressurePlan: "Un plan sans pression", keepIdeas: "Gardez uniquement les idées agréables et adaptées à vos envies.",
    makeupFinish: "Finition du maquillage", colorPreference: "Préférence de couleurs", faceShapeIdea: "Idée selon la forme du visage", eyeShapeIdea: "Idée selon la forme des yeux", eyeCornerDetail: "Angle du coin de l’œil", chosenStyle: "Style choisi",
    mirrorTitle: "Une autre perspective.", mirrorDescription: "Ouvrez la caméra pour voir le reflet habituel et votre image non inversée.", openCamera: "Ouvrir ma caméra", stopCamera: "Arrêter la caméra", mirrorView: "Vue miroir", trueView: "Vue réelle", cameraPrivate: "En direct uniquement. Jamais enregistrée ni envoyée.",
    metricSymmetry: "Symétrie", metricProportions: "Proportions", metricThirds: "Tiers", metricFifths: "Cinquièmes", metricEyes: "Yeux", metricJaw: "Mâchoire",
    featureStandout: "Trait remarquable", nextArea: "Prochain point", visibleShape: "Forme visible du visage", harmonyProfile: "Profil d’harmonie", behindNumbers: "Derrière les chiffres", closerLook: "Un regard plus attentif", firstStep: "Votre premier pas", smallChange: "Un petit changement, à votre façon.", styleNotes: "Notes de style", looksToExplore: "Styles à explorer", notMeasured: "Non mesuré sur une photo de face :",
  },
  de: {
    home: "Startseite", tools: "Kostenlose Tools", freeDevice: "Kostenlos · auf Ihrem Gerät", privateCamera: "Private Live-Kamera",
    method: "Die Methode", methodTitle: "Die Messung hinter der Bedeutung.", methodIntro: "Keine geheime Formel und kein rätselhafter Upload. Sie sollen genau wissen, worauf Ihr Ergebnis beruht.",
    measurement: "DIE MESSUNG", howToRead: "SO LESEN SIE DAS ERGEBNIS", betterPhoto: "EIN BESSERES FOTO", contextMatters: "Der Kontext ist entscheidend.", consistentConditions: "Achten Sie auf vergleichbare Bedingungen.",
    photoPrivacy: "Die Analyse läuft auf Ihrem Gerät. Für den kostenlosen Scan wird Ihr Foto nicht übertragen.", goodToKnow: "Gut zu wissen", faqTitle: "Häufig gestellte Fragen.",
    stayCurious: "Bleiben Sie neugierig", exploreAngle: "Entdecken Sie eine andere Perspektive.", allTools: "Alle Tools ansehen", privateAnalysis: "Ihre private Analyse", faceInFocus: "Ihr Gesicht im Fokus.", scanAnother: "Weiteres Foto analysieren", results: "Ihre Ergebnisse", hide: "Ausblenden", show: "Einblenden", points: "Punkte",
    photoTitle: "Starten Sie mit einem Foto von sich.", photoPrompt: "Ziehen Sie ein klares Frontal-Selfie hierher oder wählen Sie ein Foto von Ihrem Gerät.", choosePhoto: "Foto auswählen", takeSelfie: "Selfie aufnehmen", openingCamera: "Kamera wird geöffnet …", samplePortrait: "Oder mit unserem Beispielporträt ausprobieren", livePreview: "Live-Selfie-Vorschau",
    processingTitle: "Bild wird analysiert.", privacyLine: "Ihr Foto verlässt diesen Browser nie.", centerFace: "Richten Sie Ihr Gesicht mittig aus und nutzen Sie weiches, gleichmäßiges Licht.", captureSelfie: "Selfie aufnehmen", cancel: "Abbrechen", formats: "JPG, PNG oder WebP · bis zu 15 MB",
    privateScan: "Privater Scan", storyTitle: "Ihr Gesicht erzählt eine eigene Geschichte.", storyDescription: "Wir messen die Beziehungen zwischen Merkmalen und erklären die Ergebnisse verständlich.",
    tipStraight: "Blicken Sie gerade in die Kamera", tipLighting: "Nutzen Sie weiches, gleichmäßiges Licht", tipFrame: "Lassen Sie Ihr ganzes Gesicht im Bild", deviceOnly: "Die Gesichtserkennung erfolgt vollständig auf diesem Gerät.", analysisReady: "Analyse abgeschlossen", measurementReading: "Eine Schätzung anhand dieses Fotos", noAccount: "Kein Konto erforderlich.",
    saveMeasurements: "Messwerte speichern", saveReport: "Bericht speichern", copyLink: "Link kopieren", copied: "Kopiert", viewReport: "Bericht ansehen", removePhoto: "Foto entfernen",
    uploadOutfit: "Fügen Sie ein Outfit-Foto als Referenz hinzu", uploadSkin: "Fügen Sie ein Foto für Ihren Haut-Check hinzu", outfitCheck: "Ihr Outfit-Check", checklistNotRating: "Eine Checkliste, keine Bewertung", choosePhotoReference: "Foto auswählen", occasion: "Wohin gehen Sie?", priority: "Was ist Ihnen heute am wichtigsten?", quickCheck: "Ein kurzer Check vor dem Losgehen", beforeGo: "Prüfen Sie vor dem Losgehen:", allChecked: "Sie haben alle drei Punkte geprüft. Wenn Sie sich wohlfühlen und es zu Ihren Plänen passt, sind Sie bereit.",
    skinFeel: "Wie fühlt sich Ihre Haut nach dem Waschen normalerweise an?", skinConcern: "Zu welchem Thema wünschen Sie allgemeine Tipps?", skinAdvice: "Sanfte Ansatzpunkte", cosmeticOnly: "Nur kosmetische Orientierung", skinPhotoDisclaimer: "Das Foto bleibt in diesem Browser und wird nicht automatisch analysiert. Die Tipps basieren auf Ihren Antworten.",
    glowFocus: "Was möchten Sie erkunden?", timeBudget: "Wie viel Zeit ist realistisch?", smallExperiments: "Nur kleine Experimente. Käufe oder Änderungen sind nicht erforderlich.", lowPressurePlan: "Ein Plan ohne Druck", keepIdeas: "Behalten Sie nur Ideen, die sich angenehm und passend anfühlen.",
    makeupFinish: "Make-up-Finish", colorPreference: "Bevorzugte Farbrichtung", faceShapeIdea: "Idee zur Gesichtsform", eyeShapeIdea: "Idee zur Augenform", eyeCornerDetail: "Augenwinkel-Detail", chosenStyle: "Gewählter Stil",
    mirrorTitle: "Eine andere Perspektive.", mirrorDescription: "Öffnen Sie die Kamera, um das vertraute Spiegelbild und die nicht gespiegelte Ansicht zu sehen.", openCamera: "Kamera öffnen", stopCamera: "Kamera stoppen", mirrorView: "Gespiegelte Ansicht", trueView: "Echte Ansicht", cameraPrivate: "Nur live. Wird weder aufgenommen noch hochgeladen.",
    metricSymmetry: "Symmetrie", metricProportions: "Proportionen", metricThirds: "Drittel", metricFifths: "Fünftel", metricEyes: "Augen", metricJaw: "Kiefer",
    featureStandout: "Auffälliges Merkmal", nextArea: "Nächster Bereich", visibleShape: "Sichtbare Gesichtsform", harmonyProfile: "Harmonieprofil", behindNumbers: "Hinter den Zahlen", closerLook: "Der genauere Blick", firstStep: "Ihr erster Schritt", smallChange: "Eine kleine Veränderung, auf Ihre Art.", styleNotes: "Styling-Notizen", looksToExplore: "Looks zum Entdecken", notMeasured: "Auf einem Frontalfoto nicht messbar:",
  },
  "pt-BR": {
    home: "Início", tools: "Ferramentas grátis", freeDevice: "Grátis · no seu dispositivo", privateCamera: "Câmera privada ao vivo",
    method: "O método", methodTitle: "A medida por trás do significado.", methodIntro: "Sem fórmulas secretas ou envios misteriosos. Você merece saber exatamente em que seu resultado se baseia.",
    measurement: "A MEDIDA", howToRead: "COMO INTERPRETAR", betterPhoto: "UMA FOTO MELHOR", contextMatters: "O contexto faz toda a diferença.", consistentConditions: "Mantenha as condições consistentes.",
    photoPrivacy: "A análise acontece no seu dispositivo. Sua foto não é enviada na análise grátis.", goodToKnow: "É bom saber", faqTitle: "Perguntas frequentes.",
    stayCurious: "Continue explorando", exploreAngle: "Explore outro ângulo.", allTools: "Ver todas as ferramentas", privateAnalysis: "Sua análise privada", faceInFocus: "Seu rosto em foco.", scanAnother: "Analisar outra foto", results: "Seus resultados", hide: "Ocultar", show: "Mostrar", points: "pontos",
    photoTitle: "Comece com uma foto sua.", photoPrompt: "Arraste uma selfie nítida e de frente para cá ou escolha uma foto do seu dispositivo.", choosePhoto: "Escolher uma foto", takeSelfie: "Tirar uma selfie", openingCamera: "Abrindo a câmera…", samplePortrait: "Ou experimente com nosso retrato de exemplo", livePreview: "Prévia da selfie ao vivo",
    processingTitle: "Analisando a imagem.", privacyLine: "Sua foto nunca sai deste navegador.", centerFace: "Centralize o rosto e use uma iluminação suave e uniforme.", captureSelfie: "Capturar selfie", cancel: "Cancelar", formats: "JPG, PNG ou WebP · até 15 MB",
    privateScan: "Análise privada", storyTitle: "Seu rosto conta uma história única.", storyDescription: "Medimos a relação entre os traços e explicamos o resultado com clareza.",
    tipStraight: "Olhe diretamente para a câmera", tipLighting: "Use uma iluminação suave e uniforme", tipFrame: "Mantenha o rosto inteiro no enquadramento", deviceOnly: "Toda a detecção facial acontece neste dispositivo.", analysisReady: "Análise concluída", measurementReading: "Uma estimativa baseada nesta foto", noAccount: "Não precisa de conta.",
    saveMeasurements: "Salvar medidas", saveReport: "Salvar relatório", copyLink: "Copiar link", copied: "Copiado", viewReport: "Ver relatório", removePhoto: "Remover foto",
    uploadOutfit: "Adicione uma foto do look como referência", uploadSkin: "Adicione uma foto para sua avaliação de pele", outfitCheck: "Sua avaliação do look", checklistNotRating: "Uma lista de verificação, não uma nota", choosePhotoReference: "Escolher uma foto", occasion: "Para onde você vai?", priority: "O que importa mais hoje?", quickCheck: "Uma revisão rápida antes de sair", beforeGo: "Antes de sair, confira:", allChecked: "Você conferiu os três pontos básicos. Se estiver confortável e combinar com seus planos, está pronto.",
    skinFeel: "Como sua pele costuma ficar depois de lavar?", skinConcern: "Sobre o que gostaria de receber dicas gerais?", skinAdvice: "Cuidados simples para começar", cosmeticOnly: "Orientação cosmética apenas", skinPhotoDisclaimer: "A foto fica neste navegador e não é analisada automaticamente. As dicas são baseadas nas suas respostas.",
    glowFocus: "O que você gostaria de explorar?", timeBudget: "Quanto tempo parece realista?", smallExperiments: "Apenas pequenas experiências. Não é preciso comprar nada nem fazer mudanças.", lowPressurePlan: "Um plano sem pressão", keepIdeas: "Fique apenas com as ideias que forem confortáveis e fizerem sentido para você.",
    makeupFinish: "Acabamento da maquiagem", colorPreference: "Preferência de cores", faceShapeIdea: "Ideia para o formato do rosto", eyeShapeIdea: "Ideia para o formato dos olhos", eyeCornerDetail: "Detalhe do canto dos olhos", chosenStyle: "Estilo escolhido",
    mirrorTitle: "Uma perspectiva diferente.", mirrorDescription: "Abra a câmera para ver o reflexo habitual e a imagem sem espelhamento.", openCamera: "Abrir minha câmera", stopCamera: "Parar câmera", mirrorView: "Visão espelhada", trueView: "Visão real", cameraPrivate: "Ao vivo. Nunca gravada ou enviada.",
    metricSymmetry: "Simetria", metricProportions: "Proporções", metricThirds: "Terços", metricFifths: "Quintos", metricEyes: "Olhos", metricJaw: "Mandíbula",
    featureStandout: "Destaque", nextArea: "Próxima área", visibleShape: "Formato visível do rosto", harmonyProfile: "Perfil de harmonia", behindNumbers: "Por trás dos números", closerLook: "Um olhar mais atento", firstStep: "Seu primeiro passo", smallChange: "Uma pequena mudança, do seu jeito.", styleNotes: "Notas de estilo", looksToExplore: "Estilos para explorar", notMeasured: "Não medido em uma foto frontal:",
  },
  hi: {
    home: "होम", tools: "मुफ़्त टूल", freeDevice: "मुफ़्त · आपके डिवाइस पर", privateCamera: "निजी लाइव कैमरा",
    method: "तरीका", methodTitle: "माप के पीछे का अर्थ।", methodIntro: "कोई गुप्त फ़ॉर्मूला या रहस्यमय अपलोड नहीं। आपको पता होना चाहिए कि आपका परिणाम किस आधार पर है।",
    measurement: "माप", howToRead: "इसे कैसे समझें", betterPhoto: "बेहतर फ़ोटो", contextMatters: "संदर्भ बहुत मायने रखता है।", consistentConditions: "फ़ोटो की स्थितियाँ समान रखें।",
    photoPrivacy: "विश्लेषण आपके डिवाइस पर होता है। मुफ़्त स्कैन के लिए आपकी फ़ोटो नहीं भेजी जाती।", goodToKnow: "जानने योग्य बातें", faqTitle: "अक्सर पूछे जाने वाले सवाल।",
    stayCurious: "जिज्ञासु बने रहें", exploreAngle: "एक और नज़रिया देखें।", allTools: "सभी टूल देखें", privateAnalysis: "आपका निजी विश्लेषण", faceInFocus: "आपका चेहरा, साफ़ नज़र में।", scanAnother: "दूसरी फ़ोटो स्कैन करें", results: "आपके नतीजे", hide: "छिपाएँ", show: "दिखाएँ", points: "बिंदु",
    photoTitle: "अपनी फ़ोटो से शुरुआत करें।", photoPrompt: "साफ़, सामने से ली गई सेल्फ़ी यहाँ डालें या अपने डिवाइस से फ़ोटो चुनें।", choosePhoto: "फ़ोटो चुनें", takeSelfie: "सेल्फ़ी लें", openingCamera: "कैमरा खुल रहा है…", samplePortrait: "या नमूना पोर्ट्रेट के साथ आज़माएँ", livePreview: "लाइव सेल्फ़ी पूर्वावलोकन",
    processingTitle: "तस्वीर का विश्लेषण हो रहा है।", privacyLine: "आपकी फ़ोटो इस ब्राउज़र से बाहर नहीं जाती।", centerFace: "चेहरे को बीच में रखें और नरम, समान रोशनी चुनें।", captureSelfie: "सेल्फ़ी कैप्चर करें", cancel: "रद्द करें", formats: "JPG, PNG या WebP · अधिकतम 15 MB",
    privateScan: "निजी स्कैन", storyTitle: "आपका चेहरा एक अनोखी कहानी बताता है।", storyDescription: "हम चेहरे की विशेषताओं के संबंध मापते हैं और नतीजों को साफ़ शब्दों में समझाते हैं।",
    tipStraight: "कैमरे की ओर सीधे देखें", tipLighting: "नरम और समान रोशनी रखें", tipFrame: "पूरा चेहरा फ़्रेम में रखें", deviceOnly: "चेहरे की पहचान इसी डिवाइस पर होती है।", analysisReady: "विश्लेषण पूरा", measurementReading: "इस फ़ोटो पर आधारित अनुमान", noAccount: "खाते की ज़रूरत नहीं।",
    saveMeasurements: "माप सहेजें", saveReport: "रिपोर्ट सहेजें", copyLink: "लिंक कॉपी करें", copied: "कॉपी हो गया", viewReport: "रिपोर्ट देखें", removePhoto: "फ़ोटो हटाएँ",
    uploadOutfit: "अपने पहनावे की फ़ोटो संदर्भ के लिए जोड़ें", uploadSkin: "त्वचा की जाँच के लिए फ़ोटो जोड़ें", outfitCheck: "आपके पहनावे की जाँच", checklistNotRating: "जाँच सूची, रेटिंग नहीं", choosePhotoReference: "फ़ोटो चुनें", occasion: "आप कहाँ जा रहे हैं?", priority: "आज सबसे ज़रूरी क्या है?", quickCheck: "निकलने से पहले एक छोटी जाँच", beforeGo: "जाने से पहले देखें:", allChecked: "आपने तीनों बातों की जाँच कर ली। अगर आप सहज हैं और यह आपकी योजना के अनुकूल है, तो तैयार हैं।",
    skinFeel: "धोने के बाद आपकी त्वचा आमतौर पर कैसी लगती है?", skinConcern: "आप किस बारे में सामान्य सुझाव चाहते हैं?", skinAdvice: "कोमल शुरुआत", cosmeticOnly: "केवल कॉस्मेटिक जानकारी", skinPhotoDisclaimer: "फ़ोटो इसी ब्राउज़र में रहती है और इसका अपने-आप विश्लेषण नहीं होता। सुझाव आपके जवाबों पर आधारित हैं।",
    glowFocus: "आप क्या जानना चाहेंगे?", timeBudget: "कितना समय देना व्यावहारिक लगेगा?", smallExperiments: "केवल छोटे प्रयोग। खरीदारी या बदलाव ज़रूरी नहीं हैं।", lowPressurePlan: "बिना दबाव की योजना", keepIdeas: "केवल वही सुझाव अपनाएँ जो आपको सहज और सही लगें।",
    makeupFinish: "मेकअप का अंदाज़", colorPreference: "पसंदीदा रंग", faceShapeIdea: "चेहरे के आकार का सुझाव", eyeShapeIdea: "आँखों के आकार का सुझाव", eyeCornerDetail: "आँख के कोने का विवरण", chosenStyle: "चुना हुआ अंदाज़",
    mirrorTitle: "एक अलग नज़रिया।", mirrorDescription: "सामान्य प्रतिबिंब और बिना उलटी दिशा वाला दृश्य देखने के लिए कैमरा खोलें।", openCamera: "मेरा कैमरा खोलें", stopCamera: "कैमरा बंद करें", mirrorView: "प्रतिबिंबित दृश्य", trueView: "वास्तविक दृश्य", cameraPrivate: "केवल लाइव। रिकॉर्ड या अपलोड नहीं होता।",
    metricSymmetry: "सममिति", metricProportions: "अनुपात", metricThirds: "तीन भाग", metricFifths: "पाँच भाग", metricEyes: "आँखें", metricJaw: "जबड़ा",
    featureStandout: "खास विशेषता", nextArea: "अगला पहलू", visibleShape: "चेहरे का दिखने वाला आकार", harmonyProfile: "संतुलन प्रोफ़ाइल", behindNumbers: "इन अंकों के पीछे", closerLook: "थोड़ा और करीब से", firstStep: "आपका पहला कदम", smallChange: "छोटा बदलाव, आपके तरीके से।", styleNotes: "स्टाइल सुझाव", looksToExplore: "आज़माने के लिए अंदाज़", notMeasured: "सामने की फ़ोटो से नहीं मापा जाता:",
  },
  "ar-SA": {
    home: "الرئيسية", tools: "أدوات مجانية", freeDevice: "مجانًا · على جهازك", privateCamera: "كاميرا مباشرة وخاصة",
    method: "المنهج", methodTitle: "القياس وراء النتيجة.", methodIntro: "لا معادلات سرية ولا رفع غامض للصور. من حقك معرفة الأساس الذي بُنيت عليه النتيجة.",
    measurement: "القياس", howToRead: "طريقة قراءة النتيجة", betterPhoto: "صورة أوضح", contextMatters: "السياق مهم.", consistentConditions: "حافظ على ظروف تصوير متقاربة.",
    photoPrivacy: "يُجرى التحليل على جهازك. لا تُرسل صورتك عند استخدام الفحص المجاني.", goodToKnow: "معلومات مهمة", faqTitle: "الأسئلة الشائعة.",
    stayCurious: "واصل الاستكشاف", exploreAngle: "استكشف جانبًا آخر.", allTools: "عرض جميع الأدوات", privateAnalysis: "تحليلك الخاص", faceInFocus: "ملامح وجهك بوضوح.", scanAnother: "تحليل صورة أخرى", results: "نتائجك", hide: "إخفاء", show: "إظهار", points: "نقطة",
    photoTitle: "ابدأ بصورة لك.", photoPrompt: "اسحب صورة سيلفي واضحة ومباشرة إلى هنا أو اختر صورة من جهازك.", choosePhoto: "اختر صورة", takeSelfie: "التقط صورة سيلفي", openingCamera: "جارٍ فتح الكاميرا…", samplePortrait: "أو جرّب الصورة النموذجية", livePreview: "معاينة سيلفي مباشرة",
    processingTitle: "جارٍ تحليل الصورة.", privacyLine: "لا تغادر صورتك هذا المتصفح أبدًا.", centerFace: "ضع وجهك في المنتصف واستخدم إضاءة ناعمة ومتوازنة.", captureSelfie: "التقط سيلفي", cancel: "إلغاء", formats: "JPG أو PNG أو WebP · حتى 15 ميغابايت",
    privateScan: "فحص خاص", storyTitle: "ملامح وجهك تحكي قصة فريدة.", storyDescription: "نقيس العلاقات بين الملامح ونشرح النتيجة بكلمات واضحة.",
    tipStraight: "انظر مباشرة إلى الكاميرا", tipLighting: "استخدم إضاءة ناعمة ومتوازنة", tipFrame: "أبقِ وجهك كاملًا داخل الإطار", deviceOnly: "يحدث اكتشاف الوجه بالكامل على هذا الجهاز.", analysisReady: "اكتمل التحليل", measurementReading: "تقدير مستند إلى هذه الصورة", noAccount: "لا حاجة إلى حساب.",
    saveMeasurements: "حفظ القياسات", saveReport: "حفظ التقرير", copyLink: "نسخ الرابط", copied: "تم النسخ", viewReport: "عرض التقرير", removePhoto: "إزالة الصورة",
    uploadOutfit: "أضف صورة للملابس كمرجع", uploadSkin: "أضف صورة لمراجعة البشرة", outfitCheck: "مراجعة إطلالتك", checklistNotRating: "قائمة تحقق وليست تقييمًا", choosePhotoReference: "اختر صورة", occasion: "إلى أين ستذهب؟", priority: "ما الأهم اليوم؟", quickCheck: "تحقق سريع قبل الخروج", beforeGo: "قبل الخروج، تحقق من:", allChecked: "راجعت النقاط الأساسية الثلاث. إذا كنت مرتاحًا وتناسب خططك، فأنت مستعد.",
    skinFeel: "كيف تشعر بشرتك عادةً بعد غسلها؟", skinConcern: "ما الموضوع الذي تريد نصائح عامة عنه؟", skinAdvice: "خطوات لطيفة للبدء", cosmeticOnly: "إرشادات تجميلية فقط", skinPhotoDisclaimer: "تبقى الصورة في هذا المتصفح ولا تُحلل تلقائيًا. تستند النصائح إلى إجاباتك.",
    glowFocus: "ما الذي ترغب في استكشافه؟", timeBudget: "ما مقدار الوقت المناسب لك؟", smallExperiments: "تجارب بسيطة فقط. لا حاجة للشراء أو لإجراء تغييرات.", lowPressurePlan: "خطة بلا ضغط", keepIdeas: "احتفظ بالأفكار المريحة والمناسبة لك فقط.",
    makeupFinish: "لمسة المكياج", colorPreference: "الألوان المفضلة", faceShapeIdea: "فكرة لشكل الوجه", eyeShapeIdea: "فكرة لشكل العين", eyeCornerDetail: "تفصيل زاوية العين", chosenStyle: "الأسلوب المختار",
    mirrorTitle: "منظور مختلف.", mirrorDescription: "افتح الكاميرا لرؤية انعكاس المرآة المعتاد والصورة غير المعكوسة.", openCamera: "افتح الكاميرا", stopCamera: "إيقاف الكاميرا", mirrorView: "عرض معكوس", trueView: "العرض الحقيقي", cameraPrivate: "مباشر فقط. لا يُسجل ولا يُرفع.",
    metricSymmetry: "التناسق", metricProportions: "النسب", metricThirds: "الأثلاث", metricFifths: "الأخماس", metricEyes: "العينان", metricJaw: "الفك",
    featureStandout: "السمة البارزة", nextArea: "الجانب التالي", visibleShape: "شكل الوجه الظاهر", harmonyProfile: "ملف التناسق", behindNumbers: "ما وراء الأرقام", closerLook: "نظرة أقرب", firstStep: "خطوتك الأولى", smallChange: "تغيير بسيط، بطريقتك.", styleNotes: "ملاحظات التنسيق", looksToExplore: "إطلالات لاستكشافها", notMeasured: "لا يُقاس من صورة أمامية:",
  },
  "zh-CN": {
    home: "首页", tools: "免费工具", freeDevice: "免费 · 在您的设备上", privateCamera: "私人实时摄像头",
    method: "测量方法", methodTitle: "读懂测量结果。", methodIntro: "没有秘密公式，也不会神秘上传。您应该清楚了解结果的依据。",
    measurement: "测量内容", howToRead: "如何解读", betterPhoto: "拍出更清晰的照片", contextMatters: "结果需要结合背景理解。", consistentConditions: "尽量保持拍摄条件一致。",
    photoPrivacy: "分析在您的设备上进行。免费扫描不会上传您的照片。", goodToKnow: "了解更多", faqTitle: "常见问题。",
    stayCurious: "继续探索", exploreAngle: "从另一个角度了解。", allTools: "查看所有工具", privateAnalysis: "您的私人分析", faceInFocus: "聚焦您的面部。", scanAnother: "分析另一张照片", results: "您的结果", hide: "隐藏", show: "显示", points: "个标记点",
    photoTitle: "从一张自己的照片开始。", photoPrompt: "将清晰的正面自拍拖到此处，或从设备中选择照片。", choosePhoto: "选择照片", takeSelfie: "拍摄自拍", openingCamera: "正在打开相机…", samplePortrait: "或试用示例人像", livePreview: "自拍实时预览",
    processingTitle: "正在分析图像。", privacyLine: "照片不会离开此浏览器。", centerFace: "将面部置于中央，并使用柔和均匀的光线。", captureSelfie: "拍摄自拍", cancel: "取消", formats: "JPG、PNG 或 WebP · 最大 15 MB",
    privateScan: "私人扫描", storyTitle: "每张脸都有独特的故事。", storyDescription: "我们测量面部特征之间的关系，并用清晰的语言解释结果。",
    tipStraight: "正对摄像头", tipLighting: "使用柔和均匀的光线", tipFrame: "确保整张脸都在画面中", deviceOnly: "所有面部检测都在此设备上完成。", analysisReady: "分析完成", measurementReading: "基于这张照片的估算", noAccount: "无需账户。",
    saveMeasurements: "保存测量结果", saveReport: "保存报告", copyLink: "复制链接", copied: "已复制", viewReport: "查看报告", removePhoto: "移除照片",
    uploadOutfit: "添加穿搭照片作为参考", uploadSkin: "添加照片进行护肤自查", outfitCheck: "穿搭自查", checklistNotRating: "清单，而非评分", choosePhotoReference: "选择照片", occasion: "您要去哪里？", priority: "今天最看重什么？", quickCheck: "出门前快速检查", beforeGo: "出门前请确认：", allChecked: "三项基本内容都已确认。如果穿着舒适并符合计划，就可以出发了。",
    skinFeel: "洗脸后您的皮肤通常有什么感觉？", skinConcern: "您希望了解哪方面的一般建议？", skinAdvice: "温和的护理建议", cosmeticOnly: "仅提供美容护理参考", skinPhotoDisclaimer: "照片保留在此浏览器中，不会自动分析。建议根据您的回答提供。",
    glowFocus: "您想探索什么？", timeBudget: "您觉得多少时间比较合适？", smallExperiments: "只做小尝试。无需购买或改变任何东西。", lowPressurePlan: "轻松无压力的计划", keepIdeas: "只保留让您感到舒适、适合自己的建议。",
    makeupFinish: "妆容效果", colorPreference: "偏好的颜色", faceShapeIdea: "脸型建议", eyeShapeIdea: "眼型建议", eyeCornerDetail: "眼角细节", chosenStyle: "选择的风格",
    mirrorTitle: "换个角度看看。", mirrorDescription: "打开相机，查看熟悉的镜像和未镜像的自己。", openCamera: "打开摄像头", stopCamera: "关闭摄像头", mirrorView: "镜像视图", trueView: "真实视图", cameraPrivate: "仅实时预览，不会录制或上传。",
    metricSymmetry: "对称度", metricProportions: "比例", metricThirds: "三庭", metricFifths: "五眼", metricEyes: "眼部", metricJaw: "下颌",
    featureStandout: "突出特点", nextArea: "下一个关注点", visibleShape: "可见脸型", harmonyProfile: "协调度概览", behindNumbers: "读懂这些数字", closerLook: "进一步了解", firstStep: "您的第一步", smallChange: "小小改变，由您决定。", styleNotes: "造型建议", looksToExplore: "可探索的造型", notMeasured: "正面照片无法测量：",
  },
  ja: {
    home: "ホーム", tools: "無料ツール", freeDevice: "無料 · お使いの端末で", privateCamera: "プライベートライブカメラ",
    method: "測定方法", methodTitle: "測定値の意味を知る。", methodIntro: "秘密の計算式や不明なアップロードはありません。結果の根拠を明確にお伝えします。",
    measurement: "測定内容", howToRead: "結果の見方", betterPhoto: "よりよい写真", contextMatters: "結果は状況と合わせて見ましょう。", consistentConditions: "撮影条件をそろえましょう。",
    photoPrivacy: "分析は端末内で行われます。無料スキャンで写真が送信されることはありません。", goodToKnow: "知っておきたいこと", faqTitle: "よくある質問。",
    stayCurious: "さらに探索", exploreAngle: "別の視点から見てみましょう。", allTools: "すべてのツールを見る", privateAnalysis: "プライベート分析", faceInFocus: "顔の特徴を詳しく。", scanAnother: "別の写真を分析", results: "分析結果", hide: "隠す", show: "表示", points: "点",
    photoTitle: "ご自身の写真から始めましょう。", photoPrompt: "鮮明な正面の自撮りをここにドロップするか、端末から写真を選択してください。", choosePhoto: "写真を選択", takeSelfie: "自撮りを撮る", openingCamera: "カメラを起動中…", samplePortrait: "サンプル画像で試す", livePreview: "自撮りのライブプレビュー",
    processingTitle: "画像を分析しています。", privacyLine: "写真がこのブラウザーの外に送られることはありません。", centerFace: "顔を中央に合わせ、柔らかく均一な光を使ってください。", captureSelfie: "自撮りを撮影", cancel: "キャンセル", formats: "JPG、PNG、WebP · 15 MBまで",
    privateScan: "プライベートスキャン", storyTitle: "顔には一人ひとりの物語があります。", storyDescription: "顔の特徴の関係を測定し、結果をわかりやすく説明します。",
    tipStraight: "カメラをまっすぐ見てください", tipLighting: "柔らかく均一な光を使ってください", tipFrame: "顔全体をフレームに入れてください", deviceOnly: "顔の検出はすべてこの端末内で行われます。", analysisReady: "分析が完了しました", measurementReading: "この写真に基づく推定値", noAccount: "アカウントは不要です。",
    saveMeasurements: "測定値を保存", saveReport: "レポートを保存", copyLink: "リンクをコピー", copied: "コピーしました", viewReport: "レポートを見る", removePhoto: "写真を削除",
    uploadOutfit: "参考用にコーディネート写真を追加", uploadSkin: "肌のセルフチェック用写真を追加", outfitCheck: "コーディネートチェック", checklistNotRating: "評価ではなくチェックリスト", choosePhotoReference: "写真を選択", occasion: "どこへ出かけますか？", priority: "今日いちばん大切なことは？", quickCheck: "出かける前の簡単チェック", beforeGo: "出かける前に確認しましょう：", allChecked: "基本の3項目を確認しました。快適で予定に合っていれば準備完了です。",
    skinFeel: "洗顔後、肌はどのように感じますか？", skinConcern: "どのような一般的なアドバイスを知りたいですか？", skinAdvice: "やさしいケアのヒント", cosmeticOnly: "美容目的の一般情報です", skinPhotoDisclaimer: "写真はこのブラウザー内にとどまり、自動分析されません。アドバイスは回答に基づきます。",
    glowFocus: "何について知りたいですか？", timeBudget: "どのくらいの時間なら無理なく使えますか？", smallExperiments: "小さな工夫だけです。購入や変更は必要ありません。", lowPressurePlan: "無理のないプラン", keepIdeas: "心地よく、自分に合うアイデアだけを取り入れましょう。",
    makeupFinish: "メイクの仕上がり", colorPreference: "好みの色", faceShapeIdea: "顔型に合わせたアイデア", eyeShapeIdea: "目の形に合わせたアイデア", eyeCornerDetail: "目尻の角度", chosenStyle: "選んだスタイル",
    mirrorTitle: "いつもと違う視点。", mirrorDescription: "カメラを開いて、鏡で見る姿と左右反転していない姿を確認できます。", openCamera: "カメラを開く", stopCamera: "カメラを停止", mirrorView: "鏡像", trueView: "実際の見え方", cameraPrivate: "ライブ表示のみ。録画・アップロードされません。",
    metricSymmetry: "対称性", metricProportions: "比率", metricThirds: "三分割", metricFifths: "五分割", metricEyes: "目", metricJaw: "あご",
    featureStandout: "特徴的なポイント", nextArea: "次のポイント", visibleShape: "写真で見える顔型", harmonyProfile: "バランスの概要", behindNumbers: "数値の背景", closerLook: "詳しく見る", firstStep: "最初の一歩", smallChange: "小さな変化を自分らしく。", styleNotes: "スタイルのヒント", looksToExplore: "試してみたいスタイル", notMeasured: "正面写真では測定できません：",
  },
  ru: {
    home: "Главная", tools: "Бесплатные инструменты", freeDevice: "Бесплатно · на вашем устройстве", privateCamera: "Приватная камера",
    method: "Методика", methodTitle: "Что стоит за измерениями.", methodIntro: "Никаких секретных формул и скрытой отправки фото. Вы должны знать, на чём основан результат.",
    measurement: "ИЗМЕРЕНИЕ", howToRead: "КАК ЧИТАТЬ РЕЗУЛЬТАТ", betterPhoto: "КАК СДЕЛАТЬ ФОТО ЛУЧШЕ", contextMatters: "Важен контекст.", consistentConditions: "Соблюдайте одинаковые условия съёмки.",
    photoPrivacy: "Анализ выполняется на вашем устройстве. Фото не отправляется при бесплатном сканировании.", goodToKnow: "Полезно знать", faqTitle: "Часто задаваемые вопросы.",
    stayCurious: "Продолжайте исследовать", exploreAngle: "Посмотрите под другим углом.", allTools: "Все инструменты", privateAnalysis: "Ваш приватный анализ", faceInFocus: "Ваше лицо в фокусе.", scanAnother: "Анализировать другое фото", results: "Ваши результаты", hide: "Скрыть", show: "Показать", points: "точек",
    photoTitle: "Начните со своей фотографии.", photoPrompt: "Перетащите сюда чёткое селфи анфас или выберите фото на устройстве.", choosePhoto: "Выбрать фото", takeSelfie: "Сделать селфи", openingCamera: "Камера открывается…", samplePortrait: "Или попробуйте на примере", livePreview: "Предпросмотр селфи",
    processingTitle: "Анализируем изображение.", privacyLine: "Фото не покидает этот браузер.", centerFace: "Расположите лицо по центру и используйте мягкое равномерное освещение.", captureSelfie: "Сделать селфи", cancel: "Отмена", formats: "JPG, PNG или WebP · до 15 МБ",
    privateScan: "Приватное сканирование", storyTitle: "У вашего лица своя история.", storyDescription: "Мы измеряем взаимосвязи черт и объясняем результаты простыми словами.",
    tipStraight: "Смотрите прямо в камеру", tipLighting: "Используйте мягкий равномерный свет", tipFrame: "Лицо должно полностью помещаться в кадр", deviceOnly: "Распознавание лица выполняется только на этом устройстве.", analysisReady: "Анализ завершён", measurementReading: "Оценка по этой фотографии", noAccount: "Аккаунт не нужен.",
    saveMeasurements: "Сохранить измерения", saveReport: "Сохранить отчёт", copyLink: "Скопировать ссылку", copied: "Скопировано", viewReport: "Открыть отчёт", removePhoto: "Удалить фото",
    uploadOutfit: "Добавьте фото образа для справки", uploadSkin: "Добавьте фото для ухода за кожей", outfitCheck: "Проверка образа", checklistNotRating: "Список для проверки, а не оценка", choosePhotoReference: "Выбрать фото", occasion: "Куда вы собираетесь?", priority: "Что сегодня важнее всего?", quickCheck: "Быстрая проверка перед выходом", beforeGo: "Перед выходом проверьте:", allChecked: "Все три пункта проверены. Если вам комфортно и образ подходит планам, можно идти.",
    skinFeel: "Как обычно ощущается кожа после умывания?", skinConcern: "По какой теме вам нужны общие советы?", skinAdvice: "Мягкие рекомендации", cosmeticOnly: "Только косметическая информация", skinPhotoDisclaimer: "Фото остаётся в браузере и не анализируется автоматически. Советы основаны на ваших ответах.",
    glowFocus: "Что вы хотите изучить?", timeBudget: "Сколько времени вам удобно выделить?", smallExperiments: "Только небольшие эксперименты. Покупки и изменения не обязательны.", lowPressurePlan: "План без давления", keepIdeas: "Оставьте только идеи, которые вам комфортны и подходят.",
    makeupFinish: "Стиль макияжа", colorPreference: "Предпочтение по цветам", faceShapeIdea: "Идея для формы лица", eyeShapeIdea: "Идея для формы глаз", eyeCornerDetail: "Уголок глаза", chosenStyle: "Выбранный стиль",
    mirrorTitle: "Другой взгляд на себя.", mirrorDescription: "Включите камеру, чтобы увидеть привычное отражение и изображение без зеркального разворота.", openCamera: "Включить камеру", stopCamera: "Остановить камеру", mirrorView: "Зеркальный вид", trueView: "Реальный вид", cameraPrivate: "Только трансляция. Без записи и загрузки.",
    metricSymmetry: "Симметрия", metricProportions: "Пропорции", metricThirds: "Трети", metricFifths: "Пятые части", metricEyes: "Глаза", metricJaw: "Челюсть",
    featureStandout: "Выразительная черта", nextArea: "Следующий аспект", visibleShape: "Видимая форма лица", harmonyProfile: "Профиль пропорций", behindNumbers: "Что означают числа", closerLook: "Подробнее", firstStep: "Ваш первый шаг", smallChange: "Небольшие изменения — по-вашему.", styleNotes: "Заметки о стиле", looksToExplore: "Идеи для экспериментов", notMeasured: "Не оценивается по фото анфас:",
  },
};

const additionalToolUiCopy: Partial<Record<Locale, Partial<Record<ToolCopyKey, string>>>> = {
  "es-ES": {
    photoFormatsPrivate: "JPG, PNG o WebP · hasta 15 MB · permanece en este dispositivo",
    outfitPhotoReady: "Tu foto está lista para {occasion}. Ten en cuenta {priority} y usa la lista para revisar comodidad, movimiento y tiempo; la imagen no se analiza.",
    skinPhotoReady: "Tu foto está lista. Has indicado que tu piel suele sentirse {feel} y que te interesa {concern}. La orientación se basa en tus respuestas, no en un análisis de la imagen.",
    removeOutfitPhoto: "Eliminar foto del conjunto",
    removeSkinPhoto: "Eliminar foto de la piel",
    mirrorExplanation: "El espejo habitual invierte la izquierda y la derecha. La vista real muestra la orientación que ven los demás. Puede resultar poco familiar al principio, pero sigues siendo tú.",
  },
  fr: {
    photoFormatsPrivate: "JPG, PNG ou WebP · 15 Mo maximum · reste sur cet appareil",
    outfitPhotoReady: "Votre photo est prête pour {occasion}. Pensez à {priority} et utilisez la liste pour vérifier le confort, les mouvements et la météo ; l’image n’est pas analysée.",
    skinPhotoReady: "Votre photo est prête. Vous indiquez que votre peau est généralement {feel} et que vous souhaitez des conseils sur {concern}. Les conseils reposent sur vos réponses, pas sur une analyse de l’image.",
    removeOutfitPhoto: "Supprimer la photo de la tenue",
    removeSkinPhoto: "Supprimer la photo de peau",
    mirrorExplanation: "Le miroir habituel inverse la gauche et la droite. La vue réelle montre l’orientation que les autres voient. Elle peut sembler inhabituelle au début, mais c’est toujours vous.",
  },
  de: {
    photoFormatsPrivate: "JPG, PNG oder WebP · höchstens 15 MB · bleibt auf diesem Gerät",
    outfitPhotoReady: "Dein Foto ist für {occasion} bereit. Behalte {priority} im Blick und prüfe mit der Liste Komfort, Bewegungsfreiheit und Wetter; das Bild wird nicht analysiert.",
    skinPhotoReady: "Dein Foto ist bereit. Du hast angegeben, dass sich deine Haut meist {feel} anfühlt und du Hinweise zu {concern} möchtest. Die Hinweise basieren auf deinen Antworten, nicht auf einer Bildanalyse.",
    removeOutfitPhoto: "Outfitfoto entfernen",
    removeSkinPhoto: "Hautfoto entfernen",
    mirrorExplanation: "Ein normaler Spiegel vertauscht links und rechts. Die echte Ansicht zeigt die Ausrichtung, die andere sehen. Das kann zunächst ungewohnt wirken, aber du bist weiterhin du.",
  },
  "pt-BR": {
    photoFormatsPrivate: "JPG, PNG ou WebP · até 15 MB · permanece neste dispositivo",
    outfitPhotoReady: "Sua foto está pronta para {occasion}. Considere {priority} e use a lista para conferir conforto, movimento e clima; a imagem não é analisada.",
    skinPhotoReady: "Sua foto está pronta. Você informou que sua pele costuma ficar {feel} e quer dicas sobre {concern}. As orientações vêm das suas respostas, não de uma análise da imagem.",
    removeOutfitPhoto: "Remover foto do look",
    removeSkinPhoto: "Remover foto da pele",
    mirrorExplanation: "O espelho habitual inverte a esquerda e a direita. A visão real mostra a orientação que outras pessoas veem. Pode parecer diferente no início, mas continua sendo você.",
  },
  hi: {
    photoFormatsPrivate: "JPG, PNG या WebP · अधिकतम 15 MB · इसी डिवाइस पर रहती है",
    outfitPhotoReady: "आपकी फ़ोटो {occasion} के लिए तैयार है। {priority} को ध्यान में रखें और आराम, चलने-फिरने व मौसम की जाँच करें; छवि का विश्लेषण नहीं होता।",
    skinPhotoReady: "आपकी फ़ोटो तैयार है। आपने बताया कि धोने के बाद त्वचा {feel} महसूस होती है और आप {concern} पर सुझाव चाहते हैं। सुझाव आपके जवाबों पर आधारित हैं, छवि के विश्लेषण पर नहीं।",
    removeOutfitPhoto: "पहनावे की फ़ोटो हटाएँ",
    removeSkinPhoto: "त्वचा की फ़ोटो हटाएँ",
    mirrorExplanation: "सामान्य आईना बाएँ और दाएँ को उलट देता है। वास्तविक दृश्य वही दिशा दिखाता है जो दूसरे लोग देखते हैं। शुरुआत में यह अनजाना लग सकता है, फिर भी आप वही हैं।",
  },
  "ar-SA": {
    photoFormatsPrivate: "JPG أو PNG أو WebP · حتى 15 ميغابايت · تبقى على هذا الجهاز",
    outfitPhotoReady: "صورتك جاهزة لـ{occasion}. ضع {priority} في الاعتبار واستخدم القائمة لمراجعة الراحة والحركة والطقس؛ لا تُحلل الصورة.",
    skinPhotoReady: "صورتك جاهزة. ذكرت أن بشرتك عادةً {feel} وأنك مهتم بـ{concern}. تستند الإرشادات إلى إجاباتك، لا إلى تحليل الصورة.",
    removeOutfitPhoto: "إزالة صورة الإطلالة",
    removeSkinPhoto: "إزالة صورة البشرة",
    mirrorExplanation: "تعكس المرآة المعتادة اليمين واليسار. يُظهر العرض الحقيقي الاتجاه الذي يراه الآخرون. قد يبدو غير مألوف في البداية، لكنك ما زلت أنت.",
  },
  "zh-CN": {
    photoFormatsPrivate: "JPG、PNG 或 WebP · 最大 15 MB · 保留在此设备上",
    outfitPhotoReady: "照片已准备好用于{occasion}。请考虑{priority}，并通过清单检查舒适度、活动便利性和天气；照片不会被分析。",
    skinPhotoReady: "照片已准备好。您选择的肤感是{feel}，关注点是{concern}。建议依据您的回答，而非图像分析。",
    removeOutfitPhoto: "移除穿搭照片",
    removeSkinPhoto: "移除皮肤照片",
    mirrorExplanation: "普通镜像会左右颠倒。真实视图展示他人看到的方向。刚开始可能不太习惯，但这仍然是您。",
  },
  ja: {
    photoFormatsPrivate: "JPG、PNG、WebP · 15 MBまで · この端末内に保存",
    outfitPhotoReady: "{occasion}向けの写真を準備しました。{priority}を意識しながら、快適さ、動きやすさ、天候をチェックしてください。画像は分析されません。",
    skinPhotoReady: "写真を準備しました。洗顔後の肌は{feel}と回答し、{concern}についてのヒントを選択しました。ヒントは画像分析ではなく、回答に基づきます。",
    removeOutfitPhoto: "コーデ写真を削除",
    removeSkinPhoto: "肌の写真を削除",
    mirrorExplanation: "通常の鏡では左右が反転して見えます。リアル表示は、他の人から見える向きを示します。最初は見慣れなくても、あなた自身であることに変わりはありません。",
  },
  ru: {
    photoFormatsPrivate: "JPG, PNG или WebP · до 15 МБ · остаётся на этом устройстве",
    outfitPhotoReady: "Фото готово для случая «{occasion}». Учитывайте {priority} и проверьте комфорт, свободу движений и погоду; изображение не анализируется.",
    skinPhotoReady: "Фото готово. Вы указали, что кожа обычно {feel}, и выбрали тему «{concern}». Советы основаны на ваших ответах, а не на анализе изображения.",
    removeOutfitPhoto: "Удалить фото образа",
    removeSkinPhoto: "Удалить фото кожи",
    mirrorExplanation: "Обычное зеркало меняет местами левую и правую стороны. Реальный вид показывает ориентацию, которую видят другие. Сначала она может казаться непривычной, но это всё ещё вы.",
  },
};

export function translateTool(locale: Locale, key: ToolCopyKey): string {
  return toolUiCopy[locale]?.[key] ?? additionalToolUiCopy[locale]?.[key] ?? key;
}

const optionTranslations: Partial<Record<Locale, Record<string, string>>> = {
  "es-ES": {
    "Everyday plans": "Planes cotidianos", "Work or study": "Trabajo o estudios", "A social event": "Un evento social", "A formal occasion": "Una ocasión formal", "An outdoor activity": "Una actividad al aire libre",
    "Comfort and ease": "Comodidad y facilidad", "A more polished feel": "Un estilo más cuidado", "Showing my personal style": "Mostrar mi estilo personal",
    Comfortable: "Cómoda", "Dry or tight": "Seca o tirante", "Shiny or oily": "Brillante o grasa", "Easily irritated": "Se irrita con facilidad", "Not sure / varies": "No lo sé / varía",
    "No particular concern": "Ninguna preocupación concreta", "Occasional redness": "Rojeces ocasionales", "Occasional spots": "Granitos ocasionales",
    "Hair and styling": "Cabello y peinado", "A grooming habit": "Un hábito de cuidado personal", "A simple skin-care routine": "Una rutina sencilla de cuidado de la piel", "Personal style": "Estilo personal",
    "About 5 minutes": "Unos 5 minutos", "About 10 minutes": "Unos 10 minutos", "About 20 minutes": "Unos 20 minutos",
    "Everyday and light": "Natural y ligero", "More defined": "Más definido", "Playful and colorful": "Divertido y colorido", "I’ll choose my own": "Lo elegiré yo", "Warm tones": "Tonos cálidos", "Cool tones": "Tonos fríos", "Bright colors": "Colores vivos",
  },
  fr: {
    "Everyday plans": "Au quotidien", "Work or study": "Travail ou études", "A social event": "Une sortie", "A formal occasion": "Une occasion formelle", "An outdoor activity": "Une activité en plein air",
    "Comfort and ease": "Confort et aisance", "A more polished feel": "Une allure plus soignée", "Showing my personal style": "Exprimer mon style",
    Comfortable: "Confortable", "Dry or tight": "Sèche ou tiraillée", "Shiny or oily": "Brillante ou grasse", "Easily irritated": "Facilement irritée", "Not sure / varies": "Incertain / variable",
    "No particular concern": "Aucune préoccupation particulière", "Occasional redness": "Rougeurs occasionnelles", "Occasional spots": "Imperfections occasionnelles",
    "Hair and styling": "Coiffure et cheveux", "A grooming habit": "Une habitude de soin", "A simple skin-care routine": "Une routine de soin simple", "Personal style": "Style personnel",
    "About 5 minutes": "Environ 5 minutes", "About 10 minutes": "Environ 10 minutes", "About 20 minutes": "Environ 20 minutes",
    "Everyday and light": "Naturel et léger", "More defined": "Plus défini", "Playful and colorful": "Ludique et coloré", "I’ll choose my own": "Je choisirai", "Warm tones": "Tons chauds", "Cool tones": "Tons froids", "Bright colors": "Couleurs vives",
  },
  de: {
    "Everyday plans": "Alltag", "Work or study": "Arbeit oder Studium", "A social event": "Ein geselliger Anlass", "A formal occasion": "Ein formeller Anlass", "An outdoor activity": "Eine Aktivität im Freien",
    "Comfort and ease": "Komfort und Bewegungsfreiheit", "A more polished feel": "Ein gepflegter Look", "Showing my personal style": "Meinen persönlichen Stil zeigen",
    Comfortable: "Angenehm", "Dry or tight": "Trocken oder gespannt", "Shiny or oily": "Glänzend oder ölig", "Easily irritated": "Leicht reizbar", "Not sure / varies": "Unsicher / unterschiedlich",
    "No particular concern": "Kein besonderes Anliegen", "Occasional redness": "Gelegentliche Rötungen", "Occasional spots": "Gelegentliche Unreinheiten",
    "Hair and styling": "Haare und Styling", "A grooming habit": "Eine Pflegeroutine", "A simple skin-care routine": "Einfache Hautpflege", "Personal style": "Persönlicher Stil",
    "About 5 minutes": "Etwa 5 Minuten", "About 10 minutes": "Etwa 10 Minuten", "About 20 minutes": "Etwa 20 Minuten",
    "Everyday and light": "Natürlich und dezent", "More defined": "Ausdrucksstärker", "Playful and colorful": "Verspielt und farbenfroh", "I’ll choose my own": "Ich wähle selbst", "Warm tones": "Warme Töne", "Cool tones": "Kühle Töne", "Bright colors": "Leuchtende Farben",
  },
  "pt-BR": {
    "Everyday plans": "Planos do dia a dia", "Work or study": "Trabalho ou estudo", "A social event": "Um evento social", "A formal occasion": "Uma ocasião formal", "An outdoor activity": "Uma atividade ao ar livre",
    "Comfort and ease": "Conforto e praticidade", "A more polished feel": "Um visual mais alinhado", "Showing my personal style": "Mostrar meu estilo pessoal",
    Comfortable: "Confortável", "Dry or tight": "Ressecada ou repuxando", "Shiny or oily": "Brilhosa ou oleosa", "Easily irritated": "Irrita com facilidade", "Not sure / varies": "Não sei / varia",
    "No particular concern": "Nenhuma preocupação específica", "Occasional redness": "Vermelhidão ocasional", "Occasional spots": "Espinhas ocasionais",
    "Hair and styling": "Cabelo e penteado", "A grooming habit": "Um hábito de cuidado pessoal", "A simple skin-care routine": "Uma rotina simples de cuidados com a pele", "Personal style": "Estilo pessoal",
    "About 5 minutes": "Cerca de 5 minutos", "About 10 minutes": "Cerca de 10 minutos", "About 20 minutes": "Cerca de 20 minutos",
    "Everyday and light": "Leve e natural", "More defined": "Mais definido", "Playful and colorful": "Divertido e colorido", "I’ll choose my own": "Vou escolher", "Warm tones": "Tons quentes", "Cool tones": "Tons frios", "Bright colors": "Cores vibrantes",
  },
  hi: {
    "Everyday plans": "रोज़मर्रा की योजनाएँ", "Work or study": "काम या पढ़ाई", "A social event": "सामाजिक कार्यक्रम", "A formal occasion": "औपचारिक अवसर", "An outdoor activity": "बाहरी गतिविधि",
    "Comfort and ease": "आराम और सहजता", "A more polished feel": "अधिक सुथरा अंदाज़", "Showing my personal style": "अपनी निजी शैली दिखाना",
    Comfortable: "आरामदायक", "Dry or tight": "सूखी या खिंची हुई", "Shiny or oily": "चमकदार या तैलीय", "Easily irritated": "आसानी से संवेदनशील", "Not sure / varies": "पक्का नहीं / बदलता रहता है",
    "No particular concern": "कोई विशेष चिंता नहीं", "Occasional redness": "कभी-कभी लालिमा", "Occasional spots": "कभी-कभी दाने",
    "Hair and styling": "बाल और स्टाइलिंग", "A grooming habit": "देखभाल की आदत", "A simple skin-care routine": "सरल त्वचा देखभाल", "Personal style": "निजी शैली",
    "About 5 minutes": "लगभग 5 मिनट", "About 10 minutes": "लगभग 10 मिनट", "About 20 minutes": "लगभग 20 मिनट",
    "Everyday and light": "रोज़मर्रा का हल्का अंदाज़", "More defined": "अधिक स्पष्ट", "Playful and colorful": "रंगीन और चंचल", "I’ll choose my own": "मैं खुद चुनूँगा/चुनूँगी", "Warm tones": "गर्म रंग", "Cool tones": "ठंडे रंग", "Bright colors": "चटकीले रंग",
  },
  "ar-SA": {
    "Everyday plans": "خطط يومية", "Work or study": "العمل أو الدراسة", "A social event": "مناسبة اجتماعية", "A formal occasion": "مناسبة رسمية", "An outdoor activity": "نشاط في الهواء الطلق",
    "Comfort and ease": "الراحة والسهولة", "A more polished feel": "مظهر أكثر أناقة", "Showing my personal style": "إبراز أسلوبي الشخصي",
    Comfortable: "مريحة", "Dry or tight": "جافة أو مشدودة", "Shiny or oily": "لامعة أو دهنية", "Easily irritated": "سريعة التهيج", "Not sure / varies": "غير متأكد / متغيرة",
    "No particular concern": "لا توجد ملاحظة محددة", "Occasional redness": "احمرار متقطع", "Occasional spots": "حَبّ متقطع",
    "Hair and styling": "الشعر والتصفيف", "A grooming habit": "عادة للعناية الشخصية", "A simple skin-care routine": "روتين بسيط للعناية بالبشرة", "Personal style": "الأسلوب الشخصي",
    "About 5 minutes": "نحو 5 دقائق", "About 10 minutes": "نحو 10 دقائق", "About 20 minutes": "نحو 20 دقيقة",
    "Everyday and light": "يومي وخفيف", "More defined": "أكثر تحديدًا", "Playful and colorful": "مرح وملون", "I’ll choose my own": "سأختار بنفسي", "Warm tones": "درجات دافئة", "Cool tones": "درجات باردة", "Bright colors": "ألوان زاهية",
  },
  "zh-CN": {
    "Everyday plans": "日常安排", "Work or study": "工作或学习", "A social event": "社交活动", "A formal occasion": "正式场合", "An outdoor activity": "户外活动",
    "Comfort and ease": "舒适自在", "A more polished feel": "更精致的感觉", "Showing my personal style": "展现个人风格",
    Comfortable: "舒适", "Dry or tight": "干燥或紧绷", "Shiny or oily": "泛油或油腻", "Easily irritated": "容易敏感", "Not sure / varies": "不确定 / 不固定",
    "No particular concern": "没有特别关注", "Occasional redness": "偶尔泛红", "Occasional spots": "偶尔长痘",
    "Hair and styling": "发型与造型", "A grooming habit": "日常护理习惯", "A simple skin-care routine": "简单护肤流程", "Personal style": "个人风格",
    "About 5 minutes": "约 5 分钟", "About 10 minutes": "约 10 分钟", "About 20 minutes": "约 20 分钟",
    "Everyday and light": "日常清淡", "More defined": "更鲜明", "Playful and colorful": "活泼多彩", "I’ll choose my own": "我自己选择", "Warm tones": "暖色调", "Cool tones": "冷色调", "Bright colors": "明亮色彩",
  },
  ja: {
    "Everyday plans": "普段のお出かけ", "Work or study": "仕事・勉強", "A social event": "社交イベント", "A formal occasion": "フォーマルな場", "An outdoor activity": "屋外での活動",
    "Comfort and ease": "快適さと動きやすさ", "A more polished feel": "きちんとした印象", "Showing my personal style": "自分らしさを表現",
    Comfortable: "快適", "Dry or tight": "乾燥・つっぱり", "Shiny or oily": "テカリ・脂っぽさ", "Easily irritated": "刺激を感じやすい", "Not sure / varies": "不明・日によって違う",
    "No particular concern": "特に気になることはない", "Occasional redness": "ときどき赤み", "Occasional spots": "ときどき吹き出物",
    "Hair and styling": "ヘアスタイル", "A grooming habit": "身だしなみの習慣", "A simple skin-care routine": "シンプルなスキンケア", "Personal style": "自分らしいスタイル",
    "About 5 minutes": "約5分", "About 10 minutes": "約10分", "About 20 minutes": "約20分",
    "Everyday and light": "普段使いのナチュラル", "More defined": "はっきりした印象", "Playful and colorful": "遊び心のあるカラフル", "I’ll choose my own": "自分で選ぶ", "Warm tones": "暖色系", "Cool tones": "寒色系", "Bright colors": "明るい色",
  },
  ru: {
    "Everyday plans": "Повседневные планы", "Work or study": "Работа или учёба", "A social event": "Встреча или мероприятие", "A formal occasion": "Официальное событие", "An outdoor activity": "Занятие на свежем воздухе",
    "Comfort and ease": "Комфорт и удобство", "A more polished feel": "Более элегантный образ", "Showing my personal style": "Выразить свой стиль",
    Comfortable: "Комфортная", "Dry or tight": "Сухая или стянутая", "Shiny or oily": "Блестящая или жирная", "Easily irritated": "Легко раздражается", "Not sure / varies": "Не уверена / по-разному",
    "No particular concern": "Нет особых пожеланий", "Occasional redness": "Периодическое покраснение", "Occasional spots": "Периодические высыпания",
    "Hair and styling": "Волосы и укладка", "A grooming habit": "Привычка ухода за собой", "A simple skin-care routine": "Простой уход за кожей", "Personal style": "Личный стиль",
    "About 5 minutes": "Около 5 минут", "About 10 minutes": "Около 10 минут", "About 20 minutes": "Около 20 минут",
    "Everyday and light": "Лёгкий повседневный", "More defined": "Более выразительный", "Playful and colorful": "Игривый и яркий", "I’ll choose my own": "Выберу сама", "Warm tones": "Тёплые оттенки", "Cool tones": "Холодные оттенки", "Bright colors": "Яркие цвета",
  },
};

const additionalOptionTranslations: Partial<Record<Locale, Record<string, string>>> = {
  "es-ES": {
    "I can sit, stand, and move comfortably": "Puedo sentarme, estar de pie y moverme con comodidad",
    "The layers work for the weather and setting": "Las capas son adecuadas para el tiempo y el lugar",
    "The colors and pieces feel like my style": "Los colores y las prendas encajan con mi estilo",
  },
  fr: {
    "I can sit, stand, and move comfortably": "Je peux m’asseoir, me lever et bouger confortablement",
    "The layers work for the weather and setting": "Les couches conviennent à la météo et au lieu",
    "The colors and pieces feel like my style": "Les couleurs et les pièces correspondent à mon style",
  },
  de: {
    "I can sit, stand, and move comfortably": "Ich kann bequem sitzen, stehen und mich bewegen",
    "The layers work for the weather and setting": "Die Kleidungsschichten passen zum Wetter und Anlass",
    "The colors and pieces feel like my style": "Farben und Teile passen zu meinem Stil",
  },
  "pt-BR": {
    "I can sit, stand, and move comfortably": "Consigo sentar, ficar em pé e me movimentar com conforto",
    "The layers work for the weather and setting": "As camadas combinam com o clima e o local",
    "The colors and pieces feel like my style": "As cores e peças combinam com meu estilo",
  },
  hi: {
    "I can sit, stand, and move comfortably": "मैं आराम से बैठ, खड़ा और चल-फिर सकता/सकती हूँ",
    "The layers work for the weather and setting": "परतें मौसम और जगह के अनुकूल हैं",
    "The colors and pieces feel like my style": "रंग और कपड़े मेरी शैली के हैं",
  },
  "ar-SA": {
    "I can sit, stand, and move comfortably": "أستطيع الجلوس والوقوف والتحرك براحة",
    "The layers work for the weather and setting": "الطبقات مناسبة للطقس والمكان",
    "The colors and pieces feel like my style": "الألوان والقطع تناسب أسلوبي",
  },
  "zh-CN": {
    "I can sit, stand, and move comfortably": "我可以舒适地坐下、站立和活动",
    "The layers work for the weather and setting": "衣物层次适合天气和场合",
    "The colors and pieces feel like my style": "颜色和单品符合我的风格",
  },
  ja: {
    "I can sit, stand, and move comfortably": "無理なく座ったり立ったり動いたりできる",
    "The layers work for the weather and setting": "重ね着が天候や場所に合っている",
    "The colors and pieces feel like my style": "色やアイテムが自分の好みに合っている",
  },
  ru: {
    "I can sit, stand, and move comfortably": "Мне удобно сидеть, стоять и двигаться",
    "The layers work for the weather and setting": "Слои одежды подходят погоде и месту",
    "The colors and pieces feel like my style": "Цвета и вещи соответствуют моему стилю",
  },
};

export function translateToolOption(locale: Locale, value: string): string {
  return optionTranslations[locale]?.[value] ?? additionalOptionTranslations[locale]?.[value] ?? value;
}

export const translatedToolNames: Partial<Record<Locale, Record<string, string>>> = {
  "es-ES": { "face-shape": "Forma del rostro", attractiveness: "Test de atractivo gratis", symmetry: "Test de simetría", "golden-ratio": "Proporción áurea facial", "jawline-score": "Evaluación de mandíbula", "canthal-tilt": "Inclinación cantal", "eye-shape": "Detector de forma de ojos", "facial-ratios": "Proporciones faciales", "hairstyle-finder": "Asesor de peinados", "makeup-suggestions": "Sugerencias de maquillaje", "full-dress-check": "Revisión de conjunto", "skin-analysis": "Análisis de piel", "pretty-scale": "Test de proporciones faciales", "glow-up": "Plan de estilo personal", "eyebrow-mapping": "Diseño de cejas", "true-mirror": "Espejo real", "full-analysis": "Análisis facial completo" },
  fr: { "face-shape": "Forme du visage", attractiveness: "Test d’attractivité gratuit", symmetry: "Test de symétrie", "golden-ratio": "Nombre d’or du visage", "jawline-score": "Analyse de la mâchoire", "canthal-tilt": "Inclinaison canthale", "eye-shape": "Forme des yeux", "facial-ratios": "Proportions du visage", "hairstyle-finder": "Conseils coiffure", "makeup-suggestions": "Conseils maquillage", "full-dress-check": "Conseils de tenue", "skin-analysis": "Analyse de la peau", "pretty-scale": "Test de proportions du visage", "glow-up": "Plan de style personnel", "eyebrow-mapping": "Harmonie des sourcils", "true-mirror": "Vrai miroir", "full-analysis": "Analyse complète du visage" },
  de: { "face-shape": "Gesichtsform", attractiveness: "Kostenloser Attraktivitätstest", symmetry: "Symmetrie-Test", "golden-ratio": "Goldener Schnitt im Gesicht", "jawline-score": "Kieferanalyse", "canthal-tilt": "Augenwinkel-Neigung", "eye-shape": "Augenform-Erkennung", "facial-ratios": "Gesichtsproportionen", "hairstyle-finder": "Frisurenberatung", "makeup-suggestions": "Make-up-Vorschläge", "full-dress-check": "Outfit-Check", "skin-analysis": "Hautanalyse", "pretty-scale": "Gesichtsproportionen-Test", "glow-up": "Persönlicher Stylingplan", "eyebrow-mapping": "Augenbrauen-Form", "true-mirror": "Echter Spiegel", "full-analysis": "Vollständige Gesichtsanalyse" },
  "pt-BR": { "face-shape": "Formato do rosto", attractiveness: "Teste de atratividade grátis", symmetry: "Teste de simetria", "golden-ratio": "Proporção áurea facial", "jawline-score": "Análise da mandíbula", "canthal-tilt": "Inclinação cantal", "eye-shape": "Detector de formato dos olhos", "facial-ratios": "Proporções faciais", "hairstyle-finder": "Sugestões de penteado", "makeup-suggestions": "Sugestões de maquiagem", "full-dress-check": "Avaliação do look", "skin-analysis": "Análise da pele", "pretty-scale": "Teste de proporções faciais", "glow-up": "Plano de estilo pessoal", "eyebrow-mapping": "Mapeamento das sobrancelhas", "true-mirror": "Espelho real", "full-analysis": "Análise facial completa" },
  hi: { "face-shape": "चेहरे का आकार", attractiveness: "मुफ़्त आकर्षण परीक्षण", symmetry: "सममिति परीक्षण", "golden-ratio": "चेहरे का गोल्डन रेशियो", "jawline-score": "जबड़े का विश्लेषण", "canthal-tilt": "आँख के कोने का झुकाव", "eye-shape": "आँखों के आकार की पहचान", "facial-ratios": "चेहरे के अनुपात", "hairstyle-finder": "हेयरस्टाइल सुझाव", "makeup-suggestions": "मेकअप सुझाव", "full-dress-check": "पहनावे की जाँच", "skin-analysis": "त्वचा विश्लेषण", "pretty-scale": "चेहरे के अनुपात का परीक्षण", "glow-up": "व्यक्तिगत स्टाइल योजना", "eyebrow-mapping": "भौंहों का संतुलन", "true-mirror": "वास्तविक आईना", "full-analysis": "चेहरे का पूरा विश्लेषण" },
  "ar-SA": { "face-shape": "شكل الوجه", attractiveness: "اختبار الجاذبية المجاني", symmetry: "اختبار تناسق الوجه", "golden-ratio": "النسبة الذهبية للوجه", "jawline-score": "تحليل خط الفك", "canthal-tilt": "ميل زاوية العين", "eye-shape": "اكتشاف شكل العين", "facial-ratios": "نسب الوجه", "hairstyle-finder": "اقتراحات تسريحات الشعر", "makeup-suggestions": "اقتراحات المكياج", "full-dress-check": "مراجعة الإطلالة", "skin-analysis": "تحليل البشرة", "pretty-scale": "اختبار نسب الوجه", "glow-up": "خطة أسلوب شخصي", "eyebrow-mapping": "تناسق الحواجب", "true-mirror": "المرآة الحقيقية", "full-analysis": "تحليل كامل للوجه" },
  "zh-CN": { "face-shape": "脸型分析", attractiveness: "免费面部比例测试", symmetry: "面部对称测试", "golden-ratio": "面部黄金比例", "jawline-score": "下颌线分析", "canthal-tilt": "眼角倾斜度", "eye-shape": "眼型检测", "facial-ratios": "面部比例", "hairstyle-finder": "发型建议", "makeup-suggestions": "妆容建议", "full-dress-check": "穿搭检查", "skin-analysis": "护肤自查", "pretty-scale": "面部比例测试", "glow-up": "个人风格计划", "eyebrow-mapping": "眉形参考", "true-mirror": "真实镜像", "full-analysis": "完整面部分析" },
  ja: { "face-shape": "顔型チェック", attractiveness: "無料の顔バランステスト", symmetry: "顔の左右差チェック", "golden-ratio": "顔の黄金比", "jawline-score": "フェイスライン分析", "canthal-tilt": "目尻の傾き", "eye-shape": "目の形チェック", "facial-ratios": "顔の比率", "hairstyle-finder": "ヘアスタイル提案", "makeup-suggestions": "メイク提案", "full-dress-check": "コーディネートチェック", "skin-analysis": "肌のセルフチェック", "pretty-scale": "顔の比率テスト", "glow-up": "スタイルプラン", "eyebrow-mapping": "眉バランス", "true-mirror": "本当の鏡", "full-analysis": "顔の総合分析" },
  ru: { "face-shape": "Форма лица", attractiveness: "Бесплатный тест пропорций лица", symmetry: "Тест симметрии лица", "golden-ratio": "Золотое сечение лица", "jawline-score": "Анализ линии челюсти", "canthal-tilt": "Наклон уголков глаз", "eye-shape": "Определение формы глаз", "facial-ratios": "Пропорции лица", "hairstyle-finder": "Подбор причёски", "makeup-suggestions": "Советы по макияжу", "full-dress-check": "Проверка образа", "skin-analysis": "Уход за кожей", "pretty-scale": "Тест пропорций лица", "glow-up": "Личный план стиля", "eyebrow-mapping": "Форма бровей", "true-mirror": "Настоящее зеркало", "full-analysis": "Полный анализ лица" },
};

const additionalToolNames: Partial<Record<Locale, Record<string, string>>> = {
  "es-ES": { "hairstyle-try-on": "Prueba de peinados" },
  fr: { "hairstyle-try-on": "Essai de coiffure" },
  de: { "hairstyle-try-on": "Frisuren-Vorschau" },
  "pt-BR": { "hairstyle-try-on": "Prévia de penteado" },
  hi: { "hairstyle-try-on": "हेयरस्टाइल आज़माएँ" },
  "ar-SA": { "hairstyle-try-on": "معاينة تسريحة الشعر" },
  "zh-CN": { "hairstyle-try-on": "发型预览" },
  ja: { "hairstyle-try-on": "ヘアスタイル試着" },
  ru: { "hairstyle-try-on": "Примерка причёски" },
};

export function translateToolName(locale: Locale, slug: string, fallback: string): string {
  if (slug === "hairstyle-finder") {
    const hairCheckNames: Partial<Record<Locale, string>> = {
      "es-ES": "Revisión de cabello y línea capilar",
      fr: "Analyse des cheveux et de la ligne frontale",
      de: "Haar- und Haarlinien-Check",
      "pt-BR": "Análise de cabelo e linha capilar",
      hi: "बाल और हेयरलाइन जाँच",
      "ar-SA": "فحص الشعر وخط الشعر",
      "zh-CN": "头发与发际线检查",
      ja: "髪と生え際のチェック",
      ru: "Проверка волос и линии роста",
    };
    return hairCheckNames[locale] ?? "Hair & Hairline Check";
  }
  return translatedToolNames[locale]?.[slug] ?? additionalToolNames[locale]?.[slug] ?? fallback;
}

const translatedFeatureTerms: Partial<Record<Locale, Record<string, string>>> = {
  "es-ES": { Oval: "Ovalado", Round: "Redondo", Square: "Cuadrado", Heart: "Corazón", Oblong: "Alargado", Diamond: "Diamante", Almond: "Almendrado", Elongated: "Alargado" },
  fr: { Oval: "Ovale", Round: "Rond", Square: "Carré", Heart: "Cœur", Oblong: "Allongé", Diamond: "Diamant", Almond: "En amande", Elongated: "Allongé" },
  de: { Oval: "Oval", Round: "Rund", Square: "Eckig", Heart: "Herzförmig", Oblong: "Länglich", Diamond: "Rautenförmig", Almond: "Mandelförmig", Elongated: "Länglich" },
  "pt-BR": { Oval: "Oval", Round: "Redondo", Square: "Quadrado", Heart: "Coração", Oblong: "Alongado", Diamond: "Diamante", Almond: "Amendoado", Elongated: "Alongado" },
  hi: { Oval: "अंडाकार", Round: "गोल", Square: "चौकोर", Heart: "दिलाकार", Oblong: "लंबा", Diamond: "हीरे जैसा", Almond: "बादाम जैसा", Elongated: "लंबा" },
  "ar-SA": { Oval: "بيضاوي", Round: "دائري", Square: "مربع", Heart: "قلبي", Oblong: "مستطيل", Diamond: "ماسي", Almond: "لوزي", Elongated: "ممدود" },
  "zh-CN": { Oval: "椭圆形", Round: "圆形", Square: "方形", Heart: "心形", Oblong: "长形", Diamond: "菱形", Almond: "杏仁形", Elongated: "狭长形" },
  ja: { Oval: "卵形", Round: "丸型", Square: "四角形", Heart: "ハート型", Oblong: "面長", Diamond: "ひし形", Almond: "アーモンド型", Elongated: "切れ長" },
  ru: { Oval: "Овальная", Round: "Круглая", Square: "Квадратная", Heart: "Сердцевидная", Oblong: "Вытянутая", Diamond: "Ромбовидная", Almond: "Миндалевидная", Elongated: "Вытянутая" },
};

export function translateFeatureTerm(locale: Locale, value: string): string {
  return translatedFeatureTerms[locale]?.[value] ?? value;
}

const toolIntroduction: Partial<Record<Locale, Partial<Record<"completeLook" | "freePreview" | "scanTool" | "skinTool" | "outfitTool" | "glowTool" | "mirrorTool", string>>>> = {
  "es-ES": {
    completeLook: "Una mirada completa · vista previa gratuita", freePreview: "Gratis · en tu dispositivo",
    scanTool: "Explora esta herramienta con una estimación privada basada en tu foto. El resultado describe esta imagen, no un rasgo permanente.",
    skinTool: "Responde a unas preguntas para recibir orientación cosmética general. La foto permanece en tu dispositivo y no se analiza automáticamente.",
    outfitTool: "Usa una foto local como referencia y revisa tu conjunto con una lista basada en la ocasión, la comodidad y tus preferencias.",
    glowTool: "Elige un objetivo y el tiempo disponible para crear una lista de ideas sencillas de estilo personal.",
    mirrorTool: "Usa la cámara en tu dispositivo para alternar entre la vista reflejada y la vista real. El vídeo no se graba ni se sube.",
  },
  fr: {
    completeLook: "Vue d’ensemble · aperçu gratuit", freePreview: "Gratuit · sur votre appareil",
    scanTool: "Explorez cet outil grâce à une estimation privée basée sur votre photo. Le résultat décrit cette image, pas un trait permanent.",
    skinTool: "Répondez à quelques questions pour obtenir des conseils cosmétiques généraux. La photo reste sur votre appareil et n’est pas analysée automatiquement.",
    outfitTool: "Utilisez une photo locale comme référence et vérifiez votre tenue selon l’occasion, le confort et vos préférences.",
    glowTool: "Choisissez un objectif et le temps disponible pour créer une petite liste d’idées de style faciles à essayer.",
    mirrorTool: "Utilisez la caméra de votre appareil pour passer de la vue miroir à la vue réelle. La vidéo n’est ni enregistrée ni envoyée.",
  },
  de: {
    completeLook: "Der ganze Eindruck · kostenlose Vorschau", freePreview: "Kostenlos · auf Ihrem Gerät",
    scanTool: "Erkunden Sie dieses Tool mit einer privaten Schätzung anhand Ihres Fotos. Das Ergebnis beschreibt dieses Bild, kein dauerhaftes Merkmal.",
    skinTool: "Beantworten Sie einige Fragen und erhalten Sie allgemeine kosmetische Hinweise. Das Foto bleibt auf Ihrem Gerät und wird nicht automatisch analysiert.",
    outfitTool: "Nutzen Sie ein lokales Foto als Referenz und prüfen Sie Ihr Outfit anhand von Anlass, Komfort und persönlichen Vorlieben.",
    glowTool: "Wählen Sie einen Schwerpunkt und einen Zeitrahmen für eine kurze Liste unkomplizierter Styling-Ideen.",
    mirrorTool: "Nutzen Sie die Kamera auf Ihrem Gerät, um zwischen Spiegelbild und realer Ansicht zu wechseln. Das Video wird weder aufgezeichnet noch hochgeladen.",
  },
  "pt-BR": {
    completeLook: "Uma visão completa · prévia grátis", freePreview: "Grátis · no seu dispositivo",
    scanTool: "Explore esta ferramenta com uma estimativa privada baseada na sua foto. O resultado descreve esta imagem, não uma característica permanente.",
    skinTool: "Responda a algumas perguntas para receber orientações cosméticas gerais. A foto fica no seu dispositivo e não é analisada automaticamente.",
    outfitTool: "Use uma foto local como referência e confira seu look considerando ocasião, conforto e preferências pessoais.",
    glowTool: "Escolha um foco e o tempo disponível para criar uma lista curta de ideias simples de estilo.",
    mirrorTool: "Use a câmera do seu dispositivo para alternar entre a imagem espelhada e a visão real. O vídeo não é gravado nem enviado.",
  },
  hi: {
    completeLook: "पूरी तस्वीर · मुफ़्त पूर्वावलोकन", freePreview: "मुफ़्त · आपके डिवाइस पर",
    scanTool: "अपनी फ़ोटो पर आधारित निजी अनुमान से इस टूल को देखें। नतीजा इस तस्वीर का वर्णन करता है, किसी स्थायी विशेषता का नहीं।",
    skinTool: "सामान्य कॉस्मेटिक सुझाव पाने के लिए कुछ सवालों के जवाब दें। फ़ोटो आपके डिवाइस पर रहती है और अपने-आप विश्लेषित नहीं होती।",
    outfitTool: "स्थानीय फ़ोटो को संदर्भ के रूप में रखें और अवसर, आराम व पसंद के आधार पर पहनावे की जाँच करें।",
    glowTool: "व्यक्तिगत स्टाइल के सरल सुझावों की सूची के लिए अपना लक्ष्य और समय चुनें।",
    mirrorTool: "प्रतिबिंबित और वास्तविक दृश्य के बीच बदलने के लिए डिवाइस का कैमरा इस्तेमाल करें। वीडियो रिकॉर्ड या अपलोड नहीं होता।",
  },
  "ar-SA": {
    completeLook: "نظرة متكاملة · معاينة مجانية", freePreview: "مجانًا · على جهازك",
    scanTool: "استكشف هذه الأداة بتقدير خاص يستند إلى صورتك. تصف النتيجة هذه الصورة ولا تحدد سمة دائمة.",
    skinTool: "أجب عن بعض الأسئلة للحصول على إرشادات تجميلية عامة. تبقى الصورة على جهازك ولا تُحلل تلقائيًا.",
    outfitTool: "استخدم صورة محلية كمرجع وراجع إطلالتك وفق المناسبة والراحة وتفضيلاتك.",
    glowTool: "اختر هدفًا ووقتًا مناسبًا لإنشاء قائمة قصيرة بأفكار أسلوب بسيطة.",
    mirrorTool: "استخدم كاميرا جهازك للتبديل بين العرض المعكوس والعرض الحقيقي. لا يُسجل الفيديو ولا يُرفع.",
  },
  "zh-CN": {
    completeLook: "完整概览 · 免费预览", freePreview: "免费 · 在您的设备上",
    scanTool: "使用基于照片的私人估算来体验此工具。结果仅描述这张照片，不代表永久特征。",
    skinTool: "回答几个问题，获取一般美容护理建议。照片保留在您的设备上，不会自动分析。",
    outfitTool: "将本地照片用作参考，并根据场合、舒适度和个人偏好检查穿搭。",
    glowTool: "选择关注点和可用时间，生成一份简单的个人风格建议清单。",
    mirrorTool: "使用设备摄像头切换镜像与真实视图。视频不会录制或上传。",
  },
  ja: {
    completeLook: "全体を詳しく · 無料プレビュー", freePreview: "無料 · お使いの端末で",
    scanTool: "写真に基づくプライベートな推定でこのツールを試せます。結果はこの写真についてのもので、変わらない特徴を示すものではありません。",
    skinTool: "いくつかの質問に答えて、一般的な美容ケアのヒントを確認できます。写真は端末内に保存され、自動分析されません。",
    outfitTool: "端末内の写真を参考に、場面や快適さ、好みに合わせてコーディネートを確認できます。",
    glowTool: "目的と使える時間を選び、気軽に試せるスタイルのアイデアをまとめましょう。",
    mirrorTool: "端末のカメラで鏡像と実際の見え方を切り替えられます。動画は録画・アップロードされません。",
  },
  ru: {
    completeLook: "Полный обзор · бесплатный просмотр", freePreview: "Бесплатно · на вашем устройстве",
    scanTool: "Изучите этот инструмент с помощью приватной оценки по фотографии. Результат описывает снимок, а не постоянную черту.",
    skinTool: "Ответьте на несколько вопросов, чтобы получить общие косметические рекомендации. Фото остаётся на устройстве и не анализируется автоматически.",
    outfitTool: "Используйте локальное фото как справку и проверьте образ с учётом повода, комфорта и ваших предпочтений.",
    glowTool: "Выберите цель и свободное время, чтобы составить короткий список простых идей для стиля.",
    mirrorTool: "Переключайтесь между зеркальным и обычным изображением с помощью камеры устройства. Видео не записывается и не отправляется.",
  },
};

export function translateToolIntroduction(locale: Locale, key: "completeLook" | "freePreview" | "scanTool" | "skinTool" | "outfitTool" | "glowTool" | "mirrorTool", fallback: string): string {
  return toolIntroduction[locale]?.[key] ?? fallback;
}
