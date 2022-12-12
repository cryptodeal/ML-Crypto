import { rand } from '@ffi';
import * as sm from '@shumai/shumai';

export type NeuralNetConfig = {
	inputNeurons: number;
	outputNeurons: number;
	hiddenNeurons: number;
	hiddenLayers: number;
};

export class NeuralNet {
	public config: NeuralNetConfig;

	constructor(config: NeuralNetConfig) {
		this.config = config;
	}

	private newLayer(inputs: number, outputs: number) {
		// initialize weights and bias
		const tempWeights = rand.normFloat64Array(inputs * outputs),
			tempBias = rand.normFloat64Array(outputs);

		return {
			weights: sm.tensor(tempWeights).reshape([inputs, outputs]),
			bias: sm.tensor(tempBias).reshape([1, outputs])
		};
	}
}
