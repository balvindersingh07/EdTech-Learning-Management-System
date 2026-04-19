/** Admin domain projection — governance capabilities only (no teaching workflows). */
export class AdminProfile {
  constructor(record) {
    this.id = record.id;
    this.name = record.name;
    this.email = record.email;
    this.role = "admin";
  }

  toPublicDTO() {
    return { id: this.id, name: this.name, email: this.email, role: this.role };
  }
}
