const loanDetailsFormData = {
    loanAmount: 5000000,
    interestRate: 6.6,
    loanPeriod: 25,
    emiStartDate: new Date()
}

let loanOutputDetails = {
    emi: 0,
    totalInterest: 0,
    amortization: [],
    totalEarlyPayments: 0,
    totalPrinciple: 0
}

const tenureYears = []

const extraPaymentScheule = new Map();
const interestRateMap = new Map();
const adjustedEmiMap = new Map();


$(document).ready(() => {
    const table = $('#table');
    calculateAmortization();
    table.bootstrapTable({
        columns: columns,
        data: loanOutputDetails.amortization
    });
    // Append the option to select
    const mySelect = $('#myselect');
    mySelect.change(function () {
        loanOutputDetails = {
            emi: 0,
            totalInterest: 0,
            amortization: [],
            totalEarlyPayments: 0,
            totalPrinciple: 0
        }
        calculateAmortization();
        table.bootstrapTable('load', loanOutputDetails.amortization);
    });

    [...new Set(tenureYears)].reduce((prev, current) => {
        const optionValue = `${prev}-${current}`;
        mySelect.append(`<option value="${optionValue}"> ${optionValue} </option>`)
        return current;
    })
});

const getValue = (i, interestRate, emi) => {
    const extraPaymentForThisInstallment =
        extraPaymentScheule.get(i) != null ? extraPaymentScheule.get(i) : 0;
    const interestRateforThisMonth =
        interestRateMap.get(i) != null ? interestRateMap.get(i) : interestRate;
    const emiThisMonth =
        adjustedEmiMap.get(i) != null ? adjustedEmiMap.get(i) : emi;
    return {
        extraPaymentForThisInstallment,
        interestRateforThisMonth,
        emiThisMonth
    }

}

const calculateAmortization = () => {
    let { loanAmount, interestRate, loanPeriod, emiStartDate } = loanDetailsFormData;
    let { emi, totalInterest, amortization, totalEarlyPayments, totalPrinciple } = loanOutputDetails;
    const selectedYear = $('#myselect').val();
    let emiDate = new Date(emiStartDate)

    emi = calculateEmi(interestRate, loanPeriod, loanAmount)

    let endingBalance = loanAmount;
    for (let i = 0 ; endingBalance > emi; i++) {

        emiDate = new Date(emiDate.setMonth(emiDate.getMonth() + 1));
        tenureYears.push(emiDate.getFullYear());
        let { extraPaymentForThisInstallment, interestRateforThisMonth, emiThisMonth } = getValue(i, interestRate, emi);

        //assing new values of emi, interestRate
        emi = emiThisMonth;
        interestRate = interestRateforThisMonth;
        const beginingBalance = endingBalance;

        // calculate roi
        const roi = interestRate / 12 / 100;
        // calculate interest_amount
        const interestAmount = beginingBalance * roi;
        // calculate principle_amount
        const principleAmount = emi - interestAmount;
        // check interest is morethan emi and adjust
        if (principleAmount < 0) {
            // adjust emi
            emi = calculateEmi(interestRate, loanPeriod, loanAmount);
            principleAmount = emi - interestAmount;
        }
        endingBalance = beginingBalance - (principleAmount + extraPaymentForThisInstallment);

        // check pay for last installment
        if (endingBalance < 0) {
            extraPaymentForThisInstallment = (beginingBalance - principleAmount);
            endingBalance = 0;
        }
        totalEarlyPayments += extraPaymentForThisInstallment;
        totalPayMent = extraPaymentForThisInstallment + emi;
        if (selectedYear == 'select year' || validateDate(emiDate, selectedYear)) {
            totalInterest += interestAmount;
            totalPrinciple += principleAmount;

            amortization.push({
                month: i + 1,
                emiDate: emiDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                }),
                beginingBalance: AMOUNT_FORMAT.format(Math.round(beginingBalance)),
                endingBalance: AMOUNT_FORMAT.format(Math.round(endingBalance)),
                totalPayMent: AMOUNT_FORMAT.format(Math.round(totalPayMent)),
                principleAmount: AMOUNT_FORMAT.format(Math.round(principleAmount)),
                interestAmount: AMOUNT_FORMAT.format(Math.round(interestAmount)),
                interestRate: INTERESTRATE_FORMAT.format(interestRate),
                emi: AMOUNT_FORMAT.format(Math.round(emi))
            });
        }

    }
    loanOutputDetails = {
        ...loanOutputDetails,
        emi,
        totalInterest: AMOUNT_FORMAT.format(Math.round(totalInterest)),
        totalEarlyPayments: AMOUNT_FORMAT.format(Math.round(totalEarlyPayments)),
        totalPrinciple: AMOUNT_FORMAT.format(Math.round(totalPrinciple) + Math.round(endingBalance))
    }
    renderChart(Math.round(totalPrinciple + endingBalance), totalInterest);

    console.log(loanOutputDetails)

}

