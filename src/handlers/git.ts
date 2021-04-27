import { MAIN_BRANCH_NAME } from '../constants.ts';
import { exec } from '../../deps.ts';
import EVENTS from '../events.ts';
import { getCommitHashesThatDiffer } from '../util/getGitStatus.ts';
import { getFilesChangedByOtherPeople } from '../util/getConflictStatus.ts';

export async function runGitVersionCheckHandler() {
	try {
		await exec('git --version');
	} catch (e) {
		console.log('Fatal error determining Git version, quitting program');
		console.log(e.stack);
		Deno.exit();
	}
}

export async function runFetchAllHandler() {
	await exec('git fetch origin HEAD');
	await EVENTS.emit('fetched');
}

export async function emitCommitComparedEvents() {
	const behindOnRemote = (await getCommitHashesThatDiffer('HEAD', '@{u}')).length;
	const aheadOnRemote = (await getCommitHashesThatDiffer('@{u}', 'HEAD')).length;

	if (aheadOnRemote && behindOnRemote) {
		await EVENTS.emit('diverged');
		// @TODO Branches have diverged. Complicated system to figure out which commits are shared
	} else if (behindOnRemote) {
		await EVENTS.emit('behind');
		// @TODO Stash, pull, unstash
	} else if (aheadOnRemote) {
		await EVENTS.emit('ahead');
		// @TODO Push
	}
}

const collidableFiles: string[] = [];

export async function emitCollidingFileEvents() {
	const f = Object.keys(await getFilesChangedByOtherPeople());
	const filesOld = collidableFiles.filter(n => !f.includes(n));
	const filesNew = f.filter(n => !collidableFiles.includes(n));

	filesOld.forEach(n => collidableFiles.splice(collidableFiles.indexOf(n), 1));
	filesNew.forEach(n => collidableFiles.push(n));

	const events = [];
	if (filesOld.length) {
		events.push(EVENTS.emit('unlock', filesOld));
	}
	if (filesNew.length) {
		events.push(EVENTS.emit('lock', filesNew));
	}
	await Promise.all(events);
}
