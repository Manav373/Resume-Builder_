import { Router } from "express";
import Groq from "groq-sdk";
import { z } from "zod";

const router = Router();

// Global index for Round-Robin rotation
let currentKeyIndex = 0;

// Helper to aggregate all available API keys
const getAllApiKeys = () => {
    const keys: string[] = [];

    // 1. Check primary key (comma-separated support)
    if (process.env.GROQ_API_KEY) {
        keys.push(...process.env.GROQ_API_KEY.split(","));
    }

    // 2. Check indexed keys (GROQ_API_KEY_1, GROQ_API_KEY_2, etc.)
    // scan reasonable range or all env vars
    Object.keys(process.env).forEach(key => {
        if (key.match(/^GROQ_API_KEY_\d+$/)) {
            const val = process.env[key];
            if (val) keys.push(val);
        }
    });

    // Sanitize
    return keys.map(k => k.replace(/['"\s]/g, "")).filter(k => k.length > 0);
};

const getGroqClient = () => {
    const keys = getAllApiKeys();

    if (keys.length === 0) {
        console.warn("GROQ_API_KEY is not set. AI generation will fail.");
        return null;
    }

    // Round-Robin Selection
    const apiKey = keys[currentKeyIndex % keys.length];
    currentKeyIndex++;

    // Debugging: Log the masked key
    const maskedKey = apiKey.substring(0, 8) + "...";
    console.log(`[AI] Using Key #${(currentKeyIndex % keys.length) + 1}/${keys.length} (${maskedKey})`);

    return new Groq({ apiKey });
};

const generateSchema = z.object({
    jobTitle: z.string(),
    currentSkills: z.array(z.string()).optional(),
});

router.get("/test", async (req, res) => {
    const rawKeys = process.env.GROQ_API_KEY || "";
    const keys = rawKeys.split(",").filter(k => k.length > 0);

    const keyStatus = keys.map(k => ({
        validPrefix: k.startsWith("gsk_"),
        length: k.length
    }));

    res.json({
        status: keys.length > 0 ? "Configured" : "Missing API Key",
        provider: "Groq",
        keyCount: keys.length,
        keys: keyStatus,
        model: process.env.GROQ_MODEL || "Default"
    });
});

router.post("/generate", async (req, res) => {
    try {
        console.log(`[AI] Generating content for: ${req.body.jobTitle}`);
        console.log("[AI] Key check:", process.env.GROQ_API_KEY ? "Present" : "Missing");
        const { jobTitle, currentSkills } = generateSchema.parse(req.body);

        const prompt = `You are an expert resume writer. Generate a professional summary and a list of 5 key skills for a "${jobTitle}".
    ${currentSkills?.length ? `The candidate already has these skills: ${currentSkills.join(", ")}.` : ""}
    CRITICAL: Do NOT start with "Results-driven", "Passionate", "Seasoned", "Motivated", or other clichés. Be direct, modern, and specific.
    Return JSON format: { "summary": "string", "skills": ["string"] }`;

        const groq = getGroqClient();
        if (!groq) {
            throw new Error("AI Service is not configured (missing API Key)");
        }

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: process.env.GROQ_MODEL || "llama-3.1-8b-instant", // Default to fastest model
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) throw new Error("No content generated");

        res.json(JSON.parse(content));
    } catch (error: any) {
        console.error("AI Generation Error:", error);

        let errorMessage = "Failed to generate content";

        if (error?.error?.code === "invalid_api_key") {
            errorMessage = "Invalid GROQ_API_KEY. Please check your server .env file.";
        } else if (error?.message) {
            errorMessage = error.message;
        }

        // Return the actual error to the client so the user knows why it failed
        res.status(500).json({
            error: errorMessage,
            details: "Real AI Generation Failed. See server logs."
        });
    }
});

const portfolioSchema = z.object({
    resumeData: z.any(),
    theme: z.string().optional(),
    palette: z.string().optional(),
    customPrompt: z.string().optional(),
});

router.post("/generate-portfolio", async (req, res) => {
    try {
        console.log("[AI] Generating portfolio website");
        const { resumeData, theme = 'modern', palette = 'violet', customPrompt } = portfolioSchema.parse(req.body);

        // Sanitize data strategy: 
        // We replace the massive base64 photo with a token so the AI knows where to put the image.
        // Then we swap it back after generation.
        const sanitizedData = JSON.parse(JSON.stringify(resumeData));
        if (sanitizedData.personalInfo?.photoUrl) {
            sanitizedData.personalInfo.photoUrl = "__USER_PHOTO__";
        }

        // Palette Config
        const paletteColors: Record<string, string> = {
            violet: "Neon Violet (`violet-500`) mixed with Cyan (`cyan-400`)",
            sunset: "Sunset Orange (`orange-500`) mixed with Rose (`rose-500`)",
            ocean: "Deep Blue (`blue-600`) mixed with Teal (`teal-400`)",
            emerald: "Emerald Green (`emerald-500`) mixed with Lime (`lime-400`)"
        };
        const selectedColors = paletteColors[palette] || paletteColors['violet'];

        // Theme-Specific Architectures
        const themeArchitectures: Record<string, string> = {
            modern: `
                    **LAYOUT: BENTO GRID WITH PARTICLES & DOCK**
                    - **Wrapper**: \`min-h-screen bg-[#050505] text-white selection:bg-purple-500 selection:text-white overflow-x-hidden relative\`.
                    - **Background**: 
                    - **Particles**: \`<div id="particles-js" class="fixed inset-0 z-0 pointer-events-none opacity-40"></div>\`.
                    - Gradient Blobs: Fixed top-left and bottom-right blobs (purple/blue), blur-3xl opacity-20.
                    - **Navigation**: Floating Dock at bottom. Glassmorphism, rounded-full.
                    - **Grid**: \`relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6 p-8 pb-32 max-w-7xl mx-auto\`.
                    - **Cards**: \`backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl hover:border-white/30 transition-all duration-300 hover:-translate-y-1 shadow-2xl\`.
                    - **Hero**: Span 2 cols, 2 rows. Flex col, huge text.
                `,
            minimal: `
                    **LAYOUT: THE "SUPREME" EDITORIAL**
                    - **Wrapper**: \`min-h-screen bg-[#f2f2f2] text-[#111] selection:bg-black selection:text-white\`.
                    - **Typography**: 'Playfair Display' (Italic 700) for Headings, 'Inter' for body.
                    - **Structure**:
                    - **Nav**: Sticky header with name.
                    - **Hero**: Full screen, centered massive text.
                    - **Projects**: Large images, minimal text.
                `,
            cyberpunk: `
                    **LAYOUT: NEO-TOKYO TERMINAL**
                    - **Wrapper**: \`min-h-screen bg-black text-[#0f0] font-mono p-4 border-[10px] border-[#222]\`.
                    - **Effect**: CRT Scanlines overlay.
                    - **Components**: Terminal windows with green borders. Glitch text.
                `,
            creative: `
                    **LAYOUT: BRUTALIST ASYMMETRY**
                    - **Wrapper**: \`min-h-screen bg-[#eaff00] text-black font-extrabold uppercase\`.
                    - **Typography**: 'Syne' or 'Space Grotesk'.
                    - **Layout**: Masonry, overlapping elements, marquee text.
                `,
            swiss: `
                **LAYOUT: INTERNATIONAL TYPOGRAPHIC**
                - **Wrapper**: \`min-h-screen bg-[#ededed] text-[#1a1a1a]\`.
                - **Grid**: Strict modular grid (12-column), visible thin architectural lines (\`border-l border-[#ccc]\`).
                - **Typography**: 'Helvetica Now' or 'Inter' (Heavy weights). Huge, flush-left headings.
                - **Vibe**: Order, clarity, asymmetry, negative space.
                - **Animation**: Staggered reveal of text lines.
            `,
            "neo-brutalism": `
                **LAYOUT: POP-ART GUMROAD STYLE**
                - **Wrapper**: \`min-h-screen bg-[#fdfdfd] text-black\`.
                - **UI Elements**: Thick black borders (3px-4px), hard shadows (\`box-shadow: 6px 6px 0px 0px #000\`).
                - **Colors**: High saturation accents (Hot Pink, Electric Blue, Bright Yellow).
                - **Typography**: 'Space Grotesk' or 'Outfit'. Bold, quirky.
                - **Vibe**: Playful, bold, high-contrast, confident.
            `,
            aurora: `
                **LAYOUT: ETHEREAL GRADIENT MESH**
                - **Wrapper**: \`min-h-screen bg-black text-white overflow-hidden relative\`.
                - **Background**: Multiple moving gradient orbs (filter: blur(100px)) animating slowly in background.
                - **UI Elements**: Ultra-thin glassmorphism (\`bg-white/5 backdrop-blur-2xl border border-white/10\`).
                - **Typography**: 'Outfit' or 'Manrope'. Light weights, high tracking.
                - **Vibe**: Calm, glowing, spiritual, deep tech.
            `
        };

        const selectedArchitecture = themeArchitectures[theme] || themeArchitectures['modern'];

        const prompt = `
      You are an elite creative developer (Awwwards Jury Member). Generate a **COMPLETE, SELF-CONTAINED HTML5** personal portfolio website.
      
      **CRITICAL INSTRUCTION**: You must return a SINGLE HTML file with the EXACT structure below. Do not deviate.
      **FORMAT**: Return ID-formatted semantic HTML.
      
      Resume Data:
      ${JSON.stringify(sanitizedData)}

      **Theme System:**
      - **"modern"**: Dark mode, particles, bento grid, glass dock.
      - **"minimal"**: Clean, fashion-editorial, large serif typography.
      - **"cyberpunk"**: Hacker terminal, neon green, glitch effects, Three.js Grid.
      - **"creative"**: Experimental, brutalist, yellow/black.
      - **"swiss"**: Grid-based, architectural, structured, Helvetica-ish.
      - **"neo-brutalism"**: High contrast, hard shadows, vibrant, pop-art.
      - **"aurora"**: Dark, moving gradients, deep glassmorphism, glowing.

      **USER CUSTOM INSTRUCTIONS (PRIORITY OVER THEME):**
      "${customPrompt || "No custom instructions provided."} - Use 3D elements and high-quality assets."
      
      **Configuration:**
      - **Theme**: ${theme ? theme.toUpperCase() : "MODERN"}
      - **Architecture**: ${selectedArchitecture}
      
      **Visual Asset Strategy (MANDATORY):**
      1.  **Images**: Use high-quality Unsplash source URLs with specific keywords.
          - Example: \`https://source.unsplash.com/random/1920x1080/?abstract,technology,dark\`
          - Use \`object-fit: cover\` on ALL images.
      2.  **3D/WebGL**: 
          - Include \`Three.js\` CDN.
          - For "Cyberpunk" or "Aurora", create a simple 3D background (rotating cube wireframe or moving particles) if possible within a single file.
      3.  **Backgrounds**: 
          - Use CSS gradients or subtle noise textures (\`url('https://grainy-gradients.vercel.app/noise.svg')\`).

      **Strict Layout Structure (DO NOT BREAK):**
      1.  **<nav>**: **FIXED TOP** (top:0, left:0, w-full, z-50).
          - **MANDATORY LINKS**: \`<a href="#home" onclick="handleNavClick(event, '#home')">Home</a>\`, \`<a href="#about" onclick="handleNavClick(event, '#about')">About</a>\`, \`<a href="#work" onclick="handleNavClick(event, '#work')">Work</a>\`, \`<a href="#contact" onclick="handleNavClick(event, '#contact')">Contact</a>\`.
          - **CRITICAL**: ALL links MUST use \`onclick="handleNavClick(event, 'target')"\` to prevent redirects.
          - **NEVER** use \`href="/"\` or \`href="index.html"\`. ONLY anchor links (\`#id\`).
          - Must be visible at all times (sticky/fixed).
      2.  **<header id="home">**: Full viewport height (\`min-h-screen\`). Flex/Grid centered.
          - Must contain: Huge Name, Title/Role.
      3.  **<section id="about">**: Min-height 50vh. Two-column layout (Text + Image).
      4.  **<section id="work">**: Min-height 100vh. Grid layout for projects.
          - Cards must have images.
      5.  **<section id="contact">**: Simple footer with social links.

      **Design & Quality Guidelines:**
      - **Mobile First**: Default styles are mobile. Use \`md:...\` for desktop.
      - **Typography**: \`clamp(2rem, 5vw, 6rem)\` for headings.
      - **Spacing**: \`gap-8\`, \`py-24\` minimum for sections.
      - **Safety**: \`overflow-x: hidden\` on body to prevent scrollbar issues.

      **Code Structure (Single File):**
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>{{portfolioTitle}}</title>
          
          <!-- Fonts -->
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=Space+Grotesk:wght@400;700&family=Playfair+Display:ital,wght@0,600;1,600&family=Outfit:wght@300;500;700&family=Syne:wght@700;800&display=swap" rel="stylesheet">
          
          <!-- Tailwind (CDN) -->
          <script src="https://cdn.tailwindcss.com"></script>
          <script>
            tailwind.config = {
                theme: {
                    extend: {
                        colors: {
                            primary: 'var(--primary)',
                            secondary: 'var(--secondary)',
                        },
                        fontFamily: {
                             sans: ['Inter', 'sans-serif'],
                             display: ['Space Grotesk', 'sans-serif'],
                             serif: ['Playfair Display', 'serif'],
                        }
                    }
                }
            }
          </script>

          <!-- Libraries -->
          <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
          <script src="https://unpkg.com/split-type"></script> 
          <script src="https://unpkg.com/@studio-freight/lenis@1.0.42/dist/lenis.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

          <style>
              :root { ... }
              body { margin: 0; overflow-x: hidden; background-color: var(--bg-color); color: var(--text-color); }
              section { position: relative; width: 100%; z-index: 10; }
              /* SAFETY STYLES */
              #canvas-container { pointer-events: none; z-index: 0; position: fixed; top: 0; left: 0; width: 100%; height: 100%; }
              nav { z-index: 9999 !important; }
              .content-layer { position: relative; z-index: 20; }
              
              /* PRELOADER */
              #preloader { position: fixed; inset: 0; bg-color: var(--bg-color); z-index: 10000; display: flex; align-items: center; justify-content: center; transition: opacity 0.5s ease; }
          </style>
      </head>
      <body>
          <div id="preloader">Loading...</div>
          <div id="smooth-wrapper">
              <div id="smooth-content">
                  
                  <nav class="...">
                      <!-- Links to #home, #about, #work -->
                  </nav>

                  <header id="home" class="min-h-screen flex items-center justify-center relative overflow-hidden">
                      <div id="canvas-container" class="absolute inset-0 z-0"></div> <!-- For Three.js -->
                      <div class="relative z-10 text-center content-layer">
                          <h1 class="...">Name</h1>
                      </div>
                  </header>
                  
                  <section id="about" class="py-24 px-6 ...">
                      <!-- About Content -->
                  </section>

                  <section id="work" class="py-24 px-6 ...">
                      <!-- Project Grid -->
                  </section>

                  <footer id="contact" class="...">
                      <!-- Socials -->
                  </footer>
              </div>
          </div>
          
          <script>
              // SAFETY: Navigation Handler
              function handleNavClick(e, targetId) {
                  e.preventDefault();
                  const target = document.querySelector(targetId);
                  if (target) {
                      // Smooth scroll with lenis or native
                      target.scrollIntoView({ behavior: 'smooth' });
                  }
              }

              // SAFETY: Wrap everything to prevent crash
              try {
                  gsap.registerPlugin(ScrollTrigger);

                  // 1. Lenis Smooth Scroll
                  const lenis = new Lenis();
                  function raf(time) {
                      lenis.raf(time);
                      ScrollTrigger.update();
                      requestAnimationFrame(raf);
                  }
                  requestAnimationFrame(raf);

                  // 2. Hide Preloader
                  window.onload = () => {
                      gsap.to("#preloader", { opacity: 0, duration: 0.5, onComplete: () => document.getElementById("preloader").remove() });
                  };

                  // 3. GSAP Animations
                  gsap.from("h1", { y: 100, opacity: 0, duration: 1, ease: "power4.out" });

                  // 4. Three.js Safety
                  try {
                      // Init simplified Three.js scene targeting #canvas-container
                      // MUST CHECK IF CONTAINER EXISTS
                      const container = document.getElementById("canvas-container");
                      if(container && window.THREE) {
                           // ... code ...
                      }
                  } catch (e) { console.warn("3D Error handled:", e); }
              } catch (err) {
                  console.error("Critical site error:", err);
                  // Remove preloader fallback
                  const pl = document.getElementById("preloader");
                  if(pl) pl.style.display = "none";
              }
          </script>
      </body>
      </html>
    `;

        const groq = getGroqClient();
        if (!groq) {
            throw new Error("AI Service is not configured (missing API Key)");
        }

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile", // Reverting to 3.3 now that we have multiple keys
        });

        let content = completion.choices[0]?.message?.content;
        if (!content) throw new Error("No content generated");

        // Cleanup markdown
        content = content.replace(/```html/g, "").replace(/```/g, "");

        // **CRITICAL**: Restore the user's photo
        if (resumeData.personalInfo?.photoUrl) {
            // Replace the token with the actual base64/URL
            content = content.replace(/__USER_PHOTO__/g, resumeData.personalInfo.photoUrl);
            // Also serve as fallback if AI missed the token but we want to force it?
            // No, regex replace on the specific token is safest.
        }

        res.json({ html: content });
    } catch (error: any) {
        console.error("AI Portfolio Generation Error:", error);

        // Handle Rate Limits specifically
        if (error?.code === 'rate_limit_exceeded') {
            return res.status(429).json({
                error: "AI Rate Limit Reached. Please wait a moment or try again later.",
                details: error.message
            });
        }

        res.status(500).json({
            error: error.message || "Failed to generate portfolio",
        });
    }
});

export default router;

