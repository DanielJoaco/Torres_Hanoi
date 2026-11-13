import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

function copyLegacyScripts() {
  return {
    name: 'copy-legacy-scripts',
    generateBundle() {
      const scriptsDirectory = resolve(process.cwd(), 'src/scripts');

      for (const fileName of readdirSync(scriptsDirectory)) {
        if (!fileName.endsWith('.js')) continue;

        this.emitFile({
          type: 'asset',
          fileName: `src/scripts/${fileName}`,
          source: readFileSync(resolve(scriptsDirectory, fileName))
        });
      }
    }
  };
}

export default defineConfig({
  base: '/Torres_Hanoi/',
  plugins: [copyLegacyScripts()]
});