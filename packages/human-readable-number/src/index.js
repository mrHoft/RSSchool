const Digits = {
    zero: 0,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    eleven: 11,
    twelve: 12,
    thirteen: 13,
    fourteen: 14,
    fifteen: 15,
    sixteen: 16,
    seventeen: 17,
    eighteen: 18,
    nineteen: 19,
    twenty: 20,
    thirty: 30,
    forty: 40,
    fifty: 50,
    sixty: 60,
    seventy: 70,
    eighty: 80,
    ninety: 90,
};

const Strings = {};

(() => {
    for (let key in Digits) Strings[Digits[key]] = key;
})();

module.exports = function toReadable(number) {
    number = ~~number;
    if (!number) return Strings[0];
    const hundreds = Math.floor(number / 100);
    let decades = number - hundreds * 100;
    let num = number % 10;
    if (decades > 20) {
        decades = Math.floor(decades / 10) * 10;
    } else {
        num = 0;
    }
    const h = hundreds ? Strings[hundreds] + " hundred" : "";
    const d = decades ? Strings[decades] : "";
    const n = num ? Strings[num] : "";

    return h + (d && h ? " " : "") + d + (n && (h || d) ? " " : "") + n;
};

// console.log(toReadable(722));
