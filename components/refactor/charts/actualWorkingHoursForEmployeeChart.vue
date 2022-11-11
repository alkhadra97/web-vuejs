<template v-if="getterForProfileLoading">
  <v-card class="pa-4 mb-3 elevation-5" max-width="600" height="395">
    <v-card-title class="mb-0 py-0 justify-center">
      <p class="hours-card-title">Actual Hours</p>
    </v-card-title>
    <v-card class="mb-2 px-2" height="75">
      <div class="d-flex justify-space-between">
        <p class="period-title">Today</p>
        <strong
          >{{ workingHoursForToday }}
          <small v-if="totalHoursPerDay !== null"
            >/{{ totalHoursPerDay }} hrs</small
          >
        </strong>
      </div>
      <v-progress-linear
        :value="percentageForTodayHours"
        color="red"
        rounded
        height="7"
      ></v-progress-linear>
    </v-card>
    <v-card class="mb-2 pa-2" height="75">
      <div class="d-flex justify-space-between">
        <p class="period-title">Week</p>
        <strong>
          {{ workingHoursForWeek }}
          <small v-if="totalHoursPerWeek !== null"
            >/{{ totalHoursPerWeek }} hrs</small
          >
        </strong>
      </div>
      <!-- / -->
      <v-progress-linear
        :value="percentageForWeekHours"
        color="yellow"
        rounded
        height="7"
      ></v-progress-linear>
    </v-card>
    <v-card class="mb-2 pa-2" height="75">
      <div class="d-flex justify-space-between">
        <p class="period-title">Month</p>
        <strong
          >{{ workingHoursForMonth }}
          <small v-if="totalHoursPerMonth !== null"
            >/{{ totalHoursPerMonth }} hrs</small
          >
        </strong>
      </div>
      <v-progress-linear
        :value="percentageForMonthHours"
        color="green"
        rounded
        height="7"
      ></v-progress-linear>
    </v-card>
  </v-card>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { getFormattedDate } from "../../../util/dateFormatting";

export default {
  props: {
    employeeUuid: {
      type: String,
    },
  },
  data: () => ({
    value: "",
    TodayDateForCheckIn: new Date().toISOString().slice(0, 10),

    percentageForTodayHours: null,
    percentageForMonthHours: null,
    percentageForWeekHours: null,
    dataForTodaysAttendance: null,
    totalHoursPerDay: null,
    totalHoursPerWeek: null,
    totalHoursPerMonth: null,
  }),
  computed: {
    ...mapGetters([
      "getterForTimeAttendance",
      "getterForEmployeeData",
      "getterForProfileLoading",
      "getterForShiftTemplateData",
    ]),

    progress() {
      return Math.min(100, this.value.length * 10);
    },
    color() {
      return ["error", "warning", "success"][Math.floor(this.progress / 40)];
    },

    /////////////////////////////////////////
    workingHoursForToday() {
      //this compute to get how many hours employee spend from total hours for today
      try {
        let todayDate = getFormattedDate(new Date());
        let arrayForActualHoursChart = [];
        this.getterForTimeAttendance.row.timeAttendance?.forEach((el) => {
          if (el.date == todayDate) {
            arrayForActualHoursChart.push(el);
          }
        });

        let checkedInAt;
        if (arrayForActualHoursChart.length > 0) {
          let rowIdForCheckIn =
            arrayForActualHoursChart[arrayForActualHoursChart.length - 1];

          if (
            rowIdForCheckIn.timeIn != null &&
            rowIdForCheckIn.timeOut == null
          ) {
            checkedInAt = rowIdForCheckIn.timeIn;
          } else {
            checkedInAt = 0;
          }
        } else {
          checkedInAt = 0;
        }
        if (checkedInAt != 0 && checkedInAt !== undefined) {
          let time = new Date().toLocaleTimeString("en-GB", {
            // en-US can be set to 'default' to use user's browser settings
            hour: "2-digit",
            minute: "2-digit",
          });
          let findHours;

          if (time.length >= 5) {
            findHours = parseInt(time.slice(0, 2)) + time.slice(3, 5) / 60;
          } else {
            findHours = parseInt(time.slice(0, 1)) + time.slice(2, 4) / 60;
          }
          let checkedInHours =
            parseInt(checkedInAt.slice(0, 2)) + checkedInAt.slice(3, 5) / 60;

          this.percentageForTodayHours =
            ((findHours - checkedInHours) / 9) * 100;

          return (findHours - checkedInHours).toFixed(1);
        } else {
          this.percentageForTodayHours = 0;
          return 0;
        }
      } catch (error) {
        console.log(error);
      }
    },
    ////////////////////////////////////
    workingHoursForWeek() {
      //this compute to get how many hours employee spend from total hours for week

      try {
        let curr = new Date(); // get current date
        let first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
        let dayBefore = first - 1; // First day is the day of the month - the day of the week
        let last = first + 5; // last day is the first day + 6
        let firstday = new Date(curr.setDate(dayBefore));
        let lastday = new Date(curr.setDate(last));
        let actualFirst = firstday.toISOString().slice(0, 10);
        let actualSecond = lastday.toISOString().slice(0, 10);

        let checkedInAt = [];
        this.getterForTimeAttendance.row.timeAttendance?.forEach((element) => {
          if (
            getFormattedDate(new Date(element.date)) >= actualFirst &&
            getFormattedDate(new Date(element.date)) < actualSecond &&
            getFormattedDate(new Date(element.date)) !==
              getFormattedDate(new Date()) &&
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
            let fromHours = element.timeIn.slice(0, 2); //10
            let fromMunites = element.timeIn.slice(3, 5) / 60;
            let finalFromInHours =
              parseFloat(fromHours) + parseFloat(fromMunites);
            let toHours = element.timeOut.slice(0, 2);
            let toMunites = element.timeOut.slice(3, 5) / 60;
            let finalToInHours = parseFloat(toHours) + parseFloat(toMunites);
            let finalInHours = (finalToInHours - finalFromInHours).toFixed(2);
            checkedInAt.push(finalInHours * 1);
          }
        });

        if (checkedInAt.length >= 1) {
          let sum = checkedInAt.reduce((a, b) => a + b);

          this.percentageForWeekHours = (sum / 45) * 100;

          return sum.toFixed(1);
        } else {
          this.percentageForWeekHours = "0%";
          return 0;
        }
      } catch (error) {
        console.log(error, "actual working hours for month error");
      }
    },
    // ///////////////////////////////////////
    workingHoursForMonth() {
      //this compute to get how many hours employee spend from total hours for month

      try {
        let date = new Date(),
          y = date.getFullYear(),
          m = date.getMonth();
        let firstDay = new Date(y, m, 1);
        let onlyDate = firstDay.toISOString().slice(0, 10);

        let arr = [];
        this.getterForTimeAttendance.row.timeAttendance?.forEach((item) => {
          if (
            item.date >= onlyDate &&
            item.date < getFormattedDate(new Date()) &&
            ((item.inStatus !== null &&
              item.inStatus.name.en == "Accepted" &&
              item.outStatus !== null &&
              item.outStatus.name.en == "Accepted") ||
              (item.inStatus !== null &&
                item.inStatus.name.en == "missingAccepted" &&
                item.outStatus !== null &&
                item.outStatus.name.en == "Accepted") ||
              (item.inStatus !== null &&
                item.inStatus.name.en == "Accepted" &&
                item.outStatus !== null &&
                item.outStatus.name.en == "missingAccepted") ||
              (item.inStatus !== null &&
                item.inStatus.name.en == "missingAccepted" &&
                item.outStatus !== null &&
                item.outStatus.name.en == "missingAccepted"))
          ) {
            let fromHours = item.timeIn.slice(0, 2); //10
            let fromMunites = item.timeIn.slice(3, 5) / 60;
            let finalFromInHours =
              parseFloat(fromHours) + parseFloat(fromMunites);
            let toHours = item.timeOut.slice(0, 2);
            let toMunites = item.timeOut.slice(3, 5) / 60;
            let finalToInHours = parseFloat(toHours) + parseFloat(toMunites);
            let finalInHours = (finalToInHours - finalFromInHours).toFixed(2);
            arr.push(finalInHours * 1);
          }
        });
        if (arr.length > 0) {
          let sum = arr.reduce((a, b) => a + b);
          let finishedHours = sum.toFixed(1);
          this.percentageForMonthHours = (finishedHours / 180) * 100;
          return finishedHours;
        } else {
          this.percentageForMonthHours = 0;
          return 0;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  methods: {
    ...mapActions(["actionForGetShiftTemplateApi"]),
    viewAttendanceBtn() {
      this.$router.push("/hrpages/attendance/" + this.employeeUuid);
    },
    async getShiftId() {
      try {
        await this.actionForGetShiftTemplateApi({
          id: [
            this.getterForEmployeeData.data.response[0]?.contract.shift_template
              .id,
          ],
        });

        let employeeHours =
          await this.getterForShiftTemplateData.rows[0].shiftTemplateDays.map(
            (el) => {
              if (el.time[0].from === null) return;
              let fromHours = el.time[0].from.slice(0, 2) * 60; //10
              let fromMunites = el.time[0].from.slice(3, 5);
              let finalFromInHours = 1 * fromHours + 1 * fromMunites;
              let toHours = el.time[0].to.slice(0, 2) * 60;
              let toMunites = el.time[0].to.slice(3, 5);
              let finalToInHours = 1 * toHours + 1 * toMunites;
              let howManyHoursEmployeeAskForBusinessLeave =
                finalToInHours - finalFromInHours;
              this.howManyHoursEmployeeAskForBusinessLeaveForDb =
                howManyHoursEmployeeAskForBusinessLeave;
              let hours = howManyHoursEmployeeAskForBusinessLeave / 60;
              let rhours = Math.floor(hours);
              let minutes = (hours - rhours) * 60;
              let rminutes = Math.round(minutes);
              let hrminutes = rminutes / 60;
              return rhours + hrminutes;
            }
          );
        let data = employeeHours.filter(function (element) {
          return element !== undefined;
        });
        let sum = data.reduce((a, b) => a + b);
        let finishedHours = sum.toFixed(1);
        let totalHoursPerDay = finishedHours / data.length;
        this.totalHoursPerDay = totalHoursPerDay.toFixed(1);
        this.totalHoursPerWeek = finishedHours;
        this.totalHoursPerMonth = finishedHours * 4;
      } catch (error) {
        console.log(error, "shift template error");
      }
    },
  },
  mounted() {
    this.getShiftId();
  },

  watch: {
    getterForEmployeeData() {
      this.getShiftId();
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
/* .hours-card-title::after {
  content: "";
  display: block;
  width: 9vw;
  height: 4px;
  background: #059486;
  margin: 0.3rem auto 0;
} */
.period-title {
  font-size: 0.96rem;
  font-weight: 500;
  letter-spacing: 0.0125em;
  line-height: 2rem;
}
.view-time-attendance-btn {
  color: #35b5ac;
  font-size: 1.2rem;
  font-weight: 500;
  line-height: 37px;
}
</style>
