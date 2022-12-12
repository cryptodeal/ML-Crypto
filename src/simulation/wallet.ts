export class Wallet {
	public startingBalance: number;
	public balance: number;
	public txDiscountFactor: number;
	public ethBalance: number;

	constructor(startingBalance: number, txFee: number) {
		this.startingBalance = startingBalance;
		this.balance = startingBalance;
		this.txDiscountFactor = 1 - txFee;
		this.ethBalance = 0;
	}

	public buySignal(price: number) {
		if (this.ethBalance == 0) {
			this.ethBalance = (this.balance / price) * this.txDiscountFactor;
			this.balance = 0;
		}
	}

	public sellSignal(price: number) {
		if (this.balance == 0) {
			this.balance = this.ethBalance * price * this.txDiscountFactor;
			this.ethBalance = 0;
		}
	}

	public getReturn() {
		return (this.balance / this.startingBalance - 1) * 100;
	}
}
