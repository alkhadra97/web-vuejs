<template>
  <v-container>
    <GoBack />
    <p class="time-attendance-title">Missing Punch History</p>
    <v-row class="justify-center">
      <v-col md="12">
        <v-card>
          <div class="time-attendance-header">
            <div class="time-attendance-header-body">
              <!-- <v-avatar color="indigo">
                <v-icon dark> mdi-account-circle </v-icon>
              </v-avatar> -->
              <v-row>
                <!-- <v-col md="3">
                  <v-list-item two-line>
                    <v-list-item-content>
                      <v-list-item-title>
                        <strong
                          >Dr.{{ info[0].firstName }}
                          {{ info[0].lastName }}</strong
                        >
                      </v-list-item-title>
                 
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
                </v-col> -->
              </v-row>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col md="12">
        <v-card class="mt-5">
          <!-- <v-row class="justify-center mt-5">
            <v-col md="3">
              <v-select
                data-cy="cy_filter_leave_type_leave_history_hr"
                v-model="filtredType"
                :items="
                  type == 'business'
                    ? businessTypes
                    : type == 'sick'
                    ? sickTypes
                    : personalTypes
                "
                label="choose type..."
                color="teal"
                outlined
                return-object
                @change="filterDependingOnLeaveType(filtredType)"
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
                  @change="filterDependingOnDateRange(dates)"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col md="3">
              <v-select
                data-cy="cy_filtred_status_leave_history_hr"
                v-model="filtredStatus"
                :items="status"
                label="choose status..."
                color="teal"
                outlined
                return-object
                @change="filterDependingOnStatus(filtredStatus)"
              >
              </v-select>
            </v-col>
            <v-col md="2">
              <v-btn color="teal" class="white--text" @click="restAll"
                >Reset</v-btn
              >
            </v-col>
          </v-row> -->
          <v-row class="justify-center mt-0">
            <v-col md="10">
              <table class="mb-7">
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Requested Date</th>

                    <th>Time From</th>
                    <th>Time To</th>
                    <th>Missing Punch Type</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody v-for="(item, index) in dataArr" :key="index">
                  <template
                    v-if="
                      (item.statusForMissingPunsh == 'accepted' ||
                        item.statusForMissingPunsh == 'rejected') &&
                      (item.status == 'missing punch (both)' ||
                        item.status == 'missing punch (checkIn)' ||
                        item.status == 'missing punch (checkOut)')
                    "
                  >
                    <tr>
                      <td>{{ item.employeeName }}</td>
                      <td data-column="apply_date">
                        {{ item.date }}
                      </td>
                      <!-- <td>{{ item.DateFrom }}</td>
                      <td data-column="date_from">
                        {{ item.dateTo }}
                      </td> -->
                      <td data-column="date_to">
                        {{ item.checkIn }}
                      </td>
                      <td data-column="ID">
                        {{ item.checkOut }}
                      </td>
                      <!-- <td v-else-if="item.status == 'missing punch (checkIn)'">
                        {{ item.checkIn }}
                      </td>
                      <td
                        v-else-if="
                          item.status != 'missing punch (checkIn)' &&
                          item.status == 'missing punch (checkOut)'
                        "
                      ></td>
                      <td v-else-if="item.status == 'missing punch (checkOut)'">
                        {{ item.checkOut }}
                      </td> -->

                      <td v-if="item.status == 'missing punch (both)'">
                        check In & check Out
                      </td>
                      <td v-else-if="item.status == 'missing punch (checkIn)'">
                        check In
                      </td>
                      <td v-if="item.status == 'missing punch (checkOut)'">
                        check Out
                      </td>
                      <td>
                        <span
                          :class="[
                            item.statusForMissingPunsh == 'accepted'
                              ? 'accepted'
                              : null,
                            item.statusForMissingPunsh == 'rejected'
                              ? 'rejected'
                              : null,
                          ]"
                        >
                          {{ item.statusForMissingPunsh }}
                        </span>
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
    await this.actionForGettingAllTimeAttendance({
      providerUuid: null,
      filtredMonth: null,
    });
    this.dataArr = this.getAllTimeAttendanceInfo.data.reverse();
  },
  data: (vm) => ({
    employeeUuid: null,
    value: [200, 35, 410, 390],
    filtredType: null,
    type: null,
    businessTypes: [
      "conference",
      "work from another country",
      "outsource patient",
    ],
    sickTypes: ["illness", "recovery", "surery"],
    personalTypes: [
      "Public holiday",
      "Casual leave",
      "Religious holidays",
      "Maternity leave",
      "Paternity leave",
      "Bereavement leave",
      "Unpaid Leave",
    ],
    ///////////////////////////////////////
    status: ["accepted", "rejected", "pending", "New"],
    filtredStatus: null,
    dataArr: [],

    // date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    //   .toISOString()
    //   .substr(0, 10),
    // dateFormatted: vm.formatDate(
    //   new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    //     .toISOString()
    //     .substr(0, 10)
    // ),
    menu1: false,
    dates: null,
  }),
  ///

  methods: {
    ...mapActions(["getEmployees", "actionForGettingAllTimeAttendance"]),
  },
  computed: {
    ...mapGetters(["getAllTimeAttendanceInfo"]),

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
      this.dataArr = this.getAllTimeAttendanceInfo.data.resp;
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
.accepted {
  background: transparent;
  border: #35b5ac solid 1px;
  color: #35b5ac;
  padding: 5px 8px !important;
  line-height: 1.1rem !important;
  font-weight: 400 !important;
  font-size: 0.8rem !important;
}
.rejected {
  background: transparent;
  border: red solid 1px;
  color: red;
  padding: 5px 8px !important;
  line-height: 1.1rem !important;
  font-weight: 400 !important;
  font-size: 0.8rem !important;
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
