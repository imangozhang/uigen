"use client";

import { Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolInvocationDisplayProps {
  toolName: string;
  state: "partial-call" | "call" | "result";
  args: {
    command: string;
    path: string;
    new_path?: string;
    [key: string]: unknown;
  };
  result?: {
    success?: boolean;
    error?: string;
    message?: string;
  };
}

type ActionConfig = {
  label: string;
  color: string;
};

function getActionConfig(
  toolName: string,
  command: string | undefined
): ActionConfig {
  if (toolName === "str_replace_editor") {
    switch (command) {
      case "create":
        return { label: "Creating", color: "bg-emerald-500" };
      case "str_replace":
        return { label: "Editing", color: "bg-blue-500" };
      case "view":
        return { label: "Viewing", color: "bg-neutral-400" };
      case "insert":
        return { label: "Inserting into", color: "bg-blue-500" };
      default:
        return { label: "Running", color: "bg-neutral-400" };
    }
  }

  if (toolName === "file_manager") {
    switch (command) {
      case "rename":
        return { label: "Renaming", color: "bg-amber-500" };
      case "delete":
        return { label: "Deleting", color: "bg-red-500" };
      default:
        return { label: "Running", color: "bg-neutral-400" };
    }
  }

  return { label: "Running", color: "bg-neutral-400" };
}

function truncatePath(path: string | undefined): string {
  if (!path) return "";

  const segments = path.split("/");
  if (segments.length <= 2) return path;

  return ".../" + segments.slice(-2).join("/");
}

export function ToolInvocationDisplay({
  toolName,
  state,
  args,
  result,
}: ToolInvocationDisplayProps) {
  const command = args?.command;
  const path = args?.path;
  const newPath = args?.new_path;

  const { label, color } = getActionConfig(toolName, command);
  const displayPath = truncatePath(path);

  // Build display text
  let displayText: string;
  if (toolName === "file_manager" && command === "rename" && newPath) {
    const truncatedNewPath = truncatePath(newPath);
    displayText = `${label}: ${displayPath} → ${truncatedNewPath}`;
  } else if (path) {
    displayText = `${label}: ${displayPath}`;
  } else {
    displayText = `${label}: ${toolName}`;
  }

  const isInProgress = state === "call" || state === "partial-call";
  const hasError = state === "result" && result?.error;
  const isSuccess = state === "result" && !hasError;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-lg text-xs font-mono border",
        hasError
          ? "bg-red-50 border-red-200"
          : "bg-neutral-50 border-neutral-200"
      )}
    >
      {isInProgress && <Loader2 className="w-3 h-3 animate-spin text-blue-600" />}
      {isSuccess && <div className={cn("w-2 h-2 rounded-full", color)} />}
      {hasError && (
        <>
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <AlertCircle className="w-3 h-3 text-red-500" />
        </>
      )}
      <span
        className={cn(
          hasError ? "text-red-700" : "text-neutral-700"
        )}
      >
        {displayText}
      </span>
    </div>
  );
}
