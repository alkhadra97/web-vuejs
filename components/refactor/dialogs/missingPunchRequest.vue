<template v-if="settingsData.length > 0">
  <div>
    <v-dialog v-model="showMissingPunchDialog" persistent max-width="400">
      {{ assignDialog }}
      <v-col md="12">
        <v-row class="align-center justify-center">
          <v-card>
            <v-card-title>
              <span class="request-title">Missing Punch Request</span>
            </v-card-title>

            <v-divider class="mx-4"></v-divider>
            <v-card-text>
              <v-container>
                <v-form v-model="isFormValid">
                  <v-row>
                    <!-- /////////////////////////////// -->
                    <v-col md="12">
                      <v-autocomplete
                        v-if="settingsData[0]"
                        v-model="missingPunchType"
                        :items="settingsData[0].missingTypes"
                        label="choose type..."
                        color="#194569"
                        outlined
                        dense
                        hide-details
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col md="12">
                      <v-autocomplete
                        v-if="missingPunchType == 'Check In'"
                        v-model="applyDateForMissingPunch"
                        :items="missedDaysCheckIn"
                        item-text="date"
                        label="Missing Days"
                        outlined
                        color="#194569"
                        return-object
                      >
                      </v-autocomplete>
                      <v-autocomplete
                        v-else-if="missingPunchType == 'Check Out'"
                        v-model="applyDateForMissingPunch"
                        :items="missedDaysCheckOut"
                        item-text="date"
                        label="Missing Days"
                        color="#194569"
                        outlined
                        return-object
                      >
                      </v-autocomplete>
                      <v-text-field
                        v-else
                        v-model="applyDateForMissingPunch"
                        name="applyDateForMissingPunch"
                        label="Apply Date"
                        :min="getDateBeforeThirtyDays"
                        :max="getDateOneDay"
                        type="date"
                        dense
                        outlined
                        hide-details
                        color="#194569"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      md="6"
                      v-if="
                        missingPunchType == 'Check In' ||
                        missingPunchType == 'Check In & Check Out'
                      "
                    >
                      <v-text-field
                        v-model="timeFromForMissingPunch"
                        name="timeFromForMissingPunch"
                        label="Time From"
                        type="time"
                        dense
                        outlined
                        hide-details
                        color="#194569"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      md="6"
                      v-if="
                        missingPunchType == 'Check Out' ||
                        missingPunchType == 'Check In & Check Out'
                      "
                    >
                      <v-text-field
                        v-model="timeToForMissingPunch"
                        name="timeToForMissingPunch"
                        :min="timeFromForMissingPunch"
                        label="Time To"
                        type="time"
                        dense
                        outlined
                        hide-details
                        color="#194569"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <v-col md="12">
                      <v-text-field
                        v-model="reasonForMissingPunchRequest"
                        name="reasonForMissingPunchRequest"
                        label="Reason"
                        type="text"
                        dense
                        outlined
                        hide-details
                        color="#194569"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>

                    <!-- ////////////////////// -->
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="secondry-btn" @click="close"> Close </v-btn>
              <v-btn
                color="#194569"
                class="white--text"
                type="submit"
                @click="
                  requestMissingPunchRequest(
                    timeFromForMissingPunch,
                    timeToForMissingPunch,
                    reasonForMissingPunchRequest,
                    missingPunchType,
                    applyDateForMissingPunch
                  )
                "
                :disabled="!isFormValid"
              >
                Request
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-row>
      </v-col>
    </v-dialog>
    <v-row v-if="requested">
      <PopupSuccess :dialog2.sync="dialog2" />
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import PopupSuccess from "../../dialogs/PopupSuccess.vue";
import { getFormattedDate, dateHelper } from "../../../util/dateFormatting";
import {
  createNewMissingService,
  createNewMissingInService,
} from "../../../util/services/hrServices";

export default {
  components: { PopupSuccess },

  props: {
    missingPunchDialog: {
      type: Boolean,
      default: false,
    },
    employeeId: {
      type: String,
    },
  },
  data() {
    return {
      dialog2: false,
      showMissingPunchDialog: null,
      ///////////////////////////////
      applyDateForMissingPunch: new Date().toISOString().substr(0, 10),
      ///////////
      timeFromForMissingPunch: null,
      timeToForMissingPunch: null,
      /////////
      missingPunchType: null,
      ////////////
      reasonForMissingPunchRequest: null,
      //////////////////////////
      rules: {
        required: (value) => !!value || "Required.",
      },
      isFormValid: false,
      requested: false,
      ///////////
      settingsData: [],
    };
  },

  computed: {
    ...mapGetters([
      "getterForTimeAttendance",
      "getterForEmployeesInformation",
      "getterForSettingsData",
      "user",
    ]),
    assignDialog() {
      this.showMissingPunchDialog = this.missingPunchDialog;
    },
    getDateBeforeThirtyDays() {
      let date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth();
      let firstDay = new Date(y, m, 1);
      return firstDay.toISOString().slice(0, 10);
    },
    getDateOneDay() {
      return dateHelper(1);
    },
    missedDaysCheckIn() {
      ///here we get all days thats have check out only and missing check in
      let arr = [];
      let date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth();
      let firstDay = new Date(y, m, 1);
      let thisMonth = firstDay.toISOString().slice(0, 10); //here we get first day at month we currently in
      this.getterForTimeAttendance.row.timeAttendance?.forEach((item) => {
        if (
          item.date >= thisMonth &&
          item.date < getFormattedDate(new Date()) &&
          item.inStatus === null
        ) {
          arr.push({
            date: item.date,
            recordId: item.id,
          });
        }
      });
      return arr;
    },
    missedDaysCheckOut() {
      ///here we get all days thats have check in only and missing check out

      let arr = [];
      let date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth();
      let firstDay = new Date(y, m, 1);
      let thisMonth = firstDay.toISOString().slice(0, 10);
      this.getterForTimeAttendance.row.timeAttendance?.forEach((item) => {
        if (
          item.date >= thisMonth &&
          item.date < getFormattedDate(new Date()) &&
          item.outStatus == null
        ) {
          arr.push({
            date: item.date,
            recordId: item.id,
          });
        }
      });
      return arr;
    },
  },
  methods: {
    ...mapActions(["actionForTimeAttendance"]),
    resetFields() {
      //here we reset all fields after submit request
      this.missingPunchType = null;
      this.timeFromForMissingPunch = null;
      this.timeToForMissingPunch = null;
      this.reasonForMissingPunchRequest = null;
      this.applyDateForMissingPunch = new Date().toISOString().substr(0, 10);
      this.missingPunchType = null;
    },
    async requestMissingPunchRequest(
      timeFromForMissingPunch,
      timeToForMissingPunch,
      reasonForMissingPunchRequest,
      missingPunchType,
      applyDateForMissingPunch
    ) {
      try {
        //here to submit request and hit the api depending on action type
        if (missingPunchType == "Check In") {
          await createNewMissingService({
            recordId: applyDateForMissingPunch.recordId,
            timeIn: timeFromForMissingPunch,
            employeeReason: { ar: "", en: reasonForMissingPunchRequest },
            inStatus: { id: "2", name: { ar: "", en: "Missing" } },
            createdBy: {
              id: "1",
              user: { ar: "", en: "beshir" },
              system: "agents",
              chanel: "12",
            },
          });
          await this.actionForTimeAttendance({
            employeeId: [this.employeeId],
          });
          this.$emit("update:missingPunchDialog", false);

          this.requested = true;
          this.dialog2 = !this.dialog2;
          this.resetFields();
        } else if (missingPunchType == "Check In & Check Out") {
          await createNewMissingInService({
            employee: {
              id: this.employeeId,
              img: null,
              name: this.user.name,
            },
            timeIn: timeFromForMissingPunch,
            date: applyDateForMissingPunch,
            inStatus: { id: "3", name: { ar: "", en: "Missing" } },
            employeeReason: { ar: "", en: reasonForMissingPunchRequest },
            createdBy: {
              id: "1",
              user: { ar: "", en: "beshir" },
              system: "agents",
              chanel: "12",
            },
          });
          await createNewMissingInService({
            employee: {
              id: this.employeeId,
              img: null,
              name: this.user.name,
            },

            timeOut: timeToForMissingPunch,
            date: applyDateForMissingPunch,
            outStatus: { id: "3", name: { ar: "", en: "Missing" } },
            employeeReason: { ar: "", en: reasonForMissingPunchRequest },
            createdBy: {
              id: "1",
              user: { ar: "", en: "beshir" },
              system: "agents",
              chanel: "12",
            },
          });
          await this.actionForTimeAttendance({
            employeeId: [this.employeeId],
          });
          this.$emit("update:missingPunchDialog", false);

          this.requested = true;
          this.dialog2 = !this.dialog2;
          this.resetFields();
        } else {
          await createNewMissingService({
            recordId: applyDateForMissingPunch.recordId,
            timeOut: timeToForMissingPunch,
            employeeReason: { ar: "", en: reasonForMissingPunchRequest },
            outStatus: { id: "2", name: { ar: "", en: "Missing" } },
            createdBy: {
              id: "1",
              user: { ar: "", en: "beshir" },
              system: "agents",
              chanel: "12",
            },
          });
          await this.actionForTimeAttendance({
            employeeId: [this.employeeId],
          });
          this.$emit("update:missingPunchDialog", false);

          this.requested = true;
          this.dialog2 = !this.dialog2;
          this.resetFields();
        }
      } catch (error) {
        console.log(error);
      }
    },
    close() {
      this.resetFields();
      this.$emit("update:missingPunchDialog", false);
    },
  },
  mounted() {
    this.settingsData = this.getterForSettingsData.row.settings;
  },
  watch: {
    getterForSettingsData() {
      this.settingsData = this.getterForSettingsData.row.settings;
    },
  },
};
</script>

<style scoped>
.request-title {
  font-size: 1.404rem;
  color: #194569;
  margin-top: 2em auto;
  padding-bottom: 0.2em;
}
.secondry-btn {
  background: transparent !important;
  border: 1px solid #194569 !important;
}
</style>
