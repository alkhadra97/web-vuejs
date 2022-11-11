<template>
  <client-only>
    <div id="chart">
      <VueApexCharts
        type="line"
        height="277"
        width="648"
        :options="chartOptions"
        :series="series1"
      ></VueApexCharts>
      <!-- {{ getAllTimeAttendanceInfo.data }} -->
    </div>
  </client-only>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  props: {
    employeeUuid: {
      type: String,
    },
  },
  async mounted() {
    await this.actionForGettingAllTimeAttendance({
      uuid: this.employeeUuid,
      date: null,
    });
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
          height: 350,
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
        title: {
          text: "Actual Working Hours /Week",
          align: "left",
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
  methods: {
    ...mapActions(["actionForGettingAllTimeAttendance"]),
  },
  computed: {
    ...mapGetters(["getAllTimeAttendanceInfo"]),

    series1() {
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
        this.getAllTimeAttendanceInfo.data?.forEach((element) => {
          if (
            element.date >= onlyDate &&
            element.date < currentDate &&
            (((element.status == "out" ||
              element.statusForMissingPunsh == "accepted") &&
              element.checkIn != null &&
              element.checkOut != null) ||
              (element.status == "missing punch (both)" &&
                element.statusForMissingPunsh == "accepted") ||
              (element.status == "missing punch (checkIn)" &&
                element.statusForMissingPunsh == "accepted") ||
              (element.status == "missing punch (checkOut)" &&
                element.statusForMissingPunsh == "accepted"))
          ) {
            arr.push({
              totalHours: element.totalHoursPerDay,
              date: element.date,
            });
          }
        });
        ///////////////current month and year
        let oddMonth;
        let currentMonth = new Date().getMonth() + 1;
        const count = String(Math.abs(currentMonth)).length;

        if (count == 1) {
          oddMonth = "0" + currentMonth;
        } else {
          oddMonth = currentMonth;
        }
        let currentYear = new Date().getFullYear();
        ////////////////divide into 4 arrays (4 weeks)
        let week1 = [];
        let week2 = [];
        let week3 = [];
        let week4 = [];
        let allWeeks = [];
        arr.forEach((element) => {
          if (
            element.date >= `${currentYear}-${oddMonth}-01` &&
            element.date <= `${currentYear}-${oddMonth}-07`
          ) {
            week1.push(element.totalHours);
          } else if (
            element.date >= `${currentYear}-${oddMonth}-08` &&
            element.date <= `${currentYear}-${oddMonth}-14`
          ) {
            week2.push(element.totalHours);
          } else if (
            element.date >= `${currentYear}-${oddMonth}-15` &&
            element.date <= `${currentYear}-${oddMonth}-21`
          ) {
            week3.push(element.totalHours);
          } else if (
            element.date >= `${currentYear}-${oddMonth}-21` &&
            element.date <= `${currentYear}-${oddMonth}-30`
          ) {
            week4.push(element.totalHours);
          }
        });
        allWeeks = [...allWeeks, week1, week2, week3, week4];
        let allWeeksValid = [];
        allWeeks.forEach((el) => {
          if (el.length > 1) {
            allWeeksValid.push(el);
          }
        });
        ////////////////////
        const res2 = [];
        allWeeksValid.forEach((item) => {
          let sum = item
            .reduce((a, b) => parseFloat(a) + parseFloat(b))
            .toFixed(2);
          res2.push(sum);
        });
        firstArr = res2.slice(0, 4);
        ////////////////////////////////////////////////////////////////////
        return (this.series = [{ name: "Working Hours", data: firstArr }]);
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
