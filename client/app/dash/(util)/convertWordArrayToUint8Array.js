export function convertWordArrayToUint8Array(wordArray) {
    let arrayOfWords = wordArray.hasOwnProperty("words") ? wordArray.words : [];
    let length = wordArray.hasOwnProperty("sigBytes") ? wordArray.sigBytes : arrayOfWords.length * 4;
    let uInt8Array = new Uint8Array(length), index = 0, word, i;
    for (i = 0; i < length; i++) {
        word = arrayOfWords[i];
        uInt8Array[index++] = word >> 24;
        uInt8Array[index++] = (word >> 16) & 0xff;
        uInt8Array[index++] = (word >> 8) & 0xff;
        uInt8Array[index++] = word & 0xff;
    }
    return uInt8Array;
}