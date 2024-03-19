import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'shortNumber'
})
export class ShortNumberPipe implements PipeTransform {
    public transform(input: any, ...args: any[]): string {

        if (isNaN(input) || input === null || input === 0) {
            return input;
        }

        let abs: number = Math.abs(input);
        const rounder = Math.pow(10, 2);
        const isNegative = input < 0;
        let key = '';

        const powers = [
            {key: 'Q', value: Math.pow(10, 15)},
            {key: 'T', value: Math.pow(10, 12)},
            {key: 'B', value: Math.pow(10, 9)},
            {key: 'M', value: Math.pow(10, 6)},
            {key: 'K', value: 1000}
        ];

        for (const power of powers) {
            let reduced = abs / power.value;
            reduced = Math.round(reduced * rounder) / rounder;
            if (reduced >= 1) {
                abs = reduced;
                key = power.key;
                break;
            }
        }

        return (isNegative ? '-' : '') + abs.toFixed(args[0] ?? 0) + key;
    }
}
