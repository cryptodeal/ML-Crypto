import { dlopen, FFIType, ptr, suffix } from 'bun:ffi';

const {
	symbols: {
		randFloat32,
		randNormFloat32,
		randFloat64,
		randNormFloat64,
		randInt8,
		randInt16,
		randInt32,
		randInt64,
		randUint8,
		randUint16,
		randUint32,
		randUint64,
		randFloat32Array,
		randExpFloat32Array,
		randNormFloat32Array,
		randFloat64Array,
		randExpFloat64Array,
		randNormFloat64Array,
		randInt8Array,
		randInt16Array,
		randInt32Array,
		randInt64Array,
		randUint8Array,
		randUint16Array,
		randUint32Array,
		randUint64Array,
		seed: _seed,
		isSeeded: _isSeeded
	}
} = dlopen(import.meta.dir + `/librndFloat.${suffix}`, {
	randFloat32: {
		returns: FFIType.f32
	},
	randNormFloat32: {
		returns: FFIType.f32
	},
	randFloat64: {
		returns: FFIType.f64
	},
	randNormFloat64: {
		returns: FFIType.f64
	},
	randInt8: {
		returns: FFIType.i8
	},
	randInt16: {
		returns: FFIType.i16
	},
	randInt32: {
		returns: FFIType.i32
	},
	randInt64: {
		returns: FFIType.i64_fast
	},
	randUint8: {
		returns: FFIType.u8
	},
	randUint16: {
		returns: FFIType.u16
	},
	randUint32: {
		returns: FFIType.u32
	},
	randUint64: {
		returns: FFIType.u64
	},
	randFloat32Array: {
		args: [FFIType.ptr, FFIType.u64]
	},
	randNormFloat32Array: {
		args: [FFIType.ptr, FFIType.u64]
	},
	randExpFloat32Array: {
		args: [FFIType.ptr, FFIType.u64]
	},
	randFloat64Array: {
		args: [FFIType.ptr, FFIType.u64]
	},
	randNormFloat64Array: {
		args: [FFIType.ptr, FFIType.u64]
	},
	randExpFloat64Array: {
		args: [FFIType.ptr, FFIType.u64]
	},
	randInt8Array: {
		args: [FFIType.ptr, FFIType.u64]
	},
	randInt16Array: {
		args: [FFIType.ptr, FFIType.u64]
	},
	randInt32Array: {
		args: [FFIType.ptr, FFIType.u64]
	},
	randInt64Array: {
		args: [FFIType.ptr, FFIType.u64]
	},
	randUint8Array: {
		args: [FFIType.ptr, FFIType.u64]
	},
	randUint16Array: {
		args: [FFIType.ptr, FFIType.u64]
	},
	randUint32Array: {
		args: [FFIType.ptr, FFIType.u64]
	},
	randUint64Array: {
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

export const float32 = () => randFloat32.native();

export const normFloat32 = () => randNormFloat64.native();

export const float64 = () => randFloat64.native();

export const normFloat64 = () => randNormFloat32.native();

export const int8 = () => randInt8.native();

export const int16 = () => randInt16.native();

export const int32 = () => randInt32.native();

export const int64 = () => randInt64.native();

export const uint8 = () => randUint8.native();

export const uint16 = () => randUint16.native();

export const uint32 = () => randUint32.native();

export const uint64 = () => randUint64.native();

export const float32Array = (v: number | Float32Array) => {
	const usedArr =
		v instanceof Float32Array || v.constructor === Float32Array ? v : new Float32Array(v);
	randFloat32Array.native(ptr(usedArr), BigInt(usedArr.length));
	return usedArr;
};

export const normFloat32Array = (v: number | Float32Array) => {
	const usedArr =
		v instanceof Float32Array || v.constructor === Float32Array ? v : new Float32Array(v);
	randNormFloat32Array.native(ptr(usedArr), BigInt(usedArr.length));
	return usedArr;
};

export const expFloat32Array = (v: number | Float32Array) => {
	const usedArr =
		v instanceof Float32Array || v.constructor === Float32Array ? v : new Float32Array(v);
	randExpFloat32Array.native(ptr(usedArr), BigInt(usedArr.length));
	return usedArr;
};

export const float64Array = (v: number | Float64Array) => {
	const usedArr =
		v instanceof Float64Array || v.constructor === Float64Array ? v : new Float64Array(v);
	randFloat64Array.native(ptr(usedArr), BigInt(usedArr.length));
	return usedArr;
};

export const normFloat64Array = (v: number | Float64Array) => {
	const usedArr =
		v instanceof Float64Array || v.constructor === Float64Array ? v : new Float64Array(v);
	randNormFloat64Array.native(ptr(usedArr), BigInt(usedArr.length));
	return usedArr;
};

export const expFloat64Array = (v: number | Float64Array) => {
	const usedArr =
		v instanceof Float64Array || v.constructor === Float64Array ? v : new Float64Array(v);
	randExpFloat64Array.native(ptr(usedArr), BigInt(usedArr.length));
	return usedArr;
};

export const int8Array = (v: number | Int8Array) => {
	const usedArr = v instanceof Int8Array || v.constructor === Int8Array ? v : new Int8Array(v);
	randInt8Array.native(ptr(usedArr), BigInt(usedArr.length));
	return usedArr;
};

export const int16Array = (v: number | Int16Array) => {
	const usedArr = v instanceof Int16Array || v.constructor === Int16Array ? v : new Int16Array(v);
	randInt16Array.native(ptr(usedArr), BigInt(usedArr.length));
	return usedArr;
};

export const int32Array = (v: number | Int32Array) => {
	const usedArr = v instanceof Int32Array || v.constructor === Int32Array ? v : new Int32Array(v);
	randInt32Array.native(ptr(usedArr), BigInt(usedArr.length));
	return usedArr;
};

export const int64Array = (v: number | BigInt64Array) => {
	const usedArr =
		v instanceof BigInt64Array || v.constructor === BigInt64Array ? v : new BigInt64Array(v);
	randInt64Array.native(ptr(usedArr), BigInt(usedArr.length));
	return usedArr;
};

export const uint8Array = (v: number | Uint8Array) => {
	const usedArr = v instanceof Uint8Array || v.constructor === Uint8Array ? v : new Uint8Array(v);
	randUint8Array.native(ptr(usedArr), BigInt(usedArr.length));
	return usedArr;
};

export const uint16Array = (v: number | Uint16Array) => {
	const usedArr =
		v instanceof Uint16Array || v.constructor === Uint16Array ? v : new Uint16Array(v);
	randUint16Array.native(ptr(usedArr), BigInt(usedArr.length));
	return usedArr;
};

export const uint32Array = (v: number | Uint32Array) => {
	const usedArr =
		v instanceof Uint32Array || v.constructor === Uint32Array ? v : new Uint32Array(v);
	randUint32Array.native(ptr(usedArr), BigInt(usedArr.length));
	return usedArr;
};

export const uint64Array = (v: number | BigUint64Array) => {
	const usedArr =
		v instanceof BigUint64Array || v.constructor === BigUint64Array ? v : new BigUint64Array(v);
	randUint64Array.native(ptr(usedArr), BigInt(usedArr.length));
	return usedArr;
};
