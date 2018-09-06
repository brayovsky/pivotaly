class RegExpUtil {
  static get expressions() {
    return {
      alphabetsOnly: '^[a-zA-Z]+$'
    }
  }

  static testMatch(string, regex) {
    return RegExp(regex).test(string)
  }
}

module.exports = RegExpUtil
