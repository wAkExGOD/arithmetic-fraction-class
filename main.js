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
  constructor(numerator, denominator) {
    const isValid = Fraction.validateFraction({
      numerator,
      denominator,
    })

    if (!isValid) {
      return null
    }

    this.numerator = numerator
    this.denominator = denominator
  }

  static errors = {
    NOT_VALID_OPERATION: "Operation is not valid",
    FRACTION_IS_NOT_NUMBER: "Numerator / denominator is not a number",
    FRACTION_IS_NOT_INTEGER: "Numerator / denominator is not an integer",
    DENOMINATOR_IS_ZERO: "Denominator can not be zero",
  }

  #bringFractionsToCommonDenominator(f1, f2) {
    const { numerator: n1, denominator: d1 } = f1
    const { numerator: n2, denominator: d2 } = f2

    if (d1 !== d2) {
      const lcm = this.#calculateLCM(d1, d2)

      f1.numerator = (lcm / d1) * n1
      f1.denominator = (lcm / d1) * d1
      f2.numerator = (lcm / d2) * n2
      f2.denominator = f1.denominator
    }

    return {
      f1: new Fraction(f1.numerator, f2.denominator),
      f2: new Fraction(f2.numerator, f2.denominator),
    }
  }

  // Least Common Multiple
  #calculateLCM(...x) {
    let j = Math.max.apply(null, x)
    while (true) {
      if (x.every((b) => j % b == 0)) {
        return j
      }
      j++
    }
  }

  add(fraction) {
    Fraction.validateFraction(fraction)

    const { f1, f2 } = this.#bringFractionsToCommonDenominator(this, fraction)
    this.numerator = f1.numerator + f2.numerator
    this.denominator = f1.denominator

    return Fraction.reduceFraction(this)
  }

  subtract(fraction) {
    Fraction.validateFraction(fraction)

    const { f1, f2 } = this.#bringFractionsToCommonDenominator(this, fraction)
    this.numerator = f1.numerator - f2.numerator
    this.denominator = f1.denominator

    return Fraction.reduceFraction(this)
  }

  multiply(fraction) {
    Fraction.validateFraction(fraction)

    this.numerator *= fraction.numerator
    this.denominator *= fraction.denominator

    return Fraction.reduceFraction(this)
  }

  divide(fraction) {
    Fraction.validateFraction(fraction)

    this.numerator *= fraction.denominator
    this.denominator *= fraction.numerator

    return Fraction.reduceFraction(this)
  }

  static areEqual(f1, f2) {
    const newF1 = Fraction.reduceFraction(Fraction.validateFraction(f1))
    const newF2 = Fraction.reduceFraction(Fraction.validateFraction(f2))

    return (
      newF1.numerator === newF2.numerator &&
      newF1.denominator === newF2.denominator
    )
  }

  static reduceFraction(fraction) {
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

  static validateFraction(fraction) {
    const isNumeratorNumber =
      typeof fraction?.numerator === "number" &&
      Number.isFinite(fraction?.numerator)
    const isDenominatorNumber =
      typeof fraction?.denominator === "number" &&
      Number.isFinite(fraction?.denominator)

    if (!isNumeratorNumber || !isDenominatorNumber) {
      throw new FractionError(Fraction.errors.FRACTION_IS_NOT_NUMBER, fraction)
    }

    const isNumeratorInteger = Number.isInteger(fraction?.numerator)
    const isDenominatorInteger = Number.isInteger(fraction?.denominator)

    if (!isNumeratorInteger || !isDenominatorInteger) {
      throw new FractionError(Fraction.errors.FRACTION_IS_NOT_INTEGER, fraction)
    }

    if (fraction.denominator === 0) {
      throw new FractionError(Fraction.errors.DENOMINATOR_IS_ZERO)
    }

    if (fraction.denominator < 0) {
      fraction.numerator *= -1
      fraction.denominator *= -1
    }

    return fraction
  }

  toString() {
    return `${this.numerator} / ${this.denominator}`
  }
}

try {
  const a = new Fraction(-1, -3)
  const b = new Fraction(2, 3)
  const c = new Fraction(3, 9)

  console.log(a.add(b).toString())
  console.log(a.subtract(b).toString())
  console.log(a.multiply(b).toString())
  console.log(a.divide(b).toString())
  console.log(Fraction.reduceFraction(c).toString())
  console.log(Fraction.areEqual(a, c))

  // Errors:
  // const d = new Fraction('1', 2)
  // const e = new Fraction(Infinity, 2)
  // const f = new Fraction(3, 0)
} catch (error) {
  console.error(error)
}
