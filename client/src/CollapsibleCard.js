import React, { useState } from "react";
import "./CollapsibleCard.css";

export default function CollapsibleCard({
  title,
  children,
  defaultOpen = false,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`collapsible-card ${!isOpen ? "minimized" : ""}`}>
      <div
        className="collapsible-card-header"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <h2>{title}</h2>
        <span className="toggle-icon">{isOpen ? "−" : "+"}</span>
      </div>
      {isOpen && <div className="collapsible-card-body">{children}</div>}
    </div>
  );
}
