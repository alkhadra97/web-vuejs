<template>
  <v-card class="pa-4 mb-3 elevation-5" width="444" max-height="345">
    <v-card-title class="mb-0 py-0 justify-center">
      <p class="hours-card-title">Actual Working Hours /Week</p>
    </v-card-title>
    <client-only>
      <VueApexCharts
        max-height="250"
        :options="chartOptions"
        :series="series1"
        type="bar"
      ></VueApexCharts>
      <!-- {{ getAllTimeAttendanceInfo.data }} -->
    </client-only>
  </v-card>
</template>
<script>
import { mapGetters } from "vuex";
import { dateHelper, calculateHours } from "../../../util/dateFormatting";
export default {
  props: {
    employeeUuid: {
      type: String,
    },
  },
  data() {
    return {
      series: [
        {
          name: "hours",
          data: [],
        },
      ],
      chartOptions: {
        chart: {
          type: "line",
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: true,
        },
        stroke: {
          curve: "straight",
        },

        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: ["Week 1", "Week 2", "Week 3", "Week 4"],
        },
      },
    };
  },
  computed: {
    ...mapGetters(["getterForTimeAttendance"]),

    series1() {
      //here we bring time attendance data for employee then we calculate how many hours employee worked each week
      try {
        let arr = [];
        let firstArr;
        ///////////////
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        // This arrangement can be altered based on how we want the date's format to appear.
        let currentDate = `${year}-0${month}-${day}`;
        var dateOffset = 24 * 60 * 60 * 1000 * 30; //5 days
        var myDate = new Date();
        myDate.setTime(myDate.getTime() - dateOffset);
        // let beforeThirtyDays = myDate.toISOString().slice(0, 10);
        let date2 = new Date(),
          y = date2.getFullYear(),
          m = date2.getMonth();
        let firstDay = new Date(y, m, 1);
        let onlyDate = firstDay.toISOString().slice(0, 10);
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
            let finalInHours = calculateHours(element.timeIn, element.timeOut);
            arr.push({
              totalHours: finalInHours * 1,
              date: element.date,
            });
          }
        });
        ////////////////divide into 4 arrays (4 weeks)
        let week1 = [];
        let week2 = [];
        let week3 = [];
        let week4 = [];
        let allWeeks = [];
        console.log(
          dateHelper(1),
          " dateHelper(1)",
          dateHelper(8),
          " dateHelper(6)",
          dateHelper(30)
        );
        arr.forEach((element) => {
          if (
            element.date >= dateHelper(31) &&
            element.date <= dateHelper(25) &&
            element.date != currentDate
          ) {
            week1.push(calculateHours(element.timeIn, element.timeOut));
          } else if (
            element.date >= dateHelper(24) &&
            element.date <= dateHelper(17) &&
            element.date != currentDate
          ) {
            week2.push(element.totalHours);
          } else if (
            element.date >= dateHelper(16) &&
            element.date <= dateHelper(9) &&
            element.date != currentDate
          ) {
            week3.push(element.totalHours);
          } else if (
            element.date >= dateHelper(8) &&
            element.date <= dateHelper(1) &&
            element.date != currentDate
          ) {
            week4.push(element.totalHours);
          }
        });
        allWeeks = [...allWeeks, week1, week2, week3, week4];
        let allWeeksValid = [];
        allWeeks.forEach((el) => {
          if (el.length > 1) {
            allWeeksValid.push(el);
          } else {
            allWeeksValid.push(0);
          }
        });
        ////////////////////
        const res2 = [];
        allWeeksValid.forEach((item) => {
          if (item !== 0) {
            let sum = item
              .reduce((a, b) => parseFloat(a) + parseFloat(b))
              .toFixed(2);
            res2.push(sum);
          } else {
            res2.push(0);
          }
        });
        firstArr = res2.slice(0, 4);
        ////////////////////////////////////////////////////////////////////
        return (this.series = [{ name: "Working Hours", data: firstArr }]);
      } catch (e) {
        console.log(e, "hours per week for employee chart error");
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
