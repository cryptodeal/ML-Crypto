import { constants } from '@utils';
import { loadTradingData } from './data';
import { calcTA } from './features/ta';

const main = async () => {
	// load candles and TA
	const candleStart = Date.now() - constants.Time.DAY * 30;
	const tradingData = await loadTradingData(candleStart);
	const { volumes, highs, lows } = tradingData;
	let { closes } = await loadTradingData(candleStart);

	const { xTrain: inputs, xTest: inputsTest } = calcTA(closes, highs, lows, volumes);
	// Split closes to match x and x_test
	const [rows, c] = inputs.shape,
		closesTest = closes.slice(rows);
	closes = closes.slice(0, rows);

	const benchmark = (closes[closes.length - 1] / closes[0] - 1) * 100,
		benchTest = (closesTest[closesTest.length - 1] / closesTest[0] - 1) * 100,
		concurrentSims = 3,
		episodes = 100000,
		populationSize = 350,
		decayInterval = 50;
};

await main();
