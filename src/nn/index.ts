import { rand } from '@ffi';
import * as sm from '@shumai/shumai';
import { setRandomSeed } from 'bun:jsc';

setRandomSeed(Date.now());

export type NeuralNetConfig = {
	inputNeurons: number;
	outputNeurons: number;
	hiddenNeurons: number;
	hiddenLayers: number;
};

export class NeuralNet {
	public config: NeuralNetConfig;
	public mutationRate: number;
	public mutationScale: number;

	// more efficient to iterate through map vs array
	private wHidden: Map<number, sm.Tensor> = new Map();
	private bHidden: Map<number, sm.Tensor> = new Map();

	private wOut: sm.Tensor;
	private bOut: sm.Tensor;

	constructor(config: NeuralNetConfig, mutationRate: number, mutationScale: number) {
		this.config = config;
		this.mutationRate = mutationRate;
		this.mutationScale = mutationScale;
	}

	init() {
		if (!rand.isSeeded()) rand.seed(Date.now());

		// init input layers
		const { weights, bias } = this.newLayer(this.config.inputNeurons, this.config.hiddenNeurons);
		this.wHidden.set(0, weights);
		this.bHidden.set(0, bias);

		// hidden layers
		for (let i = 1; i < this.config.hiddenLayers; i++) {
			const { weights, bias } = this.newLayer(this.config.hiddenNeurons, this.config.hiddenNeurons);
			this.wHidden.set(i, weights);
			this.bHidden.set(i, bias);
		}

		// output layer
		const { weights: wOut, bias: bOut } = this.newLayer(
			this.config.hiddenNeurons,
			this.config.outputNeurons
		);
		this.wOut = wOut;
		this.bOut = bOut;
	}

	public newLayer(inputs: number, outputs: number) {
		// initialize weights and bias
		const tempWeights = rand.normFloat32Array(inputs * outputs),
			tempBias = rand.normFloat32Array(outputs);

		return {
			weights: sm.tensor(tempWeights).reshape([inputs, outputs]),
			bias: sm.tensor(tempBias).reshape([1, outputs])
		};
	}

	public mutate() {
		for (const [i, layer] of this.wHidden) {
			const val = layer.valueOf(),
				len = val.length,
				shape = layer.shape;

			for (let i = 0; i < len; i++) {
				if (Math.random() < this.mutationRate) {
					val[i] += rand.normFloat64() * this.mutationScale;
				}
			}
			this.wHidden.set(i, sm.tensor(val).reshape(shape));
		}

		// also mutate output layer
		const val = this.wOut.valueOf(),
			len = val.length,
			shape = this.wOut.shape;

		for (let i = 0; i < len; i++) {
			if (Math.random() < this.mutationRate) {
				val[i] += rand.normFloat64() * this.mutationScale;
			}
		}
		this.wOut = sm.tensor(val).reshape(shape);
	}

	public copy() {
		const copy = new NeuralNet(this.config, this.mutationRate, this.mutationScale);
		// weights & bias
		for (let i = 0; i < this.config.hiddenLayers; i++) {
			copy.wHidden.set(i, this.wHidden.get(i).copy());
			copy.bHidden.set(i, this.bHidden.get(i).copy());
		}
		// outputs
		copy.wOut = this.wOut.copy();
		copy.bOut = this.bOut.copy();
		return copy;
	}

	public setMutation(mutationRate: number, mutationScale: number) {
		this.mutationRate = mutationRate;
		this.mutationScale = mutationScale;
	}

	public predict(x: sm.Tensor) {
		// inputs
		let hiddenLayerInput = x.matmul(this.wHidden.get(0));
		let [tempRows, tempCols] = hiddenLayerInput.shape;
		hiddenLayerInput = hiddenLayerInput.add(this.bHidden.get(0));

		const inputActivations = sm.leakyRelu(hiddenLayerInput);

		// hidden layers
		let last = inputActivations.copy();
		for (let i = 1; i < this.config.hiddenLayers; i++) {
			const hiddenLayerInput = last.matmul(this.wHidden.get(i)).add(this.bHidden.get(i));
			last = sm.leakyRelu(hiddenLayerInput);
		}

		// output
		let outputLayerInput = last.matmul(this.wOut);
		[tempRows, tempCols] = outputLayerInput.shape;
		const addBOut = (row: number, col: number) => {
			outputLayerInput = outputLayerInput.indexedAssign(
				outputLayerInput.index([row, col]).add(this.bOut.index([0, col])),
				[row, col]
			);
		};
		for (let i = 0; i < tempRows; i++) {
			for (let j = 0; j < tempCols; j++) {
				addBOut(i, j);
			}
		}
		return sm.leakyRelu(outputLayerInput);
	}
}
