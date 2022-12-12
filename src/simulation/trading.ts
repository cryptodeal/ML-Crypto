import * as sm from '@shumai/shumai';
import { NeuralNet } from '../nn';
import { Wallet } from './wallet';

export const runSimulation = (model: NeuralNet, inputs: sm.Tensor, prices: number[]): number => {
	const wallet = new Wallet(10000, 0.0005);

	const modelOutputs = model.predict(inputs);
	const priceLen = prices.length;
	for (let i = 0; i < priceLen; i++) {
		// buy or sell signal
		if (modelOutputs.index([i, 0]).valueOf() > modelOutputs.index([i, 1])) {
			wallet.buySignal(prices[i]);
		} else {
			wallet.sellSignal(prices[i]);
		}
	}

	// close any positions
	wallet.sellSignal(prices[priceLen - 1]);
	return wallet.getReturn();
};
