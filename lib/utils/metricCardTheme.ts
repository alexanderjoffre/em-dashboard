export interface CardColorTheme {
    cardBackGround: string;
    textPrimaryColor: string;
    textSecondaryColor: string;
}

export interface MetricThresholds {
    alert: number;
    critical: number;
}

export const getMetricCardTheme = (baseNumber: number, thresholds: MetricThresholds): CardColorTheme => {
    const colors = {
        healthy: { cardBackGround: "bg-card", textPrimaryColor: "text-slate-200", textSecondaryColor: "text-slate-400" },
        alert: { cardBackGround: "bg-amber-800", textPrimaryColor: "text-slate-200", textSecondaryColor: "text-slate-200" },
        critical: { cardBackGround: "bg-red-800", textPrimaryColor: "text-slate-200", textSecondaryColor: "text-slate-200" },
    };

    if (baseNumber >= thresholds.critical) {
        return colors.critical;
    }

    if (baseNumber >= thresholds.alert) {
        return colors.alert;
    }

    return colors.healthy;
};
