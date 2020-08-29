import { exec } from '../../deps.ts';

export const UNTRACKED = Symbol();
export const MODIFIED = Symbol();
export const ADDED = Symbol();
export const DELETED = Symbol();

export type FileHash = { file: string; hash: string };
export type Treeish = string;

export async function getCurrentGitBranch(): Promise<Treeish> {
	const currentBranch = await exec('git branch --show-current');
	if (!currentBranch) {
		throw new Error('Not currently on any branch');
	}
	return currentBranch;
}

// export async function getStagedChanges(): Promise<string[]> {
// 	return (await exec('git status --porcelain')).split('\n').map((line) => {
// 		const changeType = line.substr(0, 2).trim();
// 		const changeFile = line.substr(2).trim();
// 		return 'nerf';
// 	});
// }

export async function getFileHashes(treeish: string = 'HEAD'): Promise<FileHash[]> {
	return (await exec(`git ls-tree -r ${treeish}`))
		.split('/n')
		.map((line) => line.split(/\s+/))
		.map(([_chmod, _changeType, hash, ...fileParts]) => ({
			// Contains a bug, if a file contains more than one consecutive space
			// those are flattened to just a single space
			file: fileParts.join(' '),
			hash
		}));
}

export async function getFileHashesThatDiffer(
	treeishLeft: string = 'HEAD',
	treeishRight: string = 'origin/HEAD'
): Promise<FileHash[]> {
	// Alternatively to using git diff-tree, could compare outputs of two getFileHashes
	return (await exec(`git diff-tree -r ${treeishLeft}..${treeishRight}`))
		.split('\n')
		.map((line) => line.split(/\s+/))
		.map(([_chmodLeft, _chmodRight, _hashLeft, hashRight, _changeType, ...fileParts]) => ({
			// Contains a bug, if a file contains more than one consecutive space
			// those are flattened to just a single space
			file: fileParts.join(' '),
			hash: hashRight
		}));
}

export async function getCommitHashesThatDiffer(
	commitishLeft: string = 'HEAD',
	commitishRight: string = 'origin/HEAD'
): Promise<Treeish[]> {
	return (await exec(`git rev-list ${commitishLeft}..${commitishRight}`)).trim().split('\n');
}

export async function getRemoteBranchNames(): Promise<Treeish[]> {
	// git ls-remote --heads origin
	//   Good list, but retrieves it async from remote
	return (await exec(`git branch --remote`))
		.split('\n')
		.filter((line) => !line.includes(' -> '))
		.map((line) => line.trim());
}

export async function testAllGitStatusFunctions() {
	console.log('Test all git functions');
	try {
		// console.log(await getFileHashes());
		console.log(await getRemoteBranchNames());
		console.log(await getCommitHashesThatDiffer('HEAD', 'origin/HEAD'));
		console.log(await getFileHashesThatDiffer('HEAD', 'origin/HEAD'));
		console.log(await getFileHashesThatDiffer('HEAD', 'origin/DEV-381-generate-editor-api'));
	} catch (error) {
		console.error(error.stack);
	}
}
