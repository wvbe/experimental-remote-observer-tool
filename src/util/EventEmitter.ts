type EventCallback = (...unknown: any) => void;
type ListenerDestroyer = () => void;
type EventName = string;

function time() {
	const d = new Date();
	return [d.getHours(), d.getMinutes(), d.getSeconds()]
		.map((number) => (number < 10 ? '0' : '') + number)
		.join(':');
}
export class EventEmitter {
	listeners: {
		[name: string]: EventCallback[];
	} = {};

	on(name: EventName, callback: EventCallback): ListenerDestroyer {
		if (!this.listeners[name]) {
			this.listeners[name] = [];
		}
		this.listeners[name].push(callback);

		return () => this.listeners[name].splice(this.listeners[name].indexOf(callback, 1));
	}

	async emit(name: EventName, ...rest: any): Promise<void> {
		console.group(`${time()} ${name}`);
		if (this.listeners[name]) {
			await Promise.all(this.listeners[name].map((callback) => callback(...rest)));

			// await this.listeners[name].reduce(async (prev, callback) => {
			// 	await prev;
			// 	return callback(...rest);
			// }, Promise.resolve());
		}
		console.groupEnd();
	}
}
