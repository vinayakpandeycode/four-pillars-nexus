# Four Pillars premium corporate website

## Build
- Replace the placeholder homepage with a complete one-page corporate site using the exact bottle-green, ivory, champagne-gold, Cormorant Garamond, and Manrope direction supplied.
- Create a fixed desktop navigation, accessible mobile menu, smooth section navigation, consultation CTAs, floating WhatsApp action, and premium footer.
- Build the cinematic video opening using the supplied Meraki walkthrough with working mute/unmute and play/pause controls.
- Use the supplied Four Pillars logo as the brand mark and the Meraki × Four Pillars image only in the collaborations section.
- Present About, Four Pillars approach, Services, Sectors, Global Footprint, Real Estate, Projects & Collaborations, and Contact as editorial sections with restrained motion and thin gold rules.

## Functional enquiries
- Validate the consultation form in the browser and on the server.
- Save valid enquiries securely in Lovable Cloud and send a notification to `info@pillars.co` through the connected email service.
- Show real loading, success, and failure states; no simulated submission.

## Four Pillars AI
- Build one non-persistent conversation, as selected, using official AI Elements for the transcript, messages, loading state, and composer.
- Add a secure `/api/chat` route that calls OpenRouter using the encrypted server-side key and configurable `OPENROUTER_MODEL`, defaulting to `openrouter/free`.
- Send full in-session message history and the official Four Pillars knowledge base on every turn.
- Enforce the supplied system rules, concise fallback wording, lead-intent guidance, rate limiting, quick questions, keyboard controls, auto-scroll, and WhatsApp handoff.
- Keep tool and configuration details server-side; visitors receive only the approved friendly outage message.

## Assets, accessibility, and metadata
- Store the uploaded logo, collaboration image, and video through the project asset flow rather than embedding large binaries in source.
- Add the exact requested title, description, canonical URL, Open Graph metadata, and Twitter card metadata at the homepage route.
- Use semantic landmarks, one H1, ordered headings, visible focus states, meaningful image text, reduced-motion support, and responsive layouts for desktop, tablet, and mobile.
- Prepare lightweight analytics event hooks for the requested actions without collecting extra personal information.

## Verification
- Check desktop and mobile layouts with browser screenshots.
- Exercise navigation, mobile menu, all CTAs, WhatsApp links, video sound/playback controls, chatbot open/close, quick questions, typed submission, Enter-to-send, API success/failure handling, contact validation, and real contact submission.
- Run the project checks and verify no API key appears in browser code or rendered output.

## Technical details
- TanStack Start routes and server handlers; Tailwind v4 semantic tokens in `src/styles.css`.
- Lovable Cloud table with explicit grants and locked row-level access; server-only privileged insert after validation.
- OpenRouter and email credentials remain encrypted environment variables read only inside server handlers.
- No chat history is persisted; contact enquiries are persisted for reliable business follow-up.
