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

pub export fn normFloat32() f32 {
    return rnd.random().floatNorm(f32);
}

pub export fn normFloat64() f64 {
    return rnd.random().floatNorm(f64);
}

pub export fn randNormFloat64() f64 {
    return rnd.random().floatNorm(f64);
}

fn randNormFloatArray(comptime T: type, arr: [*]T, len: usize) void {
    var out = arr[0..len];
    var i: usize = 0;
    while (i < len) {
        out[i] = rnd.random().floatNorm(T);
        i += 1;
    }
}

pub export fn normFloat64Array(arr: [*]f64, len: usize) void {
    randNormFloatArray(f64, arr, len);
}

pub export fn normFloat32Array(arr: [*]f32, len: usize) void {
    randNormFloatArray(f32, arr, len);
}
