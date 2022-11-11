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
              class="white--text ml-1"
              @click="filterMany(filtredType, dates, filtredStatus)"
              >Search</v-btn
            >
          </v-row>
        </div>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="leaveRequestsDataDynamic"
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
                  @click="deleteLeave(item)"
                >
                  mdi-close
                </v-icon>
              </template>
            </v-menu>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <LeaveRequestForEmployeeDashboard
      v-if="leaveRequestDetails"
      :showLeaveRequestDashboard.sync="showLeaveRequestDashboard"
      :leaveRequestDetails="leaveRequestDetails"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import LeaveRequestNew from "../dialogs/leaveRequestNew.vue";
import ShowLeaveRequest from "../dialogs/showLeaveRequest.vue";
import LeaveRequestForEmployeeDashboard from "../dialogs/leaveRequestForEmployeeDashboard.vue";
import { calculateHours } from "../../../util/dateFormatting";
import { deleteLeaveRequestService } from "../../../util/services/hrServices";
import swal from "sweetalert2";

export default {
  components: {
    LeaveRequestNew,
    ShowLeaveRequest,
    LeaveRequestForEmployeeDashboard,
  },
  data: (vm) => ({
    showLeaveRequestDashboard: false,
    deleteDialog: false,
    deleteObject: null,
    leaveRequestDetails: null,
    /////////////////////////////////
    settingsData: [],
    statusForLeave: ["new", "accepted", "refused", "on hold", "pending"],
    headers: [
      {
        text: "Employee Name",
        align: "start",
        sortable: false,
        value: "employeeName",
      },
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
    leaveRequestsDataFixed: [],
    leaveRequestsDataDynamic: [],
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

      const arr = [];

      this.getterForLeaveRequets.row.leaves?.forEach((element) => {
        arr.push({
          recordId: element.id,
          employeeId: element.employee.id,
          employeeImg: element.employee.img,
          employeeName: element.employee.name.en,
          applyDate: element.applyDate,
          leaveDateDay:
            element.dateFrom == element.dateTo ? element.dateFrom : null,

          from:
            element.dateFrom != element.dateTo
              ? element.dateFrom
              : element.timeFrom,
          to:
            element.dateFrom != element.dateTo
              ? element.dateTo
              : element.timeTo,

          leaveType: element.type.name.en,
          reason: element.subType.name.en,
          notes: element.employeeReason,
          duration:
            element.totalDays !== null && element.totalDays > 1
              ? element.totalDays + " " + "Days"
              : calculateHours(element.timeFrom, element.timeTo) +
                " " +
                "Hours",
          status: element.status.name.en,
        });
      });
      this.leaveRequestsDataFixed = arr;
    },
    handleRowClicked(value) {
      //here to display request for employee when he/she click on any request
      this.leaveRequestDetails = value;
      this.showLeaveRequestDashboard = !this.showLeaveRequestDashboard;
    },

    async deleteLeave(item, type) {
      try {
        let result = await swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        });
        // .then((result) => {
        if ((await result).isConfirmed) {
          await deleteLeaveRequestService({
            recordId: item.recordId,
          });
          await this.actionForLeaveRequets({});

          await this.getData();
          this.leaveRequestsDataDynamic = this.leaveRequestsDataFixed;
          swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      } catch (error) {
        console.log(error, "delete leave request error");
      }

      // })
    },

    filterMany(filtredType, dates, filtredStatus) {
      if (filtredStatus && dates == null && filtredType == null) {
        let updatedStatusArr = [];
        this.getterForLeaveRequets.row.leaves.forEach((item) => {
          if (item.status.id == filtredStatus.id) {
            updatedStatusArr.push({
              recordId: item.id,
              employeeId: item.employee.id,
              employeeImg: item.employee.img,
              employeeName: item.employee.name.en,
              applyDate: item.applyDate,
              leaveDateDay: item.dateFrom == item.dateTo ? item.dateFrom : null,
              from:
                item.dateFrom != item.dateTo ? item.dateFrom : item.timeFrom,
              to: item.dateFrom != item.dateTo ? item.dateTo : item.timeTo,

              leaveType: item.type.name.en,
              reason: item.subType.name.en,
              notes: item.employeeReason,
              duration:
                item.totalDays !== null && item.totalDays > 1
                  ? item.totalDays + " " + "Days"
                  : calculateHours(item.timeFrom, item.timeTo) + " " + "Hours",
              status: item.status.name.en,
            });
          }
        });
        this.leaveRequestsDataDynamic = updatedStatusArr;
      } else if (dates && filtredStatus == null && filtredType == null) {
        let filtredOnDate = [];
        this.getterForLeaveRequets.row.leaves.forEach((item) => {
          if (
            (item.dateFrom >= dates[0] && item.dateFrom <= dates[1]) ||
            (item.dateTo >= dates[0] && item.dateTo <= dates[1]) ||
            (item.dateFrom < dates[0] && item.dateTo > dates[1])
          ) {
            filtredOnDate.push({
              recordId: item.id,
              employeeId: item.employee.id,
              employeeImg: item.employee.img,
              employeeName: item.employee.name.en,
              applyDate: item.applyDate,
              leaveDateDay: item.dateFrom == item.dateTo ? item.dateFrom : null,

              from:
                item.dateFrom != item.dateTo ? item.dateFrom : item.timeFrom,
              to: item.dateFrom != item.dateTo ? item.dateTo : item.timeTo,

              leaveType: item.type.name.en,
              reason: item.subType.name.en,
              notes: item.employeeReason,
              duration:
                item.totalDays !== null && item.totalDays > 1
                  ? item.totalDays + " " + "Days"
                  : calculateHours(item.timeFrom, item.timeTo) + " " + "Hours",
              status: item.status.name.en,
            });
          }
        });
        this.leaveRequestsDataDynamic = filtredOnDate;
      } else if (filtredType && dates == null && filtredStatus == null) {
        let filtredNamesArr = [];
        this.getterForLeaveRequets.row.leaves.forEach((item) => {
          if (item.type.id == filtredType.id) {
            filtredNamesArr.push({
              recordId: item.id,
              employeeId: item.employee.id,
              employeeImg: item.employee.img,
              employeeName: item.employee.name.en,
              applyDate: item.applyDate,
              leaveDateDay: item.dateFrom == item.dateTo ? item.dateFrom : null,

              from:
                item.dateFrom != item.dateTo ? item.dateFrom : item.timeFrom,
              to: item.dateFrom != item.dateTo ? item.dateTo : item.timeTo,

              leaveType: item.type.name.en,
              reason: item.subType.name.en,
              notes: item.employeeReason,
              duration:
                item.totalDays !== null && item.totalDays > 1
                  ? item.totalDays + " " + "Days"
                  : calculateHours(item.timeFrom, item.timeTo) + " " + "Hours",
              status: item.status.name.en,
            });
          }
        });
        this.leaveRequestsDataDynamic = filtredNamesArr;
      } else if (filtredStatus && dates && filtredType == null) {
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
              employeeId: item.employee.id,
              employeeImg: item.employee.img,
              employeeName: item.employee.name.en,
              applyDate: item.applyDate,
              leaveDateDay: item.dateFrom == item.dateTo ? item.dateFrom : null,

              from:
                item.dateFrom != item.dateTo ? item.dateFrom : item.timeFrom,
              to: item.dateFrom != item.dateTo ? item.dateTo : item.timeTo,

              leaveType: item.type.name.en,
              reason: item.subType.name.en,
              notes: item.employeeReason,
              duration:
                item.totalDays !== null && item.totalDays > 1
                  ? item.totalDays + " " + "Days"
                  : calculateHours(item.timeFrom, item.timeTo) + " " + "Hours",
              status: item.status.name.en,
            });
          }
        });
        this.leaveRequestsDataDynamic = filtredNamesArr;
      } else if (filtredStatus && filtredType && dates == null) {
        let filtredNamesArr = [];
        this.getterForLeaveRequets.row.leaves.forEach((item) => {
          if (
            item.status.id == filtredStatus.id &&
            item.type.id == filtredType.id
          ) {
            filtredNamesArr.push({
              recordId: item.id,
              employeeId: item.employee.id,
              employeeImg: item.employee.img,
              employeeName: item.employee.name.en,
              applyDate: item.applyDate,
              leaveDateDay: item.dateFrom == item.dateTo ? item.dateFrom : null,

              from:
                item.dateFrom != item.dateTo ? item.dateFrom : item.timeFrom,
              to: item.dateFrom != item.dateTo ? item.dateTo : item.timeTo,

              leaveType: item.type.name.en,
              reason: item.subType.name.en,
              notes: item.employeeReason,
              duration:
                item.totalDays !== null && item.totalDays > 1
                  ? item.totalDays + " " + "Days"
                  : calculateHours(item.timeFrom, item.timeTo) + " " + "Hours",
              status: item.status.name.en,
            });
          }
        });
        this.leaveRequestsDataDynamic = filtredNamesArr;
      } else if (filtredType && dates && filtredStatus == null) {
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
              employeeId: item.employee.id,
              employeeImg: item.employee.img,
              employeeName: item.employee.name.en,
              applyDate: item.applyDate,
              leaveDateDay: item.dateFrom == item.dateTo ? item.dateFrom : null,

              from:
                item.dateFrom != item.dateTo ? item.dateFrom : item.timeFrom,
              to: item.dateFrom != item.dateTo ? item.dateTo : item.timeTo,

              leaveType: item.type.name.en,
              reason: item.subType.name.en,
              notes: item.employeeReason,
              duration:
                item.totalDays !== null && item.totalDays > 1
                  ? item.totalDays + " " + "Days"
                  : calculateHours(item.timeFrom, item.timeTo) + " " + "Hours",
              status: item.status.name.en,
            });
          }
        });
        this.leaveRequestsDataDynamic = filtredNamesArr;
      } else if (filtredStatus && dates && filtredType) {
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
              employeeId: item.employee.id,
              employeeImg: item.employee.img,
              employeeName: item.employee.name.en,
              applyDate: item.applyDate,
              leaveDateDay: item.dateFrom == item.dateTo ? item.dateFrom : null,

              from:
                item.dateFrom != item.dateTo ? item.dateFrom : item.timeFrom,
              to: item.dateFrom != item.dateTo ? item.dateTo : item.timeTo,

              leaveType: item.type.name.en,
              reason: item.subType.name.en,
              notes: item.employeeReason,
              duration:
                item.totalDays !== null && item.totalDays > 1
                  ? item.totalDays + " " + "Days"
                  : calculateHours(item.timeFrom, item.timeTo) + " " + "Hours",
              status: item.status.name.en,
            });
          }
        });
        this.leaveRequestsDataDynamic = filtredNamesArr;
      }
    },
    restAll() {
      //reset all fields when request submitted
      this.filtredStatus = null;
      this.filtredType = null;
      this.dates = null;
      this.leaveRequestsDataDynamic = this.leaveRequestsDataFixed;
    },
  },
  computed: {
    ...mapGetters(["getterForLeaveRequets", "getterForSettingsData"]),
  },
  mounted() {
    this.getData();
    this.leaveRequestsDataDynamic = this.leaveRequestsDataFixed;
  },
  watch: {
    getterForLeaveRequets() {
      this.getData();
      this.leaveRequestsDataDynamic = this.leaveRequestsDataFixed;
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
