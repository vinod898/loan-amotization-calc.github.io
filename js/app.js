var amortSchedule = [];
let loanAmountField; let interestRateField; let loanPeriodField; let loanStartDateField; let amortTable;
let amortTableBody; let partPayInstallmentField; let emiAmountField; let numberOfPaymentsField;
let actNumberOfPaymentsField; let totalEarlyPaymentsField; let totalInterestField;

$(document).ready(function () {
  console.log("Hello, JavaTpoint");
  loanAmountField = $("#loan_amount");
  loanAmountField.on("change", (e) => calculateEmiAmount());

  interestRateField = $("#interest_rate");
  interestRateField.on("change", (e) => calculateEmiAmount());

  loanPeriodField = $("#loan_period");
  loanPeriodField.on("change", (e) => calculateEmiAmount());

  loanStartDateField = $("#loan_start_date"); ``
  loanStartDateField.on("change", (e) => calculateEmiAmount());

  if (loanStartDateField.val() == undefined || loanStartDateField.val() == "") {

    const currentDate = new Date()
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
      .split(" ")
      .join("-");

    loanStartDateField.val(currentDate);
  }

  partPayInstallmentField = $("#part_payment_installment");
  partPayInstallmentField.on("change", (e) => calculateEmiAmount());

  amortTable = $("#amort_table");
  amortTableBody = $("#amort_table tbody");
  emiAmountField = $("#emi_amount");
  numberOfPaymentsField = $("#number_of_payments");
  actNumberOfPaymentsField = $("#actual_number_of_payments");
  totalEarlyPaymentsField = $("#total_early_payments");
  totalInterestField = $("#total_interest");
  calculateEmiAmount();
});

const RENDRED_CHART_DATA = {
  PRINCIPLE: 0,
  INTEREST: 0,
};

// month picker
$(".monthpicker")
  .datepicker({
    format: "MM-yyyy",
    minViewMode: "months",
    autoclose: true,
  })
  .on("change", function (e) {
    calculateEmiAmount();
  });

var CHART_RENDERED = false;
const interestRateMap = new Map();
const emiMap = new Map();

function calculateEmiAmount(event) {

  const partPaymentsField = $("input[name='part_payments']:checked");
  const partPaymentFrequency = $("input[name='schedule_frequecy']:checked").val();
  const extraPaymentScheule = new Map();
  const loanAmountField1 = isNotEmpty(loanAmountField);
  const interestRateField1 = isNotEmpty(interestRateField);
  const loanPeriodField1 = isNotEmpty(loanPeriodField);
  const loanStartDateField1 = isNotEmpty(loanStartDateField);

  if (loanAmountField1 && interestRateField1 && loanPeriodField1 && loanStartDateField1) {
    // ### Do amrtization schedule calculate #### //

    // Gets values from fields
    loanAmount = loanAmountField.val();
    loanAmount = eval(loanAmount.replace(/,/g, ""));
    interestRate = interestRateField.val();
    loanPeriod = loanPeriodField.val();
    loanStartDate = loanStartDateField.val();
    partPayment = partPaymentsField.val();
    isPartPaymentEnabled = partPayment != "off";
    $('#part_payment_hdr').attr("style", `display:${isPartPaymentEnabled ? "block" : "none"}`);
    $(".scheduled_payment_section").each((index, element) => {
      element.setAttribute("style", `display:${partPayment == "scheduled_plan" ? null : "none"}`)
    });

    let partPayInstallment = eval(
      partPayInstallmentField.val().replace(/,/g, "")
    );

    if (partPayInstallment != undefined) {
      partPayInstallmentField.val(AMOUNT_FORMAT.format(partPayInstallment));
    }
    $(".interestRates").each((index, element) => {
      interestRateMap.set(
        eval(element.getAttribute('data-index')) + 1,
        eval(element.value.replace(/,/g, ""))
      );
    });

    $(".emi").each((index, element) => {
      emiMap.set(
        eval(element.getAttribute('data-index')) + 1,
        eval(element.value.replace(/,/g, ""))
      );
    });

    if (event) {
      const { target: { id, value, defaultValue } = {} } = event;
      const newValue = eval(value.replace(/,/g, ""));
      if (id?.includes("interestRates")) {
        const modifiedEventId = parseInt(id.split("-")[1]);
        console.log({ id, modifiedEventId })
        $(".interestRates")
          .each((index, element) => {
            if (index >= modifiedEventId) {
              interestRateMap.set(index + 1, newValue);
            }
          });
      }

      if (id?.includes("emi")) {
        const modifiedEventId = parseInt(id.split("-")[1]);
        console.log({ id, modifiedEventId })
        $(".interestRates")
          .each((index, element) => {
            if (index >= modifiedEventId) {
              emiMap                                          .set(index + 1, newValue);
            }
          });
      }
    }

    // Calculating EMI
    const emi = calculateEmi(interestRate, loanPeriod, loanAmount);

    // Preserving extra payments added before a change
    if (partPayment == "scheduled_plan") {
      let frequencyFactor = partPaymentFrequencyMap[partPaymentFrequency];
      if (partPayInstallment != null && partPayInstallment != undefined && partPayInstallment > 0) {
        for (let index = 0; index < nom; index++) {
          extraPaymentScheule.set(
            index + 1,
            index % frequencyFactor == 0 ? partPayInstallment : null
          );
        }
      }
    } else {
      $(".extra_payments").each((index, element) => {
        extraPaymentScheule.set(eval(element.getAttribute('data-index')) + 1, eval(element.value.replace(/,/g, "")));
      })
    }

    // Write EMI field
    emiAmountField.val(AMOUNT_FORMAT.format(emi));
    loanAmountField.val(AMOUNT_FORMAT.format(loanAmount));
    numberOfPaymentsField.val(nom);

    const dateParts = loanStartDate.split("-");
    let emiDate = new Date(dateParts[1], month.indexOf(dateParts[0]), 1);
    let principle = loanAmount;
    amortSchedule = [];
    var totalEarlyPayments = 0;
    var totalInterest = 0;


    let ending_balance = principle;
    let i = 1;
    while (ending_balance > emi) {
      emiDate = new Date(emiDate.setMonth(emiDate.getMonth() + 1));
      extraPaymentForThisInstallment =
        extraPaymentScheule.get(i) != null ? extraPaymentScheule.get(i) : 0;

      const begining_balance = ending_balance;
      // calculate roi
      const interestRateMonth = interestRateMap.get(i) != null ? interestRateMap.get(i) : interestRate;
      const emiMonth = emiMap.get(i) != null ? emiMap.get(i) : emi;
      const roi = interestRateMonth / 12 / 100;
      // calculate interest_amount
      const interest_amount = begining_balance * roi;
      totalInterest += interest_amount;
      // calculate principle_amount
      const principle_amount = emiMonth - interest_amount;
      // check interest is morethan emi and adjust
      if (principle_amount < 0) {
        // adjust emi
        emiMonth = calculateEmi(interestRate, loanPeriod, loanAmount);
        principle_amount = emiMonth - interest_amount;
      }
      ending_balance = begining_balance - (principle_amount + extraPaymentForThisInstallment);

      // check pay for last installment
      if (ending_balance < 0) {
        extraPaymentForThisInstallment = (begining_balance - principle_amount);
        ending_balance = 0;
      }
      totalEarlyPayments += isPartPaymentEnabled
        ? extraPaymentForThisInstallment
        : 0;


      amortSchedule.push({
        payment_date: emiDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
        }),
        extra_payment:
          extraPaymentScheule.get(i) != null
            ? AMOUNT_FORMAT.format(Math.round(extraPaymentForThisInstallment))
            : "",
        begining_balance,
        totalPayMonth: emiMonth + extraPaymentForThisInstallment,
        principle_amount,
        interest_amount,
        ending_balance,
        interestRateMonth,
        emiMonth
      });
      i++;
    }

    if (amortSchedule.length > 0) {
      amortTable.attr("style", `display:block"}`);
      var tableBody = "";
      amortSchedule.forEach((schedule, index) => {
        const {
          extra_payment,
          payment_date,
          begining_balance,
          totalPayMonth,
          principle_amount,
          interest_amount,
          ending_balance,
          interestRateMonth,
          emiMonth } = schedule;
        const trClass = extra_payment && isPartPaymentEnabled ? "table-success" : "";
        tableBody += `<tr class='${trClass}'>
            <td class='text-center'>${index + 1} </td>
            <td class='text-center'>${payment_date} </td>
            <td class='text-right'>${AMOUNT_FORMAT.format(Math.round(begining_balance))} </td>
            <td class='text-right hide'>${AMOUNT_FORMAT.format(Math.round(emi))} </td>
            <td class='${isPartPaymentEnabled ? "" : "hide"}'>
              <input value='${extra_payment}'   data-index='${index}'  type='text' class='form-control form-control-sm extra_payments numeric' />
            </td>
            <td class='text-right'>
              <input value='${emiMonth}' id='emi-${index}'  data-index='${index}'  type='text' class='form-control form-control-sm emi numeric' />
            </td>
            <td class='text-right'>${AMOUNT_FORMAT.format(Math.round(totalPayMonth))} </td>
            <td class='text-right'>${AMOUNT_FORMAT.format(Math.round(principle_amount))} </td>
            <td class='text-right'>${AMOUNT_FORMAT.format(Math.round(interest_amount))} </td>
            <td class='text-right'>${AMOUNT_FORMAT.format(Math.round(ending_balance))} </td>
            <td class='text-right'>
              <input value='${interestRateMonth}' id='interestRates-${index}'  data-index='${index}'  type='text' class='form-control form-control-sm interestRates numeric' />
            </td>
        </tr>` });

      amortTableBody.html(tableBody);
    } else {
      amortTable.attr("style", `display:none"}`);
    }

    actNumberOfPaymentsField.val(amortSchedule.length);
    totalEarlyPaymentsField.val(AMOUNT_FORMAT.format(totalEarlyPayments));
    totalInterestField.val(AMOUNT_FORMAT.format(Math.round(totalInterest)));
    $(".extra_payments")
      .each((index, element) =>
        element.addEventListener("change", (e) => calculateEmiAmount(e))
      );

    $(".interestRates")
      .each((index, element) =>
        element.addEventListener("change", (e) => calculateEmiAmount(e))
      );

      $(".emi")
      .each((index, element) =>
        element.addEventListener("change", (e) => calculateEmiAmount(e))
      );
    renderChart(loanAmount, totalInterest);
  }
}

