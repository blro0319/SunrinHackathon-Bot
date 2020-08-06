export interface IMember {
	name: string,
	role: string,
	tag: string
}

export interface ITeam {
	name: string,
	type: string,
	members: IMember[]
}
