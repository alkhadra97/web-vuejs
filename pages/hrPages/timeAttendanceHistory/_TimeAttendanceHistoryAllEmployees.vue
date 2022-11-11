<template>
  <v-container>
    <GoBack />
    <p class="time-attendance-title">Time Attendance History</p>
    <v-row class="justify-center">
      <v-col md="12">
        <v-card class="mt-5 pa-5">
          <v-row class="justify-center mt-7">
            <v-col md="3">
              <v-select
                data-cy="cy_filtred_status_leave_history_hr"
                v-model="filtredName"
                :items="getAllTimeAttendanceInfo.data"
                item-text="employeeName"
                label="choose name..."
                color="teal"
                outlined
                return-object
              >
              </v-select>
            </v-col>
            <v-col md="3">
              <v-menu
                ref="menu1"
                v-model="menu1"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    data-cy="cy_date_filter_employee_attendance_hr"
                    v-model="dates"
                    label="Date"
                    color="teal"
                    outlined
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="dates"
                  range
                  color="teal"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col md="3">
              <v-select
                data-cy="cy_filter_leave_type_leave_history_hr"
                v-model="filtredType"
                :items="statusForAttendance"
                label="choose type..."
                color="teal"
                outlined
                return-object
              >
              </v-select>
            </v-col>
            <v-col md="2">
              <v-btn color="teal" class="white--text" @click="restAll"
                >Reset</v-btn
              >
              <v-btn
                v-if="
                  filtredType ||
                  filtredName ||
                  dates ||
                  (filtredType && filtredName) ||
                  (filtredName && dates) ||
                  (filtredType && dates)
                "
                color="teal"
                class="white--text"
                @click="filterMany(filtredType, dates, filtredName)"
                >Filter</v-btn
              >
            </v-col>
          </v-row>
          <v-divider color="#cfcccc" class="mx-5"></v-divider>
          <v-row class="justify-center mt-0">
            <v-col md="10">
              <table class="mb-7">
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Total Hours</th>
                    <th>Status</th>

                    <!-- <th>Working Hours</th> -->
                  </tr>
                </thead>
                <tbody v-for="(item, index) in dataArr" :key="index">
                  <template
                    v-if="
                      item.date != today &&
                      (item.statusForMissingPunsh == 'new' ||
                        item.statusForMissingPunsh == 'accepted')
                    "
                  >
                    <tr>
                      <td>{{ item.employeeName }}</td>
                      <td data-column="apply_date">
                        {{ item.date }}
                      </td>
                      <td>{{ item.checkIn }}</td>
                      <td data-column="date_from">
                        {{ item.checkOut }}
                      </td>
                      <td data-column="date_from">
                        {{ item.totalHoursPerDay }}
                      </td>
                      <td data-column="date_from">
                        <p v-if="item.checkIn > '09:10'" class="late">Late</p>
                        <p v-else-if="item.checkIn <= '09:10'" class="onTime">
                          On Time
                        </p>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

import GoBack from "../../../components/GoBack.vue";
export default {
  layout: "dashboard",
  // created() {
  //   if (this.$store.getters.tokenValue.profileType == "PROVIDER") {
  //     this.$router.push("/login");
  //   }
  // },

  mounted() {
    // let param = this.$route.params.Employee;
    // let [uuid, type] = param.split("--");
    // this.type = this.$route.params.EmployeesRequests;
    // this.employeeUuid = uuid;
    this.actionForGettingAllTimeAttendance({
      providerUuid: null,
      filtredMonth: null,
    });
    if (this.getAllTimeAttendanceInfo.data) {
      this.dataArr = this.getAllTimeAttendanceInfo.data.reverse();
    }
  },
  data: (vm) => ({
    employeeUuid: null,
    filtredName: null,
    filtredType: null,
    type: null,
    //////////////////////
    today: new Date().toISOString().slice(0, 10),
    ///////////////////////////////////////
    dataArr: [],
    //////////////////
    statusForAttendance: ["On Time", "Late"],
    //////////////
    dateFormatted: vm.formatDate(
      new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10)
    ),
    menu1: false,
    dates: null,
  }),
  ///

  methods: {
    ...mapActions(["actionForGettingAllTimeAttendance"]),
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },

    filterMany(filtredType, dates, filtredName) {
      if (filtredType && dates == null && filtredName == null) {
        if (filtredType == "On Time") {
          let updatedStatusArr = [];
          this.getAllTimeAttendanceInfo.data.forEach((item) => {
            if (
              item.checkIn <= "09:10" &&
              item.statusForMissingPunsh == "new"
            ) {
              updatedStatusArr.push(item);
            }
          });
          this.dataArr = updatedStatusArr;
        } else {
          let updatedStatusArr = [];
          this.getAllTimeAttendanceInfo.data.forEach((item) => {
            if (item.checkIn > "09:10" && item.statusForMissingPunsh == "new") {
              updatedStatusArr.push(item);
            }
          });
          this.dataArr = updatedStatusArr;
        }
      } else if (dates && filtredType == null && filtredName == null) {
        let filtredOnDate = [];
        this.getAllTimeAttendanceInfo.data.forEach((item) => {
          if (
            item.date >= dates[0] &&
            item.date <= dates[1] &&
            (item.statusForMissingPunsh == "new" ||
              (item.statusForMissingPunsh != "new" &&
                item.status == "accepted"))
          ) {
            filtredOnDate.push(item);
          }
        });
        this.dataArr = filtredOnDate;
      } else if (filtredName && dates == null && filtredType == null) {
        let filtredNamesArr = [];
        this.getAllTimeAttendanceInfo.data.forEach((item) => {
          if (
            item.employeeName == filtredName.employeeName &&
            (item.statusForMissingPunsh == "new" ||
              (item.statusForMissingPunsh != "new" &&
                item.statusForMissingPunsh == "accepted"))
          ) {
            filtredNamesArr.push(item);
          }
        });
        this.dataArr = filtredNamesArr;
      } else if (filtredName && filtredType == "On Time" && dates == null) {
        let filtredNamesArr = [];
        this.getAllTimeAttendanceInfo.data.forEach((item) => {
          if (
            item.employeeName == filtredName.employeeName &&
            item.checkIn <= "09:10" &&
            (item.statusForMissingPunsh == "new" ||
              (item.statusForMissingPunsh != "new" &&
                item.statusForMissingPunsh == "accepted"))
          ) {
            filtredNamesArr.push(item);
          }
        });
        this.dataArr = filtredNamesArr;
      } else if (filtredName && filtredType == "Late" && dates == null) {
        let filtredNamesArr = [];
        this.getAllTimeAttendanceInfo.data.forEach((item) => {
          if (
            item.employeeName == filtredName.employeeName &&
            item.checkIn > "09:10" &&
            (item.statusForMissingPunsh == "new" ||
              (item.statusForMissingPunsh != "new" &&
                item.statusForMissingPunsh == "accepted"))
          ) {
            filtredNamesArr.push(item);
          }
        });
        this.dataArr = filtredNamesArr;
      } else if (filtredName && dates && filtredType == null) {
        let filtredNamesArr = [];
        this.getAllTimeAttendanceInfo.data.forEach((item) => {
          if (
            item.employeeName == filtredName &&
            item.date >= dates[0] &&
            item.date <= dates[1] &&
            (item.statusForMissingPunsh == "new" ||
              (item.statusForMissingPunsh != "new" &&
                item.statusForMissingPunsh == "accepted"))
          ) {
            filtredNamesArr.push(item);
          }
        });
        this.dataArr = filtredNamesArr;
      } else if (filtredType == "On Time" && dates && filtredName == null) {
        let filtredNamesArr = [];
        this.getAllTimeAttendanceInfo.data.forEach((item) => {
          if (
            item.checkIn <= "09:10" &&
            item.date >= dates[0] &&
            item.date <= dates[1] &&
            (item.statusForMissingPunsh == "new" ||
              (item.statusForMissingPunsh != "new" &&
                item.statusForMissingPunsh == "accepted"))
          ) {
            filtredNamesArr.push(item);
          }
        });
        this.dataArr = filtredNamesArr;
      } else if (filtredType == "Late" && dates && filtredName == null) {
        let filtredNamesArr = [];
        this.getAllTimeAttendanceInfo.data.forEach((item) => {
          if (
            item.checkIn > "09:10" &&
            item.date >= dates[0] &&
            item.date <= dates[1] &&
            (item.statusForMissingPunsh == "new" ||
              (item.statusForMissingPunsh != "new" &&
                item.statusForMissingPunsh == "accepted"))
          ) {
            filtredNamesArr.push(item);
          }
        });
        this.dataArr = filtredNamesArr;
      } else if (filtredType == "On Time" && dates && filtredName) {
        let filtredNamesArr = [];
        this.getAllTimeAttendanceInfo.data.forEach((item) => {
          if (
            item.employeeName == filtredName.employeeName &&
            item.checkIn <= "09:10" &&
            item.date >= dates[0] &&
            item.date <= dates[1] &&
            (item.statusForMissingPunsh == "new" ||
              (item.statusForMissingPunsh != "new" &&
                item.statusForMissingPunsh == "accepted"))
          ) {
            filtredNamesArr.push(item);
          }
        });
        this.dataArr = filtredNamesArr;
      } else if (filtredType == "Late" && dates && filtredName) {
        let filtredNamesArr = [];
        this.getAllTimeAttendanceInfo.data.forEach((item) => {
          if (
            item.employeeName == filtredName.employeeName &&
            item.checkIn > "09:10" &&
            item.date >= dates[0] &&
            item.date <= dates[1] &&
            (item.statusForMissingPunsh == "new" ||
              (item.statusForMissingPunsh != "new" &&
                item.statusForMissingPunsh == "accepted"))
          ) {
            filtredNamesArr.push(item);
          }
        });
        this.dataArr = filtredNamesArr;
      }
    },
    restAll() {
      this.filtredType = null;
      this.filtredName = null;
      this.dates = null;
      this.actionForGettingAllTimeAttendance({
        providerUuid: null,
        filtredMonth: null,
      });
    },
  },
  computed: {
    ...mapGetters(["info", "getAllTimeAttendanceInfo"]),

    todaysDate() {
      let today = new Date().toISOString().slice(0, 10);
      return today;
    },
  },
  watch: {
    getAllTimeAttendanceInfo() {
      this.dataArr = this.getAllTimeAttendanceInfo.data;
    },
  },

  components: { GoBack },
};
</script>
<style scoped>
.time-attendance-title {
  margin-top: 1em;
  margin-left: 2.9em;
  font-style: normal;
  font-weight: 400;
  font-size: 32px;
  line-height: 37px;
  border-bottom: 1px solid #cfcccc;
  width: 30%;
}
.times-average {
  text-align: center !important;
}
.sub-times-average {
  font-size: 1.4rem;
}
.onTime {
  background: transparent;
  border: #35b5ac solid 1px !important;
  border-radius: 5px;
  color: #35b5ac;
  padding: 5px 8px !important;
  line-height: 1.1rem !important;
  font-weight: 400 !important;
  font-size: 1rem !important;
}

.late {
  background: transparent;
  border: orange solid 1px !important;
  border-radius: 5px;
  color: orange;
  padding: 5px 8px !important;
  line-height: 1.1rem !important;
  font-weight: 400 !important;
  font-size: 1rem !important;
}

table {
  width: 99%;
  border-collapse: collapse;
}

th {
  background: #35b5ac;
  color: white;
  font-weight: bold;
}

td,
th {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: center;
  font-size: 1.1rem;
}

@media only screen and (max-width: 760px),
  (min-device-width: 768px) and (max-device-width: 1024px) {
  table {
    width: 100%;
  }

  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }

  /* Hide table headers (but not display: none;, for accessibility) */
  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  tr {
    border: 1px solid #ccc;
  }

  td {
    /* Behave  like a "row" */
    border: none;
    border-bottom: 1px solid #eee;
    position: relative;
    padding-left: 50%;
  }

  td:before {
    /* Now like a table header */
    position: absolute;
    /* Top/left values mimic padding */
    top: 6px;
    left: 6px;
    width: 45%;
    padding-right: 10px;
    white-space: nowrap;
    /* Label the data */
    content: attr(data-column);

    color: #000;
    font-weight: bold;
  }
}
</style>
