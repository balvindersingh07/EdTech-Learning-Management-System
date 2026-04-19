/**
 * Factory (+ polymorphism): centralizes construction of role-specific user projections.
 * Encapsulates validation rules per role without leaking constructor details to HTTP layer.
 */
import { StudentProfile } from "../../domain/entities/StudentProfile.js";
import { InstructorProfile } from "../../domain/entities/InstructorProfile.js";
import { AdminProfile } from "../../domain/entities/AdminProfile.js";

export class UserFactory {
  static fromRecord(record) {
    if (!record) return null;
    switch (record.role) {
      case "student":
        return new StudentProfile(record);
      case "instructor":
        return new InstructorProfile(record);
      case "admin":
        return new AdminProfile(record);
      default:
        throw new Error(`Unsupported role: ${record.role}`);
    }
  }
}
