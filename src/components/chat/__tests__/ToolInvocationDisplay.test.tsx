import { test, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationDisplay } from "../ToolInvocationDisplay";

afterEach(() => {
  cleanup();
});

// Test display text for each tool/command combination
test("displays 'Creating' for str_replace_editor with create command", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      state="result"
      args={{ command: "create", path: "src/Button.tsx" }}
    />
  );

  expect(screen.getByText("Creating: src/Button.tsx")).toBeDefined();
});

test("displays 'Editing' for str_replace_editor with str_replace command", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      state="result"
      args={{ command: "str_replace", path: "src/App.tsx" }}
    />
  );

  expect(screen.getByText("Editing: src/App.tsx")).toBeDefined();
});

test("displays 'Viewing' for str_replace_editor with view command", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      state="result"
      args={{ command: "view", path: "src/index.ts" }}
    />
  );

  expect(screen.getByText("Viewing: src/index.ts")).toBeDefined();
});

test("displays 'Inserting into' for str_replace_editor with insert command", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      state="result"
      args={{ command: "insert", path: "src/utils.ts" }}
    />
  );

  expect(screen.getByText("Inserting into: src/utils.ts")).toBeDefined();
});

test("displays 'Renaming' with arrow for file_manager rename command", () => {
  render(
    <ToolInvocationDisplay
      toolName="file_manager"
      state="result"
      args={{ command: "rename", path: "src/Old.tsx", new_path: "src/New.tsx" }}
    />
  );

  expect(screen.getByText("Renaming: src/Old.tsx → src/New.tsx")).toBeDefined();
});

test("displays 'Deleting' for file_manager delete command", () => {
  render(
    <ToolInvocationDisplay
      toolName="file_manager"
      state="result"
      args={{ command: "delete", path: "src/unused.ts" }}
    />
  );

  expect(screen.getByText("Deleting: src/unused.ts")).toBeDefined();
});

test("displays 'Running' for unknown tools", () => {
  render(
    <ToolInvocationDisplay
      toolName="unknown_tool"
      state="result"
      args={{ command: "something", path: "file.txt" }}
    />
  );

  expect(screen.getByText("Running: file.txt")).toBeDefined();
});

test("displays tool name when no path is provided", () => {
  render(
    <ToolInvocationDisplay
      toolName="custom_tool"
      state="result"
      args={{ command: "execute" }}
    />
  );

  expect(screen.getByText("Running: custom_tool")).toBeDefined();
});

// Test spinner shown when state is call or partial-call
test("shows spinner when state is 'call'", () => {
  const { container } = render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      state="call"
      args={{ command: "create", path: "src/Test.tsx" }}
    />
  );

  const spinner = container.querySelector(".animate-spin");
  expect(spinner).toBeDefined();
});

test("shows spinner when state is 'partial-call'", () => {
  const { container } = render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      state="partial-call"
      args={{ command: "create", path: "src/Test.tsx" }}
    />
  );

  const spinner = container.querySelector(".animate-spin");
  expect(spinner).toBeDefined();
});

// Test colored dot shown when state is result
test("shows colored dot when state is 'result' with success", () => {
  const { container } = render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      state="result"
      args={{ command: "create", path: "src/Test.tsx" }}
      result={{ success: true }}
    />
  );

  // Should have a rounded-full div (the colored dot)
  const dot = container.querySelector(".rounded-full.bg-emerald-500");
  expect(dot).toBeDefined();
});

// Test error state displays red indicator and icon
test("shows error indicator when result has error", () => {
  const { container } = render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      state="result"
      args={{ command: "create", path: "src/Test.tsx" }}
      result={{ error: "File not found" }}
    />
  );

  // Should have red background
  const errorContainer = container.querySelector(".bg-red-50");
  expect(errorContainer).toBeDefined();

  // Text should be red
  const text = screen.getByText("Creating: src/Test.tsx");
  expect(text.className).toContain("text-red-700");
});

// Test long paths are truncated
test("truncates long paths to last two segments", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      state="result"
      args={{ command: "create", path: "src/components/ui/buttons/PrimaryButton.tsx" }}
    />
  );

  // Shows last two segments with ellipsis prefix
  expect(screen.getByText("Creating: .../buttons/PrimaryButton.tsx")).toBeDefined();
});

test("does not truncate short paths", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      state="result"
      args={{ command: "create", path: "src/Button.tsx" }}
    />
  );

  expect(screen.getByText("Creating: src/Button.tsx")).toBeDefined();
});

test("handles single segment paths", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      state="result"
      args={{ command: "create", path: "Button.tsx" }}
    />
  );

  expect(screen.getByText("Creating: Button.tsx")).toBeDefined();
});

// Test color coding for different commands
test("uses emerald color for create command", () => {
  const { container } = render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      state="result"
      args={{ command: "create", path: "src/Test.tsx" }}
    />
  );

  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
});

test("uses blue color for str_replace command", () => {
  const { container } = render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      state="result"
      args={{ command: "str_replace", path: "src/Test.tsx" }}
    />
  );

  expect(container.querySelector(".bg-blue-500")).toBeDefined();
});

test("uses neutral color for view command", () => {
  const { container } = render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      state="result"
      args={{ command: "view", path: "src/Test.tsx" }}
    />
  );

  expect(container.querySelector(".bg-neutral-400")).toBeDefined();
});

test("uses red color for delete command", () => {
  const { container } = render(
    <ToolInvocationDisplay
      toolName="file_manager"
      state="result"
      args={{ command: "delete", path: "src/Test.tsx" }}
    />
  );

  expect(container.querySelector(".bg-red-500")).toBeDefined();
});

test("uses amber color for rename command", () => {
  const { container } = render(
    <ToolInvocationDisplay
      toolName="file_manager"
      state="result"
      args={{ command: "rename", path: "src/Old.tsx", new_path: "src/New.tsx" }}
    />
  );

  expect(container.querySelector(".bg-amber-500")).toBeDefined();
});
