import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  highlight?: boolean;
};

export default function Card({ children, highlight = false }: CardProps) {
  return (
    <div className={`ui-card${highlight ? " ui-card--highlight" : ""}`}>
      {children}
    </div>
  );
}