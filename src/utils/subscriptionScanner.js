export const scanForSubscriptions = (expenses) => {
    const ONE_DAY = 24 * 60 * 60 * 1000;
    const subs = {};
    const predicted = [];

    // Group by exact amount and description
    expenses.forEach(exp => {
        const key = `${exp.description}-${exp.amount}`;
        if (!subs[key]) subs[key] = [];
        subs[key].push(new Date(exp.date));
    });

    // Analyze patterns (look for ~30 day gaps)
    Object.keys(subs).forEach(key => {
        const dates = subs[key].sort((a, b) => b - a);
        if (dates.length >= 2) {
            const diffDays = Math.round((dates[0] - dates[1]) / ONE_DAY);
            // If it happens roughly every month (25 to 35 days)
            if (diffDays >= 25 && diffDays <= 35) {
                const [description, amount] = key.split('-');
                const nextExpectedDate = new Date(dates[0].getTime() + (diffDays * ONE_DAY));
                const daysUntil = Math.round((nextExpectedDate - new Date()) / ONE_DAY);

                // Only warn if it's coming up in the next 5 days
                if (daysUntil <= 5 && daysUntil >= -2) {
                    predicted.push({ 
                        description, 
                        amount: parseFloat(amount), 
                        daysUntil, 
                        nextExpectedDate: nextExpectedDate.toISOString().split('T')[0] 
                    });
                }
            }
        }
    });
    return predicted.sort((a, b) => a.daysUntil - b.daysUntil);
};
