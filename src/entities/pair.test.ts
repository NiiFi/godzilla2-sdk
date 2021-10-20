import { Token, WETH9, Price, CurrencyAmount } from '@uniswap/sdk-core'
import { InsufficientInputAmountError } from '../errors'
import { computePairAddress, Pair } from './pair'

describe('computePairAddress', () => {
  //it('should correctly compute the pool address', () => {
  //  const tokenA = new Token(1, '0xB68553758df8c253746d3cED96aA1De896F09470', 18, 'KNII', 'KniightCoin')
  //  const tokenB = new Token(1, '0xB59C984a529490fde6698702342b292840743bb8', 6, 'NEURO', 'Nahmii EURO')
  //  const result = computePairAddress({
  //    factoryAddress: '0x1111111111111111111111111111111111111111',
  //    tokenA,
  //    tokenB
  //  })
  //
  //  expect(result).toEqual('0xb50b5182D6a47EC53a469395AF44e371d7C76ed4')
  //})
  it.todo('fix address computation')
  it('should give same result regardless of token order', () => {
    const KNII = new Token(1, '0xB68553758df8c253746d3cED96aA1De896F09470', 18, 'KNII', 'KniightCoin')
    const NEURO = new Token(1, '0xB59C984a529490fde6698702342b292840743bb8', 6, 'NEURO', 'Nahmii EURO')
    let tokenA = KNII
    let tokenB = NEURO
    const resultA = computePairAddress({
      factoryAddress: '0x1111111111111111111111111111111111111111',
      tokenA,
      tokenB
    })

    tokenA = NEURO
    tokenB = KNII
    const resultB = computePairAddress({
      factoryAddress: '0x1111111111111111111111111111111111111111',
      tokenA,
      tokenB
    })

    expect(resultA).toEqual(resultB)
  })
})

describe('Pair', () => {
  const KNII = new Token(1, '0xB68553758df8c253746d3cED96aA1De896F09470', 18, 'KNII', 'KniightCoin')
  const NEURO = new Token(1, '0xB59C984a529490fde6698702342b292840743bb8', 6, 'NEURO', 'Nahmii Euro')

  describe('constructor', () => {
    it('cannot be used for tokens on different chains', () => {
      expect(
        () => new Pair(CurrencyAmount.fromRawAmount(KNII, '100'), CurrencyAmount.fromRawAmount(WETH9[3], '100'))
      ).toThrow('CHAIN_IDS')
    })
  })

  // TODO: uncomment after fixing INIT_CODE_HASH issue
  // describe('#getAddress', () => {
  //   it('returns the correct address', () => {
  //     expect(Pair.getAddress(KNII, NEURO)).toEqual('0x144060d957843F22FCF80b4a0aeC227f9152EA47')
  //   })
  // })

  describe('#token0', () => {
    it('always is the token that sorts before', () => {
      expect(
        new Pair(CurrencyAmount.fromRawAmount(KNII, '100'), CurrencyAmount.fromRawAmount(NEURO, '100')).token0
      ).toEqual(NEURO)
      expect(
        new Pair(CurrencyAmount.fromRawAmount(NEURO, '100'), CurrencyAmount.fromRawAmount(KNII, '100')).token0
      ).toEqual(NEURO)
    })
  })
  describe('#token1', () => {
    it('always is the token that sorts after', () => {
      expect(
        new Pair(CurrencyAmount.fromRawAmount(KNII, '100'), CurrencyAmount.fromRawAmount(NEURO, '100')).token1
      ).toEqual(KNII)
      expect(
        new Pair(CurrencyAmount.fromRawAmount(NEURO, '100'), CurrencyAmount.fromRawAmount(KNII, '100')).token1
      ).toEqual(KNII)
    })
  })
  describe('#reserve0', () => {
    it('always comes from the token that sorts before', () => {
      expect(
        new Pair(CurrencyAmount.fromRawAmount(KNII, '100'), CurrencyAmount.fromRawAmount(NEURO, '101')).reserve0
      ).toEqual(CurrencyAmount.fromRawAmount(NEURO, '101'))
      expect(
        new Pair(CurrencyAmount.fromRawAmount(NEURO, '101'), CurrencyAmount.fromRawAmount(KNII, '100')).reserve0
      ).toEqual(CurrencyAmount.fromRawAmount(NEURO, '101'))
    })
  })
  describe('#reserve1', () => {
    it('always comes from the token that sorts after', () => {
      expect(
        new Pair(CurrencyAmount.fromRawAmount(KNII, '100'), CurrencyAmount.fromRawAmount(NEURO, '101')).reserve1
      ).toEqual(CurrencyAmount.fromRawAmount(KNII, '100'))
      expect(
        new Pair(CurrencyAmount.fromRawAmount(NEURO, '101'), CurrencyAmount.fromRawAmount(KNII, '100')).reserve1
      ).toEqual(CurrencyAmount.fromRawAmount(KNII, '100'))
    })
  })

  describe('#token0Price', () => {
    it('returns price of token0 in terms of token1', () => {
      expect(
        new Pair(CurrencyAmount.fromRawAmount(KNII, '101'), CurrencyAmount.fromRawAmount(NEURO, '100')).token0Price
      ).toEqual(new Price(NEURO, KNII, '100', '101'))
      expect(
        new Pair(CurrencyAmount.fromRawAmount(NEURO, '100'), CurrencyAmount.fromRawAmount(KNII, '101')).token0Price
      ).toEqual(new Price(NEURO, KNII, '100', '101'))
    })
  })

  describe('#token1Price', () => {
    it('returns price of token1 in terms of token0', () => {
      expect(
        new Pair(CurrencyAmount.fromRawAmount(KNII, '101'), CurrencyAmount.fromRawAmount(NEURO, '100')).token1Price
      ).toEqual(new Price(KNII, NEURO, '101', '100'))
      expect(
        new Pair(CurrencyAmount.fromRawAmount(NEURO, '100'), CurrencyAmount.fromRawAmount(KNII, '101')).token1Price
      ).toEqual(new Price(KNII, NEURO, '101', '100'))
    })
  })

  describe('#priceOf', () => {
    const pair = new Pair(CurrencyAmount.fromRawAmount(KNII, '101'), CurrencyAmount.fromRawAmount(NEURO, '100'))
    it('returns price of token in terms of other token', () => {
      expect(pair.priceOf(NEURO)).toEqual(pair.token0Price)
      expect(pair.priceOf(KNII)).toEqual(pair.token1Price)
    })

    it('throws if invalid token', () => {
      expect(() => pair.priceOf(WETH9[1])).toThrow('TOKEN')
    })
  })

  describe('#reserveOf', () => {
    it('returns reserves of the given token', () => {
      expect(
        new Pair(CurrencyAmount.fromRawAmount(KNII, '100'), CurrencyAmount.fromRawAmount(NEURO, '101')).reserveOf(KNII)
      ).toEqual(CurrencyAmount.fromRawAmount(KNII, '100'))
      expect(
        new Pair(CurrencyAmount.fromRawAmount(NEURO, '101'), CurrencyAmount.fromRawAmount(KNII, '100')).reserveOf(KNII)
      ).toEqual(CurrencyAmount.fromRawAmount(KNII, '100'))
    })

    it('throws if not in the pair', () => {
      expect(() =>
        new Pair(CurrencyAmount.fromRawAmount(NEURO, '101'), CurrencyAmount.fromRawAmount(KNII, '100')).reserveOf(
          WETH9[1]
        )
      ).toThrow('TOKEN')
    })
  })

  describe('#chainId', () => {
    it('returns the token0 chainId', () => {
      expect(
        new Pair(CurrencyAmount.fromRawAmount(KNII, '100'), CurrencyAmount.fromRawAmount(NEURO, '100')).chainId
      ).toEqual(1)
      expect(
        new Pair(CurrencyAmount.fromRawAmount(NEURO, '100'), CurrencyAmount.fromRawAmount(KNII, '100')).chainId
      ).toEqual(1)
    })
  })
  describe('#involvesToken', () => {
    expect(
      new Pair(CurrencyAmount.fromRawAmount(KNII, '100'), CurrencyAmount.fromRawAmount(NEURO, '100')).involvesToken(
        KNII
      )
    ).toEqual(true)
    expect(
      new Pair(CurrencyAmount.fromRawAmount(KNII, '100'), CurrencyAmount.fromRawAmount(NEURO, '100')).involvesToken(
        NEURO
      )
    ).toEqual(true)
    expect(
      new Pair(CurrencyAmount.fromRawAmount(KNII, '100'), CurrencyAmount.fromRawAmount(NEURO, '100')).involvesToken(
        WETH9[1]
      )
    ).toEqual(false)
  })
  describe('miscellaneous', () => {
    it('getLiquidityMinted:0', async () => {
      const tokenA = new Token(3, '0x0000000000000000000000000000000000000001', 18)
      const tokenB = new Token(3, '0x0000000000000000000000000000000000000002', 18)
      const pair = new Pair(CurrencyAmount.fromRawAmount(tokenA, '0'), CurrencyAmount.fromRawAmount(tokenB, '0'))

      expect(() => {
        pair.getLiquidityMinted(
          CurrencyAmount.fromRawAmount(pair.liquidityToken, '0'),
          CurrencyAmount.fromRawAmount(tokenA, '1000'),
          CurrencyAmount.fromRawAmount(tokenB, '1000')
        )
      }).toThrow(InsufficientInputAmountError)

      expect(() => {
        pair.getLiquidityMinted(
          CurrencyAmount.fromRawAmount(pair.liquidityToken, '0'),
          CurrencyAmount.fromRawAmount(tokenA, '1000000'),
          CurrencyAmount.fromRawAmount(tokenB, '1')
        )
      }).toThrow(InsufficientInputAmountError)

      const liquidity = pair.getLiquidityMinted(
        CurrencyAmount.fromRawAmount(pair.liquidityToken, '0'),
        CurrencyAmount.fromRawAmount(tokenA, '1001'),
        CurrencyAmount.fromRawAmount(tokenB, '1001')
      )

      expect(liquidity.quotient.toString()).toEqual('1')
    })

    it('getLiquidityMinted:!0', async () => {
      const tokenA = new Token(3, '0x0000000000000000000000000000000000000001', 18)
      const tokenB = new Token(3, '0x0000000000000000000000000000000000000002', 18)
      const pair = new Pair(
        CurrencyAmount.fromRawAmount(tokenA, '10000'),
        CurrencyAmount.fromRawAmount(tokenB, '10000')
      )

      expect(
        pair
          .getLiquidityMinted(
            CurrencyAmount.fromRawAmount(pair.liquidityToken, '10000'),
            CurrencyAmount.fromRawAmount(tokenA, '2000'),
            CurrencyAmount.fromRawAmount(tokenB, '2000')
          )
          .quotient.toString()
      ).toEqual('2000')
    })

    it('getLiquidityValue:!feeOn', async () => {
      const tokenA = new Token(3, '0x0000000000000000000000000000000000000001', 18)
      const tokenB = new Token(3, '0x0000000000000000000000000000000000000002', 18)
      const pair = new Pair(CurrencyAmount.fromRawAmount(tokenA, '1000'), CurrencyAmount.fromRawAmount(tokenB, '1000'))

      {
        const liquidityValue = pair.getLiquidityValue(
          tokenA,
          CurrencyAmount.fromRawAmount(pair.liquidityToken, '1000'),
          CurrencyAmount.fromRawAmount(pair.liquidityToken, '1000'),
          false
        )
        expect(liquidityValue.currency.equals(tokenA)).toBe(true)
        expect(liquidityValue.quotient.toString()).toBe('1000')
      }

      // 500
      {
        const liquidityValue = pair.getLiquidityValue(
          tokenA,
          CurrencyAmount.fromRawAmount(pair.liquidityToken, '1000'),
          CurrencyAmount.fromRawAmount(pair.liquidityToken, '500'),
          false
        )
        expect(liquidityValue.currency.equals(tokenA)).toBe(true)
        expect(liquidityValue.quotient.toString()).toBe('500')
      }

      // tokenB
      {
        const liquidityValue = pair.getLiquidityValue(
          tokenB,
          CurrencyAmount.fromRawAmount(pair.liquidityToken, '1000'),
          CurrencyAmount.fromRawAmount(pair.liquidityToken, '1000'),
          false
        )
        expect(liquidityValue.currency.equals(tokenB)).toBe(true)
        expect(liquidityValue.quotient.toString()).toBe('1000')
      }
    })

    it('getLiquidityValue:feeOn', async () => {
      const tokenA = new Token(3, '0x0000000000000000000000000000000000000001', 18)
      const tokenB = new Token(3, '0x0000000000000000000000000000000000000002', 18)
      const pair = new Pair(CurrencyAmount.fromRawAmount(tokenA, '1000'), CurrencyAmount.fromRawAmount(tokenB, '1000'))

      const liquidityValue = pair.getLiquidityValue(
        tokenA,
        CurrencyAmount.fromRawAmount(pair.liquidityToken, '500'),
        CurrencyAmount.fromRawAmount(pair.liquidityToken, '500'),
        true,
        '250000' // 500 ** 2
      )
      expect(liquidityValue.currency.equals(tokenA)).toBe(true)
      expect(liquidityValue.quotient.toString()).toBe('917') // ceiling(1000 - (500 * (1 / 6)))
    })
  })
})
