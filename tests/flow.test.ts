import { test } from "node:test";
import assert from "node:assert/strict";
import { problems } from "../src/data/problems";
import { tutorials, nextNode } from "../src/data/tutorials";
import { deviceParts } from "../src/data/parts";

test("all ten catalogue entries have distinct complete tutorials", () => {
  assert.equal(problems.length, 10);
  assert.equal(new Set(problems.map((p) => p.id)).size, 10);
  assert.deepEqual(
    Object.keys(tutorials).sort(),
    problems.map((p) => p.id).sort(),
  );
});
for (const problem of problems) {
  const lesson = tutorials[problem.id];
  test(
    problem.id + ": every decision terminates and every result is reachable",
    () => {
      const seen = new Set<string>();
      const walk = (id: string, trail: string[]) => {
        assert.ok(lesson.nodes[id], "missing node " + id);
        assert.ok(!trail.includes(id), "cycle at " + id);
        seen.add(id);
        const node = lesson.nodes[id];
        assert.ok(node.title && node.description);
        assert.ok(
          deviceParts[problem.device].some((p) => p.id === node.part) ||
            node.part === "body",
        );
        if (node.kind === "question") {
          for (const answer of ["yes", "no", "unsure"] as const)
            walk(nextNode(lesson, id, answer), [...trail, id]);
        } else {
          assert.ok(
            node.actions.length >= 3,
            "result needs actionable next steps",
          );
        }
      };
      walk(lesson.start, []);
      assert.deepEqual([...seen].sort(), Object.keys(lesson.nodes).sort());
      assert.equal(lesson.chapters.length, 3);
      for (const c of lesson.chapters)
        assert.ok(deviceParts[problem.device].some((p) => p.id === c.part));
    },
  );
  test(
    problem.id + ": hazards and uncertainty never continue diagnosis",
    () => {
      assert.equal(lesson.start, "safety");
      const danger = lesson.nodes[nextNode(lesson, lesson.start, "yes")];
      assert.equal(danger.kind, "result");
      assert.ok(danger.kind === "result" && danger.severity === "danger");
      const unsure = lesson.nodes[nextNode(lesson, lesson.start, "unsure")];
      assert.equal(unsure.kind, "result");
    },
  );
}
test("toilet non-running branch does not falsely diagnose a defective valve", () => {
  const t = tutorials["toilet-running-water"];
  assert.equal(nextNode(t, "observe", "no"), "normal");
  assert.equal(nextNode(t, "float-check", "no"), "fill-result");
  assert.equal(nextNode(t, "seal-check", "yes"), "seal-result");
});
