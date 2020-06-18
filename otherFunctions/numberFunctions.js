
exports.decimalToHex = function (d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
        hex = "0" + hex;
    }

    return hex;

}

exports.hexToDec = function (hexString) {
    if (hexString.charAt(0) === "#"){
        hexString = hexString.slice(1);
    }
    return parseInt(hexString, 16);
}

exports.getDoubleDigitNumber = function (number) {
    let doubleDigitNumber = '';
    if (number < 10) {
        doubleDigitNumber = `0${number}`;
    } else {
        doubleDigitNumber = `${number}`;
    }
    return doubleDigitNumber;
}

