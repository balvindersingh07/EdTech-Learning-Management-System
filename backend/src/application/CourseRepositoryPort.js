/** Port implemented by infrastructure (DIP): application depends on abstraction. */
export class CourseRepositoryPort {
  async getById() {
    throw new Error("not implemented");
  }
}
