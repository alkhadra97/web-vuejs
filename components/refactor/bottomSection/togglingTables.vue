<template>
  <v-tabs v-model="tabs">
    <v-tabs-slider circle color="GlobalStyles.primary1"> </v-tabs-slider>
    <v-tab class="tabs-font GlobalStyles.primary1--text font-weight-bold"
      >Leave</v-tab
    >
    <v-tab-item>
      <LeaveRequestsCard :employeeId="employeeId" />
    </v-tab-item>
    <v-tab class="tabs-font GlobalStyles.primary1--text font-weight-bold"
      >Missing punch</v-tab
    >

    <v-tab-item>
      <MissingPunchRequests :employeeId="employeeId" />
    </v-tab-item>
    <v-tab class="tabs-font GlobalStyles.primary1--text font-weight-bold"
      >Time Attendance</v-tab
    >

    <v-tab-item>
      <TimeAttendanceSection :employeeId="employeeId" />
    </v-tab-item>
  </v-tabs>
</template>

<script>
import { mapActions } from "vuex";
import LeaveRequestsCard from "../cards/leaveRequestsCard.vue";
import MissingPunchRequests from "../cards/missingPunchRequests.vue";
import TimeAttendanceSection from "../cards/timeAttendanceSection.vue";
export default {
  components: {
    LeaveRequestsCard,
    MissingPunchRequests,
    TimeAttendanceSection,
  },
  props: {
    employeeId: {
      type: String,
    },
  },
  methods: {
    ...mapActions(["actionForLeaveRequets", "actionForGetSettingsDataApi"]),
    async renderData() {
      await this.actionForGetSettingsDataApi();

      this.actionForLeaveRequets({
        employeeId: [this.employeeId],
      });
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
