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

pub export fn randFloat32() f32 {
    return rnd.random().float(f32);
}

pub export fn randNormFloat32() f32 {
    return rnd.random().floatNorm(f32);
}

pub export fn randFloat64() f64 {
    return rnd.random().float(f64);
}

pub export fn randNormFloat64() f64 {
    return rnd.random().floatNorm(f64);
}

pub export fn randInt8() i8 {
    return rnd.random().int(i8);
}

pub export fn randInt16() i16 {
    return rnd.random().int(i16);
}

pub export fn randInt32() i32 {
    return rnd.random().int(i32);
}

pub export fn randInt64() i64 {
    return rnd.random().int(i64);
}

fn randNormFloatArray(comptime T: type, arr: [*]T, len: usize) void {
    var out = arr[0..len];
    var i: usize = 0;
    while (i < len) {
        out[i] = rnd.random().floatNorm(T);
        i += 1;
    }
}

pub export fn randNormFloat32Array(arr: [*]f32, len: usize) void {
    randNormFloatArray(f32, arr, len);
}

pub export fn randNormFloat64Array(arr: [*]f64, len: usize) void {
    randNormFloatArray(f64, arr, len);
}

fn randIntArray(comptime T: type, arr: [*]T, len: usize) void {
    var out = arr[0..len];
    var i: usize = 0;
    while (i < len) {
        out[i] = rnd.random().int(T);
        i += 1;
    }
}

pub export fn randInt8Array(arr: [*]i8, len: usize) void {
    randIntArray(i8, arr, len);
}

pub export fn randInt16Array(arr: [*]i16, len: usize) void {
    randIntArray(i16, arr, len);
}

pub export fn randInt32Array(arr: [*]i32, len: usize) void {
    randIntArray(i32, arr, len);
}

pub export fn randInt64Array(arr: [*]i64, len: usize) void {
    randIntArray(i64, arr, len);
}
