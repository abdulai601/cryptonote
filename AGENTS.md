# AGENTS.md

## Cursor Cloud specific instructions

### Overview

CryptoNote reference implementation — a C++ cryptocurrency protocol framework. Produces five binaries: `cryptonoted` (daemon), `simplewallet`, `walletd`, `miner`, and `connectivity_tool`. Pure C++ with CMake build; no external databases or containers.

### Build

The codebase is a C++11 era project. On Ubuntu 24.04 with GCC 9 and Boost 1.83, extra flags are required:

```sh
rm -rf build && mkdir -p build/debug && cd build/debug
CC=gcc-9 CXX=g++-9 cmake -D CMAKE_BUILD_TYPE=Debug \
  -D CMAKE_CXX_FLAGS="-DBOOST_BIND_GLOBAL_PLACEHOLDERS -include memory -include cstring -include list -include iostream -include algorithm -include boost/bind.hpp" \
  -D CMAKE_CXX_FLAGS_DEBUG="-g3 -Og -Wno-error" \
  -D CMAKE_C_FLAGS_DEBUG="-g3 -Og -Wno-error" \
  ../..
make -j$(nproc)
```

Key compatibility notes:
- **GCC 9 required** — GCC 13 (system default) triggers fatal `static_assert` in `crypto.h` `random_engine::max()`. GCC 9 avoids this.
- **`-Wno-error`** must go in `CMAKE_CXX_FLAGS_DEBUG` (not `CMAKE_CXX_FLAGS`) because the root `CMakeLists.txt` appends `-Werror` to the base flags.
- **`-DBOOST_BIND_GLOBAL_PLACEHOLDERS`** is needed because Boost ≥1.73 no longer exposes `_1`..`_4` in the global namespace.
- **`-include memory -include cstring -include list -include iostream -include algorithm -include boost/bind.hpp`** fix missing transitive includes expected by the older codebase.
- The **`src/CryptoNoteConfig.h`** file is a template with blank TODO values. These must be filled in for the code to compile (address prefix, money supply, minimum fee, ports, coin name). See `README.md` for details.

### Configuration (CryptoNoteConfig.h)

The config file `src/CryptoNoteConfig.h` has placeholder values marked with `TODO` comments. For development/testing, the following values work:

| Constant | Value |
|---|---|
| `CRYPTONOTE_PUBLIC_ADDRESS_BASE58_PREFIX` | `0xe9` |
| `MONEY_SUPPLY` | `(uint64_t)(-1)` |
| `MINIMUM_FEE` | `UINT64_C(100000)` |
| `P2P_DEFAULT_PORT` | `17236` |
| `RPC_DEFAULT_PORT` | `18236` |
| `CRYPTONOTE_NAME` | `"cryptonote"` |

After initial build, run `cryptonoted --print-genesis-tx` and paste the output into `GENESIS_COINBASE_TX_HEX`, then rebuild.

### Tests

```sh
cd build/debug && ctest --output-on-failure
```

- **Hash tests** (7 tests) and **HashTargetTests** (1 test): always pass.
- **SystemTests**: 127/129 pass; 2 `TcpConnectorTests` fail in sandboxed environments (no network).
- **DifficultyTests** and **UnitTests**: fail with "Failed to initialize currency object" if config values are left blank (expected for the template).

### Run

```sh
mkdir -p /tmp/cryptonote-data
./build/debug/src/cryptonoted --data-dir /tmp/cryptonote-data
```

The daemon binds P2P on port 17236 and RPC on 127.0.0.1:18236 by default.

### Link order fix

The `src/CMakeLists.txt` `ConnectivityTool` target had `Common` before `Serialization` in the link order, which caused undefined symbol errors with static linking. Fixed to match the `Daemon` target order.
