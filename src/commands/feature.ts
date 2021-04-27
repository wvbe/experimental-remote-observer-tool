import { getCurrentGitBranch } from '../util/getGitStatus.ts';
import { MAIN_BRANCH_NAME } from '../constants.ts';
import { exec } from '../../deps.ts';
import EVENTS from '../events.ts';

export async function runFeatureCommand(branchName: string | undefined) {
	const currentBranch = await getCurrentGitBranch();

	if (branchName === 'close') {
		if (currentBranch === MAIN_BRANCH_NAME) {
			// User gave command to "close" a branch, so dont interpret it as a branch name
			throw new Error(`Not working on a feature branch.`);
		} else {
			await exec(`git checkout ${MAIN_BRANCH_NAME}`);
			await EVENTS.emit('checkout');
			console.log(`Closed feature branch "${branchName}"`);
			await EVENTS.emit('feature-close');
		}
		return;
	}

	if (!branchName) {
		if (currentBranch === MAIN_BRANCH_NAME) {
			console.log(`Currently not on a feature branch.`);
		} else {
			console.log(`Currently on feature branch "${currentBranch}".`);
		}
		return;
	}

	if (currentBranch === MAIN_BRANCH_NAME) {
		/**
		 * Opening a feature branch
		 */
		await exec(`git checkout -b ${branchName}`);
		await EVENTS.emit('checkout');
		console.log(`Checked out a new feature branch "${branchName}"`);
		await EVENTS.emit('feature-open');
	} else {
		if (branchName !== 'close') {
			throw new Error(
				`Already on a feature branch "${currentBranch}", expected to be on main branch "${MAIN_BRANCH_NAME}".`
			);
		}
	}

	// @TODO sanitize branchName
}
