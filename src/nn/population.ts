import { NeuralNet, NeuralNetConfig } from '.';

export const generatePopulation = (
	opts: NeuralNetConfig,
	mutationRate: number,
	mutationScale: number,
	size: number
) => {
	const population: Map<number, NeuralNet> = new Map();
	for (let i = 0; i < size; i++) {
		const net = new NeuralNet(opts, mutationRate, mutationScale);
		net.init();
		population.set(i, net);
	}
	return population;
};

/**
 * `poolSelection` normalizes scores and returns
 * model indexes selected by the pooling algorithm.
 * Models with higher fitness scores will have a
 * higher chance of selection.
 */

export const poolSelection = (fitnessScores: number[]) => {
	const populationSize = fitnessScores.length,
		selectedIndexes: number[] = new Array(populationSize);

	// square all scores first
	const squared = fitnessScores.map((v) => {
		const out = v ** 2;
		if (v < 0) {
			return out * -1;
		}
		return out;
	});

	// find min and max to normalize scores
	let min = Infinity,
		max = -Infinity,
		maxIdx = 0;
	for (let i = 0; i < populationSize; i++) {
		const score = squared[i];
		min = Math.min(min, score);
		if (score > max) {
			maxIdx = i;
			max = score;
		}
	}

	// keep the best model
	selectedIndexes[0] = maxIdx;

	// all scores are the same
	const normalizedScores: number[] = new Array(populationSize);
	if (min == max) {
		const newScore = 1 / populationSize;
		for (let i = 0; i < populationSize; i++) {
			normalizedScores[i] = newScore;
		}
	} else {
		let sum = 0;
		// subtract min from the array
		for (let i = 0; i < populationSize; i++) {
			normalizedScores[i] = squared[i] - min;
			sum += normalizedScores[i];
		}

		// divide by the sum
		for (let i = 0; i < populationSize; i++) {
			normalizedScores[i] /= sum;
		}
	}

	// pool selection
	for (let i = 0; i < populationSize; i++) {
		let index = 0,
			count = 0;

		// select proportionate fitness
		const r = Math.random();
		while (count < r && index < populationSize) {
			count += normalizedScores[index];
			index++;
		}
		selectedIndexes[i] = index - 1;
	}
	return selectedIndexes;
};

export const createNewPopulation = (indexes: number[], lastGen: Map<number, NeuralNet>) => {
	const newPopulation: Map<number, NeuralNet> = new Map(),
		popSize = indexes.length;
	for (let i = 0; i < popSize; i++) {
		const index = indexes[i];
		newPopulation.set(i, lastGen.get(index).copy());
		// do not mutate previous best
		if (i !== 0) {
			newPopulation[i].mutate();
		}
	}
	return newPopulation;
};
