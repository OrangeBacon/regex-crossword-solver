// Parse regular expressions
// function names + structure based upon ebnf grammar

// Entry point
export class Parser {
  constructor(text) {
    this.chars = text.split("");
    this.consumed = 0;
  }

  // Top level parser, checks for `^` as the start of line marker
  regex() {
    if (this.chars.length === this.consumed) {
      return { kind: "eof" };
    }

    const startAnchor = this.matchesChar("^");

    let value = this.expression();
    if (value && value.kind === "expression") {
      value = value.value;
    }

    return {
      kind: "regex",
      startAnchor,
      value
    };
  }

  // The main regex expression parser
  expression() {
    let expressions = [this.subExpression()];

    while (this.matchesChar("|")) {
      expressions.push(this.subExpression());
    }

    return {
      kind: "expression",
      value: expressions
    };
  }

  subExpression() {
    let expression = [];
    while (true) {
      const item = this.subExpressionItem();
      if (!item) {
        break;
      }
      expression.push(item);
    }

    return {
      kind: "sub expression",
      value: expression
    };
  }

  subExpressionItem() {
    const backref = this.backreference();
    if (backref) {
      return backref;
    }

    const anchor = this.anchor();
    if (anchor) {
      return anchor;
    }

    const group = this.group();
    if (group) {
      return group;
    }

    const match = this.match();
    if (match) {
      return match;
    }
  }

  group() {
    if (!this.matchesChar("(")) {
      return null;
    }

    let kind = "capture";
    if (this.peek() === "?" && this.peek(1) === "=") {
      this.advance();
      this.advance();
      kind = "lookahead";
    } else if (this.peek() === "?" && this.peek(1) === "!") {
      this.advance();
      this.advance();
      kind = "negative";
    }

    const content = this.expression();

    if (!this.matchesChar(")")) {
      return {
        kind: "error",
        value: "Missing `)` after capture group"
      };
    }

    const quantifier = this.quantifier();

    return {
      kind,
      value: content,
      quantifier
    };
  }

  match() {
    const value = this.matchItem();
    if (!value) {
      return null;
    }
    const quantifier = this.quantifier();

    return {
      kind: "match",
      quantifier,
      value
    };
  }

  matchItem() {
    if (this.matchesChar(".")) {
      return { kind: "match all" };
    }

    const group = this.characterGroup();
    if (group) {
      return group;
    }

    const characterClass = this.characterClass();
    if (characterClass) {
      return characterClass;
    }

    const next = this.peek();
    if (next && next !== "|" && next !== ")") {
      this.advance();
      return { kind: "character", value: next };
    }

    return null;
  }

  // parse a character range `[Aa-b]` or `[^abc]`
  characterGroup() {
    if (!this.matchesChar("[")) {
      return null;
    }

    const negated = this.matchesChar("^");

    let group = [];
    while (this.peek() && this.peek() !== "]") {
      const characterClass = this.characterClass();
      if (characterClass) {
        group.push(characterClass);
        continue;
      }

      const char = this.advance();
      if (this.peek() === "-" && this.peek(1) && this.peek(1) !== "]") {
        this.advance();
        group.push({
          kind: "range",
          start: char,
          end: this.advance()
        });
      } else {
        group.push({
          kind: "character",
          value: char
        });
      }
    }

    if (!this.matchesChar("]")) {
      return {
        kind: "error",
        value: "Expected `]` after character group"
      };
    }

    return {
      kind: "character group",
      negated,
      group
    };
  }

  // parse an escaped character e.g. `\(` or `\.`
  characterClass() {
    if (!this.matchesChar("\\")) {
      return null;
    }

    const combinations = {
      w: ["word", false],
      W: ["word", true],
      d: ["digit", false],
      D: ["digit", true],
      s: ["whitespace", false],
      S: ["whitespace", true],
      "0": ["\0", false],
      n: ["\n", false],
      "(": ["(", false],
      ")": [")", false],
      "[": ["[", false],
      "]": ["]", false],
      ".": [".", false],
      "*": ["*", false],
      "+": ["+", false],
      "?": ["?", false],
      "-": ["-", false],
      "|": ["|", false],
      "^": ["^", false],
      "\\": ["\\", false],
      $: ["$", false]
    };

    const char = this.advance();
    const next = combinations[char];

    if (next) {
      return {
        kind: "character class",
        value: next[0],
        inverted: next[1]
      };
    }

    return null;
  }

  // parses how many of the previous thing to match
  quantifier() {
    // zero or more
    if (this.matchesChar("*")) {
      return {
        kind: "quantifier",
        value: "*"
      };
    }

    // one or more
    if (this.matchesChar("+")) {
      return {
        kind: "quantifier",
        value: "+"
      };
    }

    // zero or one
    if (this.matchesChar("?")) {
      return {
        kind: "quantifier",
        value: "?"
      };
    }

    if (!this.matchesChar("{")) {
      return null;
    }

    const lowerBound = this.readInteger();
    if (!lowerBound) {
      return {
        kind: "error",
        value: "Expected integer lower bound"
      };
    }

    if (this.matchesChar("}")) {
      return {
        kind: "quantifier",
        lowerBound,
        upperBound: lowerBound
      };
    }

    if (!this.matchesChar(",")) {
      return {
        kind: "error",
        value: "Expected `}` or `,` after range lower bound"
      };
    }

    // if null is returned, doesn't matter, indicates no upper
    // bound e.g. `a{2,}` has null as its upper bound
    const upperBound = this.readInteger();

    if (!this.matchesChar("}")) {
      return {
        kind: "error",
        value: "Expected `}` at the end of range quantifier"
      };
    }

    return {
      kind: "quantifier",
      lowerBound,
      upperBound
    };
  }

  backreference() {
    if (!this.matchesChar("\\")) {
      return null;
    }

    const ref = this.readInteger();

    if (ref === null) {
      return null;
    }

    return {
      kind: "backreference",
      value: ref
    };
  }

  anchor() {
    if (this.matchesChar("$")) {
      return {
        kind: "anchor",
        value: "$"
      };
    }

    const peek = this.peek();
    const next = this.peek(1);

    if (!peek || !next || peek !== "\\" || !(next === "b" || next === "B")) {
      return null;
    }

    this.advance();
    this.advance();

    return {
      kind: "anchor",
      value: next
    };
  }

  // consume a base 10 integer and return it.
  // returns null if an integer cannot be parsed.
  readInteger() {
    let value = "";

    while (true) {
      const peek = this.peek();
      if (peek && peek >= "0" && peek <= "9") {
        value += peek;
      } else {
        break;
      }
    }

    if (value.length === 0) {
      return null;
    }

    return parseInt(value, 10);
  }

  // check if the next character is char, if so consume it and
  // return true, otherwise return false.
  matchesChar(char) {
    if (this.peek() === char) {
      this.consumed++;
      return true;
    }

    return false;
  }

  // consume and return the next character
  // returns null if out of range.
  advance() {
    if (this.consumed >= this.chars.length) {
      return null;
    }

    this.consumed++;
    return this.chars[this.consumed - 1];
  }

  // return the next + amount'th character
  // if amount is not specified, it is assumed to be 0.
  // returns null if out of range.
  peek(amount) {
    const distance = amount ? amount : 0;
    const index = this.consumed + distance;
    if (index >= this.chars.length) {
      return null;
    }
    return this.chars[index];
  }
}
