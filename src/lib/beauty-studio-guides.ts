export type BeautyStudioGuide = {
  slug: string;
  tool: string;
  title: string;
  description: string;
  readTime: string;
  intro: string;
  sections: {
    title: string;
    paragraphs: string[];
    bullets?: string[];
  }[];
  faqs: { question: string; answer: string }[];
};

export const beautyStudioGuides: BeautyStudioGuide[] = [
  {
    slug: "hairstyle-try-on",
    tool: "Hairstyle try-on",
    title: "Try hairstyles before a salon visit",
    description: "A practical guide to previewing hairstyles on your own photo, comparing lengths and shapes, and adjusting the fit before you save a look.",
    readTime: "5 min read",
    intro: "A haircut can feel like a big decision, especially when a reference photo belongs to someone with different hair, proportions, or texture. The AI Beauty Studio hairstyle tool gives you a personal preview: it maps your face in the photo, places a digital style around it, and lets you compare the result before you book a cut.",
    sections: [
      {
        title: "Start with a useful photo",
        paragraphs: [
          "Choose a sharp, evenly lit photo where your forehead, temples, ears, and jaw are reasonably easy to see. Pulling hair away from the face can help the fit. A straight-on image is the easiest place to start; a three-quarter view can be useful for seeing how a cut frames the side of your face.",
          "Keep the camera near eye level and avoid strong portrait filters. Filters, deep shadows, hats, and hair covering the hairline can make the preview less dependable. If the first result looks off, try another photo before changing every fit setting."
        ],
        bullets: [
          "Use one face in the frame and keep the face large enough to see clearly.",
          "Choose soft daylight or bright, even indoor lighting.",
          "Avoid extreme camera angles and motion blur."
        ]
      },
      {
        title: "Compare shape and length first",
        paragraphs: [
          "Browse the hairstyle tiles and use the length and category filters to narrow the options. The “Best for” filter is a suggestion based on the tool’s estimated face shape, not a rule. Try a few different silhouettes as well as the styles it highlights; personal taste and your natural texture matter more than a category label.",
          "Look at where the style adds width or height, how it sits around the temples, and whether the overall outline feels like you. A preview is most useful for comparing broad ideas, such as a shorter fringe versus longer layers, rather than predicting the exact result of a salon cut."
        ]
      },
      {
        title: "Fine-tune the fit and color",
        paragraphs: [
          "Use Size to scale the hairstyle, Width / volume to adjust its breadth, and Vertical position to move it up or down. Make small changes and compare each result with the original. Reset fit returns those controls to their starting values.",
          "Color swatches and the custom picker let you explore a different shade. Hair-color rendering is an approximation over the visible hair region; it cannot reproduce every dye process, highlight pattern, or effect of your real hair texture. For a fair comparison, start with a color close to your natural shade and adjust gradually."
        ]
      },
      {
        title: "What the preview can and cannot tell you",
        paragraphs: [
          "The studio uses face landmarks and image-based rendering to position a style. It is a visual planning aid, not a 3D scan and not a promise of how a stylist will cut or color your hair. A single photo cannot show the back of your head, hidden hair, or the way a style moves in person.",
          "Bring saved previews to a consultation as conversation starters. Ask your stylist how the reference would work with your hair density, curl pattern, growth direction, maintenance preferences, and the time you want to spend styling it."
        ]
      }
    ],
    faqs: [
      { question: "Can I try hairstyles from a side angle?", answer: "Angled photos can work when the face remains visible, and the fit adapts to detected head pose. A clear front-facing photo usually gives the most predictable starting result; extreme profile views and occluded features can reduce accuracy." },
      { question: "Does the preview show the exact salon result?", answer: "No. It is an on-photo visualization for comparing ideas. Hair texture, cut technique, lighting, and styling products all affect the result in real life." },
      { question: "Can I adjust the hairstyle after choosing it?", answer: "Yes. Use the size, width / volume, and vertical-position controls, then reset fit whenever you want to start over." }
    ]
  },
  {
    slug: "hair-color-preview",
    tool: "Hair color preview",
    title: "Preview hair color ideas on your own photo",
    description: "Learn how to compare virtual hair colors, choose a clear photo, and understand what an on-screen color preview can realistically show.",
    readTime: "4 min read",
    intro: "Choosing a new hair color is easier when you can compare options on a familiar face. The AI Beauty Studio color preview estimates the visible hair area and applies a chosen shade while preserving some of the image’s texture and light. Treat it as a way to explore a direction, not as a guaranteed dye formula.",
    sections: [
      {
        title: "Get the photo ready",
        paragraphs: [
          "Use a well-lit image with your current hair visible and in focus. Even lighting helps the tool distinguish hair from the background. If your hair blends into a dark wall or is hidden beneath a hat, the color mask may not follow the hairline cleanly.",
          "Natural, unfiltered photos are best for comparing tones. Strong warm lighting can make cool colors look warmer, while shadows can make darker shades appear heavier than they will in daylight."
        ],
        bullets: [
          "Keep hair and background visually distinct where possible.",
          "Avoid heavy filters that shift skin or hair color.",
          "Use a photo with enough resolution to see the hair."
        ]
      },
      {
        title: "Explore color without overcorrecting",
        paragraphs: [
          "Select a hairstyle or use the color controls to compare available shades. Start near your current color, then move toward a lighter, deeper, warmer, or cooler direction. If the tool offers a custom color picker, small hue changes are often more informative than jumping straight to a very different shade.",
          "Color intensity affects how strongly the selected shade appears over the original hair. A lower intensity can preserve more of the source image; a higher setting makes the new color easier to compare. Look at the result on the whole photo, not only in the hair close-up."
        ]
      },
      {
        title: "Understand lighting and color limits",
        paragraphs: [
          "A screen preview cannot account for your exact starting level, previous color, porosity, or the products and technique a colorist might use. Bright blondes, vivid fashion shades, and large lightening changes are especially difficult to predict from one image.",
          "The preview is also affected by screen brightness and color calibration. If you like a shade, save the image and show it to a professional colorist. Ask what is achievable in one appointment, how much upkeep it needs, and how to protect your hair."
        ]
      }
    ],
    faqs: [
      { question: "Will the tool tell me what dye to buy?", answer: "No. It previews visual color ideas and does not calculate a salon formula or recommend a specific chemical process." },
      { question: "Why does color appear on the background or miss some strands?", answer: "Hair segmentation is an estimate from the photo. Fine flyaways, low contrast, blur, and strong shadows can make the boundary less precise." },
      { question: "Is my photo uploaded to a server?", answer: "The studio processes the selected photo in your browser for this experience. Review the site privacy notice for details about analytics and browser storage." }
    ]
  },
  {
    slug: "beard-style-preview",
    tool: "Beard style preview",
    title: "Find a beard shape that feels like your own",
    description: "Compare beard and moustache shapes on your photo, adjust color and density, and use the preview to plan a grooming conversation.",
    readTime: "4 min read",
    intro: "A beard changes the outline of the lower face, but choosing one from a reference image can be tricky. The AI Beauty Studio beard tool lets you compare digital beard and moustache shapes on your own photo, so you can explore a direction before trimming or growing it out.",
    sections: [
      {
        title: "Choose a clear view of your jaw",
        paragraphs: [
          "Start with a sharp photo that shows your chin, jawline, cheeks, and upper lip. Keep the camera close to eye level and use even light across both sides of your face. A relaxed expression makes it easier to judge how the beard sits around the mouth and chin.",
          "If you are comparing a style that changes the cheek line, use a photo where the sides of the face are not hidden by a hand, collar, or heavy shadow."
        ]
      },
      {
        title: "Browse by grooming style",
        paragraphs: [
          "Use the filters to compare full beards, goatees, moustaches, and stubble. The clean-shaven option gives you a quick baseline. Some styles may be tagged as a match for the estimated face shape; treat that label as a starting suggestion, then choose what suits your taste and routine.",
          "Compare the cheek line, the width at the jaw, and how much visual weight the style adds to the chin. A beard that looks balanced in a photo may need a different trim line to work with your natural growth pattern."
        ]
      },
      {
        title: "Adjust density and color",
        paragraphs: [
          "Select a shade that is close to your natural beard color, then use Density to soften or strengthen the appearance. Beards often contain several colors, and the preview simplifies that variation. Use the Match hair option if you want a coordinated starting point, but remember that scalp hair and facial hair do not always grow in the same shade.",
          "Save a couple of alternatives rather than relying on one image. Showing your barber the shape you prefer and the parts you want changed can make a grooming conversation more specific."
        ]
      },
      {
        title: "Keep real growth in mind",
        paragraphs: [
          "The overlay cannot predict how full your beard will grow, where your natural cheek line sits, or how quickly it fills in. Those depend on your own hair growth and skin, not the preview. The image is a visual reference, not a claim about what you can grow.",
          "If you are unsure about a major change, try gradual trimming or ask a barber to shape the outline first. A professional can work with your actual growth pattern and suggest a maintenance routine."
        ]
      }
    ],
    faqs: [
      { question: "Can the tool make my beard look fuller than it grows?", answer: "It can visualize a beard shape and density, but it cannot predict your real growth or create new facial hair." },
      { question: "Can I match the beard to my hair color?", answer: "Yes. Choose Match hair in the beard color controls for a coordinated shade, then adjust if your natural beard is lighter or warmer." },
      { question: "What if the beard appears uneven?", answer: "Try an evenly lit, straight-on photo with the jaw unobstructed. Asymmetrical shadows or a turned head can affect landmark placement and the apparent outline." }
    ]
  },
  {
    slug: "makeup-try-on",
    tool: "Makeup try-on",
    title: "Try makeup looks and finishes on your photo",
    description: "Explore makeup presets, individual colors, and adjustable intensity with a practical guide to getting a more useful virtual try-on.",
    readTime: "5 min read",
    intro: "Makeup references can look different from one person to another because lighting, skin tone, eye shape, and personal preference all matter. The AI Beauty Studio makeup tool lets you preview a range of makeup effects on your own photo, then adjust individual features instead of committing to a single preset.",
    sections: [
      {
        title: "Choose a natural-light photo",
        paragraphs: [
          "Use a clear image with your eyes, brows, lips, and cheeks visible. Soft daylight or even indoor lighting makes color comparisons easier. Heavy makeup in the source image, strong beauty filters, or deep shadows can make it harder to judge the digital effect.",
          "Keep your expression relaxed and avoid photos where hair, glasses glare, or a hand covers the areas you want to preview."
        ]
      },
      {
        title: "Start with a signature look",
        paragraphs: [
          "Presets are useful when you want a quick starting point. Apply one, then look at the full portrait before deciding what to keep. A preset is a collection of adjustable effects, not a recommendation that you need to wear every part of it.",
          "For a more personal result, build the look in small steps: choose a lip shade and finish, add or soften eye color, then adjust blush, contour, highlight, or brow definition. The intensity controls help move from a subtle preview to a stronger one."
        ]
      },
      {
        title: "Use Custom Makeup for individual shades",
        paragraphs: [
          "The Custom Makeup tab is designed for changing specific color choices while keeping control over the rest of the look. Try one shade at a time and compare it with the suggested colors if they are available. You can also apply a suggested look as a starting point and refine it to your taste.",
          "Foundation and color matching in a photograph are approximate. Camera white balance, room lighting, display settings, and the source image all affect how a shade appears. Check any real product in person when possible, especially foundation."
        ]
      },
      {
        title: "Treat recommendations as ideas",
        paragraphs: [
          "The studio estimates visible facial features and color from a single image. Its undertone or shade suggestions are styling aids, not professional color analysis and not a guarantee that a product will match in person.",
          "Makeup placement can also vary with eye shape, expression, and angle. Use the preview to explore combinations and communicate what you like, then adapt the result to your own technique and comfort."
        ]
      }
    ],
    faqs: [
      { question: "Can I change only the lipstick or eye makeup?", answer: "Yes. The makeup controls let you adjust lips, eyes, cheeks, brows, and coverage separately." },
      { question: "Why do the colors look different on my screen?", answer: "The source lighting, camera white balance, monitor settings, and screen brightness can all shift perceived color." },
      { question: "Are the shade suggestions professional advice?", answer: "No. They are photo-based styling suggestions for experimentation, not a guarantee of a product match or a substitute for an in-person consultation." }
    ]
  },
  {
    slug: "custom-makeup-guide",
    tool: "Custom makeup",
    title: "Build a custom makeup look",
    description: "A step-by-step guide to using Custom Makeup to test suggested shades, control intensity, and create a look that feels personal.",
    readTime: "4 min read",
    intro: "A preset is convenient, but sometimes you only want to change one detail. Custom Makeup gives you a more deliberate way to explore the studio’s photo-based shade suggestions: choose individual colors, apply a suggested combination, and keep the parts of the look that feel right to you.",
    sections: [
      {
        title: "Wait for the photo analysis",
        paragraphs: [
          "Open the studio with a clear, well-lit portrait and let its on-device analysis finish. The Custom Makeup panel may show a short preparation message while it builds the photo-based suggestions. If a shade looks unexpected, check the image lighting and try a second photo before drawing conclusions.",
          "A neutral background and even light can make it easier to compare colors, but the face itself should remain clearly visible. Filters that alter skin tone can make any photo-based match less useful."
        ]
      },
      {
        title: "Try a full suggestion, then refine it",
        paragraphs: [
          "Apply the suggested look to see how the colors work together. Then change individual shade selections and adjust intensity until the result feels balanced. A useful approach is to focus on one feature at a time: lips, cheeks, or eyes.",
          "The suggested foundation, lip, and blush colors are estimates from the image. They are not linked to a particular store or product line, and a digital preview cannot account for every formula or finish."
        ]
      },
      {
        title: "Save a look you can describe",
        paragraphs: [
          "When you find a direction you like, use the studio’s download or before-and-after controls to save the preview. Treat the image as a reference for color placement and overall mood, rather than an exact recipe.",
          "For real products, swatch shades in natural light where possible. If you have sensitive skin or a history of reactions, check product ingredients and patch-test as directed by the manufacturer."
        ]
      }
    ],
    faqs: [
      { question: "What if suggested shades are not available yet?", answer: "Wait briefly for skin analysis to finish. If suggestions do not appear, reload the page and try a clear image with even lighting." },
      { question: "Does Custom Makeup recommend specific brands?", answer: "No. It offers color suggestions and visual effects, not brand, product, or ingredient recommendations." },
      { question: "Can I use the suggested colors as an exact foundation match?", answer: "Use them as a starting point only. A photo and screen cannot guarantee an in-person foundation match." }
    ]
  },
  {
    slug: "skin-analysis-guide",
    tool: "Skin analysis",
    title: "Understand your photo-based skin analysis",
    description: "Learn what the studio’s skin estimate can show, how to read its routine ideas, and why a photo cannot diagnose a skin condition.",
    readTime: "5 min read",
    intro: "A photo can be a useful prompt for noticing visible color and texture, but it cannot tell the whole story of your skin. The AI Beauty Studio skin panel summarizes image-based signals and offers general routine ideas. This guide explains how to read those results without treating a score as a diagnosis.",
    sections: [
      {
        title: "How to get a more consistent estimate",
        paragraphs: [
          "Use a recent, unfiltered photo taken in soft, even light. Keep the camera steady and avoid strong colored lighting, flash glare, or heavy makeup. Differences in exposure and white balance can change how skin tone and surface details appear to an image model.",
          "For comparisons over time, use similar lighting and camera distance. A single photo is a snapshot; it does not measure how your skin feels, how it responds to products, or how it changes through the day."
        ]
      },
      {
        title: "Read metrics as observations, not grades",
        paragraphs: [
          "The panel presents several visual estimates, including skin tone-related values, an overall score, and individual metrics. These are generated from pixels in the submitted image. They are not clinical measurements, and a low or high number should not be taken as a judgment about your appearance or health.",
          "Heat-map overlays help show where the tool found visual signals in the photo. They can be affected by shadows, facial hair, makeup, compression, and image quality. Turn the overlay off to return to the original image."
        ]
      },
      {
        title: "Use routine suggestions gently",
        paragraphs: [
          "Routine ideas are general starting points, such as keeping cleansing, moisturizing, and sun protection simple. Choose products based on your own needs, preferences, and tolerances rather than a photo score alone. Introduce one new product at a time and follow its label.",
          "If a product irritates your skin, stop using it and seek appropriate advice. For persistent, painful, or changing symptoms, consult a qualified healthcare professional instead of relying on an image tool."
        ]
      },
      {
        title: "Privacy and what this tool cannot do",
        paragraphs: [
          "The studio performs the image analysis in your browser for this experience. You choose whether to take a selfie or select a photo, and you can close the session when finished. See the site privacy notice for information about website-level data practices.",
          "This feature does not diagnose acne, eczema, rosacea, skin cancer, allergies, or any other medical condition. It cannot establish a medical skin type or replace an appointment with a dermatologist."
        ]
      }
    ],
    faqs: [
      { question: "Is the skin score a medical assessment?", answer: "No. It is an image-based estimate for general exploration and must not be used to diagnose or monitor a medical condition." },
      { question: "Can lighting change the result?", answer: "Yes. Shadows, flash, colored lights, white balance, filters, and camera exposure can affect image-based estimates." },
      { question: "Should I follow every routine suggestion?", answer: "No. Use routine ideas as general prompts, consider your own tolerance and needs, and consult a qualified professional about persistent or concerning symptoms." }
    ]
  },
  {
    slug: "face-shape-analysis-guide",
    tool: "Face shape analysis",
    title: "Face shape analysis for styling",
    description: "See how facial landmarks support the studio’s face-shape suggestions and how to use those suggestions for hair and beard ideas.",
    readTime: "4 min read",
    intro: "Face-shape labels can help organize styling ideas, but real faces do not always fit neatly into a single category. The AI Beauty Studio estimates facial proportions from a photo and uses them to suggest starting points for hairstyles and beard shapes. This guide explains how to get a useful result and how to keep the label in perspective.",
    sections: [
      {
        title: "What the face analysis measures",
        paragraphs: [
          "The studio detects facial landmarks around features and the face outline, then compares proportions such as visible length, cheek width, and jaw shape. The result is an image-based estimate, not a permanent classification or a measure of attractiveness.",
          "Camera distance, lens perspective, head angle, expression, and hair covering the outline can all change the apparent proportions. A centered, relaxed photo with the face clearly visible is a better starting point than a close-up selfie taken from above."
        ]
      },
      {
        title: "Use the label to explore options",
        paragraphs: [
          "In the hairstyle and beard panels, face-shape tags can help you narrow a large set of options. Use them as prompts rather than rules. A style that is not tagged as a match may still suit your hair texture, personal style, or maintenance preferences.",
          "Compare more than one silhouette. Consider what you want to emphasize, how much styling time you have, and whether a cut or beard shape fits your everyday routine."
        ]
      },
      {
        title: "Improve the photo before retaking it",
        paragraphs: [
          "If the result feels unlike what you see in the mirror, retake the photo in even light with the camera near eye level. Move the camera back slightly rather than using a very close lens, and make sure your jawline and forehead are not hidden.",
          "A turned head or strong expression is not necessarily a bad photo, but it can change what landmarks are visible. Use a straight-on image for the baseline, then try an angled view if you want to see how a styling preview responds to pose."
        ]
      }
    ],
    faqs: [
      { question: "Is my face shape only one category?", answer: "Not necessarily. Face shapes are simplified descriptions of proportions; many people have features that overlap more than one category." },
      { question: "Does a face-shape match mean a style will suit me?", answer: "It is a broad visual suggestion, not a guarantee. Hair texture, personal taste, maintenance, and the stylist’s technique matter too." },
      { question: "Why does the result change between photos?", answer: "Angle, distance, lighting, expression, and what is visible around the face can all affect landmark-based estimates." }
    ]
  },
  {
    slug: "face-shape-haircut-guide",
    tool: "Face shape and haircuts",
    title: "How to choose a haircut for your face shape",
    description: "A practical guide to matching haircut ideas with face shape, hair texture, personal style, and the amount of upkeep you actually want.",
    readTime: "6 min read",
    intro: "Face-shape advice is most helpful when it gives you more ideas, not a list of rules. A haircut changes the outline around your face, but texture, density, growth patterns, lifestyle, and what makes you feel like yourself matter just as much. Use this guide to explore cuts that might suit your proportions, then take the ideas—not a rigid formula—to a stylist.",
    sections: [
      {
        title: "Start with your outline, not a label",
        paragraphs: [
          "Face-shape guides usually compare face length with forehead, cheekbone, and jaw width. An oval outline is often described as gently balanced; a round outline has softer curves and similar width and length; a square outline has a broader, more angular jaw; a heart-shaped outline is broader at the forehead and tapers toward the chin; an oblong outline is longer than it is wide; and a diamond outline is widest near the cheekbones.",
          "These are broad descriptions, not fixed categories. Many people sit between shapes, and a camera angle or hairstyle can change the apparent outline. If you use the AI Beauty Studio’s estimate, treat it as a first impression rather than a definitive measurement."
        ],
        bullets: [
          "Look at your face with hair pulled back and in even light.",
          "Notice which areas appear widest and whether your face looks longer than it is wide.",
          "If two descriptions feel true, explore both sets of haircut ideas."
        ]
      },
      {
        title: "Haircut ideas by face shape",
        paragraphs: [
          "For an oval outline, many lengths and shapes can work. Consider the features you want to highlight—such as eyes, cheekbones, or a strong jaw—and choose a fringe, part, or length that supports that preference.",
          "For a round outline, some people like the visual length created by longer layers, an off-center part, or height near the crown. If you prefer a bob or a short cut, its shape can be tailored around your cheeks and jaw rather than avoided.",
          "For a square outline, layered movement, softer fringe, or length around the jaw can change how the haircut frames angular features. A clean blunt line can also be a confident choice if you enjoy a sharper silhouette.",
          "For a heart-shaped outline, consider how the cut balances the forehead and narrower chin. Side-swept fringe, face-framing layers, or fullness lower in the style are options to discuss—not requirements.",
          "For an oblong outline, fringe, cheek-level layers, curls, or width through the sides can add a different visual balance. For a diamond outline, layers or fringe that bring attention toward the eyes and soften transitions around the cheekbones may be worth trying."
        ]
      },
      {
        title: "Texture and routine matter more",
        paragraphs: [
          "A reference haircut is only useful if it can work with your natural texture and density. Curly and coily hair can spring up as it dries; waves and cowlicks affect where a fringe sits; fine hair may need a different layering approach than very dense hair. A stylist can adapt the shape for how your hair behaves, not just how it looks in a picture.",
          "Think about maintenance before choosing a dramatic change. Ask how often the cut needs trimming, how it looks air-dried, and what styling steps are needed on an ordinary morning. If you do not want daily heat styling, say so before the cut."
        ]
      },
      {
        title: "Use the AI try-on as a comparison tool",
        paragraphs: [
          "Choose a clear photo with your forehead, temples, and jaw visible. In the Hair panel, compare a few silhouettes and lengths; the “Best for” filter uses the estimated face shape to surface suggestions. You can adjust size, width, and vertical position if a style needs a small fit correction.",
          "The preview is a 2D visualization based on one image. It cannot show the back of the cut, the way your hair moves, or the exact result after a stylist adapts it to your texture. Save a few different options and use them to explain what you like—such as the fringe, the length, or the amount of volume—rather than asking for an exact copy."
        ]
      },
      {
        title: "Bring clear questions to your stylist",
        paragraphs: [
          "A good consultation turns a reference into a cut that works for your actual hair and routine. Show more than one image, including examples with hair texture or density similar to yours. Point out the specific details you like and the parts you would change.",
          "If you are uncertain, ask for a gradual change first. A stylist can help judge proportions in person, check your growth patterns, and suggest a version you can maintain. The final choice should reflect your comfort and taste—not a face-shape chart."
        ]
      }
    ],
    faqs: [
      { question: "Which haircut is best for my face shape?", answer: "There is no single best haircut. Face shape can suggest silhouettes to explore, but hair texture, density, personal style, and maintenance preferences should guide the final choice." },
      { question: "Can I wear a short haircut if I have a round face?", answer: "Yes. Face-shape categories are not restrictions. A stylist can adapt a short cut to your features, texture, and preferred outline." },
      { question: "Does the AI Beauty Studio tell me exactly what to ask my stylist for?", answer: "It can help you compare visual ideas, but it cannot account for every detail of your hair or show the full cut. Use saved previews to start a conversation and ask your stylist how to adapt them." },
      { question: "Should I choose a haircut only by face shape?", answer: "No. Consider how your hair naturally behaves, how much styling you want to do, and what makes you feel comfortable. Face shape is just one useful styling lens." }
    ]
  }
];

export const getBeautyStudioGuide = (slug: string) => beautyStudioGuides.find((guide) => guide.slug === slug);
