export function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

export function getRandomNumber(max: number) {
    return Math.random() * max;
}

export function getChance(chance: number) {
    return Math.random() < chance;
}

export function getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

export function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

