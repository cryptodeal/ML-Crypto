# NeuroEvolution ETH Trader

The goal of this project was to demonstrate the flexibility of [shumai](https://github.com/facebookresearch/shumai), the exciting new ML Library for Bun JS runtime. In an ideal world, we'd create a model that would trade on technicals through neuroevolution, but crypto is hardly a rational market, so YMMV. Highly recommend only using this in sandboxed env (default) and not actually connecting to a Coinbase account.

The initial population is built given a specified network topology and assigned random weights. For each generation, these weights are randomly mutated and each network is assigned a fitness value based on its performance. A pooling algorithm is then used to select models for the next generation and the process is repeated. Models with a higher fitness tend to make it to the next generation where their weights are mutated and ideally create a higher performing generation.

See [Golang Implementation](https://github.com/SC4RECOIN/NeuroEvolution-BTC-Trader) for the original Go implementation that inspired this project.

## Setup

Install [Bun](https://bun.sh/) and [ArrayFire](https://github.com/arrayfire/arrayfire/wiki/Getting-ArrayFire).

Next, install project dependencies:

```sh
bun install
```

Only macOS and Linux are supported. Linux installs default to GPU computation with CUDA, and macOS to CPU. Detailed install instructions here: [shumai repo](https://github.com/facebookresearch/shumai#install).

### Building FFI Bindings

This demo project leverages [Bun's FFI](https://github.com/oven-sh/bun#bunffi-foreign-functions-interface) and [Zig](https://ziglang.org) to execute native code helpers (specifically, Zig's random # generator). Accordingly, you'll need to ensure `Zig` is installed in order to build the bindings; refer to the [Zig installation guide](https://ziglang.org/learn/getting-started/#installing-zig) for more details.

Once Zig is installed, you can build the bindings locally by running the following from the root directory of the project:

```sh
bun run gen:bindings
```

## Running Demo (Coinbase Auth Unnecessary)

```sh
bun run start
```
