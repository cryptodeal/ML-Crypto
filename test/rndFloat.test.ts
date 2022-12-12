import { rand } from '@ffi';
import { describe, expect, it } from 'bun:test';
describe('FFI `rand`', () => {
	it('seeds default PRNG - `Xoshiro256`', () => {
		expect(rand.isSeeded()).toBe(false);
		rand.seed(Date.now());
		expect(rand.isSeeded()).toBe(true);
	});
	it('works to generate random normal float64', () => {
		for (let i = 0; i < 100; i++) {
			const random = rand.normFloat64();
			expect(typeof random).toBe('number');
		}
	});
	it('mutate underlying data for `Float64Array`', () => {
		for (let i = 0; i < 100; i++) {
			const arr = rand.normFloat64Array(100);
			expect(arr instanceof Float64Array).toBe(true);
		}
	});
});
