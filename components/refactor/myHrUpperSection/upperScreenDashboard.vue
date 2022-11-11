<template>
  <v-container>
    <v-row>
      <v-col md="3">
        <v-row>
          <v-col md="12">
            <InAndOutEmployeesChart />
          </v-col>
          <v-col md="12">
            <MoodTrackerChart />
          </v-col>
        </v-row>
      </v-col>
      <v-col md="9">
        <EmployeesCard />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

import ActualWorkingHoursForEmployeeChart from "../charts/actualWorkingHoursForEmployeeChart.vue";
import HoursPerWeekForEmployeeChart from "../charts/hoursPerWeekForEmployeeChart.vue";
import AvgAttendanceForEmployeeChart from "../charts/avgAttendanceForEmployeeChart.vue";
import EmployeeProfileCard from "../cards/employeeProfileCard.vue";
import TodayActivityForEmployee from "../cards/todayActivityForEmployee.vue";
import TodayAttendanceForEmployee from "../cards/todayAttendanceForEmployee.vue";
import MoodTrackerChart from "../charts/moodTrackerChart.vue";
import EmployeesCard from "../cards/employeesCard.vue";
import InAndOutEmployeesChart from "../charts/inAndOutEmployeesChart.vue";

export default {
  props: {
    employeeUuid: {
      type: String,
    },
  },

  mounted() {
    this.actionForEmployeesInformationApi({});
    this.actionForTimeAttendance({});
    this.actionForTimeAttendanceEmployeesApi();
  },
  methods: {
    ...mapActions([
      "actionForEmployeesInformationApi",
      "actionForTimeAttendance",
      "actionForTimeAttendanceEmployeesApi",
    ]),
  },
  components: {
    ActualWorkingHoursForEmployeeChart,
    HoursPerWeekForEmployeeChart,
    AvgAttendanceForEmployeeChart,
    EmployeeProfileCard,
    TodayActivityForEmployee,
    TodayAttendanceForEmployee,
    MoodTrackerChart,
    EmployeesCard,
    InAndOutEmployeesChart,
  },
};
</script>

<style scoped></style>
