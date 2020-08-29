const HELP_DESCRIPTION_BY_COMMAND: { [key: string]: string } = {
	'feature <issue ID>': 'Create a new feature branch for this issue number',
	help: 'Show this help text again',
	exit: 'Quit the process',
	once: 'Run the loop once, immediately'
};

export async function runHelpCommand() {
	const longestCommandName = Object.keys(HELP_DESCRIPTION_BY_COMMAND).reduce(
		(max, key) => Math.max(max, key.length),
		0
	);

	console.group('The following inputs are valid:');
	Object.keys(HELP_DESCRIPTION_BY_COMMAND)
		.sort()
		.forEach((key) => {
			const description = HELP_DESCRIPTION_BY_COMMAND[key];

			console.log(key + ' '.repeat(longestCommandName - key.length) + '    ' + description);
		});
	console.groupEnd();
}
