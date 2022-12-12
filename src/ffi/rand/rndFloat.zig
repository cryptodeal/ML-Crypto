const std = @import("std");
const RndGen = std.rand.DefaultPrng;
const ArrayList = std.ArrayList;

var rnd: std.rand.Xoshiro256 = undefined;
var seeded = false;

fn randUint(comptime OutType: type, comptime RandType: type) OutType {
    return @bitCast(OutType, rnd.random().int(RandType));
}

fn randNormFloatArray(comptime T: type, arr: [*]T, len: usize) void {
    var out = arr[0..len];
    var i: usize = 0;
    while (i < len) {
        out[i] = rnd.random().floatNorm(T);
        i += 1;
    }
}

fn randExpFloatArray(comptime T: type, arr: [*]T, len: usize) void {
    var out = arr[0..len];
    var i: usize = 0;
    while (i < len) {
        out[i] = rnd.random().floatExp(T);
        i += 1;
    }
}

fn randFloatArray(comptime T: type, arr: [*]T, len: usize) void {
    var out = arr[0..len];
    var i: usize = 0;
    while (i < len) {
        out[i] = rnd.random().float(T);
        i += 1;
    }
}

fn randIntArray(comptime T: type, arr: [*]T, len: usize) void {
    var out = arr[0..len];
    var i: usize = 0;
    while (i < len) {
        out[i] = rnd.random().int(T);
        i += 1;
    }
}

fn randUintArray(comptime ArrayT: type, comptime RandT: type, arr: [*]ArrayT, len: usize) void {
    var out = arr[0..len];
    var i: usize = 0;
    while (i < len) {
        out[i] = randUint(ArrayT, RandT);
        i += 1;
    }
}

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

pub export fn randExpFloat32() f32 {
    return rnd.random().floatExp(f32);
}

pub export fn randFloat64() f64 {
    return rnd.random().float(f64);
}

pub export fn randNormFloat64() f64 {
    return rnd.random().floatNorm(f64);
}

pub export fn randExpFloat64() f64 {
    return rnd.random().floatExp(f64);
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

pub export fn randUint8() u8 {
    return randUint(u8, i8);
}

pub export fn randUint16() u16 {
    return randUint(u16, i16);
}

pub export fn randUint32() u32 {
    return randUint(u32, i32);
}

pub export fn randUint64() u64 {
    return randUint(u64, i64);
}

pub export fn randFloat32Array(arr: [*]f32, len: usize) void {
    randFloatArray(f32, arr, len);
}

pub export fn randNormFloat32Array(arr: [*]f32, len: usize) void {
    randNormFloatArray(f32, arr, len);
}

pub export fn randExpFloat32Array(arr: [*]f32, len: usize) void {
    randExpFloatArray(f32, arr, len);
}

pub export fn randFloat64Array(arr: [*]f64, len: usize) void {
    randFloatArray(f64, arr, len);
}

pub export fn randNormFloat64Array(arr: [*]f64, len: usize) void {
    randNormFloatArray(f64, arr, len);
}

pub export fn randExpFloat64Array(arr: [*]f64, len: usize) void {
    randExpFloatArray(f64, arr, len);
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

pub export fn randUint8Array(arr: [*]u8, len: usize) void {
    randUintArray(u8, i8, arr, len);
}

pub export fn randUint16Array(arr: [*]u16, len: usize) void {
    randUintArray(u16, i16, arr, len);
}

pub export fn randUint32Array(arr: [*]u32, len: usize) void {
    randUintArray(u32, i32, arr, len);
}

pub export fn randUint64Array(arr: [*]u64, len: usize) void {
    randUintArray(u64, i64, arr, len);
}
