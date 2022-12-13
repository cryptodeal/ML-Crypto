import * as sm from '@shumai/shumai';
import { scaler, talib } from '@utils';

export const calcTA = (
	closes: number[],
	highs: number[],
	lows: number[],
	volumes: number[]
	// testSize: number
) => {
	let values: number[],
		signalCnt = 0;

	// Money Flow Index (invert signal)
	const mfi = talib.Mfi(highs, lows, closes, volumes, 16);
	for (let i = 0; i < mfi.length; i++) {
		mfi[i] = 100 - mfi[i];
	}
	values = [...mfi];
	signalCnt++;

	// MACD histogram
	const { outMACDHist } = talib.Macd(closes, 12, 24, 9);
	values = [...values, ...outMACDHist];
	signalCnt++;

	// Moving average (diff from close)
	const ma = talib.Sma(closes, 175);
	for (let i = 0; i < ma.length; i++) {
		ma[i] = closes[i] - ma[i];
	}
	values = [...values, ...ma];
	signalCnt++;

	// BB
	const { upperBand, lowerBand } = talib.BBands(closes, 40, 2, 2, 0);
	for (let i = 0; i < upperBand.length; i++) {
		upperBand[i] = closes[i] - upperBand[i];
		lowerBand[i] = closes[i] - lowerBand[i];
	}
	values = [...values, ...upperBand, ...lowerBand];
	signalCnt += 2;

	// CCI (invert)
	const cci = talib.Cci(highs, lows, closes, 17);
	for (let i = 0; i < cci.length; i++) {
		cci[i] = -1 * cci[i];
	}
	values = [...values, ...cci];
	signalCnt++;
	const transposed = sm.tensor(new Float64Array(values)).reshape([signalCnt, closes.length]).T();
	const denseInputs = transposed.deepCopy();

	// Split test and train
	const [nSamples, nFeatures] = denseInputs.shape;
	const splitIdx = nSamples / 2;
	let xTrain = sm
		.tensor(new Float64Array(splitIdx * nFeatures).fill(0))
		.reshape([splitIdx, nFeatures]);
	let xTest = sm
		.tensor(new Float64Array((nSamples - splitIdx) * nFeatures).fill(0))
		.reshape([nSamples - splitIdx, nFeatures]);

	for (let i = 0; i < nSamples; i++) {
		const rowToCopy = denseInputs.index([i, ':']);
		if (i < splitIdx) {
			xTrain = xTrain.indexedAssign(rowToCopy, [i, ':']);
		} else {
			xTest = xTest.indexedAssign(rowToCopy, [i - splitIdx, ':']);
		}
	}

	const tmpScaler = new scaler.StandardScaler();
	tmpScaler.fit(xTrain);
	return { xTrain: tmpScaler.transform(xTrain), xTest: tmpScaler.transform(xTest) };
};
