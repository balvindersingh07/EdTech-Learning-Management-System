/** Student domain projection — student-specific capabilities only. */
export class StudentProfile {
  constructor(record) {
    this.id = record.id;
    this.name = record.name;
    this.email = record.email;
    this.role = "student";
  }

  toPublicDTO() {
    return { id: this.id, name: this.name, email: this.email, role: this.role };
  }
}
