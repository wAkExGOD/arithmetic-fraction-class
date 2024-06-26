class FractionError extends Error {
  constructor(message, information = "") {
    super(message)
    this.name = "FractionError"
    this.message = message

    if (information) {
      this.information = information
    }
  }
}

class Fraction {
  #numerator
  #denominator

  constructor(numerator, denominator) {
    this.numerator = numerator
    this.denominator = denominator

    Fraction.validateFraction(this)
  }

  static errors = {
    NOT_FRACTION_INSTANCE: "Not a Fraction instance",
    NOT_VALID_OPERATION: "Operation is not valid",
    NOT_VALID_NUMBER: "Number is not valid",
    NOT_INTEGER_NUMBER: "Number is not integer",
    DENOMINATOR_IS_ZERO: "Denominator can not be zero",
  }

  get numerator() {
    return this.#numerator
  }

  get denominator() {
    return this.#denominator
  }

  set numerator(number) {
    try {
      Fraction.validateNumber(number)
      this.#numerator = number

      return this.#numerator
    } catch (error) {
      console.error(error)
    }
  }

  set denominator(number) {
    try {
      Fraction.validateNumber(number)
      this.#denominator = number
      Fraction.validateFraction(this)

      return this.#denominator
    } catch (error) {
      console.error(error)
    }
  }

  set(fraction) {
    const { numerator, denominator } = fraction
    Fraction.validateNumber(numerator)
    Fraction.validateNumber(denominator)
    
    if (!Fraction.validateFraction(fraction)) {
      return null
    }

    this.#numerator = numerator
    this.#denominator = denominator

    return this
  }

  add(fraction) {
    if (!Fraction.validateFraction(fraction)) {
      return this
    }

    const { f1, f2 } = Fraction.bringFractionsToCommonDenominator(
      this,
      fraction
    )
    this.numerator = f1.numerator + f2.numerator
    this.denominator = f1.denominator

    return Fraction.reduceFraction(this)
  }

  subtract(fraction) {
    if (!Fraction.validateFraction(fraction)) {
      return this
    }

    const { f1, f2 } = Fraction.bringFractionsToCommonDenominator(
      this,
      fraction
    )
    this.numerator = f1.numerator - f2.numerator
    this.denominator = f1.denominator

    return Fraction.reduceFraction(this)
  }

  multiply(fraction) {
    if (!Fraction.validateFraction(fraction)) {
      return this
    }

    this.numerator *= fraction.numerator
    this.denominator *= fraction.denominator

    return Fraction.reduceFraction(this)
  }

  divide(fraction) {
    if (!Fraction.validateFraction(fraction)) {
      return this
    }

    this.numerator *= fraction.denominator
    this.denominator *= fraction.numerator

    return Fraction.reduceFraction(this)
  }

  static areEqual(f1, f2) {
    const validatedF1 = Fraction.validateFraction(f1)
    const validatedF2 = Fraction.validateFraction(f2)
    if (!validatedF1 || !validatedF2) {
      return false
    }

    const reducedF1 = Fraction.reduceFraction(validatedF2)
    const reducedF2 = Fraction.reduceFraction(validatedF2)

    return (
      reducedF1.numerator === reducedF2.numerator &&
      reducedF1.denominator === reducedF2.denominator
    )
  }

  static bringFractionsToCommonDenominator(f1, f2) {
    const validatedF1 = Fraction.validateFraction(f1)
    const validatedF2 = Fraction.validateFraction(f2)
    if (!validatedF1 || !validatedF2) {
      return null
    }

    const { numerator: n1, denominator: d1 } = f1
    const { numerator: n2, denominator: d2 } = f2

    if (d1 !== d2) {
      const lcm = Fraction.calculateLCM(d1, d2)

      f1.numerator = (lcm / d1) * n1
      f1.denominator = (lcm / d1) * d1
      f2.numerator = (lcm / d2) * n2
      f2.denominator = f1.denominator
    }

    return {
      f1,
      f2,
    }
  }

  // Least Common Multiple
  static calculateLCM(...x) {
    let j = Math.max.apply(null, x)
    while (true) {
      if (x.every((b) => j % b == 0)) {
        return j
      }
      j++
    }
  }

  static reduceFraction(fraction) {
    const validatedFraction = Fraction.validateFraction(fraction)
    if (!validatedFraction) {
      return fraction
    }

    let m = fraction.numerator
    let n = fraction.denominator

    for (var i = 2; i <= m; i++) {
      if (m % i === 0 && n % i === 0) {
        fraction.numerator = m / i
        fraction.denominator = n / i
      }
    }

    return fraction
  }

  static validateNumber(number) {
    try {
      const isNumber = typeof number === "number" && Number.isFinite(number)
      if (!isNumber) {
        throw new FractionError(Fraction.errors.NOT_VALID_NUMBER, number)
      }

      const isInteger = Number.isInteger(number)
      if (!isInteger) {
        throw new FractionError(Fraction.errors.NOT_INTEGER_NUMBER, number)
      }

      return number
    } catch (error) {
      console.error(error)
    }
  }

  static validateFraction(fraction) {
    try {
      if (!(fraction instanceof Fraction)) {
        throw new FractionError(Fraction.errors.NOT_FRACTION_INSTANCE)
      }

      if (fraction.denominator === 0) {
        throw new FractionError(Fraction.errors.DENOMINATOR_IS_ZERO)
      }

      if (fraction.denominator < 0) {
        fraction.numerator *= -1
        fraction.denominator *= -1
      }

      return fraction
    } catch (error) {
      console.error(error)
    }
  }

  toString() {
    return `${this.numerator} / ${this.denominator}`
  }
}

const a = new Fraction(1, -3)
const b = new Fraction(4, 3)
const c = new Fraction(3, 6)

console.log(a.add(b).toString())
console.log(a.subtract(b).toString())
console.log(a.multiply(b).toString())
console.log(a.divide(b).toString())
console.log(Fraction.reduceFraction(c).toString())
console.log(Fraction.areEqual(a, b))
console.log(a.set(b).toString())

// Errors:
// const d = new Fraction('1', 2)
// const e = new Fraction(Infinity, 2)
// const f = new Fraction(3, 0)
// console.log(Fraction.areEqual(a, {numerator: 1, denominator: 2}))
// a.set('1')
