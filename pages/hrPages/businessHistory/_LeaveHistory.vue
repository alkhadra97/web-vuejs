<template>
  <v-container>
    <GoBack />
    <p class="time-attendance-title">{{ type }} Leave History</p>
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
                data-cy="cy_filtred_status_leave_history_hr"
                v-model="filtredStatus"
                :items="status"
                label="choose status..."
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
                  filtredStatus ||
                  filtredType ||
                  dates ||
                  (filtredStatus && filtredType) ||
                  (filtredType && dates) ||
                  (filtredStatus && dates)
                "
                color="teal"
                class="white--text"
                @click="filterMany(filtredStatus, dates, filtredType)"
                >Filter</v-btn
              >
            </v-col>
            <!-- <v-col md="2"> -->
            <!-- <v-btn
                @click="
                  filterTimeAttendanceDependingOnNameAndDate(filtredType, date)
                "
                class="mr-2 teal lighten-1 white--text"
                >Filter</v-btn
              > -->
            <!-- </v-col> -->
          </v-row>
          {{ formatingForHours }}
          <v-row class="justify-center mt-0">
            <v-col md="10">
              <table class="mb-7">
                <thead>
                  <tr>
                    <th>Apply Date</th>
                    <th>Date From</th>
                    <th>Date To</th>
                    <th>Time From</th>
                    <th>Time To</th>
                    <th>Leave Type</th>
                    <th>Days</th>
                    <th>Hours</th>
                    <th>Status</th>
                    <!-- <th>Working Hours</th> -->
                  </tr>
                </thead>
                <tbody v-for="(item, index) in newArr" :key="index">
                  <template
                    v-if="
                      item.leaveType == type &&
                      (item.isApproved == 'accepted' ||
                        item.isApproved == 'New' ||
                        item.isApproved == 'refused' ||
                        item.isApproved == 'pending' ||
                        (item.isApproved == 'updated' &&
                          item.status == 'latest'))
                    "
                  >
                    <tr>
                      <td data-column="apply_date">
                        {{ item.applyDate }}
                      </td>
                      <td>{{ item.DateFrom }}</td>
                      <td data-column="date_from">
                        {{ item.dateTo }}
                      </td>
                      <td data-column="date_to" v-if="item.timeFrom">
                        {{ item.timeFrom }}
                      </td>
                      <td data-column="date_to" v-else>--</td>
                      <td data-column="ID" v-if="item.timeTo">
                        {{ item.timeTo }}
                      </td>
                      <td v-else>--</td>
                      <td data-column="ID">
                        {{ item.subLeaveType }}
                      </td>
                      <td
                        data-column="ID"
                        v-if="item.howManyDaysEmployeeAskedFor"
                      >
                        {{ item.howManyDaysEmployeeAskedFor }}
                      </td>
                      <td v-else>--</td>
                      <td
                        data-column="ID"
                        v-if="item.howManyHoursEmployeeAskedFor"
                      >
                        {{ item.howManyHoursEmployeeAskedFor }}
                      </td>
                      <td v-else>--</td>
                      <td data-column="ID">
                        <span
                          :class="[
                            item.isApproved == 'accepted' ? 'accepted' : null,
                            item.isApproved == 'on hold' ? 'pending' : 'null',
                            item.isApproved == 'refused' ? 'rejected' : 'null',
                            item.isApproved == 'New' ? 'New' : 'null',
                            item.isApproved == 'updated' ? 'updated' : 'null',
                          ]"
                        >
                          {{ item.isApproved }}
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
  //   layout: "dashboard",
  layout: "dashboard",

  mounted() {
    let param = this.$route.params.LeaveHistory;
    let [uuid, type] = param.split("--");
    this.type = type;
    this.employeeUuid = uuid;
    this.getEmployees(uuid);
    this.actionForGettingAllLeaveWork({
      providerUuid: uuid,
      dateFromFiltred: null,
      dateToFiltred: null,
    });
    this.dataArr = this.getAllLeaveForProviders.data.resp;
  },
  data: (vm) => ({
    employeeUuid: null,
    labels: ["March", "April", "May", "June"],
    value: [200, 35, 410, 390],
    filtredType: null,
    type: null,
    businessTypes: [
      "conference",
      "work from another country",
      "outsource patient",
    ],
    sickTypes: [
      "illness",
      "doctor appointment",
      "surgery",
      "hospital admission",
      "recovery",
      "other",
    ],
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
    status: ["accepted", "refused", "New"],
    filtredStatus: null,
    dataArr: [],
    newArr: [],

    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    dateFormatted: vm.formatDate(
      new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10)
    ),
    menu1: false,
    dates: null,
  }),

  methods: {
    ...mapActions(["getEmployees", "actionForGettingAllLeaveWork"]),
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },

    restAll() {
      this.filtredType = null;
      this.filtredStatus = null;
      this.dates = null;
      this.actionForGettingAllLeaveWork({
        providerUuid: this.employeeUuid,
        dateFromFiltred: null,
        dateToFiltred: null,
      });
    },
    filterMany(filtredStatus, dates, filtredType) {
      if (filtredStatus && filtredType == null && dates == null) {
        let updatedStatusArr = [];
        this.getAllLeaveForProviders.data.resp.forEach((item) => {
          if (item.isApproved == filtredStatus) {
            updatedStatusArr.push(item);
          }
        });
        console.log(updatedStatusArr, "updatedStatusArr");
        this.newArr = updatedStatusArr;
      } else if (filtredType && filtredStatus == null && dates == null) {
        let updatedStatusArr = [];
        this.getAllLeaveForProviders.data.resp.forEach((item) => {
          if (item.subLeaveType == filtredType) {
            updatedStatusArr.push(item);
          }
        });
        this.newArr = updatedStatusArr;
      } else if (dates && filtredType == null && filtredStatus == null) {
        let updatedStatusArr = [];

        this.getAllLeaveForProviders.data.resp.forEach((item) => {
          if (item.applyDate >= dates[0] && item.applyDate <= dates[1]) {
            updatedStatusArr.push(item);
          }
        });
        this.newArr = updatedStatusArr;
      } else if (filtredStatus && filtredType && dates == null) {
        let updatedStatusArr = [];
        this.getAllLeaveForProviders.data.resp.forEach((item) => {
          if (
            item.isApproved == filtredStatus &&
            item.subLeaveType == filtredType
          ) {
            updatedStatusArr.push(item);
          }
        });
        this.newArr = updatedStatusArr;
      } else if (filtredStatus && dates && filtredType == null) {
        let updatedStatusArr = [];

        this.getAllLeaveForProviders.data.resp.forEach((item) => {
          if (
            item.isApproved == filtredStatus &&
            item.applyDate >= dates[0] &&
            item.applyDate <= dates[1]
          ) {
            updatedStatusArr.push(item);
          }
        });
        this.newArr = updatedStatusArr;
      } else if (filtredType && dates && filtredStatus == null) {
        let updatedStatusArr = [];

        this.getAllLeaveForProviders.data.resp.forEach((item) => {
          if (
            item.subLeaveType == filtredType &&
            item.applyDate >= dates[0] &&
            item.applyDate <= dates[1]
          ) {
            updatedStatusArr.push(item);
          }
        });
        this.newArr = updatedStatusArr;
      } else if (filtredType && dates && filtredStatus) {
        let updatedStatusArr = [];

        this.getAllLeaveForProviders.data.resp.forEach((item) => {
          if (
            item.isApproved == filtredStatus &&
            item.subLeaveType == filtredType &&
            item.applyDate >= dates[0] &&
            item.applyDate <= dates[1]
          ) {
            updatedStatusArr.push(item);
          }
        });
        this.newArr = updatedStatusArr;
      }
    },
  },
  computed: {
    ...mapGetters(["info", "getAllLeaveForProviders"]),

    todaysDate() {
      let today = new Date().toISOString().slice(0, 10);
      return today;
    },
    formatingForHours() {
      this.newArr = this.dataArr.map((object) => {
        let hours = object.howManyHoursEmployeeAskedFor / 60;
        let rhours = Math.floor(hours);
        let minutes = (hours - rhours) * 60;
        let rminutes = Math.round(minutes);
        object.howManyHoursEmployeeAskedFor = rhours + ":" + rminutes;
        // 👇️ change value of name property
        return {
          ...object,
          howManyHoursEmployeeAskedFor: rhours + ":" + rminutes,
        };
      });

      // 👇️ [{id: 1, name: 'Alice'}, {id: 2, name: 'John'}]
    },
  },
  watch: {
    date(val) {
      this.dateFormatted = this.formatDate(this.date);
    },
    getAllLeaveForProviders() {
      this.dataArr = this.getAllLeaveForProviders.data.resp;
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
.New {
  background: transparent;
  border: #2196f3 solid 1px;
  color: #2196f3;
  padding: 5px 8px !important;
  line-height: 1.1rem !important;
  font-weight: 400 !important;
  font-size: 0.8rem !important;
}
.pending {
  background: transparent;
  border: orange solid 1px !important;
  border-radius: 5px;
  color: rgb(255, 166, 1);
  padding: 5px 8px !important;
  line-height: 1.1rem !important;
  font-weight: 400 !important;
  font-size: 1rem !important;
}
.updated {
  background: transparent;
  border: rgb(255, 194, 81) solid 1px !important;
  border-radius: 5px;
  color: rgb(255, 194, 81);
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
