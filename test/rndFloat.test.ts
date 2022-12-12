import { rand } from '@ffi';
import { describe, expect, it } from 'bun:test';
describe('FFI `rand`', () => {
	it('seeds default PRNG - `Xoshiro256`', () => {
		expect(rand.isSeeded()).toBe(false);
		rand.seed(Date.now());
		expect(rand.isSeeded()).toBe(true);
	});
	it('gen random float32', () => {
		for (let i = 0; i < 100; i++) {
			const random = rand.float32();
			expect(typeof random).toBe('number');
		}
	});
	it('gen random normal float32', () => {
		for (let i = 0; i < 100; i++) {
			const random = rand.normFloat32();
			expect(typeof random).toBe('number');
		}
	});
	it('gen random float64', () => {
		for (let i = 0; i < 100; i++) {
			const random = rand.float64();
			expect(typeof random).toBe('number');
		}
	});
	it('gen random normal float64', () => {
		for (let i = 0; i < 100; i++) {
			const random = rand.normFloat64();
			expect(typeof random).toBe('number');
		}
	});
	it('works to generate random int8', () => {
		for (let i = 0; i < 100; i++) {
			const random = rand.int8();
			expect(typeof random).toBe('number');
		}
	});
	it('works to generate random int16', () => {
		for (let i = 0; i < 100; i++) {
			const random = rand.int16();
			expect(typeof random).toBe('number');
		}
	});
	it('works to generate random int32', () => {
		for (let i = 0; i < 100; i++) {
			const random = rand.int32();
			expect(typeof random).toBe('number');
		}
	});
	it('works to generate random int64', () => {
		for (let i = 0; i < 100; i++) {
			const random = rand.int64();
			expect(typeof random == 'bigint' || typeof random == 'number').toBe(true);
		}
	});
	/*
    it('works to generate random int less than n (port of golang `rand.Intn`', () => {
      for (let i = 0; i < 100; i++) {
        const random = rand.intN(rand.int64());
        expect(typeof random == 'bigint' || typeof random == 'number').toBe(true);
      }
    });
  */
	it('mutate underlying data for `Float32Array`', () => {
		for (let i = 0; i < 100; i++) {
			const arr = rand.normFloat32Array(100);
			expect(arr instanceof Float32Array).toBe(true);
		}
	});
	it('mutate underlying data for `Float64Array`', () => {
		for (let i = 0; i < 100; i++) {
			const arr = rand.normFloat64Array(100);
			expect(arr instanceof Float64Array).toBe(true);
		}
	});
	it('mutate underlying data for `Int8Array`', () => {
		for (let i = 0; i < 100; i++) {
			const arr = rand.int8Array(100);
			expect(arr instanceof Int8Array).toBe(true);
		}
	});
	it('mutate underlying data for `Int16Array`', () => {
		for (let i = 0; i < 100; i++) {
			const arr = rand.int16Array(100);
			expect(arr instanceof Int16Array).toBe(true);
		}
	});
	it('mutate underlying data for `Int32Array`', () => {
		for (let i = 0; i < 100; i++) {
			const arr = rand.int32Array(100);
			expect(arr instanceof Int32Array).toBe(true);
		}
	});
	it('mutate underlying data for `Int32Array`', () => {
		for (let i = 0; i < 100; i++) {
			const arr = rand.int64Array(100);
			expect(arr instanceof BigInt64Array).toBe(true);
		}
	});
});
