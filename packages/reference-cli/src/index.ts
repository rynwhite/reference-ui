export * from './lib/reference-cli';

// CLI entry point
import { referenceCli } from './lib/reference-cli';

// If running as CLI (not imported as module)
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(referenceCli());
}
