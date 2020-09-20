import {caver} from "../core";

export const trim = (text: string): string => {
  return text.replace(/\u0000/g, '')
}

export const hexToUtf8 = (hex: string): string => {
  return caver.utils.hexToUtf8(hex)
}

export const utf8toHex = (text: string): string => {
  return caver.utils.utf8ToHex(text)
}

export const encodeAllInput = (input) => {
  let res = {};
  Object
    .keys(input)
    .forEach(key => {
      res = {
        ...res,
        [key]: typeof input[key] === "string"
          ? caver.abi.encodeParameter('bytes32', caver.utils.padRight(utf8toHex(input[key]), 64))
          : input[key]
      }
    });
  
  return res;
}

export const decodeAllInput = (input) => {
  let res = {};
  Object
    .keys(input)
    .forEach(key => {
      res = {
        ...res,
        [key]: caver.utils.isValidHash(input[key])
          ? trim(hexToUtf8(input[key]))
          : input[key]
      }
    });
  
  return res;
}
