<template>
  <v-container>
    <GoBack />
    <p class="time-attendance-title">Time Attendance</p>
    <v-row class="justify-center">
      <v-col md="12">
        <v-card>
          <div class="time-attendance-header">
            <div class="time-attendance-header-body">
              <!-- <v-avatar color="indigo">
                <v-icon dark> mdi-account-circle </v-icon>
              </v-avatar> -->
              <v-row>
                <v-col md="3">
                  <v-list-item two-line>
                    <v-list-item-content>
                      <v-list-item-title>
                        <strong
                          >Dr.{{ info[0].firstName }}
                          {{ info[0].lastName }}</strong
                        >
                      </v-list-item-title>
                      <!-- <v-list-item-subtitle>{{
                        info[0].minor
                      }}</v-list-item-subtitle> -->
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
                <v-col md="3">
                  <v-list-item two-line>
                    <v-list-item-content>
                      <v-list-item-title
                        ><strong>Employee ID</strong></v-list-item-title
                      >
                      <v-list-item-subtitle>{{
                        info[0].employeeNumber
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
                <v-col md="3">
                  <v-list-item two-line>
                    <v-list-item-content>
                      <v-list-item-title
                        ><strong>Joining Date</strong></v-list-item-title
                      >
                      <v-list-item-subtitle>{{
                        info[0].createdAt.substring(0, 10)
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
                <v-col md="3">
                  <v-list-item two-line>
                    <v-list-item-content>
                      <v-list-item-title
                        ><strong>Department</strong></v-list-item-title
                      >
                      <v-list-item-subtitle>Doctors</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
              </v-row>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col md="12">
        <v-card class="mt-5">
          <v-row class="justify-center mt-5">
            <v-col md="6">
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
                    v-model="dateFormatted"
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
                  @change="filterDependingOnDateRange(dates)"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col md="2">
              <v-btn @click="restDate" class="mr-2 teal lighten-1 white--text"
                >Reset</v-btn
              >
            </v-col>
          </v-row>
          <v-row class="justify-center mt-0">
            <v-col md="10">
              <table class="mb-7">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Total Hours</th>

                    <!-- <th>Working Hours</th> -->
                  </tr>
                </thead>
                <tbody
                  v-for="timeAttendanceArray in dateArr"
                  :key="timeAttendanceArray.id"
                >
                  <template
                    v-if="
                      (timeAttendanceArray.date != todayDate &&
                        timeAttendanceArray.status == 'out' &&
                        (timeAttendanceArray.checkIn != null ||
                          timeAttendanceArray.checkIn != '') &&
                        (timeAttendanceArray.checkOut != null ||
                          timeAttendanceArray.checkOut != '')) ||
                      (timeAttendanceArray.statusForMissingPunsh ==
                        'accepted' &&
                        timeAttendanceArray.status != 'out')
                    "
                  >
                    <tr>
                      <td data-column="USERNAME">
                        {{ timeAttendanceArray.date }}
                      </td>
                      <td>{{ timeAttendanceArray.checkIn }}</td>
                      <td data-column="ID">
                        {{ timeAttendanceArray.checkOut }}
                      </td>
                      <td data-column="ID">
                        {{ timeAttendanceArray.totalHoursPerDay }}
                      </td>
                    </tr>
                  </template>
                  <template
                    v-else-if="
                      (timeAttendanceArray.date != todayDate &&
                        timeAttendanceArray.status == 'out' &&
                        (timeAttendanceArray.checkIn != null ||
                          timeAttendanceArray.checkIn != '') &&
                        (timeAttendanceArray.checkOut != null ||
                          timeAttendanceArray.checkOut != '')) ||
                      (timeAttendanceArray.statusForMissingPunsh ==
                        'rejected' &&
                        timeAttendanceArray.status == 'missing punch (checkIn)')
                    "
                  >
                    <tr>
                      <td data-column="USERNAME">
                        {{ timeAttendanceArray.date }}
                      </td>
                      <td>--</td>
                      <td data-column="ID">
                        {{ timeAttendanceArray.checkOut }}
                      </td>
                      <td data-column="ID">
                        {{ timeAttendanceArray.totalHoursPerDay }}
                      </td>
                    </tr>
                  </template>
                  <template
                    v-else-if="
                      (timeAttendanceArray.date != todayDate &&
                        timeAttendanceArray.status == 'out' &&
                        (timeAttendanceArray.checkIn != null ||
                          timeAttendanceArray.checkIn != '') &&
                        (timeAttendanceArray.checkOut != null ||
                          timeAttendanceArray.checkOut != '')) ||
                      (timeAttendanceArray.statusForMissingPunsh ==
                        'rejected' &&
                        timeAttendanceArray.status ==
                          'missing punch (checkOut)')
                    "
                  >
                    <tr>
                      <td data-column="USERNAME">
                        {{ timeAttendanceArray.date }}
                      </td>
                      <td>{{ timeAttendanceArray.checkIn }}</td>
                      <td data-column="ID">--</td>
                      <td data-column="ID">
                        {{ timeAttendanceArray.totalHoursPerDay }}
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

  async mounted() {
    await this.getEmployees(this.$route.params.TimeAttendanceEmployee);
    await this.actionForGettingAllTimeAttendance({
      uuid: this.$route.params.TimeAttendanceEmployee,
      date: null,
      type: "historyAttendanceForEmployee",
    });
    this.dateArr = this.getAllTimeAttendanceInfo.data;
  },
  data: (vm) => ({
    labels: ["March", "April", "May", "June"],
    value: [200, 35, 410, 390],
    filtredMonth: null,
    dates: null,
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    dateFormatted: vm.formatDate(
      new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10)
    ),
    menu1: false,
    dateArr: [],
    todayDate: new Date().toISOString().slice(0, 10),
  }),

  methods: {
    ...mapActions(["getEmployees", "actionForGettingAllTimeAttendance"]),
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    filterDependingOnDateRange(dates) {
      let newArr = [];
      this.getAllTimeAttendanceInfo.data.forEach((item) => {
        if (item.date >= dates[0] && item.date <= dates[1]) {
          newArr.push(item);
        }
      });
      this.dateArr = newArr;
    },
    restDate() {
      this.dateArr = this.getAllTimeAttendanceInfo.data;
    },
  },
  computed: {
    ...mapGetters(["info", "getAllTimeAttendanceInfo"]),
    // timeAttendanceArrayFiltred() {
    //   return this.getAllTimeAttendanceInfo.data
    //     .reverse()
    //     .slice(0, 3)
    //     .map((item) => {
    //       return item;
    //     });
    // },
    todaysDate() {
      let today = new Date().toISOString().slice(0, 10);
      return today;
    },
  },
  watch: {
    date(val) {
      this.dateFormatted = this.formatDate(this.date);
    },
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
  width: 20%;
}
.times-average {
  text-align: center !important;
}
.sub-times-average {
  font-size: 1.4rem;
}
/* .time-attendance-header {
  box-sizing: border-box;
} */
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
