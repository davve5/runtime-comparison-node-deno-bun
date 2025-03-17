import { runtime } from './runtime.js';

export const readArgs = () => {
	let rawArgs = [];

	if (runtime === 'Node.js') {
		rawArgs = process.argv.slice(2);
	}
	else if (runtime === 'Deno') {
		rawArgs = Deno.args;
	}
	else if (runtime === 'Bun') {
		rawArgs = Bun.argv.slice(2);
	}

	return Object.fromEntries(
		rawArgs.map(arg => {
			const [key, value] = arg.replace(/^-/, '').split('=');
			return [key, value ? Number(value) || value : true];
		})
	);
};