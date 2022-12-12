export type CandleData = {
	openTime: number;
	low: number;
	high: number;
	open: number;
	close: number;
	volume: number;
};

type RawCandleData = [number, number, number, number, number, number];
