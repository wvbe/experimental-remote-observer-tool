import EVENTS from './src/events.ts';
import { runReplInputHandler, runReplReadyHandler } from './src/handlers/repl.ts';
import {
	emitCommitComparedEvents,
	emitCollidingFileEvents,
	runGitVersionCheckHandler
} from './src/handlers/git.ts';
import { runStartLoopHandler } from './src/handlers/loop.ts';
import { wrappedRunOnceCommand } from './src/commands/once.ts';

console.log('GIT OBSERVER ENGAGED');
console.log('--------------------');

// REPL behaviour
EVENTS.on('ready', runGitVersionCheckHandler);
EVENTS.on('ready', runReplReadyHandler);
EVENTS.on('repl-input', runReplInputHandler);
EVENTS.on('repl-ready', runReplReadyHandler);

// Error reporting
EVENTS.on('loop-error', error => {
	console.log(error.stack);
});
EVENTS.on('loop-once', wrappedRunOnceCommand);

// Git status checking
EVENTS.on('fetched', emitCommitComparedEvents);
EVENTS.on('fetched', emitCollidingFileEvents);

// Document locking
function limitedFileLog(caption: string, files: string[]) {
	console.group(caption);
	files.slice(0, 3).forEach(f => console.log(f));
	console.groupEnd();
	if (files.length > 3) {
		console.log(`... and ${files.length - 3} other files`);
	}
}
EVENTS.on('lock', files => limitedFileLog(`Locking ${files.length} files`, files));
EVENTS.on('unlock', files => limitedFileLog(`Unlocking ${files.length} files`, files));

// Event loop
EVENTS.on('ready', runStartLoopHandler);

EVENTS.emit('ready');
