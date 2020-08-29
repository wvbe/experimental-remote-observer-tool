import { exec as execDep, OutputMode } from 'https://deno.land/x/exec/mod.ts';

async function exec(cmd: string): Promise<string> {
	console.log('% ' + cmd);
	return (await execDep(cmd, { output: OutputMode.Capture })).output.trim();
}

export { exec };
