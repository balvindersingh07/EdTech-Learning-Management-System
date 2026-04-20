/**
 * Fixed catalog subject codes — instructors pick these or add custom subjects (stored in memory).
 * All codes use the `lms-subj-` prefix for clarity and collision avoidance.
 */
export const BUILT_IN_SUBJECTS = [
  { code: "lms-subj-engineering", name: "Engineering", builtIn: true },
  { code: "lms-subj-computer-science", name: "Computer Science", builtIn: true },
  { code: "lms-subj-product", name: "Product", builtIn: true },
  { code: "lms-subj-general", name: "General", builtIn: true },
];
