/**
 * State: explicit assignment lifecycle transitions instead of scattered string checks.
 */
export class DraftState {
  submit() {
    return new SubmittedState();
  }
}

export class SubmittedState {
  grade() {
    return new GradedState();
  }
}

export class GradedState {}

export class AssignmentWorkflow {
  constructor() {
    this.state = new DraftState();
  }

  submit() {
    if (!(this.state instanceof DraftState)) {
      throw new Error("Invalid transition: only drafts can be submitted");
    }
    this.state = this.state.submit();
  }

  finalizeGrade() {
    if (!(this.state instanceof SubmittedState)) {
      throw new Error("Invalid transition: grading requires submitted work");
    }
    this.state = this.state.grade();
  }
}
