import { dlopen, FFIType, ptr, suffix, toArrayBuffer } from 'bun:ffi';

const {
	symbols: {
		rndNormFloat64: _rndNormFloat64,
		seed: _seed,
		isSeeded: _isSeeded,
		rndNormFloat64Array: _rndNormFloat64Array
	}
} = dlopen(import.meta.dir + `/librndFloat.${suffix}`, {
	rndNormFloat64: {
		returns: FFIType.f64
	},
	seed: {
		args: [FFIType.u64]
	},
	isSeeded: {
		returns: FFIType.bool
	},
	rndNormFloat64Array: {
		args: [FFIType.ptr, FFIType.u64]
	}
});

export const isSeeded = () => _isSeeded.native();
export const seed = (seed: number) => _seed.native(BigInt(seed));
export const normFloat64 = () => _rndNormFloat64.native();
export const normFloat64Array = (v: number | Float64Array) => {
	const f64Array = v instanceof Float64Array ? v : new Float64Array(v);
	_rndNormFloat64Array.native(ptr(f64Array), BigInt(f64Array.length));
	return f64Array;
};
