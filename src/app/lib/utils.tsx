import modularscale from 'modularscale-js';

export const getComputedFontSize = ({
    step,
    baseSize,
    ratio,
    round,
}: {
    step: number;
    baseSize: number;
    ratio: number;
    round: boolean;
}) => {
    const stepSize = modularscale(step, {
        base: [baseSize],
        ratio: ratio,
    });

    if (round) {
        return Math.round(stepSize);
    }

    return stepSize;
};
