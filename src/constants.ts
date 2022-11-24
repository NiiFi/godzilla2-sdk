import JSBI from 'jsbi'
// @ts-ignore
export const FACTORY_ADDRESS = window.__RUNTIME_CONFIG__ ? window.__RUNTIME_CONFIG__.FACTORY_ADDRESS : '0xe3DcF89D0c90A877cD82283EdFA7C3Bd03e77E86'
// @ts-ignore
export const INIT_CODE_HASH =  window.__RUNTIME_CONFIG__ ? window.__RUNTIME_CONFIG__.INIT_CODE_HASH : '0x0afcd21f90e27818df9c484881aac8a20b869cbd86156c655d2020ef6950a5ba'

export const MINIMUM_LIQUIDITY = JSBI.BigInt(1000)

// exports for internal consumption
export const ZERO = JSBI.BigInt(0)
export const ONE = JSBI.BigInt(1)
export const FIVE = JSBI.BigInt(5)
export const _997 = JSBI.BigInt(997)
export const _1000 = JSBI.BigInt(1000)

export type BigintIsh = JSBI | string | number

export enum TradeType {
  EXACT_INPUT,
  EXACT_OUTPUT
}

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP
}

export const MaxUint256 = JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
