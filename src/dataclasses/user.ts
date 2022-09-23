export default class User {
	id: string;
	username: string;
	color: string;

	constructor(data: any) {
		this.id = data['id']
		this.username = data['username']
		this.color = data['color']
	}
}