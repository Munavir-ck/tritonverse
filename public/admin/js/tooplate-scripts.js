const width_threshold = 480;
 



function drawLineChart() {

  $.ajax({
   url:"/admin/monthlylineChart",
   method:"get",
   success:((res)=>{
    if(res.status){

      if ($("#lineChart").length) {
        ctxLine = document.getElementById("lineChart").getContext("2d");
        optionsLine = {
          scales: {
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: "Hits"
                }
              }
            ]
          }
        };
    
        // Set aspect ratio based on window width
        optionsLine.maintainAspectRatio =
          $(window).width() < width_threshold ? false : true;
    
        configLine = {
          type: "line",
          data: {
            labels: [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              // "August",
              // "September"
            ],
            datasets: [
              {
                label: "Monthly Turnover",
                data: res.ordersTotal,
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                cubicInterpolationMode: "monotone",
                pointRadius: 0
              },
              {
                label: "Monthly Profit",
                data: res.salesprofit,
                fill: false,
                borderColor: "rgba(255,99,132,1)",
                cubicInterpolationMode: "monotone",
                pointRadius: 0
              },
              {
                label: "Total Order",
                data:  res.orderCount,
                fill: false,
                borderColor:  "rgba(153, 102, 255, 1)",
                cubicInterpolationMode: "monotone",
                pointRadius: 0
              }
            ]
          },
          options: optionsLine
        };
    
        lineChart = new Chart(ctxLine, configLine);
      }



    }
   })


  })
 
}

function drawBarChart() {

 $.ajax({
  url:"/admin/drawBarChart",
  method:"get",
  success:((res)=>{
    if(res.status==true){
      console.log(111111111111111111);
      if ($("#barChart").length) {
        ctxBar = document.getElementById("barChart").getContext("2d");
    
        optionsBar = {
          responsive: true,
          scales: {
            yAxes: [
              {
                barPercentage: 0.2,
                ticks: {
                  beginAtZero: true
                },
                scaleLabel: {
                  display: true,
                  labelString: "Hits"
                }
              }
            ]
          }
        };
    
        optionsBar.maintainAspectRatio =
          $(window).width() < width_threshold ? false : true;
    
        /**
         * COLOR CODES
         * Red: #F7604D
         * Aqua: #4ED6B8
         * Green: #A8D582
         * Yellow: #D7D768
         * Purple: #9D66CC
         * Orange: #DB9C3F
         * Blue: #3889FC
         */
    
        configBar = {
          type: "horizontalBar",
          data: {
            labels:res.years,
            datasets: [
              {
                label: "# of Hits",
                data:res.totalSales,
                backgroundColor: [
                  "#F7604D",
                  "#4ED6B8",
                  "#A8D582",
                  "#D7D768",
                  "#9D66CC",
                  "#DB9C3F",
                  "#3889FC"
                ],
                borderWidth: 0
              }
            ]
          },
          options: optionsBar
        };
    
        barChart = new Chart(ctxBar, configBar);
      }
    }
  })
 })



 
}

function drawPieChart() {

  $.ajax({
    url:"/admin/graph",
    method:"get",
    success:((res)=>{
     if(res.data){

      if ($("#pieChart").length) {
        var chartHeight = 300;
    
        $("#pieChartContainer").css("height", chartHeight + "px");
    
        ctxPie = document.getElementById("pieChart").getContext("2d");
    
        optionsPie = {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              left: 10,
              right: 10,
              top: 10,
              bottom: 10
            }
          },
          legend: {
            position: "top"
          }
        };
    
        configPie = {
          type: "pie",
          data: {
            datasets: [
              {
                data: res.data,
                backgroundColor: [ "#4ED6B8","#F7604D","#A8D582"],
                label: "Order"
              }
            ],
            labels: [
              "Delivered-"+( res.data[0]),
              "Cancelled-"+( res.data[1]),
              "Returned-"+( res.data[2]),
            ]
          },
          options: optionsPie
        };
    
        pieChart = new Chart(ctxPie, configPie);
      }
    }
    })
  })
 
}

function updateLineChart() {
  if (lineChart) {
    lineChart.options = optionsLine;
    lineChart.update();
  }
}

function updateBarChart() {
  if (barChart) {
    barChart.options = optionsBar;
    barChart.update();
  }
}
