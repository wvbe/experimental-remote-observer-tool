import { MAIN_BRANCH_NAME } from '../constants.ts';
import { exec } from '../../deps.ts';
import EVENTS from '../events.ts';
import { runFetchAllHandler } from '../handlers/git.ts';

export async function wrappedRunOnceCommand() {
	try {
		await runOnceCommand();
	} catch (error) {
		await EVENTS.emit('loop-error', error);
	}
}

export async function runOnceCommand() {
	await runFetchAllHandler();
}
