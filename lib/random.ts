/* eslint-disable no-bitwise */
// eslint-disable-next-line no-useless-concat
const ALPHABET = ('abcdefghijklmnopqrstuvwxyz' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + '0123456789').split(
  ''
)

// Based on https://stackoverflow.com/a/19301306/8930600
export class Random {
  private m_w = 123456789
  private m_z = 987654321
  private mask = 0xffffffff

  constructor(seed: number = Date.now()) {
    this.m_w = (123456789 + seed) & this.mask
    this.m_z = (987654321 - seed) & this.mask
  }

  /**
   * Random number
   * @returns number between 0 (inclusive) and 1.0 (exclusive), just like Math.random().
   */
  random() {
    this.m_z = (36969 * (this.m_z & 65535) + (this.m_z >> 16)) & this.mask
    this.m_w = (18000 * (this.m_w & 65535) + (this.m_w >> 16)) & this.mask
    let result = ((this.m_z << 16) + (this.m_w & 65535)) >>> 0
    result /= 4294967296
    return result
  }

  randomTime(startDate: Date, endDate: Date) {
    const startTs = startDate.getTime()
    const endTs = endDate.getTime()
    return new Date(startTs + this.random() * (endTs - startTs))
  }

  randomInt = (max: number): number => {
    return Math.floor(this.random() * max)
  }

  choose<T>(options: readonly T[]): T {
    return options[this.randomInt(options.length)]
  }

  randomString = (length: number, alphabet = ALPHABET): string => {
    return [...Array(length)].map(() => this.choose(alphabet)).join('')
  }
}
