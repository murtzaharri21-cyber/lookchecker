"use client";

import { useEffect } from "react";
import { tools } from "@/lib/site-data";

type WebMCPTool = {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: {
      query: { type: "string"; description: string; minLength: 1; maxLength: 200 };
    };
    required: ["query"];
    additionalProperties: false;
  };
  execute: (input: { query: string }) => {
    query: string;
    results: { title: string; url: string; summary: string }[];
    message: string;
  };
};

type WebMCPContext = {
  registerTool: (tool: WebMCPTool) => void | Promise<void>;
};

declare global {
  interface Navigator {
    modelContext?: WebMCPContext;
  }
}

const publicPages = [
  { title: "Home and free tools", path: "/", summary: "Overview of Look Checker's free, private browser-based tools." },
  { title: "About Look Checker", path: "/about", summary: "How the measurements work and what they can and cannot tell you." },
  { title: "Tools directory", path: "/tools", summary: "Browse the available face, style, and beauty tools." },
  { title: "Sample report", path: "/sample-report", summary: "See an example report with measurement explanations." },
  { title: "Pricing", path: "/pricing", summary: "Information about free tools and available features." },
  { title: "Privacy policy", path: "/privacy", summary: "How local photo processing and saved report information work." },
  { title: "AI Beauty Studio", path: "/beauty-studio", summary: "Explore private browser-based beauty and styling tools." },
  { title: "Face shape and hairstyle guide", path: "/guides/face-shape-hairstyle", summary: "Practical context for face shape and hairstyle suggestions." },
  { title: "Contact", path: "/contact", summary: "Contact the site operator about privacy, accessibility, or the tools." },
  ...tools.map((tool) => ({ title: tool.title, path: `/tools/${tool.slug}`, summary: tool.description })),
  { title: "Complete Face Analysis", path: "/tools/full-analysis", summary: "Review facial shape, symmetry, ratios, and styling suggestions in one report." },
];

export function WebMCPTools() {
  useEffect(() => {
    const modelContext = navigator.modelContext;
    if (!modelContext) return;

    const tool: WebMCPTool = {
      name: "look_checker_search_pages",
      description: "Find public Look Checker pages about its tools, methods, privacy, pricing, and guides. This tool does not analyze photos or provide personal assessments.",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "A topic or page to find, such as privacy, face shape, or pricing.",
            minLength: 1,
            maxLength: 200,
          },
        },
        required: ["query"],
        additionalProperties: false,
      },
      execute: ({ query }) => {
        const normalizedQuery = query.trim().toLowerCase();
        const results = normalizedQuery
          ? publicPages
          .filter((page) => `${page.title} ${page.summary} ${page.path}`.toLowerCase().includes(normalizedQuery))
          .map((page) => ({
            title: page.title,
            url: new URL(page.path, window.location.origin).toString(),
            summary: page.summary,
          }))
          : [];

        return {
          query,
          results,
          message: !normalizedQuery
            ? "Enter a non-empty search query."
            : results.length
              ? `Found ${results.length} matching page(s).`
              : "No public page matched that query.",
        };
      },
    };

    try {
      void Promise.resolve(modelContext.registerTool(tool)).catch((error: unknown) => {
        console.error("Look Checker WebMCP tool registration failed.", error);
      });
    } catch (error) {
      console.error("Look Checker WebMCP tool registration failed.", error);
    }
  }, []);

  return null;
}
