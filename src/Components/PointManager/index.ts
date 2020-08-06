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
		if (this.data[target] == undefined) return 0;
		return this.data[target];
	}

	pointToIcon(point: number): string {
		let rating = ["⭐", "🤍", "💜", "💙", "💚", "💛", "🧡", "❤️"];
		let pStr = point.toString();
		if (pStr.length > rating.length) return "💠";

		let result = "";
		let lv = rating.length - pStr.length;
		while (pStr !== "") {
			for (let i = 0; i < Number(pStr.charAt(0)); i++) {
				result += rating[lv];
			}
			lv++;
			pStr = pStr.slice(1);
		}
		if (result === "") result = "HP가 없습니다 :(";
		return result;
	}

	private loadData() {
		try {
			this.data = require("./data.json");
		} catch(error) {
			this.data = { };
		}
	}
	private saveData() {
		FileSystem.writeFileSync("./src/Components/PointManager/data.json", JSON.stringify(this.data));
		this.loadData();
	}
}
export default new PointManager();
