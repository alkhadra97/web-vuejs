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
                v-if="settingsData[0]"
                v-model="filtredStatus"
                :items="settingsData[0].missingStatus"
                item-text="text"
                item-value="id"
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
              class="white--text mx-1"
              @click="filterMany(filtredType, dates, filtredStatus)"
              >Search</v-btn
            >
            <v-btn
              v-if="$permissions('ID-123')"
              :disabled="$permissions('ID-123') == 'READ_ONLY'"
              color="#194569"
              class="white--text ml-1"
              @click="missingPunchDialog = !missingPunchDialog"
              ><v-icon>mdi-plus</v-icon>Request Missing</v-btn
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
            <v-menu bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  v-on="on"
                  small
                  class="mr-2"
                  @click="editClicked(item)"
                  v-if="item.status == 'New'"
                >
                  mdi-pencil
                </v-icon>
              </template>
            </v-menu>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <MissingPunchRequest
      :missingPunchDialog.sync="missingPunchDialog"
      :employeeId="employeeId"
    />

    <ShowMissingPunchRequest
      v-if="missingPunchDetails"
      :missingPunchRequest.sync="missingPunchRequest"
      :missingPunchDetails="missingPunchDetails"
    />
    <editMissingPunchDialogVue
      v-if="missingPunchDetails"
      :editMissingDialog.sync="editMissingDialog"
      :missingPunchDetails="missingPunchDetails"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import MissingPunchRequest from "../dialogs/missingPunchRequest.vue";
import ShowMissingPunchRequest from "../dialogs/showMissingPunchRequest.vue";
import editMissingPunchDialogVue from "../dialogs/editMissingPunchDialog.vue";

export default {
  components: {
    MissingPunchRequest,
    ShowMissingPunchRequest,
    editMissingPunchDialogVue,
  },

  props: {
    employeeId: {
      type: String,
    },
  },

  data: (vm) => ({
    missingPunchDialog: false,
    editMissingDialog: false,
    //////////////////////////
    missingPunchRequest: false,
    missingPunchRequestsDataDynamic: null,
    missingPunchDetails: null,
    //////////////////////////
    leaveTypes: ["in", "out"],
    settingsData: [],
    headers: [
      {
        text: "Missing Punch Type",
        align: "start",
        sortable: false,
        value: "missingType",
      },
      { text: "Date", value: "date" },
      { text: " Time", value: "time" },
      { text: "Reason", value: "reason", sortable: false },
      { text: "Status", value: "status", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
    missingPunchRequests: [],
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
    ...mapActions(["actionForTimeAttendance"]),
    getName: (item) => `${item.name.en}`,

    async getData() {
      //this method for get data from getter then we rearrange the data to fit our page then we save it in state we call it fixed state
      try {
        const arr = [];
        const arr2 = [];

        this.getterForTimeAttendance.row.timeAttendance?.forEach((element) => {
          if (element.employeeReason !== null) {
            if (
              (element.inStatus !== null &&
                element.inStatus.name.en == "Missing") ||
              (element.inStatus !== null &&
                element.inStatus.name.en == "missingAccepted") ||
              (element.inStatus !== null &&
                element.inStatus.name.en == "missingRejected")
            ) {
              arr.push({
                recordId: element.id,
                employeeId: element.employee.id,
                employeeImg: element.employee.img,
                employeeName: element.employee.name,
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
            // this.missingPunchRequests = arr;
            console.log(element.date, "lllllllllll", element);
            if (
              (element.outStatus !== null &&
                element.outStatus.name.en == "Missing") ||
              (element.outStatus !== null &&
                element.outStatus.name.en == "missingAccepted") ||
              (element.outStatus !== null &&
                element.outStatus.name.en == "missingRejected")
            ) {
              arr2.push({
                recordId: element.id,
                employeeId: element.employee.id,
                employeeImg: element.employee.img,
                employeeName: element.employee.name,
                date: element.date,
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
            console.log(arr2, "arrrrrrrrrrrrrr2");
            this.missingPunchRequests = [...arr, ...arr2];
          }
        });
      } catch (error) {
        console.log(error.message, "missing punch table error");
      }
    },
    handleRowClicked(value) {
      //here to display request for employee when he/she click on any request

      this.missingPunchDetails = value;
      this.missingPunchRequest = !this.missingPunchRequest;
    },
    filterMany(filtredType, dates, filtredStatus) {
      //here we filter data depending only status
      try {
        const filterDataArr = this.missingPunchRequests.filter((ele) => {
          return (
            (filtredStatus ? ele.status === filtredStatus?.name?.en : true) &&
            (filtredType
              ? ele.missingType.toLowerCase() === filtredType.toLowerCase()
              : true) &&
            (dates ? ele.date >= dates[0] && ele.date <= dates[1] : true)
          );
        });
        this.missingPunchRequestsDataDynamic = filterDataArr;
        return;
      } catch (error) {
        console.log("employee missing punch tableerror", error.message);
      }
    },
    editClicked(item) {
      this.missingPunchDetails = item;
      this.editMissingDialog = !this.editMissingDialog;
    },
    restAll() {
      this.filtredStatus = null;
      this.filtredType = null;
      this.dates = null;
      this.actionForTimeAttendance({
        employeeId: [this.employeeId],
      });
    },
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    async renderData() {
      this.actionForTimeAttendance({
        employeeId: [this.employeeId],
      });
      this.getData();
      this.missingPunchRequestsDataDynamic = this.missingPunchRequests;
      this.settingsData = this.getterForSettingsData.row.settings;
    },
  },
  computed: {
    ...mapGetters(["getterForTimeAttendance", "getterForSettingsData"]),
  },
  mounted() {
    // this.getData();
    // this.missingPunchRequestsDataDynamic = this.missingPunchRequests;
    // this.settingsData = this.getterForSettingsData.row.settings;
    this.renderData();
  },
  watch: {
    getterForTimeAttendance() {
      this.getData();
      this.missingPunchRequestsDataDynamic = this.missingPunchRequests;
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
