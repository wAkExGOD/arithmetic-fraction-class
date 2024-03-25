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
    const isValid = this.#validateFraction({
      numerator,
      denominator,
    })

    if (!isValid) {
      return null
    }

    this.numerator = numerator
    this.denominator = denominator
  }

  #errors = {
    NOT_VALID_OPERATION: "Operation is not valid",
    FRACTION_IS_NOT_VALID: "Numerator / denominator is not a number",
    DENOMINATOR_IS_NEGATIVE: "Denominator should be positive",
  }

  add(fraction) {
    this.#validateFraction(fraction)

    const { f1, f2 } = Fraction.bringFractionsToCommonDenominator(this, fraction)
    this.numerator = f1.numerator + f2.numerator
    this.denominator = f1.denominator
    return Fraction.reduceFraction(this)
  }

  subtract(fraction) {
    this.#validateFraction(fraction)

    const { f1, f2 } = Fraction.bringFractionsToCommonDenominator(this, fraction)
    this.numerator = f1.numerator - f2.numerator
    this.denominator = f1.denominator
    return Fraction.reduceFraction(this)
  }

  multiply(fraction) {
    this.#validateFraction(fraction)

    this.numerator *= fraction.numerator
    this.denominator *= fraction.denominator
    return Fraction.reduceFraction(this)
  }

  divide(fraction) {
    this.#validateFraction(fraction)

    this.numerator *= fraction.denominator
    this.denominator *= fraction.numerator
    return Fraction.reduceFraction(this)
  }

  isEqual(fraction) {
    this.#validateFraction(fraction)

    const f1 = Fraction.reduceFraction(this)
    const f2 = Fraction.reduceFraction(fraction)

    return f1.numerator === f2.numerator && f1.denominator === f2.denominator
  }

  static bringFractionsToCommonDenominator(f1, f2) {
    const { numerator: n1, denominator: d1 } = f1
    const { numerator: n2, denominator: d2 } = f2

    if (d1 !== d2) {
      const lcm = Fraction.calculateLCM(d1, d2)

      f1.numerator = (lcm / d1) * n1
      f1.denominator = (lcm / d1) * d1
      f2.numerator = (lcm / d2) * n2
      f2.denominator = f1.denominator
    }

    return { f1, f2 }
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

  #validateFraction(fraction) {
    const isNumeratorValid =
      typeof fraction?.numerator === "number" &&
      Number.isFinite(fraction?.numerator)
    const isDenominatorValid =
      typeof fraction?.denominator === "number" &&
      Number.isFinite(fraction?.denominator)

    if (!isNumeratorValid || !isDenominatorValid) {
      throw new FractionError(this.#errors.FRACTION_IS_NOT_VALID, fraction)
    }

    if (fraction.denominator < 0) {
      throw new FractionError(
        this.#errors.DENOMINATOR_IS_NEGATIVE,
        fraction?.denominator
      )
    }

    return true
  }

  toString() {
    return `${this.numerator} / ${this.denominator}`
  }
}

try {
  const a = new Fraction(1, 3)
  const b = new Fraction(5, 2)
  const c = new Fraction(1, 3)

  console.log(a.add(b).toString())
  console.log(a.subtract(b).toString())
  console.log(a.multiply(b).toString())
  console.log(a.divide(b).toString())
  console.log(a.isEqual(c))

  // Errors:
  // const d = new Fraction('1', 2)
  // const e = new Fraction(Infinity, 2)
} catch (error) {
  console.error(error)
}
