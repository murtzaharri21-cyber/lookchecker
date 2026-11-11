export type ToolDefinition = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  action: string;
  metric: string;
  formula: string;
  detail: string;
  mode?: "outfit" | "skin" | "glow-up";
};

export const tools: ToolDefinition[] = [
  {
    slug: "face-shape",
    title: "Face Shape",
    eyebrow: "Face shape detector",
    description: "Find your face shape, then see hairstyles and frames that make sense for your proportions.",
    action: "Find my shape",
    metric: "Face shape",
    formula: "Face height ÷ cheekbone width, interpreted together with jaw-to-cheekbone width.",
    detail: "Your outline is classified using the proportions of your visible face. Hairstyles are suggestions, not rules.",
  },
  {
    slug: "attractiveness",
    title: "Free Attractiveness Test",
    eyebrow: "Free facial proportion test",
    description: "Explore a 0–100 reading of visible symmetry and proportions. It describes one photo, not your attractiveness or worth.",
    action: "Explore my results",
    metric: "Harmony score",
    formula: "A weighted blend of symmetry (28%), overall proportions (18%), facial thirds (14%), fifths (13%), eyes (14%), and jaw (13%).",
    detail: "This score describes the geometry of a single photograph. It is not a measure of attractiveness or your worth.",
  },
  {
    slug: "symmetry",
    title: "Symmetry Test",
    eyebrow: "Face symmetry checker",
    description: "See how corresponding points around your eyes, brows, mouth, and jaw align from side to side.",
    action: "Check my symmetry",
    metric: "Symmetry score",
    formula: "Twelve paired facial landmarks are compared across a central axis after correcting for head tilt.",
    detail: "Everyone has asymmetry. Lighting, expression, and camera angle can move this number, too.",
  },
  {
    slug: "golden-ratio",
    title: "Golden Ratio Face",
    eyebrow: "Facial proportion calculator",
    description: "Explore the relationship between your visible face length and its widest point.",
    action: "Measure my ratio",
    metric: "Length-to-width ratio",
    formula: "Distance from the visible forehead to the chin ÷ distance between the outer cheeks.",
    detail: "The golden ratio is a historical reference, not a universal standard for a beautiful face.",
  },
  {
    slug: "jawline-score",
    title: "Jawline Rating",
    eyebrow: "Jawline analysis",
    description: "Measure your jaw-to-cheekbone taper and see how your lower face frames the whole face.",
    action: "Score my jawline",
    metric: "Jaw proportion",
    formula: "Front-view jaw width ÷ cheekbone width, with left–right alignment considered.",
    detail: "A straight-on photo cannot give an accurate side-profile or gonial-angle measurement.",
  },
  {
    slug: "canthal-tilt",
    title: "Canthal Tilt",
    eyebrow: "Eye angle calculator",
    description: "Find the angle of your eye corners and see whether they read level, upturned, or downturned.",
    action: "Check my tilt",
    metric: "Eye corner tilt",
    formula: "The average angle between the inner and outer eye corners, corrected for head tilt.",
    detail: "A small change of angle is normal, and expression or camera position can affect a photograph.",
  },
  {
    slug: "eye-shape",
    title: "Eye Shape Detector",
    eyebrow: "Eye shape analysis",
    description: "Learn whether your visible eye opening reads more almond, round, or elongated.",
    action: "Find my eye shape",
    metric: "Eye shape",
    formula: "Average eye-opening width ÷ height, measured from eye-corner and eyelid landmarks.",
    detail: "This describes the visible eye opening in this image, not a permanent or medical classification.",
  },
  {
    slug: "facial-ratios",
    title: "Facial Ratios",
    eyebrow: "Face measurement tool",
    description: "A closer look at face length, eye spacing, jaw taper, nose width, and facial thirds.",
    action: "See my ratios",
    metric: "Facial proportions",
    formula: "Distances between facial landmarks are normalized by face width or height so the result is independent of image size.",
    detail: "The values are relative to your own photo; a selfie cannot reliably determine real-world millimetres.",
  },
  {
    slug: "hairstyle-finder",
    title: "Hair & Hairline Check",
    eyebrow: "Photo-based hairline and coverage check",
    description: "Check the visible front hairline and estimate how much hair is detected around the head and crown in your photo.",
    action: "Check my hair",
    metric: "Visible hair coverage and front hairline",
    formula: "On-device hair segmentation estimates visible hair coverage in head and crown regions; facial landmarks provide a reference for the visible front hairline.",
    detail: "These are approximate measurements from one image, not a diagnosis or a reliable way to confirm hair loss. Photo angle, lighting, hairstyle, and image quality can affect the result.",
  },
  {
    slug: "hairstyle-try-on",
    title: "Hairstyle Try-On",
    eyebrow: "On-device style preview",
    description: "Preview realistic hairstyles and multi-tonal salon shades fitted directly to your head with private, on-device AI alignment.",
    action: "Try a hairstyle",
    metric: "Realistic hairstyle try-on",
    formula: "Face landmarks map head tilt, forehead apex, cheek width, and cranial volume for realistic procedural hair rendering.",
    detail: "Rendered completely on your device with high-definition procedural strands, anisotropic sheen, and precision head-fit controls. Your photo never leaves your browser.",
  },
  {
    slug: "makeup-suggestions",
    title: "Makeup Suggestions",
    eyebrow: "Photo-based makeup guide",
    description: "Upload a photo for on-device face-shape and eye-shape readings, then get makeup ideas matched to those features.",
    action: "Get makeup ideas",
    metric: "Feature-based makeup ideas",
    formula: "Suggestions use the face shape, visible eye shape, and eye-corner angle measured from the photo.",
    detail: "Ideas are optional styling inspiration, not an assessment of your appearance. Skin tone and undertone are not inferred; choose colors that suit your own preference.",
  },
  {
    slug: "full-dress-check",
    title: "Full Dress Check",
    eyebrow: "Outfit checklist",
    description: "Add an outfit photo for a private visual reference, then review comfort, occasion, weather, and personal style with an on-device checklist.",
    action: "Check my outfit",
    metric: "Outfit checklist",
    formula: "A practical self-check based on your occasion, priorities, and the details you select.",
    detail: "Your outfit photo is shown only as a local reference; the tool does not identify clothes or judge fit from the image. Your choices stay in your browser.",
    mode: "outfit",
  },
  {
    slug: "skin-analysis",
    title: "Skin Analysis",
    eyebrow: "Cosmetic self-check",
    description: "Review a photo locally alongside a guided cosmetic check-in. No upload, automated diagnosis, or medical claims.",
    action: "Start a skin check",
    metric: "Personal skin check-in",
    formula: "General cosmetic suggestions based on the answers you choose, not automated image analysis.",
    detail: "Your photo stays in your browser and is not automatically analyzed. This is not a diagnosis or substitute for professional care.",
    mode: "skin",
  },
  {
    slug: "pretty-scale",
    title: "Pretty Scale Test",
    eyebrow: "Proportion snapshot",
    description: "See the same photo-based proportion measurements used in the free face test, without treating them as a beauty grade.",
    action: "View my proportions",
    metric: "Facial proportion snapshot",
    formula: "A weighted reading of visible symmetry and proportions detected in a single photograph.",
    detail: "There is no objective pretty scale. This result describes selected photo measurements only—not attractiveness, health, or personal worth.",
  },
  {
    slug: "glow-up",
    title: "Glow-Up Planner",
    eyebrow: "Everyday style planner",
    description: "Choose a realistic focus and time budget for practical, low-pressure grooming and personal-style ideas.",
    action: "Build my plan",
    metric: "Personal style plan",
    formula: "A short checklist based on the focus and time you select.",
    detail: "No procedures or appearance rules. Keep what suits your preferences, routine, and budget.",
    mode: "glow-up",
  },
  {
    slug: "eyebrow-mapping",
    title: "Eyebrow Mapping",
    eyebrow: "Brow balance tool",
    description: "Compare the position of your two brows and find an easy-to-try framing adjustment.",
    action: "Map my brows",
    metric: "Brow balance",
    formula: "Matching brow landmarks are compared after the photo is straightened by the eye line.",
    detail: "Brow shape is personal; a small difference is natural and often adds character.",
  },
  {
    slug: "true-mirror",
    title: "True Mirror",
    eyebrow: "Unmirrored camera",
    description: "See yourself as other people do, and flip back and forth in a private live camera view.",
    action: "Open my mirror",
    metric: "Live mirror",
    formula: "Your camera preview is flipped locally in your browser. No video is recorded or uploaded.",
    detail: "The unfamiliar view can feel surprising. It is just a perspective change, not a different face.",
  },
];

export const featuredToolSlugs = ["face-shape", "attractiveness", "symmetry", "golden-ratio"];

export const getTool = (slug: string) => tools.find((tool) => tool.slug === slug);

export type GuideDefinition = {
  slug: string;
  category: string;
  title: string;
  description: string;
  readTime: string;
  sections: { title: string; paragraphs: string[]; bullets?: string[] }[];
};

export const guides: GuideDefinition[] = [
  {
    slug: "face-shape-hairstyle",
    category: "Hairstyle",
    title: "Choosing a haircut for your facial outline",
    description: "A practical guide to finding a cut that complements your proportions without following arbitrary rules.",
    readTime: "4 min read",
    sections: [
      {
        title: "First, find your proportions",
        paragraphs: [
          "Face shape is a shorthand for your visible length, cheekbone width, and how the jaw tapers. It is a useful starting point, not a fixed identity. The same face can read differently with a new haircut, a camera angle, or a smile.",
          "For a steadier estimate, use a front-facing photo in even light. The browser-based tool compares visible proportions and offers a place to begin.",
        ],
      },
      {
        title: "A few good starting points",
        paragraphs: ["The goal is balance: decide where you want width, softness, or vertical movement, then choose the cut that you will actually enjoy maintaining."],
        bullets: [
          "Oval: most lengths work. Consider a textured bob, soft layers, or a middle part.",
          "Round: longer layers, side parts, and volume at the crown create a more elongated outline.",
          "Square: a soft fringe, waves, or layers around the jaw add movement to strong angles.",
          "Heart: a chin-length bob or fullness around the jaw balances a wider upper face.",
          "Oblong: curtain bangs and cheek-level volume can visually shorten a longer outline.",
          "Diamond: gentle volume at the forehead or jaw works well with prominent cheekbones.",
        ],
      },
      {
        title: "What matters more than a label",
        paragraphs: [
          "Hair density, curl pattern, cowlicks, lifestyle, and your own taste deserve at least as much weight as face shape. Bring photos of styles you like to a stylist and ask what is realistic for your texture.",
          "Try changing one thing at a time: parting, length around the cheekbones, or fringe. A small adjustment is easier to live with and easier to assess than a dramatic overhaul.",
        ],
      },
      {
        title: "A practical way to compare haircut ideas",
        paragraphs: [
          "Start with a goal you can describe without using a face-shape label: more movement around the cheeks, less weight at the jaw, a fringe that is easy to pin back, or a cut that air-dries well. This makes it easier to discuss a haircut with a stylist and easier to judge whether a reference photo is relevant.",
          "When saving reference photos, look for people with a similar hair texture, density, and styling routine. A cut that looks effortless on straight, fine hair may need more layering or daily styling on dense curls. Ask what the maintenance looks like between salon visits, how the cut behaves when tied back, and what products or heat tools are assumed.",
          "Treat face-shape suggestions as hypotheses to test against your preferences. You can preview a change by moving your part, pinning hair away from the face, or trying a temporary fringe before making a permanent cut. A photo tool can estimate an outline; it cannot know how a style will feel through a full day."
        ],
        bullets: [
          "Describe the effect you want, such as cheek-level movement or a low-maintenance fringe.",
          "Bring reference images that show the front, side, and natural texture where possible.",
          "Ask the stylist which parts of the reference will translate to your hair and routine."
        ]
      },
      {
        title: "Questions to ask before committing",
        paragraphs: [
          "A useful consultation makes room for trade-offs. Ask how much length needs to come off, whether the shape needs heat styling, how often it needs a trim, and what it looks like on a wash-and-wear day. If you are unsure, request a smaller change first and agree on a plan to adjust later.",
          "The best result is not the haircut that makes a diagram look balanced. It is one that works with your hair, time, budget, comfort, and taste. Face-shape labels are broad visual shorthand; they should never be treated as rules or as evidence that a feature needs correcting."
        ]
      },
    ],
  },
  {
    slug: "hairline-check",
    category: "Hair & hairline",
    title: "Hairline photos: what one image can show",
    description: "Learn how to take a useful hairline photo, what visible hair coverage estimates actually measure, and why one image cannot diagnose hair loss.",
    readTime: "5 min read",
    sections: [
      {
        title: "What a hairline photo can show",
        paragraphs: [
          "A clear portrait can show the visible outline of your front hairline and how hair appears in the parts of your head that are in frame. A photo-based hair check can estimate visible coverage in selected head regions, but it cannot count individual strands or measure clinical hair density.",
          "The front hairline and the crown are different views. A straight-on photo may show the forehead and front edge, while the crown is often partly hidden by the angle. Treat a coverage percentage as a description of pixels classified in that particular image—not as a complete picture of your scalp."
        ]
      },
      {
        title: "Take a more consistent hairline photo",
        paragraphs: [
          "The most useful comparison is usually a repeatable one. Face the camera at eye level, keep your head in a natural neutral position, and use soft, even light. Include your full head and forehead in the frame, and avoid filters, strong shadows, hats, or hair covering the area you want to see.",
          "If you are comparing photos over time, try to keep the camera distance, lighting, angle, and hairstyle similar. A change in any of these can make the hairline or apparent coverage look different even when the underlying hair has not changed."
        ],
        bullets: [
          "Use a clear, front-facing image with the forehead visible.",
          "Choose even light and avoid harsh overhead shadows.",
          "Keep framing and styling similar when comparing separate photos."
        ]
      },
      {
        title: "Understand what a coverage estimate means",
        paragraphs: [
          "An image tool classifies pixels; it does not inspect follicles. Hair color, skin tone, background contrast, curls, tied-back styles, shadows, compression, and segmentation mistakes can all affect which pixels are identified as hair. A low or high percentage should therefore not be read as a medical measure.",
          "Likewise, a front hairline trace is only an approximate visual reference when the photo contains a clear enough signal. If no trace is shown, it means the image did not provide a confident estimate—not that a particular hairline is present or absent."
        ]
      },
      {
        title: "Use photos as context, not a diagnosis",
        paragraphs: [
          "One portrait cannot establish whether hair is thinning, identify a cause, or show every area of the scalp. Hair can be arranged differently from one photo to the next, and a camera can exaggerate small changes. Use a photo check as a visual reference only, and avoid treating its labels as a verdict about your hair or health.",
          "If you notice persistent or concerning changes, or want advice about hair loss, speak with a qualified healthcare professional. They can consider your history and examine areas a selfie cannot show. This guide and the Hair & Hairline Check are educational tools, not medical advice."
        ]
      },
      {
        title: "Keep your photo private",
        paragraphs: [
          "Look Checker's hair check runs in your browser, so the photo is analyzed on your device rather than uploaded for the scan. You can use the Hair & Hairline Check for an optional visual estimate, then return to this guide whenever you want a reminder of its limits."
        ]
      }
    ]
  },
  {
    slug: "glow-up-tips",
    category: "Everyday care",
    title: "A realistic everyday glow-up guide",
    description: "Simple, sustainable changes that make a difference without a complicated routine.",
    readTime: "3 min read",
    sections: [
      {
        title: "Start with the things you can repeat",
        paragraphs: ["Consistency is more useful than a long list of products. Sleep, sun protection, a gentle routine, and a haircut that fits your day-to-day life do more than chasing a single perfect selfie."],
        bullets: [
          "Keep your skincare basic: cleanse gently, moisturize, and use broad-spectrum SPF during the day.",
          "Take progress photos in the same light and from the same distance if you want an honest comparison.",
          "Choose a haircut and grooming routine you can maintain comfortably.",
          "If skin irritation or other health concerns persist, ask a qualified professional rather than relying on a photo tool.",
        ],
      },
      {
        title: "Make your features the reference point",
        paragraphs: ["A proportion measurement can help explain why a parting or frame looks different on two people. It should not tell you that a normal feature needs fixing. Use your results to experiment, not to judge yourself."],
      },
      {
        title: "Give changes time",
        paragraphs: ["Styling changes can be visible immediately. Skin routines take weeks, and changes in photos are easy to confuse with a different lens or lighting setup. Set a small goal, stay consistent, and check back with a matched photo."],
      },
      {
        title: "Build a routine around one real need",
        paragraphs: [
          "A practical routine starts with a specific problem, not a long shopping list. If mornings feel rushed, choose one styling step that saves time. If a product repeatedly irritates your skin, stop using it and seek qualified advice if symptoms persist. If you want to compare photos, keep the camera distance, lighting, and expression as similar as you reasonably can.",
          "Write down what you changed and when. This simple record helps separate a real pattern from a good or bad photo day. Avoid changing several products or habits at once if you are trying to understand what helped, and do not interpret a cosmetic photo check-in as a diagnosis."
        ],
        bullets: [
          "Choose one manageable change for the next two weeks.",
          "Note the cost, time, and comfort as well as the visible result.",
          "Stop a routine that causes discomfort and ask a qualified professional about persistent concerns."
        ]
      },
      {
        title: "Keep comparisons fair and kind",
        paragraphs: [
          "A close selfie, overhead lighting, a new camera, or a different expression can change how facial features appear. When comparing images, match the setup as closely as possible and use the comparison to understand photography conditions rather than to grade yourself.",
          "There is no requirement to optimize your appearance. Rest, grooming, skincare, clothing, or a new haircut are personal choices, not obligations. A plan is useful only if it fits your own priorities and does not make daily life feel more stressful."
        ]
      },
    ],
  },
  {
    slug: "glasses-for-face-shape",
    category: "Eyewear",
    title: "The right glasses for your face shape",
    description: "Find a flattering frame by balancing width, angles, and the fit on your actual face.",
    readTime: "4 min read",
    sections: [
      {
        title: "Fit first, shape second",
        paragraphs: ["A frame that pinches your temples or slides down your nose will never feel right, however well it matches a face-shape chart. Start with comfortable width, bridge fit, and lens height, then consider visual balance."],
      },
      {
        title: "Find contrast or echo",
        paragraphs: ["Rounder outlines often pair nicely with a bit of angular definition; sharper outlines can look great with soft curves. An oval face is flexible enough for almost anything. These are ideas, not restrictions."],
        bullets: [
          "Round: rectangular, square, and subtly upswept frames add structure.",
          "Square: round, oval, or softly curved frames can ease a strong jawline.",
          "Heart: lighter bottoms or softly rounded frames balance the upper face.",
          "Oval: experiment with wayfarer, aviator, geometric, or round shapes.",
          "Oblong: taller lenses and a stronger brow line can add visual width.",
        ],
      },
      {
        title: "A quick in-store test",
        paragraphs: ["Take a straight-on photo wearing each pair in similar light. Make sure your eyes sit near the center of each lens, your cheeks do not touch the frames when you smile, and the width feels proportional to your face."],
      },
      {
        title: "Check frame measurements and comfort",
        paragraphs: [
          "Frame labels such as round, square, or cat-eye describe broad design traits, not a reliable fit. Compare the width of the frame with your face, check that the bridge rests comfortably, and make sure the temples do not pinch or flare sharply. The pupils should sit naturally within the lenses, and the frame should stay in place when you look down and smile.",
          "If you already own a pair that fits well, note its measurements—often printed inside the temple—and use them as a starting point when browsing. A similar number does not guarantee a similar fit because bridge shape, lens height, and temple design differ. Ask an optician to adjust the frames if they slide, press, or sit unevenly."
        ],
        bullets: [
          "Wear the frames for several minutes instead of judging only from a mirror glance.",
          "Check for pressure at the nose and temples, and for contact with cheeks when smiling.",
          "Ask about adjustments, lens compatibility, and return terms before buying."
        ]
      },
      {
        title: "Use face-shape advice as a styling prompt",
        paragraphs: [
          "A shape chart can suggest contrast—curves with angular lines, or a stronger brow line with a softer outline—but it cannot account for prescription thickness, bridge fit, vision needs, or personal taste. Comfort and optical suitability should come first. A frame that fits well can look intentional on many different face outlines.",
          "If shopping online, compare the frame measurements with a pair you already wear and read the seller's return policy. If you need corrective lenses, get frame and lens advice from an optician. The goal is a pair you can see through and comfortably wear, not a shape category to satisfy."
        ]
      },
    ],
  },
];

export const getGuide = (slug: string) => guides.find((guide) => guide.slug === slug);
