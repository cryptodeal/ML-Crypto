import { rand } from '@ffi';
import { describe, expect, it } from 'bun:test';
describe('FFI `rand`', () => {
	it('seeds default PRNG - `Xoshiro256`', () => {
		expect(rand.isSeeded()).toBe(false);
		rand.seed(Date.now());
		expect(rand.isSeeded()).toBe(true);
	});
	it('generates random float32', () => {
		for (let i = 0; i < 100; i++) {
			const random = rand.float32();
			expect(typeof random).toBe('number');
		}
	});
	it('generates random normal float32', () => {
		for (let i = 0; i < 100; i++) {
			const random = rand.normFloat32();
			expect(typeof random).toBe('number');
		}
	});
	it('generates random float64', () => {
		for (let i = 0; i < 100; i++) {
			const random = rand.float64();
			expect(typeof random).toBe('number');
		}
	});
	it('generates random normal float64', () => {
		for (let i = 0; i < 100; i++) {
			const random = rand.normFloat64();
			expect(typeof random).toBe('number');
		}
	});
	it('generates random int8', () => {
		for (let i = 0; i < 100; i++) {
			const random = rand.int8();
			expect(typeof random).toBe('number');
		}
	});
	it('generates random int16', () => {
		for (let i = 0; i < 100; i++) {
			const random = rand.int16();
			expect(typeof random).toBe('number');
		}
	});
	it('generates random int32', () => {
		for (let i = 0; i < 100; i++) {
			const random = rand.int32();
			expect(typeof random).toBe('number');
		}
	});
	it('generates random int64', () => {
		for (let i = 0; i < 100; i++) {
			const random = rand.int64();
			expect(typeof random == 'bigint' || typeof random == 'number').toBe(true);
		}
	});
	it('generates random uint8', () => {
		for (let i = 0; i < 100; i++) {
			const random = rand.uint8();
			expect(typeof random).toBe('number');
		}
	});
	it('generates random uint16', () => {
		for (let i = 0; i < 100; i++) {
			const random = rand.uint16();
			expect(typeof random).toBe('number');
		}
	});
	it('generates random uint32', () => {
		for (let i = 0; i < 100; i++) {
			const random = rand.uint32();
			expect(typeof random).toBe('number');
		}
	});
	it('generates random uint64', () => {
		for (let i = 0; i < 100; i++) {
			const random = rand.uint64();
			expect(typeof random == 'bigint' || typeof random == 'number').toBe(true);
		}
	});

	it('mutate random `Float32Array` ', () => {
		for (let i = 0; i < 100; i++) {
			const arr = rand.float32Array(100);
			for (let j = 0; j < arr.length; j++) {
				expect(typeof arr[j] == 'number').toBe(true);
			}
			expect(arr instanceof Float32Array).toBe(true);
		}

		for (let i = 0; i < 100; i++) {
			const arr = new Float32Array(100);
			rand.float32Array(100);
			for (let j = 0; j < arr.length; j++) {
				expect(typeof arr[j] == 'number').toBe(true);
			}
			expect(arr instanceof Float32Array).toBe(true);
		}
	});

	it('mutate normal random `Float32Array` ', () => {
		for (let i = 0; i < 100; i++) {
			const arr = rand.normFloat32Array(100);
			for (let j = 0; j < arr.length; j++) {
				expect(typeof arr[j] == 'number').toBe(true);
			}
			expect(arr instanceof Float32Array).toBe(true);
		}

		for (let i = 0; i < 100; i++) {
			const arr = new Float32Array(100);
			rand.normFloat32Array(100);
			for (let j = 0; j < arr.length; j++) {
				expect(typeof arr[j] == 'number').toBe(true);
			}
			expect(arr instanceof Float32Array).toBe(true);
		}
	});

	it('mutate exp random `Float32Array` ', () => {
		for (let i = 0; i < 100; i++) {
			const arr = rand.expFloat32Array(100);
			for (let j = 0; j < arr.length; j++) {
				expect(typeof arr[j] == 'number').toBe(true);
			}
			expect(arr instanceof Float32Array).toBe(true);
		}

		for (let i = 0; i < 100; i++) {
			const arr = new Float32Array(100);
			rand.expFloat32Array(100);
			for (let j = 0; j < arr.length; j++) {
				expect(typeof arr[j] == 'number').toBe(true);
			}
			expect(arr instanceof Float32Array).toBe(true);
		}
	});

	it('mutate random `Float64Array` ', () => {
		for (let i = 0; i < 100; i++) {
			const arr = rand.float64Array(100);
			for (let j = 0; j < arr.length; j++) {
				expect(typeof arr[j] == 'number').toBe(true);
			}
			expect(arr instanceof Float64Array).toBe(true);
		}

		for (let i = 0; i < 100; i++) {
			const arr = new Float64Array(100);
			rand.float64Array(100);
			for (let j = 0; j < arr.length; j++) {
				expect(typeof arr[j] == 'number').toBe(true);
			}
			expect(arr instanceof Float64Array).toBe(true);
		}
	});

	it('mutate normal random `Float64Array` ', () => {
		for (let i = 0; i < 100; i++) {
			const arr = rand.normFloat64Array(100);
			for (let j = 0; j < arr.length; j++) {
				expect(typeof arr[j] == 'number').toBe(true);
			}
			expect(arr instanceof Float64Array).toBe(true);
		}

		for (let i = 0; i < 100; i++) {
			const arr = new Float64Array(100);
			rand.normFloat64Array(100);
			for (let j = 0; j < arr.length; j++) {
				expect(typeof arr[j] == 'number').toBe(true);
			}
			expect(arr instanceof Float64Array).toBe(true);
		}
	});

	it('mutate exp random `Float64Array` ', () => {
		for (let i = 0; i < 100; i++) {
			const arr = rand.expFloat64Array(100);
			for (let j = 0; j < arr.length; j++) {
				expect(typeof arr[j] == 'number').toBe(true);
			}
			expect(arr instanceof Float64Array).toBe(true);
		}

		for (let i = 0; i < 100; i++) {
			const arr = new Float64Array(100);
			rand.expFloat64Array(100);
			for (let j = 0; j < arr.length; j++) {
				expect(typeof arr[j] == 'number').toBe(true);
			}
			expect(arr instanceof Float64Array).toBe(true);
		}
	});

	it('mutate underlying data for `Int8Array`', () => {
		for (let i = 0; i < 100; i++) {
			const arr = rand.int8Array(100);
			for (let j = 0; j < arr.length; j++) {
				expect(typeof arr[j] == 'number').toBe(true);
			}
			expect(arr instanceof Int8Array).toBe(true);
		}

		for (let i = 0; i < 100; i++) {
			const arr = new Int8Array(100);
			rand.int8Array(100);
			for (let j = 0; j < arr.length; j++) {
				expect(typeof arr[j] == 'number').toBe(true);
			}
			expect(arr instanceof Int8Array).toBe(true);
		}
	});
	it('mutate underlying data for `Int16Array`', () => {
		for (let i = 0; i < 100; i++) {
			const arr = rand.int16Array(100);
			for (let j = 0; j < arr.length; j++) {
				expect(typeof arr[j] == 'number').toBe(true);
			}
			expect(arr instanceof Int16Array).toBe(true);
		}

		for (let i = 0; i < 100; i++) {
			const arr = new Int16Array(100);
			rand.int16Array(100);
			for (let j = 0; j < arr.length; j++) {
				expect(typeof arr[j] == 'number').toBe(true);
			}
			expect(arr instanceof Int16Array).toBe(true);
		}
	});
	it('mutate underlying data for `Int32Array`', () => {
		for (let i = 0; i < 100; i++) {
			const arr = rand.int32Array(100);
			for (let j = 0; j < arr.length; j++) {
				expect(typeof arr[j] == 'number').toBe(true);
			}
			expect(arr instanceof Int32Array).toBe(true);
		}

		for (let i = 0; i < 100; i++) {
			const arr = new Int32Array(100);
			rand.int32Array(100);
			for (let j = 0; j < arr.length; j++) {
				expect(typeof arr[j] == 'number').toBe(true);
			}
			expect(arr instanceof Int32Array).toBe(true);
		}
	});

	it('mutate underlying data for `BigInt64Array`', () => {
		for (let i = 0; i < 100; i++) {
			const arr = rand.int64Array(100);
			for (let j = 0; j < arr.length; j++) {
				expect(typeof arr[j] == 'bigint' || typeof arr[j] == 'number').toBe(true);
			}
			expect(arr instanceof BigInt64Array).toBe(true);
		}

		for (let i = 0; i < 100; i++) {
			const arr = new BigInt64Array(100);
			rand.int64Array(100);
			for (let j = 0; j < arr.length; j++) {
				expect(typeof arr[j] == 'bigint' || typeof arr[j] == 'number').toBe(true);
			}
			expect(arr instanceof BigInt64Array).toBe(true);
		}
	});

	it('mutate underlying data for `Uint8Array`', () => {
		for (let i = 0; i < 100; i++) {
			const arr = rand.uint8Array(100);
			for (let j = 0; j < arr.length; j++) {
				expect(typeof arr[j] == 'number').toBe(true);
			}
			expect(arr instanceof Uint8Array).toBe(true);
		}

		for (let i = 0; i < 100; i++) {
			const arr = new Uint8Array(100);
			rand.uint8Array(100);
			for (let j = 0; j < arr.length; j++) {
				expect(typeof arr[j] == 'number').toBe(true);
			}
			expect(arr instanceof Uint8Array).toBe(true);
		}
	});

	it('mutate underlying data for `Uint16Array`', () => {
		for (let i = 0; i < 100; i++) {
			const arr = rand.uint16Array(100);
			for (let j = 0; j < arr.length; j++) {
				expect(typeof arr[j] == 'number').toBe(true);
			}
			expect(arr instanceof Uint16Array).toBe(true);
		}

		for (let i = 0; i < 100; i++) {
			const arr = new Uint16Array(100);
			rand.uint16Array(100);
			for (let j = 0; j < arr.length; j++) {
				expect(typeof arr[j] == 'number').toBe(true);
			}
			expect(arr instanceof Uint16Array).toBe(true);
		}
	});

	it('mutate underlying data for `Uint32Array`', () => {
		for (let i = 0; i < 100; i++) {
			const arr = rand.uint32Array(100);
			for (let j = 0; j < arr.length; j++) {
				expect(typeof arr[j] == 'number').toBe(true);
			}
			expect(arr instanceof Uint32Array).toBe(true);
		}

		for (let i = 0; i < 100; i++) {
			const arr = new Uint32Array(100).fill(0);
			rand.uint32Array(100);
			for (let j = 0; j < arr.length; j++) {
				expect(typeof arr[j] == 'number').toBe(true);
			}
			expect(arr instanceof Uint32Array).toBe(true);
		}
	});

	it('mutate underlying data for `BigUint64Array`', () => {
		for (let i = 0; i < 100; i++) {
			const arr = rand.uint64Array(100);
			for (let j = 0; j < arr.length; j++) {
				expect(typeof arr[j] == 'bigint' || typeof arr[j] == 'number').toBe(true);
			}
			expect(arr instanceof BigUint64Array).toBe(true);
		}

		for (let i = 0; i < 100; i++) {
			const arr = new BigUint64Array(100);
			rand.uint64Array(arr);
			for (let j = 0; j < arr.length; j++) {
				expect(typeof arr[j] == 'bigint' || typeof arr[j] == 'number').toBe(true);
			}
			expect(arr instanceof BigUint64Array).toBe(true);
		}
	});
});
