import { exec as execDep, OutputMode } from 'https://deno.land/x/exec/mod.ts';

async function exec(cmd: string): Promise<string> {
	// console.log('% ' + cmd);
	const result = await execDep(cmd, { output: OutputMode.Capture, verbose: false });
	if (result.status.code !== 0) {
		console.dir(result.output);
		throw new Error(`Child process "${cmd}" quit with non-zero code "${result.status.code}"`);
	}

	return result.output.trim();
}

export { exec };
