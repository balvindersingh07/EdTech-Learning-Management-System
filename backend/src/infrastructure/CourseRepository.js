import { CourseRepositoryPort } from "../application/CourseRepositoryPort.js";

export class CourseRepository extends CourseRepositoryPort {
  constructor(store) {
    super();
    this._store = store;
  }

  async getById(id) {
    return Promise.resolve(this._store.getCourse(id));
  }
}
