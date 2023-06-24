const loanDetailsFormData = {
    loanAmount: 0,
    interestRate: 0,
    loanPeriod: 0,
    emiStartDate: new Date()
}
const tempArr = [];
let loanOutputDetails = {
    emi: 0,
    totalInterest: 0,
    amortization: [],
    totalEarlyPayments: 0,
    totalPrinciple: 0,
    optionArray: ['select year']
}
const extraPaymentScheule = new Map();
const interestRateMap = new Map();
const adjustedEmiMap = new Map();
let formFields = [
    { name: 'loanAmount', required: true },
    { name: 'interestRate', required: true },
    { name: 'loanPeriod', required: true },
    { name: 'emiStartDate', required: false },
    { name: 'emiAmount', required: false }
]


$(document).ready(() => {
    const reload = () => {
        if (getFormData()) {
            loanOutputDetails = emptyOutPut();
            calculateAmortization();
            table.bootstrapTable('load', loanOutputDetails.amortization);
            mySelect
                .empty()
                .append(loanOutputDetails.optionArray.join(' '));
            //set final values
            $('#emiAmount').val(loanOutputDetails.emi);
            $('#actualMonths').val((loanDetailsFormData.loanPeriod ?? 0) * 12);
            $('#reducedMonths').val(loanOutputDetails.amortization.length);


        }
    }
    const table = $('#table');
    // Append the option to select
    const mySelect = $('#myselect');
    // month picker
    $(".monthpicker")
        .datepicker({
            format: "MM-yyyy",
            minViewMode: "months",
            autoclose: true,
        }).datepicker("setDate", 'now')
        .on("change", function (e) {
            console.log('date picker reloading..........')
            reload();
        });

    mySelect.change(() => {
        reload()
    });

    formFields = formFields.map(({ name, required }) => {
        const field = $(`#${name}`);
        if (required) field.on('change', () => reload())
        return { name, field, required }
    })
    reload();
    table.bootstrapTable({
        columns: columns,
        data: loanOutputDetails.amortization,
    });

    $('#saveModelChanges').on('click', () => {
        const index = $('#saveModelChanges').data('index');
        if (index != undefined && index > -1) {
            let { extraPayment, interestRate, emi } = getModel();
            extraPayment = eval(extraPayment.replace(/,/g, ""))
            interestRate = eval(interestRate.replace(/,/g, ""))
            emi = eval(emi.replace(/,/g, ""))

            for (let i = index; i < loanOutputDetails.amortization.length; i++) {
                interestRateMap.set(i, interestRate);
                adjustedEmiMap.set(i, emi);
            }
            extraPaymentScheule.set(index, extraPayment);
            console.log({ extraPaymentScheule, interestRateMap, adjustedEmiMap })
            reload();
            const modalObj = $('#exampleModal');
            modalObj.modal('hide');
        }
    })
    $('#exampleModal').on('show.bs.modal', function (event) {
        let button = $(event.relatedTarget) // Button that triggered the modal
        let index = button.attr('id').split('-')[1];
        let rowData = { ...loanOutputDetails.amortization[index] };
        console.log(rowData)
        $(this).find('.modal-title').html(`<b> Loan Details </b>  <small> [Month : ${rowData.emiDate}]  </small>`);
        setModel(rowData)
        $('#saveModelChanges').data('index', rowData.id)
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

const getFormData = () => {
    let flag = true;
    // get form field values
    formFields.map(({ name, field, required }) => {
        let value = isNotNull(field.val()) ? field.val() : '0';
        if (required && value == '0') flag = false;
        if (name != 'emiStartDate') {
            value = eval(value.replace(/,/g, ""))
        } else {
            if (value == '0') {
                console.log(field.val())
            }
        }
        loanDetailsFormData[name] = value;
    });
    return flag;
}

const calculateAmortization = () => {
    let { loanAmount, interestRate, loanPeriod, emiStartDate } = loanDetailsFormData;
    let { emi, totalInterest, amortization, totalEarlyPayments, totalPrinciple, optionArray } = loanOutputDetails;
    const selectedYear = $('#myselect').val();
    let emiDate = emiStartDate != 0 ? new Date(emiStartDate) : new Date();

    emi = calculateEmi(interestRate, loanPeriod, loanAmount)

    let endingBalance = loanAmount;
    for (let i = 0; endingBalance > emi; i++) {

        emiDate = new Date(emiDate.setMonth(emiDate.getMonth() + 1));
        const currentYear = emiDate.getFullYear();
        const value = emiDate.getMonth() < 3 ? `${currentYear - 1}-${currentYear}` : `${currentYear}-${currentYear + 1}`;
        const option = `<option value="${value}" ${selectedYear == value ? 'selected' : ''}> ${value}</option>`;
        if (!optionArray.includes(option)) optionArray.push(option);
        let { extraPaymentForThisInstallment, interestRateforThisMonth, emiThisMonth } = getValue(i, interestRate, emi);

        //assing new values of emi, interestRate
        emi = emiThisMonth;
        interestRate = interestRateforThisMonth;
        const beginingBalance = endingBalance;

        // calculate roi
        const roi = interestRate / 12 / 100;
        // calculate interest_amount
        const interestAmount = (beginingBalance - extraPaymentForThisInstallment) * roi;
        // calculate principle_amount
        let principleAmount = emi - interestAmount;
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
        totalPayMent = extraPaymentForThisInstallment + emi;
        if (selectedYear == 'select year' || validateDate(emiDate, selectedYear)) {
            totalInterest += interestAmount;
            totalPrinciple += principleAmount;
            totalEarlyPayments += extraPaymentForThisInstallment;

            totalPayMentString = extraPaymentForThisInstallment > 0 ?
                `${AMOUNT_FORMAT.format(Math.round(emi))} + ${AMOUNT_FORMAT.format(Math.round(extraPaymentForThisInstallment))}` :
                AMOUNT_FORMAT.format(Math.round(emi));

            amortization.push({
                id: i,
                month: i + 1,
                emiDate: emiDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                }),
                beginingBalance: AMOUNT_FORMAT.format(Math.round(beginingBalance)),
                endingBalance: AMOUNT_FORMAT.format(Math.round(endingBalance)),
                totalPayMent: totalPayMentString,
                principleAmount: AMOUNT_FORMAT.format(Math.round(principleAmount)),
                interestAmount: AMOUNT_FORMAT.format(Math.round(interestAmount)),
                extraPayment: AMOUNT_FORMAT.format(Math.round(extraPaymentForThisInstallment)),
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
    renderChart(Math.round(totalPrinciple + (selectedYear == 'select year' ? endingBalance: 0) + totalEarlyPayments), totalInterest);

    console.log(loanOutputDetails)

}