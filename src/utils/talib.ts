type MoneyFlow = { positive: number | null; negative: number | null };

export const Mfi = (
	inHigh: number[],
	inLow: number[],
	inClose: number[],
	inVolume: number[],
	inTimePeriod: number
) => {
	const outReal: number[] = new Array(inClose.length).fill(0),
		mflow = Array.from({ length: inTimePeriod }, () => <MoneyFlow>{});

	let mflowIdx = 0,
		maxIdxMflow = inTimePeriod - 1;

	maxIdxMflow = inTimePeriod - 1;

	const lookbackTotal = inTimePeriod,
		startIdx = lookbackTotal;

	let outIdx = startIdx,
		today = startIdx - lookbackTotal,
		prevValue = (inHigh[today] + inLow[today] + inClose[today]) / 3.0,
		posSumMF = 0.0,
		negSumMF = 0.0;

	today++;
	for (let i = inTimePeriod; i > 0; i--) {
		let tempValue1 = (inHigh[today] + inLow[today] + inClose[today]) / 3.0;
		const tempValue2 = tempValue1 - prevValue;
		prevValue = tempValue1;
		tempValue1 *= inVolume[today];
		today++;
		if (tempValue2 < 0) {
			mflow[mflowIdx].negative = tempValue1;
			negSumMF += tempValue1;
			mflow[mflowIdx].positive = 0.0;
		} else if (tempValue2 > 0) {
			mflow[mflowIdx].positive = tempValue1;
			posSumMF += tempValue1;
			mflow[mflowIdx].negative = 0.0;
		} else {
			mflow[mflowIdx].positive = 0.0;
			mflow[mflowIdx].negative = 0.0;
		}
		mflowIdx++;
		if (mflowIdx > maxIdxMflow) mflowIdx = 0;
	}
	if (today > startIdx) {
		const tempValue1 = posSumMF + negSumMF;
		if (!(tempValue1 < 1.0)) {
			outReal[outIdx] = 100.0 * (posSumMF / tempValue1);
			outIdx++;
		}
	} else {
		while (today < startIdx) {
			posSumMF -= mflow[mflowIdx].positive;
			negSumMF -= mflow[mflowIdx].negative;
			let tempValue1 = (inHigh[today] + inLow[today] + inClose[today]) / 3.0;
			const tempValue2 = tempValue1 - prevValue;
			prevValue = tempValue1;
			tempValue1 *= inVolume[today];
			today++;
			if (tempValue2 < 0) {
				mflow[mflowIdx].negative = tempValue1;
				negSumMF += tempValue1;
				mflow[mflowIdx].positive = 0.0;
			} else if (tempValue2 > 0) {
				mflow[mflowIdx].positive = tempValue1;
				posSumMF += tempValue1;
				mflow[mflowIdx].negative = 0.0;
			} else {
				mflow[mflowIdx].positive = 0.0;
				mflow[mflowIdx].negative = 0.0;
			}
			mflowIdx++;
			if (mflowIdx > maxIdxMflow) mflowIdx = 0;
		}
	}
	while (today < inClose.length) {
		posSumMF -= mflow[mflowIdx].positive;
		negSumMF -= mflow[mflowIdx].negative;
		let tempValue1 = (inHigh[today] + inLow[today] + inClose[today]) / 3.0;
		const tempValue2 = tempValue1 - prevValue;
		prevValue = tempValue1;
		tempValue1 *= inVolume[today];
		today++;
		if (tempValue2 < 0) {
			mflow[mflowIdx].negative = tempValue1;
			negSumMF += tempValue1;
			mflow[mflowIdx].positive = 0.0;
		} else if (tempValue2 > 0) {
			mflow[mflowIdx].positive = tempValue1;
			posSumMF += tempValue1;
			mflow[mflowIdx].negative = 0.0;
		} else {
			mflow[mflowIdx].positive = 0.0;
			mflow[mflowIdx].negative = 0.0;
		}
		tempValue1 = posSumMF + negSumMF;
		if (tempValue1 < 1.0) {
			outReal[outIdx] = 0.0;
		} else {
			outReal[outIdx] = 100.0 * (posSumMF / tempValue1);
		}
		outIdx++;
		mflowIdx++;
		if (mflowIdx > maxIdxMflow) mflowIdx = 0;
	}
	return outReal;
};

export const Macd = (
	inReal: number[],
	inFastPeriod: number,
	inSlowPeriod: number,
	inSignalPeriod: number
) => {
	if (inSlowPeriod < inFastPeriod) {
		const tempSlow = inSlowPeriod,
			tempFast = inFastPeriod;
		inSlowPeriod = tempFast;
		inFastPeriod = tempSlow;
	}

	let k1 = 0.0,
		k2 = 0.0;
	if (inSlowPeriod != 0) {
		k1 = 2.0 / (inSlowPeriod + 1);
	} else {
		inSlowPeriod = 26;
		k1 = 0.075;
	}
	if (inFastPeriod != 0) {
		k2 = 2.0 / (inFastPeriod + 1);
	} else {
		inFastPeriod = 12;
		k2 = 0.15;
	}

	const lookbackSignal = inSignalPeriod - 1;
	let lookbackTotal = lookbackSignal;
	lookbackTotal += inSlowPeriod - 1;

	const fastEMABuffer = ema(inReal, inFastPeriod, k2);
	const slowEMABuffer = ema(inReal, inSlowPeriod, k1);
	for (let i = 0; i < fastEMABuffer.length; i++) {
		fastEMABuffer[i] = fastEMABuffer[i] - slowEMABuffer[i];
	}

	const outMACD: number[] = new Array(inReal.length).fill(0);
	for (let i = lookbackTotal - 1; i < fastEMABuffer.length; i++) {
		outMACD[i] = fastEMABuffer[i];
	}
	const outMACDSignal = ema(outMACD, inSignalPeriod, 2.0 / (inSignalPeriod + 1));

	const outMACDHist: number[] = new Array(inReal.length).fill(0);
	for (let i = lookbackTotal; i < outMACDHist.length; i++) {
		outMACDHist[i] = outMACD[i] - outMACDSignal[i];
	}
	return { outMACD, outMACDSignal, outMACDHist };
};

export const Sma = (inReal: number[], inTimePeriod: number) => {
	const outReal: number[] = new Array(inReal.length).fill(0),
		lookbackTotal = inTimePeriod - 1,
		startIdx = lookbackTotal;
	let periodTotal = 0.0,
		trailingIdx = startIdx - lookbackTotal,
		i = trailingIdx;

	if (inTimePeriod > 1) {
		while (i < startIdx) {
			periodTotal += inReal[i];
			i++;
		}
	}

	let outIdx = startIdx;
	do {
		periodTotal += inReal[i];
		const tempReal = periodTotal;
		periodTotal -= inReal[trailingIdx];
		outReal[outIdx] = tempReal / inTimePeriod;
		trailingIdx++;
		i++;
		outIdx++;
	} while (i < outReal.length);
	return outReal;
};

const Var = (inReal: number[], inTimePeriod: number) => {
	const outReal: number[] = new Array(inReal.length).fill(0),
		nbInitialElementNeeded = inTimePeriod - 1,
		startIdx = nbInitialElementNeeded;

	let periodTotal1 = 0.0,
		periodTotal2 = 0.0,
		trailingIdx = startIdx - nbInitialElementNeeded,
		i = trailingIdx;

	if (inTimePeriod > 1) {
		while (i < startIdx) {
			let tempReal = inReal[i];
			periodTotal1 += tempReal;
			tempReal *= tempReal;
			periodTotal2 += tempReal;
			i++;
		}
	}

	let outIdx = startIdx;
	do {
		let tempReal = inReal[i];
		periodTotal1 += tempReal;
		tempReal *= tempReal;
		periodTotal2 += tempReal;
		const meanValue1 = periodTotal1 / inTimePeriod;
		const meanValue2 = periodTotal2 / inTimePeriod;
		tempReal = inReal[trailingIdx];
		periodTotal1 -= tempReal;
		tempReal *= tempReal;
		periodTotal2 -= tempReal;
		outReal[outIdx] = meanValue2 - meanValue1 * meanValue1;
		i++;
		trailingIdx++;
		outIdx++;
	} while (i < inReal.length);
	return outReal;
};

const StdDev = (inReal: number[], inTimePeriod: number, inNbDev: number) => {
	const outReal = Var(inReal, inTimePeriod);
	if (inNbDev != 1) {
		for (let i = 0; i < inReal.length; i++) {
			const tempReal = outReal[i];
			if (!(tempReal < 0.00000000000001)) {
				outReal[i] = Math.sqrt(tempReal) * inNbDev;
			} else {
				outReal[i] = 0.0;
			}
		}
	} else {
		for (let i = 0; i < inReal.length; i++) {
			const tempReal = outReal[i];
			if (!(tempReal < 0.00000000000001)) {
				outReal[i] = Math.sqrt(tempReal);
			} else {
				outReal[i] = 0.0;
			}
		}
	}
	return outReal;
};

export const Cci = (inHigh: number[], inLow: number[], inClose: number[], inTimePeriod: number) => {
	const outReal: number[] = new Array(inClose.length).fill(0),
		lookbackTotal = inTimePeriod - 1,
		startIdx = lookbackTotal,
		circBuffer: number[] = new Array(inTimePeriod).fill(0),
		maxIdxCircBuffer = inTimePeriod - 1;

	let i = startIdx - lookbackTotal,
		circBufferIdx = 0;

	if (inTimePeriod > 1) {
		while (i < startIdx) {
			circBuffer[circBufferIdx] = (inHigh[i] + inLow[i] + inClose[i]) / 3;
			i++;
			circBufferIdx++;
			if (circBufferIdx > maxIdxCircBuffer) circBufferIdx = 0;
		}
	}

	let outIdx = inTimePeriod - 1;
	while (i < inClose.length) {
		const lastValue = (inHigh[i] + inLow[i] + inClose[i]) / 3;
		circBuffer[circBufferIdx] = lastValue;
		let theAverage = 0.0;
		for (let j = 0; j < inTimePeriod; j++) {
			theAverage += circBuffer[j];
		}

		theAverage /= inTimePeriod;
		let tempReal2 = 0.0;
		for (let j = 0; j < inTimePeriod; j++) {
			tempReal2 += Math.abs(circBuffer[j] - theAverage);
		}
		const tempReal = lastValue - theAverage;
		if (tempReal != 0.0 && tempReal2 != 0.0) {
			outReal[outIdx] = tempReal / (0.015 * (tempReal2 / inTimePeriod));
		} else {
			outReal[outIdx] = 0.0;
		}
		{
			circBufferIdx++;
			if (circBufferIdx > maxIdxCircBuffer) {
				circBufferIdx = 0;
			}
		}
		outIdx++;
		i++;
	}
	return outReal;
};

export const BBands = (
	inReal: number[],
	inTimePeriod: number,
	inNbDevUp: number,
	inNbDevDn: number,
	inMaType: number
) => {
	const bbands = <{ upperBand: number[]; middleBand: number[]; lowerBand: number[] }>{
		upperBand: new Array(inReal.length).fill(0),
		middleBand: Ma(inReal, inTimePeriod, inMaType),
		lowerBand: new Array(inReal.length).fill(0)
	};

	const tempBuffer2 = StdDev(inReal, inTimePeriod, 1.0);

	if (inNbDevUp == inNbDevDn) {
		if (inNbDevUp == 1.0) {
			for (let i = 0; i < inReal.length; i++) {
				const tempReal = tempBuffer2[i];
				const tempReal2 = bbands.middleBand[i];
				bbands.upperBand[i] = tempReal2 + tempReal;
				bbands.lowerBand[i] = tempReal2 - tempReal;
			}
		} else {
			for (let i = 0; i < inReal.length; i++) {
				const tempReal = tempBuffer2[i] * inNbDevUp;
				const tempReal2 = bbands.middleBand[i];
				bbands.upperBand[i] = tempReal2 + tempReal;
				bbands.lowerBand[i] = tempReal2 - tempReal;
			}
		}
	} else if (inNbDevUp == 1.0) {
		for (let i = 0; i < inReal.length; i++) {
			const tempReal = tempBuffer2[i];
			const tempReal2 = bbands.middleBand[i];
			bbands.upperBand[i] = tempReal2 + tempReal;
			bbands.lowerBand[i] = tempReal2 - tempReal * inNbDevDn;
		}
	} else if (inNbDevDn == 1.0) {
		for (let i = 0; i < inReal.length; i++) {
			const tempReal = tempBuffer2[i];
			const tempReal2 = bbands.middleBand[i];
			bbands.lowerBand[i] = tempReal2 - tempReal;
			bbands.upperBand[i] = tempReal2 + tempReal * inNbDevUp;
		}
	} else {
		for (let i = 0; i < inReal.length; i++) {
			const tempReal = tempBuffer2[i];
			const tempReal2 = bbands.middleBand[i];
			bbands.upperBand[i] = tempReal2 + tempReal * inNbDevUp;
			bbands.lowerBand[i] = tempReal2 - tempReal * inNbDevDn;
		}
	}
	return bbands;
};

export const ema = (inReal: number[], inTimePeriod: number, k1: number) => {
	const outReal: number[] = new Array(inReal.length).fill(0),
		lookbackTotal = inTimePeriod - 1,
		startIdx = lookbackTotal;

	let today = startIdx - lookbackTotal,
		i = inTimePeriod,
		tempReal = 0.0;

	while (i > 0) {
		tempReal += inReal[today];
		today++;
		i--;
	}

	let prevMA = tempReal / inTimePeriod;
	while (today <= startIdx) {
		prevMA = (inReal[today] - prevMA) * k1 + prevMA;
		today++;
	}
	outReal[startIdx] = prevMA;
	let outIdx = startIdx + 1;
	while (today < inReal.length) {
		prevMA = (inReal[today] - prevMA) * k1 + prevMA;
		outReal[outIdx] = prevMA;
		today++;
		outIdx++;
	}
	return outReal;
};

export const Ema = (inReal: number[], inTimePeriod: number) => {
	const k = 2.0 / (inTimePeriod + 1);
	return ema(inReal, inTimePeriod, k);
};

const Ma = (inReal, inTimePeriod, inMAType) => {
	let outReal = new Array(inReal.length).fill(0);
	if (inTimePeriod == 1) {
		outReal = [...inReal];
		return outReal;
	}
	switch (inMAType) {
		case 0: //SMA
			outReal = Sma(inReal, inTimePeriod);
			break;
		case 1: //EMA
			outReal = Ema(inReal, inTimePeriod);
			break;
		/*case 2: //WMA
			outReal = Wma(inReal, inTimePeriod);
			break;
		case 3: //DEMA
			outReal = Dema(inReal, inTimePeriod);
			break;
		case 4: //TEMA
			outReal = Tema(inReal, inTimePeriod);
			break;
		case 5: //TRIMA
			outReal = Trima(inReal, inTimePeriod);
			break;
		case 6: //KAMA
			outReal = Kama(inReal, inTimePeriod);
			break;
		case 7: //MAMA
			let [tempOutReal,] = Mama(inReal, 0.5, 0.05);
			break;
    */
		default:
			outReal = Sma(inReal, inTimePeriod);
	}
	return outReal;
};
