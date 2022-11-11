<template v-if="getAllTimeAttendanceInfo.data.length > 0">
  <client-only>
    <div id="chart">
      <!-- <v-row class="justify-space-around">
        <p class="time-attendance-title">Average CheckIn & CheckOut</p>
     
      </v-row> -->
      <VueApexCharts
        type="line"
        height="258"
        width="648"
        :options="chartOptions"
        :series="series1"
        ref="exampleChart"
      ></VueApexCharts>
      <!-- {{ getAllTimeAttendanceInfo.data }} -->
    </div>
  </client-only>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "AverageWorkingHoursForEmployee",

  async mounted() {},
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
        title: {
          text: "Average CheckIn & CheckOut",
          align: "left",
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

          labels: {
            // formatter: function (val) {
            //   // console.log(val);
            //   var today = new Date(val);
            //   return today.getHours() + ":" + today.getMinutes();
            // },
          },
        },

        legend: {
          // show: false,
          position: "top",
        },
        // legend: {
        //   position: "top",
        //   horizontalAlign: "right",
        //   floating: true,
        //   offsetY: -25,
        //   offsetX: -5,
        // },
      },
    };
  },
  methods: {
    // ...mapActions(["actionForGettingAllTimeAttendance"]),
    // viewAttendanceBtn() {
    //   this.$router.push("/hrpages/attendance/" + this.employeeUuid);
    // },
  },
  computed: {
    ...mapGetters(["getAllTimeAttendanceInfo"]),
    series1() {
      try {
        let todayDate = new Date().toISOString().slice(0, 10);
        let date = new Date(),
          y = date.getFullYear(),
          m = date.getMonth();
        let firstDay = new Date(y, m, 1);
        let onlyDate = firstDay.toISOString().slice(0, 10);
        // console.log(onlyDate);
        // this.getAllTimeAttendanceInfo.data.map
        const arr = [];
        const arr2 = [];
        let firstArr;
        let secondArr;
        ///////////////
        this.getAllTimeAttendanceInfo.data?.forEach((element) => {
          // console.log(element);
          if (
            (element.checkIn.length >= 5 &&
              element.checkIn != null &&
              element.checkIn != "" &&
              element.checkIn != "null" &&
              element.status == "out" &&
              element.date > onlyDate &&
              element.date < todayDate) ||
            (element.statusForMissingPunsh == "accepted" &&
              element.date > onlyDate &&
              element.date < todayDate &&
              element.checkIn != null &&
              element.checkIn != "" &&
              element.checkIn != "null")
          ) {
            let mins = element.checkIn.slice(3, 5);
            let hrs = element.checkIn.slice(0, 2) * 60;
            let finalCheckInMins = parseInt(mins) + parseInt(hrs);
            let hours = finalCheckInMins / 60;
            let rhours = Math.floor(hours);
            let minutes = (hours - rhours) * 60;
            let rminutes = Math.round(minutes);
            let finalTime = rhours + "." + rminutes;

            arr.push(finalTime);
          } else if (
            (element.status == "out" &&
              element.checkIn != null &&
              element.checkIn != "" &&
              element.checkIn != "null" &&
              element.date > onlyDate &&
              element.date < todayDate) ||
            (element.statusForMissingPunsh == "accepted" &&
              element.checkIn != null &&
              element.checkIn != "" &&
              element.checkIn != "null" &&
              element.date > onlyDate &&
              element.date < todayDate)
          ) {
            let hrs = element.checkIn.slice(0, 1) * 60;
            let mins = element.checkIn.slice(2, 4);
            let finalCheckInMins = parseInt(mins) + parseInt(hrs);
            let hours = finalCheckInMins / 60;
            let rhours = Math.floor(hours);
            let minutes = (hours - rhours) * 60;
            let rminutes = Math.round(minutes);
            let finalTime = rhours + "." + rminutes;
            arr.push(finalTime);
          }
        });

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
        this.getAllTimeAttendanceInfo.data?.forEach((element) => {
          if (element.checkOut == null) {
            return;
          } else if (
            element.checkOut.length < 5 &&
            element.checkOut != null &&
            element.checkOut != "" &&
            element.checkOut != "null" &&
            element.date != todayDate &&
            ((element.status == "out" &&
              element.date > onlyDate &&
              element.date < todayDate) ||
              element.statusForMissingPunsh == "accepted") &&
            element.date > onlyDate &&
            element.date < todayDate
          ) {
            let hrs = element.checkOut.slice(0, 1) * 60;
            let mins = element.checkOut.slice(2, 4);
            let finalCheckInMins = parseInt(mins) + parseInt(hrs);
            let hours = finalCheckInMins / 60;
            let rhours = Math.floor(hours);
            let minutes = (hours - rhours) * 60;
            let rminutes = Math.round(minutes);
            let finalTime = rhours + "." + rminutes;
            arr2.push(finalTime);
          } else if (
            element.checkOut.length >= 5 &&
            element.checkOut != null &&
            element.checkOut != "" &&
            element.checkOut != "null" &&
            ((element.status == "out" &&
              element.date > onlyDate &&
              element.date < todayDate) ||
              element.statusForMissingPunsh == "accepted") &&
            element.date > onlyDate &&
            element.date < todayDate
          ) {
            let hrs = element.checkOut.slice(0, 2) * 60;
            let mins = element.checkOut.slice(3, 5);
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
        console.log(e);
      }
    },
  },
  components: {
    VueApexCharts: () => import("vue-apexcharts"),
  },
};
</script>
<style scoped>
.time-attendance-title {
  text-align: center;
  font-weight: bold;
  color: #000000;
  margin-top: 2em auto;
  padding-bottom: 0.2em;
}
</style>
