const columns = [
    {
        field: 'state',
        checkbox: 'false'
    },
    {
        field: 'month',
        title: 'Month',
    }, {
        field: 'emiDate',
        title: 'EMI Date'
    }, {
        field: 'beginingBalance',
        title: 'Begining Balance'
    }, {
        field: 'totalPayMent',
        title: 'Total Payment'
    }, {
        field: 'principleAmount',
        title: 'Principle'
    }, {
        field: 'interestAmount',
        title: 'Interest'
    }, {
        field: 'endingBalance',
        title: 'Ending Balance'
    },
    {
        field: 'interestRate',
        title: 'Interest Rate'
    }];

const calculateEmi = (interestRate, loanPeriod, loanAmount) => {
    roi = interestRate / 12 / 100;
    nom = 12 * loanPeriod;

    rateVariable = Math.pow(1 + roi, nom);

    return Math.round(
        loanAmount * roi * (rateVariable / (rateVariable - 1))
    );
}

//formats


const RENDRED_CHART_DATA = {
    PRINCIPLE: 0,
    INTEREST: 0,
};

const AMOUNT_FORMAT = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

const INTERESTRATE_FORMAT = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const validateDate = (currentDate, selectedYear) => {
    const [item1, item2] = selectedYear.split('-');
    const { firstYear, NextYear } = { firstYear: new Date(item1, 3, 1), NextYear: new Date(item2, 2, 31) }
    return currentDate.getTime() > firstYear.getTime() && currentDate.getTime() < NextYear.getTime()
}

const isNotNull = (val) => {
    return val != null && val != undefined && val != '';
}


const emptyOutPut = () => {
    return {
        emi: 0,
        totalInterest: 0,
        amortization: [],
        totalEarlyPayments: 0,
        totalPrinciple: 0,
        tenureYears: []
    };
}