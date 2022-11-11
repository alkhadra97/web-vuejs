<template>
  <v-tabs v-model="tabs">
    <v-tabs-slider circle color="GlobalStyles.primary1"> </v-tabs-slider>
    <v-tab class="tabs-font GlobalStyles.primary1--text font-weight-bold"
      >Leave</v-tab
    >
    <v-tab-item>
      <LeaveTableRequestsDashboard />
    </v-tab-item>
    <v-tab class="tabs-font GlobalStyles.primary1--text font-weight-bold"
      >Missing punch</v-tab
    >

    <v-tab-item>
      <MissingPunchRequestsDashboardTable />
    </v-tab-item>
    <v-tab class="tabs-font GlobalStyles.primary1--text font-weight-bold"
      >Time Attendance</v-tab
    >

    <v-tab-item>
      <TimeAttendanceForEmployeesDashboardTable />
    </v-tab-item>
  </v-tabs>
</template>

<script>
import { mapActions } from "vuex";

import LeaveTableRequestsDashboard from "../tables/leaveTableRequestsDashboard.vue";
import MissingPunchRequestsDashboardTable from "../tables/missingPunchRequestsDashboardTable.vue";
import TimeAttendanceForEmployeesDashboardTable from "../tables/timeAttendanceForEmployeesDashboardTable.vue";
export default {
  props: {
    employeeId: {
      type: String,
    },
  },
  components: {
    LeaveTableRequestsDashboard,
    MissingPunchRequestsDashboardTable,
    TimeAttendanceForEmployeesDashboardTable,
  },
  methods: {
    ...mapActions(["actionForLeaveRequets", "actionForGetSettingsDataApi"]),
    async renderData() {
      await this.actionForGetSettingsDataApi();

      this.actionForLeaveRequets({});
    },
  },
  mounted() {
    this.renderData();
  },
};
</script>

<style scoped>
.tabs-font {
  font-size: 1.152rem;
}
</style>
