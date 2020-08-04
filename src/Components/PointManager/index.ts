import * as FileSystem from "fs";

class PointManager {
	private data: { [key: string]: number };

	constructor() {
		this.loadData();
	}

	setPoint(target: string, point: number) {
		this.data[target] = point;
		this.saveData();
		console.log(`[Point][set] ${target}: ${point}`);
	}
	addPoint(target: string, point: number) {
		if (!this.data[target]) this.setPoint(target, 0);
		this.data[target] += point;
		this.saveData();
		console.log(`[Point][add] ${target}: ${this.data[target] - point} (+${point})`);
	}
	setPointAll(point: number) {
		let keys = Object.keys(this.data);
		for (let i in keys) {
			this.setPoint(keys[i], point);
		}
	}
	addPointAll(point: number) {
		let keys = Object.keys(this.data);
		for (let i in keys) {
			this.addPoint(keys[i], point);
		}
	}
	getPoint(target: string): number {
		return this.data[target];
	}

	private loadData() {
		try {
			this.data = require("./data.json");
		} catch(error) {
			this.data = { };
		}
	}
	private saveData() {
		FileSystem.writeFileSync("./src/Components/PointManager/data.json", this.dataToString());
		this.loadData();
	}
	private dataToString(): string {
		let result = "{\n";
		let keys = Object.keys(this.data);
		for (let i = 0; i < keys.length; i++) {
			result += `\t"${keys[i]}": ${this.data[keys[i]]}`;
			if (i != keys.length - 1) result += ",\n";
			else result += "\n";
		}
		return result + "}";
	}
}
export default new PointManager();
