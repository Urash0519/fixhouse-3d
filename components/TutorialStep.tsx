import type { ReactNode } from "react";

export function TutorialStep({
  title,
  description,
  question,
  children,
}: {
  title: string;
  description: string;
  question?: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="tutorial-step-title">{title}</h2>
      <p className="tutorial-step-description">{description}</p>
      {question && (
        <div className="tutorial-question">
          <strong>{question}</strong>
        </div>
      )}
      <div className="tutorial-actions">{children}</div>
    </section>
  );
}

