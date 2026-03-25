export function applySsrTemplate(html: string, shell: string): string {
  return shell.replace('<!--app-->', html);
}

