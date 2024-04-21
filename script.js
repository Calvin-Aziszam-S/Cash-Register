let price = 3.26;
let cash = 5;

let cid = [
	["PENNY", 1.01],
	["NICKEL", 2.05],
	["DIME", 3.1],
	["QUARTER", 4.25],
	["ONE", 90],
	["FIVE", 55],
	["TEN", 20],
	["TWENTY", 60],
	["ONE HUNDRED", 100],
];

if (price > Number(cash)) {
	console.log("Customer does not have enough money to purchase the item");
}

if (price === Number(cash)) {
	console.log("No change due - customer paid with exact cash");
}

let change = Math.round(Number(cash) * 100 - price * 100);
let reverseCid = [...cid].reverse();
let denominations = [100, 20, 10, 5, 1, 0.25, 0.1, 0.05, 0.01];
let denomNorm = denominations.map((e) => e * 100);
let result = { status: "OPEN", change: [] };
let valueCid = cid.map((e) => Math.round(e[1] * 100));
let totalCid = valueCid.reduce((prev, curr) => prev + curr);

// console.log(reverseCid[0]);

if (totalCid < change) {
	console.log("INSUFFICIENT_FUNDS");
}

if (totalCid === change) {
	console.log("CLOSED");
}

for (let i = 0; i < reverseCid.length; i++) {
	if (change >= denomNorm[i]) {
		let count = 0;
		let total = Math.round(reverseCid[i][1] * 100);
		while (total > 0 && change >= denomNorm[i]) {
			total -= denomNorm[i];
			change -= denomNorm[i];
			count++;
		}
		if (count > 0) {
			result.change.push([reverseCid[i][0], count * denominations[i]]);
		}
	}
}

if (result.change) {
	result.change.forEach((e) => {
		const targetArr = cid.find((c) => c[0] === e[0]);
		targetArr[1] -= e[1];
		// console.log(targetArr);
	});
}

console.log(result);
cid.map((e) => console.log(e));
