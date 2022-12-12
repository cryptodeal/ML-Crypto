const std = @import("std");
const RndGen = std.rand.DefaultPrng;
const ArrayList = std.ArrayList;

var rnd: std.rand.Xoshiro256 = undefined;
var seeded = false;

pub export fn seed(v: u64) void {
    rnd = RndGen.init(v);
    seeded = true;
}

pub export fn isSeeded() bool {
    return seeded;
}

pub export fn rndNormFloat64() f64 {
    return rnd.random().floatNorm(f64);
}

pub export fn rndNormFloat64Array(arr: [*]f64, len: usize) void {
    var out = arr[0..len];
    var i: usize = 0;
    while (i < len) {
        out[i] = rndNormFloat64();
        i += 1;
    }
}
