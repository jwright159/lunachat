export default class SocketHandler {
	socket: WebSocket;
	eventListeners: Record<string, ((data: any) => void)[]>;

	constructor(host: string) {
		this.socket = new WebSocket('wss://' + host);
		this.eventListeners = {};

		this.socket.addEventListener('message', event => {
			const data = JSON.parse(event.data);
			console.log(data);
			if (data['type'] in this.eventListeners)
				this.eventListeners[data['type']].forEach(listener => listener(data));
			else if ('error' in this.eventListeners)
				this.eventListeners['error'].forEach(listener => listener({
					type: 'error',
					error: 'Invalid type of message ' + data['type'],
				}));
		});
	}

	on(eventName: string, eventListener: (data: any) => void) {
		if(eventName === 'open' || eventName === 'close') {
			this.socket.addEventListener(eventName, () => eventListener({}));
		}

		else {
			if (!(eventName in this.eventListeners))
				this.eventListeners[eventName] = [];
			
			this.eventListeners[eventName].push(eventListener);
		}
	}

	send(eventName: string, data: any) {
		data['type'] = eventName;
		this.socket.send(JSON.stringify(data));
	}
}