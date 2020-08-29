import { FETCH_INTERVAL } from '../constants.ts';
import EVENTS from '../events.ts';
let NEXT_LOOP: null | number = null;

export async function startLoop(timeoutLength: number = FETCH_INTERVAL) {
	if (NEXT_LOOP) {
		throw new TypeError('A loop is already in progress');
	}

	await EVENTS.emit('loop-start');
	await (async function loop() {
		await EVENTS.emit('loop-once');

		NEXT_LOOP = setTimeout(loop, timeoutLength);
	})();
}

export async function stopLoop() {
	if (!NEXT_LOOP) {
		throw new TypeError('No loop in progress');
	}
	await EVENTS.emit('loop-stop');
	clearTimeout(NEXT_LOOP);
	NEXT_LOOP = null;
}
