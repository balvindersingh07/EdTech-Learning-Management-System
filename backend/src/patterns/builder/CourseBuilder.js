/**
 * Builder: stepwise assembly of a complex Course aggregate for instructor creation flows.
 */
export class CourseBuilder {
  constructor() {
    this._payload = {
      modules: [],
      enrolledCount: 0,
      rating: 5,
      isBuiltIn: false,
    };
  }

  withBasics({ title, description, category, level, instructorId, instructorName }) {
    this._payload.title = title;
    this._payload.description = description;
    this._payload.category = category;
    this._payload.level = level;
    this._payload.instructorId = instructorId;
    this._payload.instructorName = instructorName;
    return this;
  }

  withThumbnail(url) {
    this._payload.thumbnailUrl = url;
    return this;
  }

  withSlug(slug) {
    this._payload.slug = slug;
    return this;
  }

  /**
   * @param {string} code Subject code (e.g. lms-subj-engineering)
   * @param {string} [displayName] Human-readable name
   */
  withSubject(code, displayName) {
    this._payload.subject = code;
    this._payload.subjectName = displayName ?? code;
    return this;
  }

  withBuiltIn(value) {
    this._payload.isBuiltIn = Boolean(value);
    return this;
  }

  build(id) {
    if (!this._payload.title) throw new Error("Course title required");
    const slug =
      this._payload.slug ??
      this._payload.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-");
    return {
      id,
      slug,
      thumbnailUrl:
        this._payload.thumbnailUrl ??
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
      ...this._payload,
      isBuiltIn: this._payload.isBuiltIn ?? false,
      subject: this._payload.subject,
      subjectName: this._payload.subjectName ?? this._payload.subject,
    };
  }
}
