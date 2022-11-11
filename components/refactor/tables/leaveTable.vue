<template>
  <div v-if="settingsData.length > 0">
    <v-card class="pa-4 mb-3 elevation-5">
      <v-card-title class="mb-0 py-0 justify-space-between">
        <div>
          <v-row>
            <v-col md="3">
              <v-autocomplete
                v-if="settingsData[0]"
                v-model="filtredType"
                :items="settingsData[0].leaveType"
                item-value="id"
                label="choose type..."
                color="#194569"
                outlined
                return-object
                dense
                clearable
              >
                <template v-slot:selection="{ item }">
                  {{ getName(item) }}
                </template>
                <template v-slot:item="{ item }">
                  {{ getName(item) }}
                </template>
              </v-autocomplete>
            </v-col>
            <v-col md="4">
              <v-menu
                ref="menu1"
                v-model="menu1"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="auto"
                dense
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="dates"
                    label="Date"
                    color="#194569"
                    outlined
                    v-bind="attrs"
                    v-on="on"
                    dense
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="dates"
                  range
                  color="#194569"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col md="3">
              <v-autocomplete
                v-if="settingsData[0]"
                v-model="filtredStatus"
                :items="settingsData[0].leaveStatus"
                item-value="id"
                label="status"
                color="#194569"
                outlined
                return-object
                dense
                clearable
              >
                <template v-slot:selection="{ item }">
                  {{ getName(item) }}
                </template>
                <template v-slot:item="{ item }">
                  {{ getName(item) }}
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
        </div>
        <div>
          <v-row>
            <v-btn
              color="#194569"
              class="secondry-btn black--text mr-1"
              @click="restAll"
              >Reset</v-btn
            >
            <v-btn
              color="#194569"
              class="white--text mx-1"
              @click="filterMany(filtredType, dates, filtredStatus)"
              >Search</v-btn
            >
            <v-btn
              color="#194569"
              class="white--text ml-1"
              @click="businessLeaveDialog = !businessLeaveDialog"
              ><v-icon>mdi-plus</v-icon> Request Leave</v-btn
            >
          </v-row>
        </div>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="leaveRequests"
          :items-per-page="5"
          class="elevation-1 mt-5"
          @click:row="handleRowClicked"
        >
          <template v-slot:item.actions="{ item }">
            <v-menu bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  v-on="on"
                  small
                  class="mr-2"
                  @click="editClicked(item)"
                  v-if="item.status == 'new'"
                >
                  mdi-pencil
                </v-icon>
              </template>
            </v-menu>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <LeaveRequestNew
      :businessLeaveDialog.sync="businessLeaveDialog"
      :employeeId="employeeId"
    />
    <ShowLeaveRequest
      v-if="leaveRequestDetails"
      :leaveRequestDialog.sync="leaveRequestDialog"
      :leaveRequestDetails="leaveRequestDetails"
    />
    <PendingLeaveRequestForEmployee
      v-if="leaveRequestDetails"
      :showPendingLeaveRequest.sync="showPendingLeaveRequest"
      :leaveRequestDetails="leaveRequestDetails"
      :employeeId="employeeId"
    />
    <!-- <template> -->
    <EditLeaveRequestVue
      v-if="editLeaveRequestDialog"
      :leaveRequestDetails="leaveRequestDetails"
      :editLeaveRequestDialog.sync="editLeaveRequestDialog"
    />
    <!-- </template> -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import LeaveRequestNew from "../dialogs/leaveRequestNew.vue";
import ShowLeaveRequest from "../dialogs/showLeaveRequest.vue";
import PendingLeaveRequestForEmployee from "../dialogs/pendingLeaveRequestForEmployee.vue";
import { calculateHours } from "../../../util/dateFormatting";
import EditLeaveRequestVue from "../dialogs/EditLeaveRequestDialog.vue";

export default {
  components: {
    LeaveRequestNew,
    ShowLeaveRequest,
    PendingLeaveRequestForEmployee,
    EditLeaveRequestVue,
  },
  props: {
    employeeId: {
      type: String,
    },
  },

  data: (vm) => ({
    businessLeaveDialog: false,
    editLeaveRequestDialog: false,
    ///////////////////
    leaveRequestDialog: false,
    showPendingLeaveRequest: false,
    leaveRequestDetails: null,
    /////////////////////////////////
    settingsData: [],
    headers: [
      {
        text: "Leave Type",
        align: "start",
        sortable: false,
        value: "leaveType",
      },
      { text: "From", value: "from" },
      { text: "To", value: "to" },
      { text: "Duration", value: "duration" },
      { text: "Reason", value: "reason" },
      { text: "Status", value: "status", sortable: false },
      { text: "Notes", value: "notes", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
    leaveRequests: [],
    filtredType: null,
    filtredStatus: null,
    //////////////
    dateFormatted: vm.formatDate(
      new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10)
    ),
    menu1: false,
    dates: null,
  }),
  methods: {
    ...mapActions(["actionForLeaveRequets"]),
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    getName: (item) => `${item.name.en}`,

    async getData() {
      //this method for get data from getter then we rearrange the data to fit our page then we save it in state we call it fixed state
      try {
        const arr = [];

        this.getterForLeaveRequets.row.leaves?.forEach((element) => {
          arr.push({
            recordId: element.id,
            employeeId: element.employee.id,
            employeeImg: element.employee.img ? element.employee.img : null,

            applyDate: element.applyDate,

            dateFrom: element.dateFrom,
            dateTo: element.dateTo,

            timeFrom: element.timeFrom ? element.timeFrom : null,
            timeTo: element.timeTo ? element.timeTo : null,
            dateFrom: element.dateFrom,
            dateTo: element.dateTo,
            from:
              element.dateFrom != element.dateTo
                ? element.dateFrom
                : element.timeFrom,
            to:
              element.dateFrom != element.dateTo
                ? element.dateTo
                : element.timeTo,
            notes: element.employeeReason,
            leaveType: element.type.name.en,
            leaveType2: element.type,
            reason: element.subType.name.en,
            reason2: element.subType,
            duration:
              element.totalDays !== null && element.totalDays > 1
                ? element.totalDays + " " + "Days"
                : calculateHours(element.timeFrom, element.timeTo) +
                  " " +
                  "Hours",
            status: element.status ? element.status.name.en : null,
          });
        });
        this.leaveRequests = arr;
      } catch (error) {
        console.log(error.message, "get leaves data error");
      }
    },
    handleRowClicked(value) {
      //here to display request for employee when he/she click on any request
      this.leaveRequestDetails = value;
      if (value.status == "On Hold") {
        this.showPendingLeaveRequest = !this.showPendingLeaveRequest;
      } else {
        this.leaveRequestDialog = !this.leaveRequestDialog;
      }
    },

    filterMany(filtredType, dates, filtredStatus) {
      try {
        if (filtredStatus && dates == null && filtredType == null) {
          //here we filter data depending on status

          let updatedStatusArr = [];
          this.getterForLeaveRequets.row.leaves.forEach((item) => {
            if (item.status.id == filtredStatus.id) {
              updatedStatusArr.push({
                recordId: item.id,

                employeeId: item.id,
                employeeName: item.name,
                applyDate: item.applyDate,

                dateFrom: item.dateFrom,
                dateTo: item.dateTo,
                from:
                  item.dateFrom != item.dateTo ? item.dateFrom : item.timeFrom,
                to: item.dateFrom != item.dateTo ? item.dateTo : item.timeTo,
                notes: item.employeeReason,

                leaveType: item.type.name.en,
                reason: item.subType.name.en,
                duration:
                  item.totalDays !== null && item.totalDays > 1
                    ? item.totalDays + " " + "Days"
                    : calculateHours(item.timeFrom, item.timeTo) +
                      " " +
                      "Hours",
                status: item.status.name.en,
              });
            }
          });
          this.leaveRequests = updatedStatusArr;
        } else if (dates && filtredStatus == null && filtredType == null) {
          //here we filter data depending on date range

          let filtredOnDate = [];
          this.getterForLeaveRequets.row.leaves.forEach((item) => {
            if (
              (item.dateFrom >= dates[0] && item.dateFrom <= dates[1]) ||
              (item.dateTo >= dates[0] && item.dateTo <= dates[1]) ||
              (item.dateFrom < dates[0] && item.dateTo > dates[1])
            ) {
              filtredOnDate.push({
                recordId: item.id,

                employeeId: item.id,
                employeeName: item.name,
                applyDate: item.applyDate,
                dateFrom: item.dateFrom,
                dateTo: item.dateTo,
                from:
                  item.dateFrom != item.dateTo ? item.dateFrom : item.timeFrom,
                to: item.dateFrom != item.dateTo ? item.dateTo : item.timeTo,
                notes: item.employeeReason,
                leaveType: item.type.name.en,
                reason: item.subType.name.en,
                duration:
                  item.totalDays !== null && item.totalDays > 1
                    ? item.totalDays + " " + "Days"
                    : calculateHours(item.timeFrom, item.timeTo) +
                      " " +
                      "Hours",
                status: item.status.name.en,
              });
            }
          });
          this.leaveRequests = filtredOnDate;
        } else if (filtredType && dates == null && filtredStatus == null) {
          //here we filter data depending on leave types

          let filtredNamesArr = [];
          this.getterForLeaveRequets.row.leaves.forEach((item) => {
            if (item.type.id == filtredType.id) {
              filtredNamesArr.push({
                recordId: item.id,

                employeeId: item.id,
                employeeName: item.name,
                applyDate: item.applyDate,
                dateFrom: item.dateFrom,
                dateTo: item.dateTo,
                from:
                  item.dateFrom != item.dateTo ? item.dateFrom : item.timeFrom,
                to: item.dateFrom != item.dateTo ? item.dateTo : item.timeTo,
                notes: item.employeeReason,
                leaveType: item.type.name.en,
                reason: item.subType.name.en,
                duration:
                  item.totalDays !== null && item.totalDays > 1
                    ? item.totalDays + " " + "Days"
                    : calculateHours(item.timeFrom, item.timeTo) +
                      " " +
                      "Hours",
                status: item.status.name.en,
              });
            }
          });
          this.leaveRequests = filtredNamesArr;
        } else if (filtredStatus && dates && filtredType == null) {
          //here we filter data depending on date range and status

          let filtredNamesArr = [];
          this.getterForLeaveRequets.row.leaves.forEach((item) => {
            if (
              item.status.id == filtredStatus.id &&
              ((item.dateFrom >= dates[0] && item.dateFrom <= dates[1]) ||
                (item.dateTo >= dates[0] && item.dateTo <= dates[1]) ||
                (item.dateFrom < dates[0] && item.dateTo > dates[1]))
            ) {
              filtredNamesArr.push({
                recordId: item.id,

                employeeId: item.id,
                employeeName: item.name,
                applyDate: item.applyDate,
                dateFrom: item.dateFrom,
                dateTo: item.dateTo,
                from:
                  item.dateFrom != item.dateTo ? item.dateFrom : item.timeFrom,
                to: item.dateFrom != item.dateTo ? item.dateTo : item.timeTo,
                leaveType: item.type.name.en,
                reason: item.subType.name.en,
                notes: item.employeeReason,
                duration:
                  item.totalDays !== null && item.totalDays > 1
                    ? item.totalDays + " " + "Days"
                    : calculateHours(item.timeFrom, item.timeTo) +
                      " " +
                      "Hours",
                status: item.status.name.en,
              });
            }
          });
          this.leaveRequests = filtredNamesArr;
        } else if (filtredStatus && filtredType && dates == null) {
          //here we filter data depending on status and leave types

          let filtredNamesArr = [];
          this.getterForLeaveRequets.row.leaves.forEach((item) => {
            if (
              item.status.id == filtredStatus.id &&
              item.type.id == filtredType.id
            ) {
              filtredNamesArr.push({
                recordId: item.id,

                employeeId: item.id,
                employeeName: item.name,
                applyDate: item.applyDate,
                dateFrom: item.dateFrom,
                dateTo: item.dateTo,
                from:
                  item.dateFrom != item.dateTo ? item.dateFrom : item.timeFrom,
                to: item.dateFrom != item.dateTo ? item.dateTo : item.timeTo,
                notes: item.employeeReason,
                leaveType: item.type.name.en,
                reason: item.subType.name.en,
                duration:
                  item.totalDays !== null && item.totalDays > 1
                    ? item.totalDays + " " + "Days"
                    : calculateHours(item.timeFrom, item.timeTo) +
                      " " +
                      "Hours",
                status: item.status.name.en,
              });
            }
          });
          this.leaveRequests = filtredNamesArr;
        } else if (filtredType && dates && filtredStatus == null) {
          //here we filter data depending on date range and leave types
          let filtredNamesArr = [];
          this.getterForLeaveRequets.row.leaves.forEach((item) => {
            if (
              item.type.id == filtredType.id &&
              ((item.dateFrom >= dates[0] && item.dateFrom <= dates[1]) ||
                (item.dateTo >= dates[0] && item.dateTo <= dates[1]) ||
                (item.dateFrom < dates[0] && item.dateTo > dates[1]))
            ) {
              filtredNamesArr.push({
                recordId: item.id,

                employeeId: item.id,
                employeeName: item.name,
                applyDate: item.applyDate,
                dateFrom: item.dateFrom,
                dateTo: item.dateTo,
                from:
                  item.dateFrom != item.dateTo ? item.dateFrom : item.timeFrom,
                to: item.dateFrom != item.dateTo ? item.dateTo : item.timeTo,
                notes: item.employeeReason,
                leaveType: item.type.name.en,
                reason: item.subType.name.en,
                duration:
                  item.totalDays !== null && item.totalDays > 1
                    ? item.totalDays + " " + "Days"
                    : calculateHours(item.timeFrom, item.timeTo) +
                      " " +
                      "Hours",
                status: item.status.name.en,
              });
            }
          });
          this.leaveRequests = filtredNamesArr;
        } else if (filtredStatus && dates && filtredType) {
          //here we filter data depending all filter types

          let filtredNamesArr = [];
          this.getterForLeaveRequets.row.leaves.forEach((item) => {
            if (
              item.status.id == filtredStatus.id &&
              item.type.id == filtredType.id &&
              ((item.dateFrom >= dates[0] && item.dateFrom <= dates[1]) ||
                (item.dateTo >= dates[0] && item.dateTo <= dates[1]) ||
                (item.dateFrom < dates[0] && item.dateTo > dates[1]))
            ) {
              filtredNamesArr.push({
                recordId: item.id,

                employeeId: item.id,
                employeeName: item.name,
                applyDate: item.applyDate,
                dateFrom: item.dateFrom,
                dateTo: item.dateTo,
                from:
                  item.dateFrom != item.dateTo ? item.dateFrom : item.timeFrom,
                to: item.dateFrom != item.dateTo ? item.dateTo : item.timeTo,
                notes: item.employeeReason,
                leaveType: item.type.name.en,
                reason: item.subType.name.en,
                duration:
                  item.totalDays !== null && item.totalDays > 1
                    ? item.totalDays + " " + "Days"
                    : calculateHours(item.timeFrom, item.timeTo) +
                      " " +
                      "Hours",
                status: item.status.name.en,
              });
            }
          });
          this.leaveRequests = filtredNamesArr;
        }
      } catch (error) {
        console.log(error, "leave table filter");
      }
    },
    restAll() {
      this.filtredStatus = null;
      this.filtredType = null;
      this.dates = null;
      this.actionForLeaveRequets({
        employeeId: [this.employeeId],
      });
    },
    editClicked(item) {
      this.leaveRequestDetails = item;
      this.editLeaveRequestDialog = true;
    },
  },
  computed: {
    ...mapGetters(["getterForLeaveRequets", "getterForSettingsData"]),
  },
  async mounted() {
    this.getData();
  },
  watch: {
    getterForLeaveRequets() {
      this.getData();
    },
    getterForSettingsData() {
      this.settingsData = this.getterForSettingsData.row.settings;
    },
  },
};
</script>
<style scoped>
.secondry-btn {
  background: transparent !important;
  border: 1px solid #194569 !important;
}
</style>
e
