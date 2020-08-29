import { MAIN_BRANCH_NAME } from '../constants.ts';
import { exec } from '../../deps.ts';

export class GitStatus {
	public commitsAhead: string[] = [];
	public commitsBehind: string[] = [];
	public filesModified: string[] = [];

	get hasDiverged(): boolean {
		return Boolean(this.commitsAhead.length && this.commitsBehind.length);
	}

	static async betweenHeadAndRemoteMain() {
		return GitStatus.betweenHeads('origin/' + MAIN_BRANCH_NAME);
	}

	static async betweenHeads(otherHead = 'origin/HEAD') {
		const instance = new GitStatus();
		instance.commitsBehind = (await exec(`git rev-list ..${otherHead}`)).split('\n');
		instance.commitsAhead = (await exec(`git rev-list ${otherHead}..`)).split('\n');
		instance.filesModified = (await exec(`git diff-tree -r HEAD..${otherHead}`))
			.split('\n')
			.map((line) => line.split(/\s+/))
			.map(([chmodBefore, chmodAfter, hashBefore, hashAfter, changeType, ...fileName]) => ({
				chmodAfter,
				chmodBefore,
				hashBefore,
				hashAfter,
				changeType,
				fileName: fileName.join(' ')
			}));
		return instance;
	}
}
