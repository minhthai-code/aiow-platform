export interface HtmlTemplateOptions {
  title: string;
  bodyHtml: string;
}

export function renderHtmlTemplate(opts: HtmlTemplateOptions): string {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${opts.title}</title></head><body>${opts.bodyHtml}</body></html>`;
}

