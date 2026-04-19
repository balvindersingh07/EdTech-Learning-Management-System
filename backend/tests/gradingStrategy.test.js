import { describe, expect, it } from "vitest";
import {
  GradingContext,
  NumericGradingStrategy,
  RubricGradingStrategy,
} from "../src/patterns/strategy/GradingStrategy.js";

describe("GradingStrategy (Strategy pattern)", () => {
  it("applies numeric grading", () => {
    const ctx = new GradingContext(new NumericGradingStrategy());
    const out = ctx.execute({ maxScore: 100, score: 88 });
    expect(out.score).toBe(88);
    expect(out.feedback).toContain("88/100");
  });

  it("applies rubric grading", () => {
    const ctx = new GradingContext(new RubricGradingStrategy());
    const out = ctx.execute({ maxScore: 100, rubricBand: "A" });
    expect(out.score).toBe(100);
  });
});
