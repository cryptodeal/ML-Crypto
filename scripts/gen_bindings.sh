#!/bin/bash
pushd src/ffi/rand
zig build-lib rndFloat.zig -dynamic -OReleaseFast
popd