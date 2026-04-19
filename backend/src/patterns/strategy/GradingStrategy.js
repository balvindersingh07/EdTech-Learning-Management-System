/**
 * Strategy: interchangeable grading algorithms (numeric vs rubric) selected at runtime.
 * Keeps grading service closed for modification when adding new schemes (OCP).
 */
export class NumericGradingStrategy {
  grade({ maxScore, score }) {
    if (score < 0 || score > maxScore) {
      throw new Error("Score out of range");
    }
    return { score, feedback: `Numeric grade recorded (${score}/${maxScore}).` };
  }
}

export class RubricGradingStrategy {
  grade({ maxScore, rubricBand }) {
    const map = { A: 1, B: 0.85, C: 0.7, D: 0.55 };
    const ratio = map[rubricBand] ?? 0.5;
    const score = Math.round(maxScore * ratio);
    return { score, feedback: `Rubric band ${rubricBand} mapped to ${score}/${maxScore}.` };
  }
}

export class GradingContext {
  constructor(strategy) {
    this._strategy = strategy;
  }

  setStrategy(strategy) {
    this._strategy = strategy;
  }

  execute(input) {
    return this._strategy.grade(input);
  }
}
