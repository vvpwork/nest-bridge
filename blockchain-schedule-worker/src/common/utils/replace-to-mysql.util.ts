/* eslint-disable no-control-regex */
/* eslint-disable prefer-template */
/* eslint-disable no-useless-escape */
export function stringMsqlAdapter(str: string) {
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char: string) => {
    switch (char) {
      case '\0':
        return '\\0';
      case '\x08':
        return '\\b';
      case '\x09':
        return '\\t';
      case '\x1a':
        return '\\z';
      case '\n':
        return '\\n';
      case '\r':
        return '\\r';
      case "'":
        return "’";
      case '"':
      case '\\':
      case '%':
        return '';
      default:
        return char;
    }
  });
}
