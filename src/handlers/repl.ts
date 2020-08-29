import { readLines } from 'https://deno.land/std/io/bufio.ts';

import { runFeatureCommand } from '../commands/feature.ts';
import { runHelpCommand } from '../commands/help.ts';
import { runOnceCommand } from '../commands/once.ts';

import EVENTS from '../events.ts';

async function processInput(input: string): Promise<void> {
	const [command, ...rest] = input.split(' ');
	switch (command) {
		case 'feature':
			const [branchName] = rest;
			await runFeatureCommand(branchName);
			return;

		case 'exit':
			console.log('Quitting program');
			Deno.exit(0);

		case 'once':
			await runOnceCommand();
			return;

		case 'help':
		case '?':
			await runHelpCommand();
			return;

		// case 'test':
		// 	await getFilesChangedByOtherPeople();
		// 	return;

		default:
			throw new TypeError(`Command "${command}" not recognized`);
	}
}
export async function runReplInputHandler(input: string): Promise<void> {
	try {
		await processInput(input);
	} catch (error) {
		console.group(`Could not process "${input}"`);
		console.log(error.stack);
		console.groupEnd();
		await processInput('help');
	}

	// Do not await:
	EVENTS.emit('repl-ready');
}

export async function runReplReadyHandler(): Promise<void> {
	Deno.stdout.write(new TextEncoder().encode('> '));
	for await (const line of readLines(Deno.stdin)) {
		await EVENTS.emit('repl-input', line);
		break;
	}
}
