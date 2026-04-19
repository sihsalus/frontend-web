import path from 'node:path';

export function createVitestAliases(
  rootDir: string,
  aliases: Record<string, string>,
): Array<{ find: RegExp; replacement: string }> {
  return Object.entries(aliases).map(([key, relativeTarget]) => {
    const isGlob = key.endsWith('/*');
    const find = isGlob ? new RegExp(`^${key.slice(0, -2)}/(.*)$`) : new RegExp(`^${key}$`);
    const replacement = isGlob
      ? `${path.resolve(rootDir, relativeTarget.slice(0, -2)).split(path.sep).join('/')}/$1`
      : path.resolve(rootDir, relativeTarget).split(path.sep).join('/');

    return { find, replacement };
  });
}
