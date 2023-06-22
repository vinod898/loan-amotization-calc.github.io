function renderChart(principle, interest) {
    if (
      RENDRED_CHART_DATA.PRINCIPLE != principle ||
      RENDRED_CHART_DATA.INTEREST != interest
    ) {
      RENDRED_CHART_DATA.PRINCIPLE = principle;
      RENDRED_CHART_DATA.INTEREST = interest;
    } else {
      return;
    }
  
    document.querySelector("#chart-area").innerHTML = "";
  
    var options = {
      series: [Math.round(principle), Math.round(interest)],
      colors: ["#ff6e54", "#dd5182"],
      tooltip: {
        fillSeriesColor: false,
        y: {
          formatter: function (val) {
            return AMOUNT_FORMAT.format(val);
          },
        },
      },
      chart: {
        type: "pie",
        foreColor: "#373d3f",
        dropShadow: {
          enabled: true,
        },
      },
      labels: ["Loan Principle", "Total Interest"],
      dataLabels: {
        enabled: true,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      legend: {
        position: "bottom",
        horizontalAlign: "center",
      },
    };
  
    var chart = new ApexCharts(document.querySelector("#chart-area"), options);
    chart.render();
    CHART_RENDERED = true;
  }
  