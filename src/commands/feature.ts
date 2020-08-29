import { getCurrentGitBranch } from '../util/getGitStatus.ts';
import { MAIN_BRANCH_NAME } from '../constants.ts';
import { exec } from '../../deps.ts';
import EVENTS from '../events.ts';

export async function runFeatureCommand(branchName: string | undefined) {
	const currentBranch = await getCurrentGitBranch();

	if (!branchName) {
		if (currentBranch === MAIN_BRANCH_NAME) {
			console.log(`Currently not on a feature branch.`);
		} else {
			console.log(`Currently on feature branch "${currentBranch}".`);
		}
	} else if (currentBranch === MAIN_BRANCH_NAME) {
		if (branchName === 'close') {
			throw new Error(`Not working on a feature branch.`);
		}
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

		await exec(`git checkout ${MAIN_BRANCH_NAME}`);
		await EVENTS.emit('checkout');
		console.log(`Closed feature branch "${branchName}"`);
		await EVENTS.emit('feature-close');
	}

	// @TODO sanitize branchName
}
