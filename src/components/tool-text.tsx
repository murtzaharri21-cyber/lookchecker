"use client";

import type { ReactNode } from "react";
import { useLocale } from "@/lib/use-locale";
import { translateTool, type ToolCopyKey } from "@/lib/tool-copy";

export function ToolText({ copyKey, children }: { copyKey: ToolCopyKey; children?: ReactNode }) {
  const locale = useLocale();
  return <>{translateTool(locale, copyKey) === copyKey ? children : translateTool(locale, copyKey)}</>;
}
