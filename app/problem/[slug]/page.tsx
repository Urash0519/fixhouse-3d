import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProblemTutorial } from "@/components/ProblemTutorial";
import { problems } from "@/src/data/problems";
import { tutorials } from "@/src/data/tutorials";
export const dynamicParams = false;
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return problems.map((problem) => ({ slug: problem.id }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const problem = problems.find((p) => p.id === slug);
  return {
    title: problem?.title || "找不到教學",
    description: problem?.description,
  };
}
export default async function ProblemPage({ params }: Props) {
  const { slug } = await params;
  const problem = problems.find((p) => p.id === slug);
  const tutorial = tutorials[slug];
  if (!problem || !tutorial) notFound();
  return (
    <ProblemTutorial key={problem.id} problem={problem} tutorial={tutorial} />
  );
}
