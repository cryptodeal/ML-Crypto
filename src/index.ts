import { constants } from '@utils';
import * as dayjs from 'dayjs';
import { loadTradingData } from './data';
import { calcTA } from './features/ta';
import { NeuralNetConfig } from './nn';
import * as nn from './nn/population';
import * as simulation from './simulation/trading';
import { Time } from './utils/const';
const main = async () => {
	// load candles and TA
	const candleStart = Date.now() - constants.Time.DAY * 30;
	const tradingData = await loadTradingData(candleStart);
	const { volumes, highs, lows } = tradingData;
	let { closes } = tradingData;

	const { xTrain: inputs, xTest: inputsTest } = calcTA(closes, highs, lows, volumes);
	// Split closes to match x and x_test
	const [rows, c] = inputs.shape,
		closesTest = closes.slice(rows);
	closes = closes.slice(0, rows);

	const benchmark = (closes[closes.length - 1] / closes[0] - 1) * 100,
		benchTest = (closesTest[closesTest.length - 1] / closesTest[0] - 1) * 100,
		// TODO: concurrentSims = 3,
		episodes = 100000,
		populationSize = 350,
		decayInterval = 50,
		config: NeuralNetConfig = {
			inputNeurons: c,
			hiddenNeurons: 32,
			hiddenLayers: 2,
			outputNeurons: 2
		};

	let population = nn.generatePopulation(config, 0.15, 0.1, populationSize);
	const start = Date.now();
	for (let i = 0; i < episodes; i++) {
		// scale back mutation
		if (i % decayInterval == 0) {
			for (const [, model] of population) {
				model.setMutation(
					Math.max(0.02, model.mutationRate - 0.005),
					Math.max(0.01, model.mutationRate - 0.005)
				);
			}
		}
		const fitness: number[] = new Array(populationSize);

		for (const [j, model] of population) {
			fitness[j] = simulation.runSimulation(model, inputs, closes);
			console.log(`model ${j + 1}: ${fitness[j]}`);
		}
		const nextGenIndexes = nn.poolSelection(fitness);
		population = nn.createNewPopulation(nextGenIndexes, population);

		let max = -Infinity,
			maxIdx = 0;
		for (let j = 0; j < populationSize; j++) {
			const score = fitness[j];
			if (score > max) {
				maxIdx = j;
				max = score;
			}
		}

		// test best model on test data
		const testResult = simulation.runSimulation(population.get(maxIdx), inputsTest, closesTest);
		const elapsed = Date.now() - start;
		console.log(
			`${dayjs().format('MM-DD-YYYY HH:mm:ss')}\t${elapsed / Time.SECOND}sec\tEpisode: ${String(
				i
			).padStart(4, '0')}\tReturn: ${max.toFixed(3)}\tBenchmark: ${benchmark.toFixed(
				3
			)}\tTest Return: ${testResult.toFixed(3)}\tBenchmark Test: ${benchTest.toFixed(3)}`
		);
	}
	const elapsed = Date.now() - start;
	console.log(`Execution time ${elapsed / Time.SECOND}sec`);
};

await main();
