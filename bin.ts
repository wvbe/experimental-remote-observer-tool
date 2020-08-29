import EVENTS from './src/events.ts';
import { runReplInputHandler, runReplReadyHandler } from './src/handlers/repl.ts';
import { runCompareCommitsHandler, runDetectCollidableFilesHandler } from './src/handlers/git.ts';

console.log('GIT OBSERVER ENGAGED');
console.log('--------------------');

// Error reporting
EVENTS.on('loop-error', (error) => {
	console.log(error.stack);
});

// REPL behaviour
EVENTS.on('ready', runReplReadyHandler);
EVENTS.on('repl-input', runReplInputHandler);
EVENTS.on('repl-ready', runReplReadyHandler);

// Git status checking
EVENTS.on('fetched', runCompareCommitsHandler);
EVENTS.on('fetched', runDetectCollidableFilesHandler);

// Document locking
EVENTS.on('lock', (f) => console.log(`Locking ${f.length} files`));
EVENTS.on('unlock', (f) => console.log(`Unlocking ${f.length} files`));

// Event loop
// EVENTS.on('loop-once', wrappedRunOnceCommand);

EVENTS.emit('ready');
