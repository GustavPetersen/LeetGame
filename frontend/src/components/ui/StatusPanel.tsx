import type { ReactNode } from "react";

type StatusPanelVariant = "info" | "success" | "error";

type StatusPanelProps = {
  children: ReactNode;
  variant?: StatusPanelVariant;
};

export default function StatusPanel({
  children,
  variant = "info",
}: StatusPanelProps) {
  return <div className={`ui-panel ui-panel--${variant}`}>{children}</div>;
}