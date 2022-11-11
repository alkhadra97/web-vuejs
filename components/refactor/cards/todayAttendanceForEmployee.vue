<template>
  <v-card class="pa-4 mb-3 elevation-5" max-width="421" height="395">
    <v-card-title class="mb-0 py-0 justify-center">
      <p class="hours-card-title">Attendance For Today</p>
    </v-card-title>

    <div class="d-flex ml-5 mt-3">
      <v-card height="55" width="150">
        <h4 class="teal--text text-center">Check In</h4>
        <v-divider class="mx-3"></v-divider>
        <p class="text-center mb-0" v-if="checkInTime !== null">
          {{ checkInTime }}
        </p>
        <p class="text-center mb-0" v-else>--</p>
      </v-card>
      <v-card height="55" width="150" class="ml-3">
        <h4 class="red--text text-center">Check Out</h4>

        <v-divider class="mx-3"></v-divider>

        <p class="text-center mb-0" v-if="checkOutTime !== null">
          {{ checkOutTime }}
        </p>
        <p class="text-center mb-0" v-else>--</p>
      </v-card>
      <!-- </v-col> -->
    </div>
    <div class="d-flex align-center justify-space-around" style="height: 30vh">
      <v-btn
        @click="checkInClicked"
        :color="checkInStatus ? 'grey' : 'teal accent-2'"
        :disabled="checkInStatus === true"
        >Check In</v-btn
      >
      <v-btn
        @click="checkOutClicked"
        :color="checkOutStatus ? 'grey' : 'red lighten-1'"
        :disabled="checkOutStatus === true"
        >Check Out</v-btn
      >
    </div>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { getFormattedDate } from "../../../util/dateFormatting";
import {
  checkInService,
  checkOutService,
} from "../../../util/services/hrServices";

export default {
  props: {
    employeeId: {
      type: String,
    },
  },
  data() {
    return {
      checkInTime: null,
      checkOutTime: null,
      checkInStatus: false,
      checkOutStatus: true,
      recordId: null,
    };
  },
  computed: {
    ...mapGetters(["getterForTimeAttendance", "user"]),
  },
  methods: {
    ...mapActions(["actionForTimeAttendance"]),

    async checkForCheckInAndOutTime() {
      //here we get time attendance for specific employee, this data for today date to get first check in and last check out

      if (this.getterForTimeAttendance.row.timeAttendance.length === 0) return;
      if (this.getterForTimeAttendance.row.timeAttendance[0].timeOut === null) {
        this.checkInTime =
          this.getterForTimeAttendance.row.timeAttendance[0].timeIn;
      } else {
        this.checkInTime =
          this.getterForTimeAttendance.row.timeAttendance[0].timeIn;
        this.checkOutTime =
          this.getterForTimeAttendance.row.timeAttendance[
            this.getterForTimeAttendance.row.timeAttendance.length - 1
          ].timeOut;
      }
    },

    async checkStatus() {
      try {
        if (this.getterForTimeAttendance.row.timeAttendance.length === 0) {
          this.checkInStatus = false;
          this.checkOutStatus = true;
        } else if (
          this.getterForTimeAttendance.row.timeAttendance[0].timeOut === null
        ) {
          this.recordId = this.getterForTimeAttendance.row.timeAttendance[0].id;
          this.checkInStatus = true;
          this.checkOutStatus = false;
        } else if (
          this.getterForTimeAttendance.row.timeAttendance[0].timeIn !== null &&
          this.getterForTimeAttendance.row.timeAttendance[0].timeOut !== null
        ) {
          this.checkInStatus = true;
          this.checkOutStatus = true;
        }
      } catch (error) {
        console.log(error, "check in and out status error");
      }
    },
    async checkInClicked() {
      try {
        await checkInService({
          employee: {
            id: this.employeeId,
            img: null,
            name: this.user.name,
          },
          createdBy: {
            id: "1",
            user: { ar: "", en: "beshir" },
            system: "agents",
            chanel: "12",
          },
        });
        await this.actionForTimeAttendance({
          employeeId: [this.employeeId],
          dateFrom: getFormattedDate(new Date()),
          dateTo: getFormattedDate(new Date()),
        });
        await this.checkStatus();
        await this.checkForCheckInAndOutTime();
      } catch (error) {
        console.log(error, "check in button error");
      }
    },
    async checkOutClicked() {
      try {
        await checkOutService({
          recordId: this.recordId,
          outStatus: { id: "1", name: { ar: "", en: "Accepted" } },
        });
        await this.actionForTimeAttendance({
          employeeId: [this.employeeId],
          dateFrom: getFormattedDate(new Date()),
          dateTo: getFormattedDate(new Date()),
        });
        await this.checkStatus();
        await this.checkForCheckInAndOutTime();
      } catch (error) {
        console.log(error, "check out button error");
      }
    },
  },

  async mounted() {
    await this.actionForTimeAttendance({
      employeeId: [this.employeeId],
      dateFrom: getFormattedDate(new Date()),
      dateTo: getFormattedDate(new Date()),
    });
    await this.checkStatus();
    await this.checkForCheckInAndOutTime();
  },
  watch: {},
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
