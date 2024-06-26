const cashInput = document.getElementById("cash");
const purchaseButton = document.getElementById("purchase-btn");
const changeDueContainer = document.getElementById("change-container");
const changeDueText = document.getElementById("change-due");
const cidContainer = document.getElementById("cid-container");
const cidText = document.getElementById("cid");
const priceText = document.getElementById("price-text");

let price = 19.5;
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

const currencyName = {
	PENNY: "Pennies",
	NICKEL: "Nickels",
	DIME: "Dimes",
	QUARTER: "Quarters",
	ONE: "Ones",
	FIVE: "Fives",
	TEN: "Tens",
	TWENTY: "Twenties",
	"ONE HUNDRED": "Hundreds",
};

priceText.innerText = `Price: $${price}`;
cidText.innerHTML = `<p style="font-weight:bold;margin-bottom:10px;">Cash In Drawer:</p>${cid
	.map((e) => `<p>${currencyName[e[0]]}: $${e[1]}</p>`)
	.join("")}`;

function checkCashRegister() {
	if (!cashInput.value) {
		return;
	}

	if (Number(cashInput.value) < price) {
		alert("Customer does not have enough money to purchase the item");
		return;
	}

	if (Number(cashInput.value) === price) {
		changeDueText.innerText = `No change due - customer paid with exact cash`;
		changeDueContainer.style.display = "flex";
		return;
	}

	let changeDue = parseFloat(Number(cashInput.value) - price).toFixed(2);
	let totalCid = parseFloat(
		cid
			.map((e) => e[1])
			.reduce((prev, curr) => prev + curr)
			.toFixed(2)
	);
	let result = { status: "OPEN", change: [] };
	const cidReversed = [...cid].reverse();
	const denominations = [100, 20, 10, 5, 1, 0.25, 0.1, 0.05, 0.01];

	if (totalCid < changeDue) {
		changeDueContainer.style.display = "flex";
		changeDueText.innerHTML = `<p>Status: INSUFFICIENT_FUNDS</p>`;
		return;
	}

	if (totalCid === Number(changeDue)) {
		result.status = "CLOSED";
	}

	console.log(result, totalCid, Number(changeDue));

	for (let i = 0; i < cidReversed.length; i++) {
		if (changeDue > denominations[i]) {
			let total = cidReversed[i][1];
			let count = 0;
			while (total > 0 && changeDue >= denominations[i]) {
				changeDue = parseFloat((changeDue - denominations[i]).toFixed(2));
				total = parseFloat(total - denominations[i].toFixed(2));
				count++;
			}
			if (count > 0) {
				result.change.push([
					cidReversed[i][0],
					parseFloat(denominations[i] * count).toFixed(2),
				]);
			}
		}
	}

	if (changeDue > 0) {
		changeDueContainer.style.display = "flex";
		changeDueText.innerHTML = "<p>Status: INSUFFICIENT_FUNDS</p>";
		return;
	}

	result.change.forEach((e) => {
		const target = cid.find((x) => x[0] === e[0]);
		target[1] = parseFloat((target[1] - e[1]).toFixed(2));
	});

	cashInput.value = "";
	priceText.innerText = `Price: $${price}`;
	cidText.innerHTML = `<p style="font-weight:bold;margin-bottom:10px;">Cash In Drawer:</p>${cid
		.map((e) => `<p>${currencyName[e[0]]}: $${e[1]}</p>`)
		.join("")}`;
	changeDueContainer.style.display = "flex";
	changeDueText.innerHTML = `<p>Status: <strong>${result.status}</strong></p>
	${result.change.map((e) => `<p>${e[0]}: $${e[1]}</p>`).join("")}`;
}

purchaseButton.addEventListener("click", checkCashRegister);

cashInput.addEventListener("keypress", (e) => {
	if (e.key === "Enter") {
		checkCashRegister();
	}
});
