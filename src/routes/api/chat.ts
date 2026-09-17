import { FOUR_PILLARS_KNOWLEDGE, FOUR_PILLARS_SYSTEM_PROMPT } from "@/lib/four-pillars-knowledge";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const ChatRequest = z.object({
  question: z.string().trim().min(1).max(1200),
  knowledge: z.string().max(200).optional(),
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) })).max(30).default([]),
});

const visits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 12;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip = request.headers.get("cf-connecting-ip") ?? "anonymous";
        const now = Date.now();
        const recent = (visits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
        if (recent.length >= MAX_REQUESTS) {
          return Response.json({ error: "Please wait a moment before asking another question." }, { status: 429 });
        }
        visits.set(ip, [...recent, now]);

        try {
          const input = ChatRequest.parse(await request.json());
          const key = process.env["OPENROUTER_API_KEY"];
          if (!key) throw new Error("OPENROUTER_API_KEY is unavailable");
          const model = process.env["OPENROUTER_MODEL"] || "openrouter/free";
          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${key}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "https://fourpillars.co/",
              "X-Title": "Four Pillars AI",
            },
            body: JSON.stringify({
              model,
              temperature: 0.2,
              max_tokens: 420,
              messages: [
                { role: "system", content: `${FOUR_PILLARS_SYSTEM_PROMPT}\n\nOFFICIAL KNOWLEDGE:\n${FOUR_PILLARS_KNOWLEDGE}` },
                ...input.messages,
                { role: "user", content: input.question },
              ],
            }),
          });
          if (!response.ok) {
            const detail = await response.text();
            console.error(`OpenRouter failed [${response.status}]: ${detail}`);
            throw new Error("OpenRouter request failed");
          }
          const payload = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
          const answer = payload.choices?.[0]?.message?.content?.trim();
          if (!answer) throw new Error("OpenRouter returned no answer");
          return Response.json({ answer }, { headers: { "Cache-Control": "no-store" } });
        } catch (error) {
          console.error("Four Pillars AI error", error instanceof Error ? error.message : error);
          return Response.json({ error: "I’m unable to connect to the AI assistant right now. Please contact the Four Pillars team at info@pillars.co." }, { status: 500 });
        }
      },
    },
  },
});
