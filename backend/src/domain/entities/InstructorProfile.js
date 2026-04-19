/** Instructor domain projection — teaching domain only. */
export class InstructorProfile {
  constructor(record) {
    this.id = record.id;
    this.name = record.name;
    this.email = record.email;
    this.role = "instructor";
  }

  toPublicDTO() {
    return { id: this.id, name: this.name, email: this.email, role: this.role };
  }

  ownsCourse(course) {
    return course?.instructorId === this.id;
  }
}
