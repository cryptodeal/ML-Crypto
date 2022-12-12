import { constants } from '@utils';
import { CandleData, RawCandleData } from './types';

const { CandleGranularity, Time, API_Data } = constants;

const candle_endpoint = 'https://api.exchange.coinbase.com/products/';

const getISODate = (date: number) => new Date(date).toISOString();

export const loadTradingData = async (start: number) => {
	const granularity = CandleGranularity.FIFTEEN_MIN;
	const end = Date.now();
	const closes: number[] = [];
	const volumes: number[] = [];
	const highs: number[] = [];
	const lows: number[] = [];
	console.log('Loading historical trading data');
	while (start < end) {
		let usedEnd = start + Time.MINUTE * 15 * 300;
		if (usedEnd > end) usedEnd = end;
		const url =
			candle_endpoint +
			'ETH-USD' +
			API_Data.CANDLES +
			'?start=' +
			getISODate(start) +
			'&end=' +
			getISODate(usedEnd) +
			'&granularity=' +
			granularity;
		const ticks = await fetch(url, {
			method: 'GET',
			headers: {
				accept: 'application/json'
			}
		})
			.then((res) => <Promise<RawCandleData[]>>res.json())
			.then((data) =>
				data.map((d) => {
					const [openTime, low, high, open, close, volume] = d;
					return <CandleData>{ openTime, low, high, open, close, volume };
				})
			)
			.then((d) => d.sort((a, b) => a.openTime - b.openTime));
		if (!ticks.length) break;
		ticks.map((tick) => {
			const { close, high, low, volume } = tick;
			closes.push(close);
			volumes.push(volume);
			highs.push(high);
			lows.push(low);
		});
		start = ticks[ticks.length - 1].openTime * 1000 + Time.MINUTE * 15;
	}
	console.log(`Returning ${closes.length} candles\n`);
	return { closes, volumes, highs, lows };
};
