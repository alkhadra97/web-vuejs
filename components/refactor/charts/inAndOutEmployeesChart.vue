<template>
  <v-card class="pa-4 mb-3 elevation-5" width="444" height="345">
    <v-card-title class="mb-0 py-0 justify-center">
      <p class="hours-card-title">Attendance</p>
    </v-card-title>
    <!-- <client-only>
      <div id="chart">
        <VueApexCharts
          type="donut"
          :options="chartOptions"
          :series="series.length > 0 ? series : []"
          :key="series.length"
        ></VueApexCharts>
      </div>
    </client-only> -->
    <!-- m  -->
    <div class="d-flex ml-5 mt-3">
      <v-card height="55" width="150">
        <h4 class="teal--text text-center">Employees In</h4>
        <v-divider class="mx-3"></v-divider>
        <p class="text-center mb-0" v-if="employeesCounterIn !== 0">
          {{ employeesCounterIn }}
        </p>
        <p class="text-center mb-0" v-else>--</p>
      </v-card>
      <v-card height="55" width="150" class="ml-3">
        <h4 class="red--text text-center">Employees Out</h4>

        <v-divider class="mx-3"></v-divider>

        <p class="text-center mb-0" v-if="employeesOut !== 0">
          {{ employeesOut }}
        </p>
        <p class="text-center mb-0" v-else>--</p>
      </v-card>
      <!-- </v-col> -->
    </div>
  </v-card>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { getFormattedDate } from "../../../util/dateFormatting";

export default {
  name: "AverageWorkingHoursForEmployee",
  components: {
    VueApexCharts: () => import("vue-apexcharts"),
  },
  data() {
    return {
      allEmployees: 0,
      employeesCounterIn: 0,
      // series: [0, 0],
      employeesOut: 0,
      chartOptions: {
        chart: {
          type: "donut",
        },
        colors: ["#f00", "#0f0"],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                show: false,
              },
            },
          },
        ],
      },
    };
  },
  methods: {
    async series1() {
      try {
        // here we get all employees time attendance for today and check who in or out then we reflect that on donut chart
        let arr = [];
        this.allEmployees = this.getterForEmployeesInformation.results;

        await this.getterForTimeAttendance.row.timeAttendance?.forEach(
          (element) => {
            if (
              element.date == getFormattedDate(new Date()) &&
              element.timeIn !== null &&
              (element.inStatus.id == 1 || element.inStatus.id == 3) &&
              element.timeOut === null
            ) {
              arr.push(element);
            }
          }
        );
        this.employeesCounterIn = arr.length;
        this.employeesOut = this.allEmployees * 1 - this.employeesCounterIn * 1;
      } catch (e) {
        console.log(e);
      }
    },
  },
  computed: {
    ...mapGetters(["getterForTimeAttendance", "getterForEmployeesInformation"]),
  },
  mounted() {
    this.series1();
  },
  watch: {
    getterForTimeAttendance() {
      this.series1();
    },
    getterForEmployeesInformation() {
      this.series1();
    },
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
