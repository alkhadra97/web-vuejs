<template>
  <v-card class="pa-4 mb-3 elevation-5" width="444" max-height="345">
    <v-card-title class="mb-0 py-0 justify-center">
      <p class="hours-card-title">Average CheckIn & CheckOut</p>
    </v-card-title>
    <client-only>
      <div id="chart">
        <VueApexCharts
          type="line"
          :options="chartOptions"
          :series="series1"
          ref="exampleChart"
        ></VueApexCharts>
      </div>
    </client-only>
  </v-card>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "AverageWorkingHoursForEmployee",

  data() {
    return {
      // data: [],
      series: [
        {
          name: "Check In",
          data: [],
        },
        {
          name: "Check Out",
          data: [],
        },
      ],
      chartOptions: {
        chart: {
          height: 350,
          type: "line",
          dropShadow: {
            enabled: true,
            color: "#000",
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2,
          },
          toolbar: {
            show: false,
          },
        },
        colors: ["#009688", "#F44336"],
        dataLabels: {
          enabled: true,
        },
        stroke: {
          curve: "smooth",
        },

        grid: {
          borderColor: "#e7e7e7",
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        markers: {
          size: 1,
        },
        xaxis: {
          categories: ["week 1", "week 2", "week 3", "week 4"],
          // title: {
          //   text: "Month",
          // },
        },
        yaxis: {
          title: {
            text: "Clock",
          },
          min: 8,
          max: 23,

          labels: {},
        },

        legend: {
          position: "top",
        },
      },
    };
  },
  computed: {
    ...mapGetters(["getterForTimeAttendance"]),

    series1() {
      //here we get all check in and out for employee then we calculate the average for one month
      try {
        let todayDate = new Date().toISOString().slice(0, 10);
        let date = new Date(),
          y = date.getFullYear(),
          m = date.getMonth();
        let firstDay = new Date(y, m, 1);
        let onlyDate = firstDay.toISOString().slice(0, 10);

        const arr = [];
        const arr2 = [];
        let firstArr;
        let secondArr;
        ///////////////

        this.getterForTimeAttendance.row.timeAttendance?.forEach((element) => {
          if (
            (element.inStatus !== null &&
              element.inStatus.name.en == "Accepted" &&
              element.outStatus !== null &&
              element.outStatus.name.en == "Accepted") ||
            (element.inStatus !== null &&
              element.inStatus.name.en == "missingAccepted" &&
              element.outStatus !== null &&
              element.outStatus.name.en == "Accepted") ||
            (element.inStatus !== null &&
              element.inStatus.name.en == "Accepted" &&
              element.outStatus !== null &&
              element.outStatus.name.en == "missingAccepted") ||
            (element.inStatus !== null &&
              element.inStatus.name.en == "missingAccepted" &&
              element.outStatus !== null &&
              element.outStatus.name.en == "missingAccepted")
          ) {
            console.log(element.timeIn, "element.timeInelement.timeIn");
            let mins = element.timeIn.slice(3, 5);
            let hrs = element.timeIn.slice(0, 2) * 60;
            let finalCheckInMins = parseInt(mins) + parseInt(hrs);
            let hours = finalCheckInMins / 60;
            let rhours = Math.floor(hours);
            let minutes = (hours - rhours) * 60;
            let rminutes = Math.round(minutes);
            let finalTime = rhours + "." + rminutes;

            arr.push(finalTime);
          }
        });
        console.log(arr, "arrrrrrrrr");
        const res = [];
        for (let i = 0; i < arr.length; i += 3) {
          const chunk = arr.slice(i, i + 3);
          res.push(chunk);
        }
        ////////////////////
        const res2 = [];
        res.forEach((item) => {
          let sum = item.reduce((a, b) => parseFloat(a) + parseFloat(b));
          let avgSum = (sum / item.length).toFixed(2);
          res2.push(avgSum);
        });
        firstArr = res2.slice(0, 4);

        ////////////////////////////////////////////////////////////////////
        this.getterForTimeAttendance.row.timeAttendance.forEach((element) => {
          if (element.timeOut == null) {
            return;
          }
          if (
            element.date > onlyDate &&
            element.date < todayDate &&
            ((element.inStatus !== null &&
              element.inStatus.name.en == "Accepted" &&
              element.outStatus !== null &&
              element.outStatus.name.en == "Accepted") ||
              (element.inStatus !== null &&
                element.inStatus.name.en == "missingAccepted" &&
                element.outStatus !== null &&
                element.outStatus.name.en == "Accepted") ||
              (element.inStatus !== null &&
                element.inStatus.name.en == "Accepted" &&
                element.outStatus !== null &&
                element.outStatus.name.en == "missingAccepted") ||
              (element.inStatus !== null &&
                element.inStatus.name.en == "missingAccepted" &&
                element.outStatus !== null &&
                element.outStatus.name.en == "missingAccepted"))
          ) {
            let hrs = element.timeOut.slice(0, 2) * 60;
            let mins = element.timeOut.slice(3, 5);
            let finalCheckInMins = parseInt(mins) + parseInt(hrs);
            let hours = finalCheckInMins / 60;
            let rhours = Math.floor(hours);
            let minutes = (hours - rhours) * 60;
            let rminutes = Math.round(minutes);
            let finalTime = rhours + "." + rminutes;
            arr2.push(finalTime);
          }
        });
        const res3 = [];
        for (let i = 0; i < arr2.length; i += 3) {
          const chunk = arr2.slice(i, i + 3);
          res3.push(chunk);
        }
        ////////////////////
        const res4 = [];
        res3.forEach((item) => {
          let sum = item.reduce((a, b) => parseFloat(a) + parseFloat(b));
          let avgSum = (sum / item.length).toFixed(2);
          res4.push(avgSum);
        });
        secondArr = res4.slice(0, 4);
        ///////////////////////////////////////////

        return (this.series = [
          { name: "Check In", data: firstArr },
          { name: "Check Out", data: secondArr },
        ]);
      } catch (e) {
        console.log(e, "avg attendance for employee chart error");
      }
    },
  },
  components: {
    VueApexCharts: () => import("vue-apexcharts"),
  },
};
</script>
<style scoped>
.hours-card-title {
  font-size: 1.3824rem;
  line-height: 2em;
  color: #194569;
  margin-top: 1em auto;
}
</style>
