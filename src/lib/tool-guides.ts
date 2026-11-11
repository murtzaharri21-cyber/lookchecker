export type ToolGuide = {
  title: string;
  description: string;
  keywords: string[];
  sections: { title: string; paragraphs: string[]; bullets?: string[] }[];
};

export const toolGuides: Record<string, ToolGuide> = {
  "face-shape": {
    title: "How to find your face shape",
    description: "See how a face shape detector compares face length, cheekbones, and jaw taper, how to take a clear photo, and how to use the result for hairstyles and glasses.",
    keywords: ["face shape detector", "what is my face shape", "face shape finder", "identify face shape from photo", "face shape guide"],
    sections: [
      {
        title: "What a face shape finder measures",
        paragraphs: [
          "A face shape finder is a starting point for describing visible proportions, not a permanent label. This free face shape detector estimates face length, cheekbone width, and the way the jaw narrows, then compares those relationships with common outline categories.",
          "The result can shift with a tilted head, a wide-angle selfie, hair covering the temples, or an unclear forehead and chin outline. Treat the category as a practical styling reference rather than a definitive measurement."
        ]
      },
      {
        title: "How to get a clearer face-shape reading",
        paragraphs: ["Use a straight-on photo with your full face visible, even lighting, and a relaxed expression. Keep the camera at eye level and avoid holding it very close; perspective can make the center of the face look larger than the sides."],
        bullets: ["Move hair away from the cheeks and jaw.", "Keep your head level and look toward the camera.", "Use a clear, evenly lit photo rather than a heavily filtered image."]
      },
      {
        title: "Use the result to explore styles",
        paragraphs: [
          "Face-shape charts can help you browse haircuts or eyewear, but they cannot account for everything that affects fit and personal style. Hair texture, maintenance time, comfort, and the frame's actual fit matter as much as a shape name.",
          "Try the free face shape tool for a photo-based estimate, then compare ideas that appeal to you. There is no face shape that needs correcting and no single style that suits everyone in a category."
        ]
      }
    ]
  },
  attractiveness: {
    title: "What a facial proportion test can—and cannot—tell you",
    description: "Learn what a free attractiveness test measures, why photo scores are not beauty ratings, and how lighting and camera angle affect face-analysis results.",
    keywords: ["free attractiveness test", "facial proportion test", "face analysis score", "face symmetry and proportions", "online face test"],
    sections: [
      {
        title: "A photo score is not an attractiveness rating",
        paragraphs: [
          "Online searches for an attractiveness test often promise a simple number. Look Checker instead reports selected face measurements from one image, such as landmark alignment and proportions. Its 0–100 summary is a custom calculation, not a validated measure of beauty, personality, health, or worth.",
          "There is no objective attractiveness score that can capture expression, identity, culture, movement, or how someone is perceived in real life. A result should never be used to rank people or make decisions about them."
        ]
      },
      {
        title: "Why results change between photos",
        paragraphs: ["A phone held close can distort proportions. Head rotation, uneven lighting, facial expression, and partial occlusion can also move detected landmarks. For a more meaningful comparison, use similar camera distance, eye-level framing, lighting, and expression in both photos."]
      },
      {
        title: "How to use a face analysis result",
        paragraphs: [
          "Read the measurement breakdown rather than treating the combined number as a verdict. It describes geometry detected in the chosen photo and does not recommend changing any feature.",
          "This free facial proportion test runs in your browser. Use it as a curiosity or photo-comparison aid, and step away from scoring if it makes you feel worse about your appearance."
        ]
      }
    ]
  },
  symmetry: {
    title: "Facial symmetry: what a photo symmetry test measures",
    description: "See how a face symmetry test compares landmarks, why perfect symmetry is not a realistic standard, and how to take a fair comparison photo.",
    keywords: ["face symmetry test", "facial symmetry checker", "face symmetry detector", "left right face symmetry", "symmetry in face photo"],
    sections: [
      {
        title: "How a face symmetry test works",
        paragraphs: [
          "A face symmetry checker compares selected landmarks on the left and right sides of a face around an estimated center line. This tool uses visible points around the eyes, brows, mouth, and jaw to create a photo-based alignment reading.",
          "It is not a clinical assessment and does not measure every feature or the three-dimensional face. A single front-facing image only provides a limited view."
        ]
      },
      {
        title: "Natural asymmetry and camera effects",
        paragraphs: ["Small differences between sides are common. Expression, head tilt, lens perspective, light direction, and how the face detector locates a landmark can all affect the result. A score is therefore best understood as an estimate for that particular image, not a fixed personal trait."]
      },
      {
        title: "Take a more consistent comparison",
        paragraphs: [
          "For a steadier facial symmetry test, face the camera directly, keep the camera at eye level, move hair away from the main landmarks, and use soft light from the front. Avoid comparing a close selfie with a distant portrait.",
          "Use the result to learn about how image conditions influence measurements—not as a beauty standard or a reason to try to make both sides identical."
        ]
      }
    ]
  },
  "golden-ratio": {
    title: "The golden ratio face myth and facial proportions",
    description: "Learn what a face ratio calculator measures, why the golden ratio is not a beauty formula, and how perspective affects facial proportions.",
    keywords: ["golden ratio face test", "face ratio calculator", "facial golden ratio", "face proportions calculator", "face length to width ratio"],
    sections: [
      {
        title: "What a face ratio calculator measures",
        paragraphs: [
          "This face ratio calculator estimates visible face length relative to cheekbone width from facial landmarks. The result is a ratio from the image, not a measurement in millimetres and not a complete map of facial proportions.",
          "The term “golden ratio face” is widely used online, but a mathematical ratio does not define a universally beautiful face. People have varied features, and a single proportion cannot account for expression, appearance in motion, or individual preference."
        ]
      },
      {
        title: "Why a selfie can change the ratio",
        paragraphs: ["A close phone camera can exaggerate features nearest to the lens, while turning or tilting the head changes the visible outline. Hair, shadows, and cropping may also obscure the forehead, cheek, or chin landmarks used by the estimate."]
      },
      {
        title: "Read your facial proportions in context",
        paragraphs: [
          "Use a straight-on, evenly lit image with the full face visible when checking face length to width. Compare only photos made under similar conditions, and remember that the tool's reference index is an internal heuristic rather than a scientific or beauty threshold.",
          "The free face proportion tool is for exploration. It does not prescribe a target ratio or suggest that you need to change your appearance."
        ]
      }
    ]
  },
  "jawline-score": {
    title: "How to understand a jawline measurement from a photo",
    description: "Find out what a front-view jawline analyzer can estimate, why it cannot measure jaw angle or definition from one selfie, and how framing affects the result.",
    keywords: ["jawline analyzer", "jawline score", "jawline measurement", "jaw to cheekbone ratio", "face jawline analysis"],
    sections: [
      {
        title: "What a front-view jawline analyzer sees",
        paragraphs: [
          "A front-view jawline analysis can estimate how visible jaw width relates to cheekbone width in a photo. This tool presents that relationship as a proportion; the accompanying index is a custom reference and is not a rating of how attractive or “good” a jawline is.",
          "One selfie cannot reliably establish jaw depth, a side-profile angle, bone structure, or a medical measurement such as gonial angle. Those require different views and, for clinical purposes, a qualified professional."
        ]
      },
      {
        title: "Photo framing affects jaw measurements",
        paragraphs: ["A low camera angle, head turn, shadow under the chin, or hair over the jaw can change the visible outline. For a more consistent jawline measurement, face the camera squarely, use a neutral expression, and include the full lower face in even light."]
      },
      {
        title: "Use the result as a proportion, not a grade",
        paragraphs: [
          "Read the jaw-to-cheekbone estimate as a description of one image. It is not a diagnosis, body-composition estimate, or recommendation for a procedure.",
          "If your goal is styling, you can experiment with hair framing, neckline, or grooming based on your own taste. The free jawline tool is educational and does not define an ideal face."
        ]
      }
    ]
  },
  "canthal-tilt": {
    title: "Canthal tilt explained: eye-corner angle in a photo",
    description: "Learn what positive, neutral, or negative canthal tilt means, how an eye angle calculator works, and why expression can change the reading.",
    keywords: ["canthal tilt test", "canthal tilt calculator", "positive canthal tilt", "negative canthal tilt", "eye corner angle"],
    sections: [
      {
        title: "What positive and negative canthal tilt mean",
        paragraphs: [
          "Canthal tilt describes the angle between the inner and outer corners of the eye. In a straight-on photo, an outer corner that appears higher is often described as positive tilt; a lower outer corner is described as negative; corners close to level are near neutral.",
          "This free eye angle calculator estimates the average visible angle from facial landmarks. It is an image-based estimate, not an eye-health test or a measure of attractiveness."
        ]
      },
      {
        title: "Why the eye-corner estimate varies",
        paragraphs: ["Head tilt, squinting, smiling, eyeliner, partial eyelid coverage, and camera position can affect corner detection. Even a small shift in a landmark changes the angle, so a reading near zero should not be overinterpreted."]
      },
      {
        title: "Get a clearer canthal tilt reading",
        paragraphs: [
          "Face the camera with both eyes visible, keep your head level, and use even lighting. If you compare photos, match camera height, distance, and expression.",
          "There is no universally better eye-corner direction. Treat positive, neutral, or negative as a neutral description of the photo and explore makeup only if it suits your personal style."
        ]
      }
    ]
  },
  "eye-shape": {
    title: "How to identify your eye shape from a photo",
    description: "Learn how an eye shape detector compares visible eye width and height, what almond, round, and elongated mean here, and how to get a clearer photo reading.",
    keywords: ["eye shape detector", "what is my eye shape", "eye shape finder", "eye shape analysis", "almond round or elongated eyes"],
    sections: [
      {
        title: "How an eye shape detector estimates eye shape",
        paragraphs: [
          "An eye shape finder can describe the visible eye opening by comparing its width and height in a photo. This tool groups that estimate into broad descriptions such as almond, round, or elongated; it does not identify a medical condition or permanent category.",
          "Eyelid visibility, expression, makeup, and the direction of your gaze can change how the opening appears. Real eyes do not always fit neatly into one label."
        ]
      },
      {
        title: "Take a clear eye-shape photo",
        paragraphs: ["Use even light and a relaxed, forward-facing expression. Keep hair away from your eyes and avoid filters or heavy shadows. A very close selfie can distort the eye area and affect the landmarks."]
      },
      {
        title: "Use your result for optional makeup ideas",
        paragraphs: [
          "The eye shape reading can be a starting point for trying eyeliner or eyeshadow placement, not a set of rules. Follow your natural lash line, experiment with blending, and choose techniques that feel comfortable.",
          "The free eye shape detector only describes the visible image. It does not infer eye health, ethnicity, or a single “best” makeup style."
        ]
      }
    ]
  },
  "facial-ratios": {
    title: "Facial ratios explained: face measurement guide",
    description: "Understand face length, eye spacing, facial thirds, and jaw proportions, how ratios are normalized, and what a selfie cannot measure.",
    keywords: ["facial ratios calculator", "face measurements", "facial proportions test", "facial thirds calculator", "face measurement tool"],
    sections: [
      {
        title: "Which facial ratios appear in a face measurement tool",
        paragraphs: [
          "A facial ratios tool compares relative distances between detected landmarks. Depending on the feature, distances are expressed in relation to face width or height, so they describe proportions within the photo rather than real-world millimetres.",
          "This report may include face length-to-width, pupil spacing, jaw-to-cheekbone width, midface length, and eye-corner angle. Facial thirds are estimated from visible forehead, brow, nose-base, and chin points when available."
        ]
      },
      {
        title: "What changes the facial proportion reading",
        paragraphs: ["Camera perspective, head rotation, expression, shadows, hair, and landmark detection all influence the measured points. A front-facing selfie also cannot provide a complete five-part face measurement or side-profile depth."]
      },
      {
        title: "How to compare face measurements fairly",
        paragraphs: [
          "For a more consistent face measurement, use an eye-level camera, a straight-on pose, soft even light, and a clear view of the face. Compare like with like rather than treating a number from one image as a fixed biological measurement.",
          "Facial ratios can help describe an image, but they are not standards of beauty and do not indicate health. Use them as optional reference points, not targets."
        ]
      }
    ]
  },
  "hairstyle-finder": {
    title: "Hair and hairline check: estimate visible hair coverage",
    description: "Check a photo-based estimate of visible hair coverage, crown coverage, and front hairline position. Learn what a single image can—and cannot—show.",
    keywords: ["hairline check", "hair coverage checker", "hair quantity check from photo", "front hairline estimate", "visible hair density estimate"],
    sections: [
      {
        title: "What this hair check measures",
        paragraphs: [
          "The Hair & Hairline Check estimates how much hair is visibly detected around the head and crown, then traces a front hairline when the photo provides a clear enough signal. For the length label, hair is considered long when it visibly extends below the estimated ear line; otherwise, it is considered short. The outline on the photo is an estimate from image segmentation, not a measured clinical hairline.",
          "Coverage is the share of pixels classified as hair inside estimated head regions. It is not a count of individual strands or a clinical measurement of hair density. Dark backgrounds, shadows, hats, tied hair, and similar hair and skin tones can affect the estimate."
        ]
      },
      {
        title: "How to take a clearer hairline photo",
        paragraphs: ["Use a sharp, evenly lit photo with your forehead and hairline visible. Face the camera at eye level, keep your head straight, and avoid hats, filters, strong shadows, and hair covering the front hairline. For a fair comparison over time, use similar lighting, camera distance, and hairstyle."],
        bullets: ["Keep your full head and forehead inside the frame.", "Use soft, even light and a plain background if possible.", "Wear hair as you normally do, but keep the front hairline visible."]
      },
      {
        title: "Read hair quantity and hairline estimates carefully",
        paragraphs: [
          "A front-facing portrait cannot show the back or full crown, and a single image cannot establish whether hair is thinning or why. Camera angle, contrast, styling, and segmentation errors can all change the percentages. The estimate is for visual reference only.",
          "If you are concerned about ongoing shedding or changes in hair coverage, compare consistent photos and speak with a qualified healthcare professional. Optional haircut ideas on this page are separate styling suggestions, not conclusions from the hair check."
        ]
      }
    ]
  },
  "hairstyle-try-on": {
    title: "Preview realistic hairstyles fitted to your head",
    description: "Try a private, on-device hairstyle preview with procedural fiber strands, multi-tonal salon shades, and precision head-fitting controls.",
    keywords: ["hairstyle try on", "virtual hairstyle preview", "try a haircut on my photo", "hair color preview", "realistic hair try on", "virtual salon"],
    sections: [
      {
        title: "Photorealistic on-device hair preview",
        paragraphs: [
          "Choose from 12 expertly sculpted hairstyles across lengths and textures, paired with multi-tonal salon shades or your own custom tint. The tool renders thousands of individual procedural strands with natural root blending, anisotropic crown sheen, and forehead contact depth.",
          "Every calculation and landmark mapping runs locally inside your browser tab using WebAssembly face detection. No photo is ever sent to an external server or API."
        ]
      },
      {
        title: "How to get a perfect head fit",
        paragraphs: ["Use a clear, front-facing portrait in even lighting. Our AI landmark system automatically maps your face width, head tilt, and cranial apex to place the hairstyle naturally."],
        bullets: [
          "Use the 'Fix on Head' controls to nudge hairline height up or down to align with your natural hairline.",
          "Adjust Crown Volume, Hair Length, and Head Scale to match your skull shape.",
          "Use 'Mirror Parting' to flip side sweeps from left to right.",
          "Drag the interactive Split View slider to inspect before-and-after transformations side-by-side."
        ]
      },
      {
        title: "Your preferences matter most",
        paragraphs: [
          "The preview helps you visualize cut silhouettes and shades before visiting a stylist. Real hair density, cowlicks, texture, and upkeep routines are personal, so use these previews as inspiration alongside professional salon advice.",
          "Your portrait never leaves your device. You can download your high-resolution styled look at any time with one click."
        ]
      }
    ]
  },
  "makeup-suggestions": {
    title: "Makeup suggestions by face and eye shape",
    description: "Get makeup ideas from visible face shape and eye features, and learn what a photo tool cannot infer about your skin or undertone.",
    keywords: ["makeup suggestions by face shape", "makeup for eye shape", "makeup suggestions tool", "makeup ideas for my features", "face shape makeup guide"],
    sections: [
      {
        title: "How this photo-based makeup guide works",
        paragraphs: [
          "This makeup suggestions tool uses visible face and eye proportions to offer optional ideas for placement and style. It can describe the detected face outline, eye opening, and approximate eye-corner angle, then let you choose a makeup finish and color direction.",
          "A photo cannot reliably establish your skin undertone, product compatibility, allergies, or exact skin tone under different lighting. Those are not inferred by this tool."
        ]
      },
      {
        title: "Choose makeup colors for your own preferences",
        paragraphs: ["Use the color selector to explore a direction you already like, then consider testing shades in natural light. Camera white balance, indoor bulbs, and filters can shift how colors look on screen. The tool does not prescribe a palette or claim one is objectively most flattering."]
      },
      {
        title: "Treat application tips as experiments",
        paragraphs: [
          "Eye-shape ideas can help you try a liner trajectory or shadow placement, while face-shape notes can suggest ways to blend cheek color. These are creative options rather than corrections; keep the techniques that make you feel like yourself.",
          "The free makeup guide processes the face photo on your device. It does not diagnose skin, analyze skin texture, or recommend specific cosmetic products."
        ]
      }
    ]
  },
  "full-dress-check": {
    title: "Outfit check: a practical guide to choosing what to wear",
    description: "Use a simple outfit checklist for comfort, weather, occasion, fit, and personal style. No body rating or clothing-photo analysis is involved.",
    keywords: ["outfit checker", "outfit check", "what should I wear checklist", "outfit planning guide", "clothing outfit ideas"],
    sections: [
      {
        title: "What an outfit check should help you decide",
        paragraphs: [
          "A useful outfit check is less about being rated and more about whether your clothes work for the day. Consider the occasion, expected weather, comfort, movement, and any practical requirements before deciding whether an outfit feels right.",
          "Look Checker's free outfit checklist is based on the choices you make. It does not inspect a clothing photo, judge your body, or claim that one silhouette is correct for you."
        ]
      },
      {
        title: "A quick checklist before you leave",
        paragraphs: ["Start with what the day asks of you, then review the outfit against your own preferences."],
        bullets: ["Does it suit the occasion and dress expectations?", "Can you move, sit, and spend the day comfortably?", "Will you be warm or cool enough for the weather?", "Do the pieces feel like your style and fit your plans?"]
      },
      {
        title: "Make outfit advice personal",
        paragraphs: [
          "Personal style is not a universal formula. Color, fit, layering, and accessories are choices you can adapt to your comfort, culture, budget, and taste.",
          "Use the online outfit checker as a private planning prompt. It runs in your browser and does not need an account or a photo upload."
        ]
      }
    ]
  },
  "skin-analysis": {
    title: "Skin analysis guide: a cosmetic self-check, not a diagnosis",
    description: "Learn what this skin check-in can help you reflect on, why a selfie cannot diagnose skin, and when to seek professional advice.",
    keywords: ["skin analysis online", "skin check tool", "skin analysis app", "cosmetic skin routine guide", "skin self assessment"],
    sections: [
      {
        title: "What this online skin check does",
        paragraphs: [
          "This skin analysis tool is a guided cosmetic check-in based on the answers you choose. An optional photo stays in your browser as a visual reference; it is not automatically scanned for texture, spots, acne, tone, or skin conditions.",
          "Lighting, camera processing, makeup, and display settings can all alter how skin looks in a photograph. A selfie cannot reliably diagnose a condition or determine the cause of a skin change."
        ]
      },
      {
        title: "Keep cosmetic skincare simple",
        paragraphs: ["If you are reviewing everyday skincare, start with gentle cleansing, moisturizer that suits you, and broad-spectrum sun protection. Introduce new products cautiously and follow their labels. More products do not automatically mean better results."]
      },
      {
        title: "When to ask a professional",
        paragraphs: [
          "A cosmetic self-check is not medical advice and cannot replace an examination. Ask a qualified healthcare professional about persistent irritation, a changing spot, pain, or any skin concern that worries you.",
          "Use this free skin check for general reflection only. Your photo is not uploaded for automated skin analysis, and the tool does not prescribe treatment."
        ]
      }
    ]
  },
  "pretty-scale": {
    title: "Pretty scale test: what a face proportion snapshot means",
    description: "Learn why no objective pretty scale exists, what measurements this face snapshot summarizes, and how camera conditions affect online beauty-score claims.",
    keywords: ["pretty scale test", "pretty scale online", "face rating test", "face proportion score", "pretty scale calculator"],
    sections: [
      {
        title: "There is no objective pretty scale",
        paragraphs: [
          "Searches for a pretty scale test often lead to websites that assign a number to someone's appearance. Look Checker does not claim to measure beauty. Its photo snapshot summarizes selected landmark measurements using a custom formula.",
          "Attractiveness is subjective and influenced by far more than facial geometry. A score from an app is not a measure of your value, health, identity, or how other people will see you."
        ]
      },
      {
        title: "What the photo proportion snapshot contains",
        paragraphs: ["The result combines estimates such as symmetry, face proportions, facial thirds and fifths, eye relationships, and jaw width. These measurements can change with expression, camera distance, lighting, head angle, and image quality."]
      },
      {
        title: "Use a face test without turning it into a judgement",
        paragraphs: [
          "If you are curious, focus on the individual measurements and their limits rather than the combined score. Use a similar photo setup when comparing results, and remember the values describe that image only.",
          "This free pretty-scale alternative is designed for casual exploration, not ranking or diagnosing people. If appearance scoring is affecting your well-being, it is okay to skip the number and use a different tool."
        ]
      }
    ]
  },
  "glow-up": {
    title: "A realistic glow-up plan: small changes that fit your life",
    description: "Build a low-pressure glow-up routine around your goals, time, and budget, with practical grooming and style ideas—not appearance rules.",
    keywords: ["glow up planner", "glow up routine", "realistic glow up tips", "personal style plan", "simple grooming routine"],
    sections: [
      {
        title: "Start a glow-up with a goal you control",
        paragraphs: [
          "A realistic glow-up is a personal routine, not a requirement to change your face or body. Pick one area you want to explore—such as getting ready more easily, refreshing a haircut, or organizing a wardrobe—and choose a time commitment you can maintain.",
          "The free glow-up planner turns your selected focus and time budget into a short checklist. It does not require a photo, recommend procedures, or assume that everyone wants the same result."
        ]
      },
      {
        title: "Choose small, repeatable habits",
        paragraphs: ["Simple steps are easier to keep than an elaborate makeover plan. Build around your real schedule, preferences, and budget."],
        bullets: ["Choose grooming habits that feel comfortable and manageable.", "Try one styling change at a time so you can decide whether you like it.", "Use products you already own before buying more.", "Keep goals focused on how you want to feel or get ready."]
      },
      {
        title: "Review the plan without pressure",
        paragraphs: [
          "Give a new routine enough time to see whether it works for your day-to-day life, then adjust or stop anything that does not feel right. Progress does not need a before-and-after score.",
          "Use the glow-up checklist as inspiration, not a judgement. Rest, self-expression, and doing nothing to your appearance are all valid choices."
        ]
      }
    ]
  },
  "eyebrow-mapping": {
    title: "Eyebrow mapping guide: balance, shape, and natural brows",
    description: "Learn how a brow balance tool compares visible landmarks, what it cannot map from a selfie, and how to shape brows without chasing perfect symmetry.",
    keywords: ["eyebrow mapping", "brow mapping tool", "eyebrow shape guide", "eyebrow symmetry check", "how to map eyebrows"],
    sections: [
      {
        title: "What an eyebrow mapping tool can estimate",
        paragraphs: [
          "Traditional eyebrow mapping uses facial reference points to plan the start, arch, and tail of each brow. This photo tool does something narrower: it compares the vertical positions of a pair of visible brow landmarks after accounting for eye-line angle.",
          "It does not calculate exact brow start, arch, or tail coordinates, assess hair growth, or determine an ideal brow shape. A front-facing selfie also makes fine placement difficult to measure accurately."
        ]
      },
      {
        title: "Natural brow differences are normal",
        paragraphs: ["Brows often differ slightly in height, density, and growth direction. Expression, grooming, makeup, and camera angle can make those differences more noticeable in a photograph. Perfectly matching brows are not a requirement for a balanced look."]
      },
      {
        title: "Use brow balance as a styling reference",
        paragraphs: [
          "If you want to experiment, work with your natural growth and remove or fill small areas gradually. A brow professional can help with shaping if you are unsure; avoid making a large change based on one image score.",
          "This free eyebrow balance check is a photo estimate, not a beauty grade or a replacement for a hands-on brow map."
        ]
      }
    ]
  },
  "true-mirror": {
    title: "True mirror: how to see an unmirrored camera view",
    description: "Compare mirrored and unmirrored selfie views, learn how a true mirror tool works, and why it cannot show exactly how others perceive you.",
    keywords: ["true mirror online", "unmirrored camera", "how others see my face", "flip selfie camera", "unmirror face camera"],
    sections: [
      {
        title: "Mirrored selfies and unmirrored views",
        paragraphs: [
          "Many front-facing cameras show a mirrored preview, similar to looking in a bathroom mirror. A saved photo may use the unmirrored orientation, so familiar asymmetries or text can appear reversed compared with the live preview.",
          "A true mirror tool flips the camera preview horizontally to let you compare orientations. It does not change your features or measure how attractive you look."
        ]
      },
      {
        title: "Why an unmirrored view can feel unfamiliar",
        paragraphs: ["You are accustomed to seeing your reflection, so a reversed version of your face can feel surprising even though it is simply another orientation. The view is not a more accurate judgement of your appearance and cannot predict exactly how someone else perceives you."]
      },
      {
        title: "Use a private live mirror",
        paragraphs: [
          "Allow camera access to see the preview, then switch between mirrored and unmirrored views at your own pace. The camera is used locally in your browser; video is not recorded or uploaded by this tool.",
          "The free online true mirror is a perspective aid, not a test. You can close it whenever you like, and no account is required."
        ]
      }
    ]
  },
  "full-analysis": {
    title: "Complete face analysis: measurements, limits, and style ideas",
    description: "Explore a complete photo-based face analysis with shape, symmetry, proportions, eye and jaw estimates, plus clear limits and optional styling ideas.",
    keywords: ["complete face analysis", "face analysis online", "facial analysis tool", "face measurements and proportions", "free face scan"],
    sections: [
      {
        title: "What a complete face analysis includes",
        paragraphs: [
          "A complete face analysis brings several photo-based estimates together: visible face shape, paired landmark alignment, length-to-width proportions, facial thirds and fifths, eye relationships, and front-view jaw taper. It can also present hairstyle ideas based on the estimated outline.",
          "These are relative measurements from a single image, not clinical craniometrics, real-world millimetres, or a validated beauty score. Perspective, expression, lighting, and landmark detection all affect the result."
        ]
      },
      {
        title: "Prepare a useful front-facing photo",
        paragraphs: ["Use a well-lit, straight-on photo with your full face visible, a relaxed expression, and the camera around eye level. Avoid close wide-angle selfies, filters, heavy shadows, or hair covering important landmarks. Consistent photos make comparisons more meaningful."]
      },
      {
        title: "Understand what the scan cannot determine",
        paragraphs: [
          "A front-facing image cannot reliably measure side-profile jaw angle, gonial angle, skin condition, skin undertone, exact brow mapping points, neck or shoulder proportions, or how other people perceive you. Those details are marked as not measured rather than guessed.",
          "The face scan runs in your browser and does not upload your photo. Use the report as educational context and optional style inspiration—not diagnosis, a beauty standard, or a reason to change your appearance."
        ]
      }
    ]
  }
};
