exports.formatBudget = budget => {
    const formattedBudget = budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return `$${formattedBudget}.00`;
}