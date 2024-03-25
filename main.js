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

  #operations = {
    ADD: "ADD",
    SUBTRACT: "SUBTRACT",
  }

  #errors = {
    NOT_VALID_OPERATION: "Operation is not valid",
    NOT_VALID_FRACTION: "Fraction is not valid",
  }

  add(fraction) {
    this.#validateFraction(fraction)
    const { numerator, denominator } =
      this.#calculateFractionsWithCommonDenominator(
        this,
        fraction,
        this.#operations.ADD
      )
    this.numerator = numerator
    this.denominator = denominator
    return this
  }

  subtract(fraction) {
    this.#validateFraction(fraction)
    const { numerator, denominator } =
      this.#calculateFractionsWithCommonDenominator(
        this,
        fraction,
        this.#operations.SUBTRACT
      )
    this.numerator = numerator
    this.denominator = denominator
    return this
  }

  multiply(fraction) {
    this.#validateFraction(fraction)
    this.numerator *= fraction.numerator
    this.denominator *= fraction.denominator
    return this
  }

  divide(fraction) {
    this.#validateFraction(fraction)
    this.numerator *= fraction.denominator
    this.denominator *= fraction.numerator
    return this
  }

  #calculateFractionsWithCommonDenominator(f1, f2, operation) {
    if (!Object.keys(this.#operations).includes(operation)) {
      throw new FractionError(this.#errors.NOT_VALID_OPERATION, operation)
    }

    const { numerator: n1, denominator: d1 } = f1
    const { numerator: n2, denominator: d2 } = f2

    let numerator = f1.numerator
    let denominator = f1.denominator

    if (d1 === d2) {
      numerator =
        operation === this.#operations.ADD
          ? numerator + f2.numerator
          : numerator - f2.numerator
    } else {
      const lcm = this.#calculateLCM(d1, d2)
      numerator = this.#operations.ADD
        ? (lcm / d1) * n1 + (lcm / d2) * n2
        : (lcm / d1) * n1 - (lcm / d2) * n2
      denominator = (lcm / d1) * d1
    }

    return {
      numerator,
      denominator,
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

  #validateFraction(fraction) {
    const isNumeratorValid =
      typeof fraction?.numerator === "number" &&
      Number.isFinite(fraction?.numerator)
    const isDenominatorValid =
      typeof fraction?.denominator === "number" &&
      Number.isFinite(fraction?.denominator)

    if (isNumeratorValid && isDenominatorValid) {
      return true
    }

    throw new FractionError(this.#errors.NOT_VALID_FRACTION, fraction)
  }

  toString() {
    return `${this.numerator} / ${this.denominator}`
  }
}

try {
  const a = new Fraction(1, 3)
  const b = new Fraction(5, 2)

  console.log(a.add(b).toString())
  console.log(a.subtract(b).toString())
  console.log(a.multiply(b).toString())
  console.log(a.divide(b).toString())

  // Errors:
  // const c = new Fraction('1', 2)
  // const d = new Fraction(Infinity, 2)
} catch (error) {
  console.error(error)
}
