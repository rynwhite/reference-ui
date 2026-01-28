import type { Plugin } from 'vite';
import { normalizePath } from 'vite';

/**
 * HMR plugin for reference-core components.
 * When reference-core dist files change, invalidate all related modules to trigger HMR.
 */
export function stencilHmrPlugin(): Plugin {
  return {
    name: 'stencil-hmr',
    handleHotUpdate({ file, server, modules }) {
      // Normalize the file path for consistent matching
      const normalizedFile = normalizePath(file);
      
      // Watch reference-core dist files - these are the built outputs that Storybook uses
      const isReferenceCore =
        normalizedFile.includes('/reference-core/dist/') && 
        (normalizedFile.endsWith('.js') || normalizedFile.endsWith('.cjs') || normalizedFile.endsWith('.d.ts'));

      if (isReferenceCore) {
        console.log(`[HMR] Detected change in reference-core: ${normalizedFile}`);
        
        // Find and invalidate ALL modules that import from @reference-ui/core
        const modulesToUpdate: any[] = [];
        const allModules = Array.from(server.moduleGraph.idToModuleMap.values());
        
        for (const mod of allModules) {
          const modId = normalizePath(mod.id || mod.url || '');
          
          // Check if module is related to reference-core
          if (
            modId.includes('@reference-ui/core') ||
            modId.includes('reference-core/dist') ||
            modId.includes('.stories.')
          ) {
            // Invalidate this module to force reload
            server.moduleGraph.invalidateModule(mod);
            modulesToUpdate.push(mod);
          }
          
          // Also check importers - if any module imports from reference-core, invalidate it
          if (mod.importers && mod.importers.size > 0) {
            for (const importer of mod.importers) {
              const importerId = normalizePath(importer.id || importer.url || '');
              if (
                importerId.includes('reference-storybook') ||
                importerId.includes('.stories.')
              ) {
                if (!modulesToUpdate.includes(mod)) {
                  server.moduleGraph.invalidateModule(mod);
                  modulesToUpdate.push(mod);
                }
              }
            }
          }
        }

        // Also add modules passed to handleHotUpdate
        for (const mod of modules) {
          if (!modulesToUpdate.includes(mod)) {
            server.moduleGraph.invalidateModule(mod);
            modulesToUpdate.push(mod);
          }
        }

        console.log(`[HMR] Invalidated ${modulesToUpdate.length} module(s) for HMR`);
        
        // Return modules to trigger HMR update
        return modulesToUpdate.length > 0 ? modulesToUpdate : modules;
      }

      return undefined;
    },
  };
}
