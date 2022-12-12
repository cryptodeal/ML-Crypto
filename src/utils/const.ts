export enum API_Data {
	CANDLES = '/candles'
}

export enum Time {
	SECOND = 1000,
	MINUTE = 60 * SECOND,
	HOUR = 60 * MINUTE,
	DAY = 24 * HOUR
}

export enum CandleGranularity {
	ONE_MIN = 60,
	FIVE_MIN = 300,
	FIFTEEN_MIN = 900,
	ONE_HR = 3600,
	SIX_HR = 21600,
	OBE_DAY = 86400
}
