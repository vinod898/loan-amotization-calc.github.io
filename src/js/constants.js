const columns = [
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
    },
    {
        field: 'operate',
        align: 'center',
        valign: 'middle',
        clickToSelect: true,
        formatter : function(value,row,index) {
          //return '<input name="elementname"  value="'+value+'"/>';
          return `<button id='editData-${row.id}'  class=\'btn btn-primary \'  data-toggle="modal" data-target="#exampleModal" >Edit</button>`;
        }
      }
    ];

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
    PARTPAYMENT : 0
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
    return currentDate.getTime() >= firstYear.getTime() && currentDate.getTime() <= NextYear.getTime()
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
        optionArray : ['<option value=\"select year\"> select year</option>']

    };
}

const setModel = (rowData) => {
    const { emiDate, beginingBalance, endingBalance, totalPayMent, extraPayment, principleAmount, interestAmount, interestRate, emi } = rowData;
   
    $('#modelBeginningBalance').val(beginingBalance);
    $('#modelEndingBalance').val(endingBalance);
    $('#modelEMIDate').val(emiDate);
    $('#modelPrincAmount').val(principleAmount);
    $('#modelInterestAmount').val(interestAmount);
    $('#modelInterestRate').val(interestRate);
    $('#modelEMIAmount').val(emi);
    $('#modelExtraPayment').val(extraPayment);
}


const getModel = () => {
    const interestRate = $('#modelInterestRate').val();
    const emi = $('#modelEMIAmount').val();
    const extraPayment = $('#modelExtraPayment').val();
    return { extraPayment, interestRate, emi };

}