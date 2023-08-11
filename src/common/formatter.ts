export class Formatter {
  static TEN = BigInt(10);
  static ZERO = BigInt(0);
  static FIVE = BigInt(5);

  static bigIntToPrecision(sum: bigint, decimalSpaces: number = 6, precision: number = 2): string {
    sum = BigInt(sum);

    let decimals = Formatter.TEN ** BigInt(decimalSpaces);

    let remainder = sum % decimals;
    let division = sum / decimals;

    if (remainder === Formatter.ZERO) {
      return division.toString() + ".".padEnd(precision + 1, "0");
    }

    if (precision >= decimalSpaces) {
      return (
        division.toString() +
        "." +
        remainder.toString().padStart(precision, "0")
      );
    }

    // Ugly, but works

    let precisionDifference = decimalSpaces - precision;

    if (precisionDifference <= 0) {
      return (
        division.toString() +
        "." +
        remainder.toString().padStart(precision, "0")
      );
    }

    // Round and remove numbers smaller than precision
    for (precisionDifference; precisionDifference > 0; precisionDifference--) {
      remainder += Formatter.FIVE;
      remainder /= Formatter.TEN;
    }

    // Case when rounding .999 goes to 1.000
    if (remainder.toString().length > precision) {
      return (++division).toString() + ".".padEnd(precision + 1, "0");
    }

    return (
      division.toString() + "." + remainder.toString().padStart(precision, "0")
    );
  }

  static splitWordByCase(word: string): string {
    if (word.length < 3) {
      return word;
    }
    word = word.replace(/[-_]+/g, " ");
    let parts = word.split(/(?=[A-Z])/);
    return (
      parts[0].substring(0, 1).toUpperCase() +
      parts.join(" ").replace(/\s+/g, " ").toLowerCase().substring(1)
    );
  }
}
