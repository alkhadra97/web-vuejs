<template>
  <div v-if="settingsData.length > 0">
    <v-card class="pa-4 mb-3 elevation-5">
      <v-card-title class="mb-0 py-0 justify-space-between">
        <div>
          <v-row>
            <v-col md="3">
              <v-autocomplete
                v-model="filtredType"
                :items="leaveTypes"
                item-value="id"
                label="choose type..."
                color="#194569"
                outlined
                return-object
                dense
                clearable
              >
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
                v-if="settingsData.length > 0"
                v-model="filtredStatus"
                :items="settingsData[0].missingStatus"
                item-value="id"
                item-text="text"
                item
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
              @click="filterManyTableData(filtredType, dates, filtredStatus)"
              >Search</v-btn
            >
          </v-row>
        </div>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="missingPunchRequestsDataDynamic"
          :items-per-page="5"
          class="elevation-1 mt-5"
          @click:row="handleRowClicked"
        >
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2"> mdi-pencil </v-icon>
            <v-icon small> mdi-delete </v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <MissingPunchRequestForEmployeeDashboard
      v-if="missingPunchDetails"
      :showMissingPunchDashboard.sync="showMissingPunchDashboard"
      :missingPunchDetails="missingPunchDetails"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import MissingPunchRequestForEmployeeDashboard from "../dialogs/missingPunchRequestForEmployeeDashboard.vue";

export default {
  components: { MissingPunchRequestForEmployeeDashboard },
  props: {
    employeeId: {
      type: String,
    },
  },
  data: (vm) => ({
    showMissingPunchDashboard: false,
    //////////////////////////
    missingPunchRequest: false,
    missingPunchDetails: null,
    //////////////////////////
    settingsData: [],
    leaveTypes: ["in", "out"],

    headers: [
      {
        text: "Employee Name",
        align: "start",
        sortable: false,
        value: "employeeName",
      },
      {
        text: "Missing Punch Type",
        sortable: false,
        value: "missingType",
      },
      { text: "Date", value: "date" },
      { text: " Time", value: "time" },
      { text: "Reason", value: "reason", sortable: false },
      { text: "Status", value: "status", sortable: false },
    ],
    missingPunchRequestsDataFixed: [],
    missingPunchRequestsDataDynamic: [],
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
    getName: (item) => `${item.name.en}`,
    async getData() {
      //this method for get data from getter then we rearrange the data to fit our page then we save it in state we call it fixed state

      const arr = [];
      this.getterForTimeAttendance.row.timeAttendance?.forEach((element) => {
        if (element.employeeReason !== null) {
          if (
            element.inStatus !== null &&
            element.inStatus.name.en != "Accepted"
          ) {
            arr.push({
              recordId: element.id,
              employeeId: element.employee.id,
              employeeImg: element.employee.img ? element.employee.img : null,
              employeeName: element.employee.name
                ? element.employee.name.en
                : null,
              date: element.date,
              time: element.timeIn ? element.timeIn : null,
              // to: element.timeOut ? element.timeOut : null,
              missingType: "In",
              reason: element.employeeReason.en,
              status:
                element.inStatus.name.en == "Missing"
                  ? "New"
                  : element.inStatus.name.en == "missingAccepted"
                  ? "Accepted"
                  : "Rejected",
            });
          }
          if (
            element.outStatus !== null &&
            element.outStatus.name.en != "Accepted"
          ) {
            arr.push({
              recordId: element.id,
              employeeId: element.employee.id,
              employeeImg: element.employee.img ? element.employee.img : null,
              employeeName: element.employee.name
                ? element.employee.name.en
                : null,
              date: element.date,
              // from: element.timeIn ? element.timeIn : null,
              time: element.timeOut ? element.timeOut : null,
              missingType: "Out",
              reason: element.employeeReason.en,
              status:
                element.outStatus.name.en == "Missing"
                  ? "New"
                  : element.outStatus.name.en == "missingAccepted"
                  ? "Accepted"
                  : "Rejected",
            });
          }
        }
      });
      this.missingPunchRequestsDataFixed = arr;
    },
    handleRowClicked(value) {
      //here to display request for employee when he/she click on any request

      this.missingPunchDetails = value;
      this.showMissingPunchDashboard = !this.showMissingPunchDashboard;
    },
    filterManyTableData(filtredType, dates, filtredStatus) {
      try {
        const filterDataArr = this.missingPunchRequestsDataFixed.filter(
          (ele) => {
            return (
              (filtredStatus ? ele.status === filtredStatus?.name?.en : true) &&
              (filtredType
                ? ele.missingType.toLowerCase() === filtredType.toLowerCase()
                : true) &&
              (dates ? ele.date >= dates[0] && ele.date <= dates[1] : true)
            );
          }
        );
        this.missingPunchRequestsDataDynamic = filterDataArr;
        return;
      } catch (error) {
        console.log("error", error.message);
      }
    },
    restAll() {
      //reset all fields when request submitted

      this.filtredStatus = null;
      this.filtredType = null;
      this.dates = null;
      this.missingPunchRequestsDataDynamic = this.missingPunchRequestsDataFixed;
    },
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
  },
  computed: {
    ...mapGetters(["getterForTimeAttendance", "getterForSettingsData"]),
  },
  mounted() {
    this.getData();
    this.missingPunchRequestsDataDynamic = this.missingPunchRequestsDataFixed;
    this.settingsData = this.getterForSettingsData.row.settings;
  },
  watch: {
    getterForTimeAttendance() {
      this.getData();
      this.missingPunchRequestsDataDynamic = this.missingPunchRequestsDataFixed;
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
