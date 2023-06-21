const AMOUNT_FORMAT = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

const month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";


const DATE_PICKER_FORMAT = new Intl.DateTimeFormat(
    new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
    })
);

const DATE_FORMAT = new Intl.DateTimeFormat(
    new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
    })
);

const partPaymentFrequencyMap = {
    monthly: 1,
    quarterly: 4,
    yearly: 12
}


function isNotEmpty(field) {
    return field.val() != undefined &&  field.val() != null &&  field.val() != "";
}

const calculateEmi = (beginningBalance, loanPeriod, loanAmount) => {
    roi = interestRate / 12 / 100;
    nom = 12 * loanPeriod;

    rateVariable = Math.pow(1 + roi, nom);

    return Math.round(
        loanAmount * roi * (rateVariable / (rateVariable - 1))
    );
}

const endingBalance = (beginningBalance, totalPayment, loanAmount) => {


    let value = beginningBalance - totalPayment;

    if (totalPayment > emi) {
        value = beginningBalance - emiForThisInstallment -
            interest +
            (isPartPaymentEnabled ? extraPaymentForThisInstallment : 0)
    }
    return AMOUNT_FORMAT.format(Math.round(value))
}

