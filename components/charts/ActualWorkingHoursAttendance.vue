<template>
  <v-container>
    <v-card width="648" height="385" class="pa-4 mb-3 elevation-5">
      <v-card-title class="mb-0">
        <p class="hours-card-title">Actual Hours</p>
      </v-card-title>
      <!-- <v-divider class="my-3"></v-divider> -->
      {{ getOnlyTimeAttendanceOneValue }}
      <v-card class="mb-2 pa-2" height="80">
        <div class="d-flex justify-space-between">
          <p class="period-title">Today</p>
          <strong v-if="dataForTodaysAttendance != null"
            >{{ workingHoursForToday }} <small>/9 hrs</small>
          </strong>
        </div>
        <v-progress-linear
          :value="percentageForTodayHours"
          color="red"
          rounded
          height="7"
        ></v-progress-linear>
      </v-card>
      <v-card class="mb-2 pa-2" height="80">
        <div class="d-flex justify-space-between">
          <p class="period-title">Week</p>
          <strong> {{ workingHoursForWeek }} <small>/45 hrs</small> </strong>
        </div>
        <!-- / -->
        <v-progress-linear
          :value="percentageForWeekHours"
          color="yellow"
          rounded
          height="7"
        ></v-progress-linear>
      </v-card>
      <v-card class="mb-2 pa-2" height="80">
        <div class="d-flex justify-space-between">
          <p class="period-title">Month</p>
          <strong>{{ workingHoursForMonth }} <small>/180 hrs</small> </strong>
        </div>
        <v-progress-linear
          :value="percentageForMonthHours"
          color="green"
          rounded
          height="7"
        ></v-progress-linear>
      </v-card>
    </v-card>
    <v-card height="150" width="648">
      <v-card-title class="pb-0">
        <v-row class="justify-space-around">
          <p class="hours-card-title">Attendance For Today</p>
          <button
            @click="viewAttendanceBtn"
            class="view-time-attendance-btn"
            v-if="
              $store.getters.tokenValue.profileType == 'PROVIDER' ||
              $store.getters.tokenValue.profileType == 'MANAGER'
            "
          >
            View History
          </button>
        </v-row>
      </v-card-title>
      <div class="d-flex ml-5 mt-3">
        <!-- <v-card-text> -->
        <!-- <v-col md="12"> -->
        <!-- <v-col md="12"> -->
        <v-card height="55" width="150">
          <h4 class="teal--text text-center">Check In</h4>
          <v-divider class="mx-3"></v-divider>
          <p class="text-center mb-0">
            {{ getOnlyTimeAttendanceOneValue2 }}
          </p>
        </v-card>
        <v-card height="55" width="150" class="ml-3">
          <h4 class="red--text text-center">Check Out</h4>

          <v-divider class="mx-3"></v-divider>

          <p class="text-center mb-0">
            {{ getOnlyTimeAttendanceOneValueForCheckOut }}
          </p>
        </v-card>
        <!-- </v-col> -->
      </div>
      <!-- </v-col> -->
      <!-- </v-card-text> -->
    </v-card>
  </v-container>
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
    this.getOnlyTimeAttendanceOneValue;
  },
  data: () => ({
    value: "",
    TodayDateForCheckIn: new Date().toISOString().slice(0, 10),

    percentageForTodayHours: null,
    percentageForMonthHours: null,
    percentageForWeekHours: null,
    dataForTodaysAttendance: null,
  }),
  methods: {
    ...mapActions(["actionForGettingAllTimeAttendance"]),
    viewAttendanceBtn() {
      this.$router.push("/hrpages/attendance/" + this.employeeUuid);
    },
  },
  computed: {
    ...mapGetters(["getAllTimeAttendanceInfo", "getAllWorkingHours"]),
    progress() {
      return Math.min(100, this.value.length * 10);
    },
    color() {
      return ["error", "warning", "success"][Math.floor(this.progress / 40)];
    },
    getOnlyTimeAttendanceOneValue() {
      const date = new Date();
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      // This arrangement can be altered based on how we want the date's format to appear.
      let currentDate = `${year}-0${month}-${day}`;
      // console.log(currentDate, "currentDate"); // "17-6-2022"

      let arr = [];
      // console.log(TodayDateForCheckIn, "this.TodayDateForCheckIn");
      this.getAllTimeAttendanceInfo.data?.forEach((item) => {
        if (item.date == currentDate && item.status == "present") {
          arr.push({ checkIn: item.checkIn, id: item.id });
        }
      });
      if (arr.length != 0) {
        this.dataForTodaysAttendance = arr[0].id;
        arr[0].checkIn;
      } else {
        arr = null;
      }
    },
    getOnlyTimeAttendanceOneValue2() {
      const date = new Date();
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      // This arrangement can be altered based on how we want the date's format to appear.
      let currentDate = `${year}-0${month}-${day}`;
      // console.log(currentDate, "currentDate"); // "17-6-2022"

      let arr = [];
      // console.log(TodayDateForCheckIn, "this.TodayDateForCheckIn");
      this.getAllTimeAttendanceInfo.data?.forEach((item) => {
        if (item.date == currentDate) {
          arr.push({ checkIn: item.checkIn, id: item.id });
        }
      });
      if (arr.length != 0) {
        return arr[0].checkIn;
      } else {
        return (arr = null);
      }
    },
    getOnlyTimeAttendanceOneValueForCheckOut() {
      const date = new Date();
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      // This arrangement can be altered based on how we want the date's format to appear.
      let currentDate = `${year}-0${month}-${day}`;
      // console.log(currentDate, "currentDate"); // "17-6-2022"

      let arr = [];
      // console.log(TodayDateForCheckIn, "this.TodayDateForCheckIn");
      this.getAllTimeAttendanceInfo.data?.forEach((item) => {
        if (item.id == this.dataForTodaysAttendance) {
          arr.push({ checkOut: item.checkOut, id: item.id });
        }
      });
      if (arr.length != 0) {
        return arr[0].checkOut;
      } else {
        return (arr = null);
      }
    },
    /////////////////////////////////////////
    workingHoursForToday() {
      let checkedInAt;
      let todayDate = new Date().toISOString().slice(0, 10);
      // console.log(this.dataForTodaysAttendance, "this.dataForTodaysAttendance");
      this.getAllTimeAttendanceInfo.data.forEach((element) => {
        if (element.id == this.dataForTodaysAttendance) {
          return (checkedInAt = element.checkIn);
        } else {
          return;
        }
      });

      if (checkedInAt != 0 && checkedInAt !== undefined) {
        let today = new Date();
        // console.log(today, "today");
        let time = today.getHours() + ":" + today.getMinutes();
        let findHours;
        if (time.length >= 5) {
          findHours = parseInt(time.slice(0, 2)) + time.slice(3, 5) / 60;
        } else {
          findHours = parseInt(time.slice(0, 1)) + time.slice(2, 4) / 60;
        }
        let checkedInHours =
          parseInt(checkedInAt.slice(0, 2)) + checkedInAt.slice(3, 5) / 60;
        // console.log(checkedInHours, "checkedInHours");
        this.percentageForTodayHours = ((findHours - checkedInHours) / 9) * 100;
        return (findHours - checkedInHours).toFixed(1);
      } else {
        this.percentageForTodayHours = 0;
        return 0;
      }
    },
    ////////////////////////////////////
    workingHoursForWeek() {
      let curr = new Date(); // get current date
      let first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
      let dayBefore = first - 1; // First day is the day of the month - the day of the week
      let last = first + 5; // last day is the first day + 6

      let firstday = new Date(curr.setDate(dayBefore));
      let lastday = new Date(curr.setDate(last));
      let actualFirst = firstday.toISOString().slice(0, 10);
      let actualSecond = lastday.toISOString().slice(0, 10);

      let checkedInAt = [];
      this.getAllTimeAttendanceInfo.data.forEach((element) => {
        if (
          (element.date >= actualFirst &&
            element.date < actualSecond &&
            element.status == "out" &&
            element.statusForMissingPunsh != "rejected") ||
          (element.date >= actualFirst &&
            element.date < actualSecond &&
            element.statusForMissingPunsh == "accepted" &&
            element.checkIn != null &&
            element.checkOut != null)
        ) {
          checkedInAt.push(element.totalHoursPerDay);
        }
      });
      if (checkedInAt.length >= 1) {
        let sum = checkedInAt.reduce((a, b) => a + b);
        this.percentageForWeekHours = (sum / 45) * 100;
        return sum.toFixed(1);
      } else {
        this.percentageForWeekHours = 0;
        return 0;
      }
    },
    ///////////////////////////////////////
    workingHoursForMonth() {
      // var dateOffset = 24 * 60 * 60 * 1000 * 30; //5 days
      // var myDate = new Date();
      // myDate.setTime(myDate.getTime() - dateOffset);
      // let beforeSevenDays = myDate.toISOString().slice(0, 10);
      let todayDate = new Date().toISOString().slice(0, 10);
      let date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth();
      let firstDay = new Date(y, m, 1);
      let onlyDate = firstDay.toISOString().slice(0, 10);

      let arr = [];
      this.getAllTimeAttendanceInfo.data.forEach((item) => {
        if (
          (item.date >= onlyDate &&
            item.date < todayDate &&
            item.status == "out" &&
            item.statusForMissingPunsh != "rejected") ||
          (item.date >= onlyDate &&
            item.date < todayDate &&
            item.statusForMissingPunsh == "accepted" &&
            item.checkIn != null &&
            item.checkOut != null)
        ) {
          arr.push(item.totalHoursPerDay);
        }
      });
      if (arr.length > 0) {
        let sum = arr.reduce((a, b) => a + b);
        // console.log(sum);
        let finishedHours = sum.toFixed(1);
        this.percentageForMonthHours =
          (finishedHours / this.getAllWorkingHours[0].totalHours) * 100;
        return finishedHours;
      } else {
        this.percentageForMonthHours = 0;
        return 0;
      }
    },
  },
  watch: {},
};
</script>
<style scoped>
.hours-card-title {
  font-weight: bold;
  line-height: 2em;
  color: black;
  margin-top: 1em auto;
  padding-bottom: 0.2em;
}
.hours-card-title::after {
  content: "";
  display: block;
  width: 9vw;
  height: 4px;
  background: #059486;
  margin: 0.3rem auto 0;
}
.period-title {
  font-size: 1.25rem;
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
