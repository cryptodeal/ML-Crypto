import { dlopen, FFIType, ptr, suffix } from 'bun:ffi';

const {
	symbols: {
		normFloat32: _rndNormFloat32,
		normFloat64: _rndNormFloat64,
		normFloat32Array: _normFloat32Array,
		normFloat64Array: _normFloat64Array,
		seed: _seed,
		isSeeded: _isSeeded
	}
} = dlopen(import.meta.dir + `/librndFloat.${suffix}`, {
	normFloat32: {
		returns: FFIType.f32
	},
	normFloat64: {
		returns: FFIType.f64
	},
	normFloat32Array: {
		args: [FFIType.ptr, FFIType.u64]
	},
	normFloat64Array: {
		args: [FFIType.ptr, FFIType.u64]
	},
	seed: {
		args: [FFIType.u64]
	},
	isSeeded: {
		returns: FFIType.bool
	}
});

export const isSeeded = () => _isSeeded.native();

export const seed = (seed: number) => _seed.native(BigInt(seed));

export const normFloat64 = () => _rndNormFloat64.native();

export const normFloat32 = () => _rndNormFloat32.native();

export const normFloat64Array = (v: number | Float64Array) => {
	const f64Array =
		v instanceof Float64Array || v.constructor === Float64Array ? v : new Float64Array(v);
	_normFloat64Array.native(ptr(f64Array), BigInt(f64Array.length));
	return f64Array;
};

export const normFloat32Array = (v: number | Float32Array) => {
	const f64Array =
		v instanceof Float32Array || v.constructor === Float32Array ? v : new Float32Array(v);
	_normFloat64Array.native(ptr(f64Array), BigInt(f64Array.length));
	return f64Array;
};
