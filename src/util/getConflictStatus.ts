import { getRemoteBranchNames, getFileHashesThatDiffer } from './getGitStatus.ts';
import { MAIN_BRANCH_NAME } from '../constants.ts';

type TreeishFileHashComparisons = { [file: string]: { [hash: string]: string[] } };
export async function getFilesChangedByOtherPeople(): Promise<TreeishFileHashComparisons> {
	const remoteBranches = await getRemoteBranchNames();
	const remoteMainBranchName = 'origin/' + MAIN_BRANCH_NAME;
	if (!remoteBranches.includes(remoteMainBranchName)) {
		throw new Error(`Main branch "${remoteMainBranchName}" not found`);
	}
	const fileChanges: TreeishFileHashComparisons = {};
	await Promise.all(
		remoteBranches.map(async (treeish) => {
			const changedFiles = await getFileHashesThatDiffer('HEAD', treeish);
			changedFiles.forEach((i) => {
				// if (i.hash.split('').every((char) => char === '0')) {
				// 	// Hash "00000.." means that file does not exist (on the remote)
				// 	// Assuming there will be no merge conflict
				// 	return;
				// }
				if (!fileChanges[i.file]) {
					fileChanges[i.file] = {};
				}
				if (!fileChanges[i.file][i.hash]) {
					fileChanges[i.file][i.hash] = [];
				}
				fileChanges[i.file][i.hash].push(treeish);
			});
		})
	);

	return fileChanges;
}
