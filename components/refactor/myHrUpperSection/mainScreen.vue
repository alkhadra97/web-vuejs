<template>
  <v-container>
    <v-row>
      <v-col md="9">
        <v-row>
          <v-col md="4">
            <TodayAttendanceForEmployee :employeeId="employeeId" />
          </v-col>
          <v-col md="5">
            <ActualWorkingHoursForEmployeeChart :employeeId="employeeId" />
          </v-col>

          <v-col md="3">
            <TodayActivityForEmployee />
          </v-col>
          <v-col md="4">
            <HoursPerWeekForEmployeeChart :employeeId="employeeId" />
          </v-col>
          <v-col md="4">
            <AvgAttendanceForEmployeeChart :employeeId="employeeId" />
          </v-col>
          <v-col md="4">
            <MoodTrackerChart />
          </v-col>
        </v-row>
      </v-col>
      <v-col md="3">
        <EmployeeProfileCard :employeeId="employeeId" />
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

export default {
  methods: {
    ...mapActions([
      "actionForEmployeesInformationApi",
      "actionForTimeAttendance",
      "actionForGetShiftTemplateApi",
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
  },
  props: {
    employeeId: {
      type: String,
    },
  },

  mounted() {
    try {
      this.actionForEmployeesInformationApi({
        employeeId: [this.employeeId],
      });
      this.actionForTimeAttendance({
        employeeId: [this.employeeId],
      });
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style scoped></style>
