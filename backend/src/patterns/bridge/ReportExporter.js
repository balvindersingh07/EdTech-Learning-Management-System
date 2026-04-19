/**
 * Bridge: decouples report generation orchestration from concrete export implementations (HTML vs JSON).
 * Abstraction (ReportExporter) can evolve independently from implementation (HtmlExporter / JsonExporter).
 */
export class ReportExporter {
  constructor(impl) {
    this._impl = impl;
  }

  setImplementation(impl) {
    this._impl = impl;
  }

  exportReport(model) {
    return this._impl.render(model);
  }
}

export class HtmlExporter {
  render(model) {
    return `<article><h1>${model.title}</h1><p>${model.summary}</p></article>`;
  }
}

export class JsonExporter {
  render(model) {
    return JSON.stringify(model);
  }
}
