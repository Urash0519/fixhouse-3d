import { notFound } from "next/navigation";
import { ProblemTutorial } from "@/components/ProblemTutorial";
import { ComingSoon } from "@/components/ComingSoon";
import { problems } from "@/src/data/problems";
import { toiletRunningWaterTutorial } from "@/src/data/toilet-running-water";

const tutorialMap = {
  [toiletRunningWaterTutorial.id]: toiletRunningWaterTutorial,
};

export async function generateStaticParams() {
  return problems.map((problem) => ({ slug: problem.id }));
}

export default function ProblemPage({ params }: { params: { slug: string } }) {
  const problem = problems.find((item) => item.id === params.slug);

  if (!problem) {
    return notFound();
  }

  if (!problem.available) {
    return <ComingSoon title={problem.title} />;
  }

  const tutorial = tutorialMap[problem.id];
  if (!tutorial) {
    return <ComingSoon title={problem.title} />;
  }

  return <ProblemTutorial problem={problem} tutorial={tutorial} />;
}
