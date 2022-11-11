<template v-if="settingsData.length > 0">
  <div>
    <v-dialog v-model="showBusinessLeaveDialog" persistent max-width="558">
      {{ assignDialog }}
      <v-col md="12">
        <v-row class="align-center justify-center">
          <v-card>
            <v-card-title>
              <span class="request-title text-h5">Request Leave</span>
            </v-card-title>
            <v-divider class="mx-4"></v-divider>

            <v-card-text>
              <v-container>
                <v-form v-model="isFormValid">
                  <v-row>
                    <!-- //////////////////////////////////////////////////////////////// -->
                    <!-- ///to handle leave type  -->
                    <v-col md="12">
                      <v-autocomplete
                        v-if="settingsData[0]"
                        v-model="requestType"
                        :items="settingsData[0].leaveType"
                        item-text="name"
                        item-value="id"
                        label="choose type..."
                        color="#194569"
                        dense
                        hide-details
                        outlined
                        return-object
                        :rules="[rules.required]"
                      >
                        <template v-slot:selection="{ item }">
                          {{ getName(item) }}
                        </template>
                        <template v-slot:item="{ item }">
                          {{ getName(item) }}
                        </template>
                      </v-autocomplete>
                    </v-col>
                    <!-- ///here we handle text fields for dates  -->
                    <v-col md="5">
                      <v-text-field
                        v-model="dateFromBusinessLeave"
                        name="dateFromBusinessLeave"
                        type="date"
                        outlined
                        dense
                        :min="nowDate"
                        label="Date From"
                        hide-details
                        color="#194569"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <!-- /////////// -->
                    <v-col md="5">
                      <v-text-field
                        v-model="dateToBusinessLeave"
                        name="dateToBusinessLeave"
                        type="date"
                        :min="dateFromBusinessLeave"
                        outlined
                        dense
                        @change="
                          checkForShowTimeFields(
                            dateFromBusinessLeave,
                            dateToBusinessLeave
                          )
                        "
                        label="Date To"
                        hide-details
                        color="#194569"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <v-col md="2">
                      <v-text-field
                        v-model="howManyDaysEmployeeAskForBusinessLeave"
                        name="howManyDaysEmployeeAskForBusinessLeave"
                        label="Days"
                        hide-details
                        readonly
                        outlined
                        dense
                        :value="calculateNumberOfDays2"
                      ></v-text-field>
                    </v-col>
                    <!-- ///////////////////////////////////////////////////////////////// -->
                    <!-- ///here we handle text fields for times -->
                    <v-col md="5">
                      <v-text-field
                        v-model="timeFromBusinessLeave"
                        name="timeFromBusinessLeave"
                        type="time"
                        outlined
                        dense
                        :disabled="showTimeTextField"
                        label="Time From"
                        hide-details
                        color="#194569"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <!-- /////////////////////////// -->
                    <v-col md="5">
                      <v-text-field
                        v-model="timeToBusinessLeave"
                        name="timeToBusinessLeave"
                        type="time"
                        :min="timeFromBusinessLeave"
                        label="Time To"
                        outlined
                        dense
                        :disabled="showTimeTextField"
                        hide-details
                        color="#194569"
                        :rules="[rules.required]"
                        @change="
                          checkAppointmentForProvider(
                            dateToBusinessLeave,
                            timeFromBusinessLeave,
                            timeToBusinessLeave
                          )
                        "
                      ></v-text-field>
                    </v-col>
                    <v-col md="2">
                      <v-text-field
                        v-model="howManyHoursEmployeeAskForBusinessLeave"
                        name="howManyHoursEmployeeAskForBusinessLeave"
                        label="Hours"
                        hide-details
                        outlined
                        dense
                        readonly
                        :value="calculateHoursEmployeeAskedFor"
                      ></v-text-field>
                    </v-col>
                    <!-- //////////////////////////////// -->
                    <!-- <v-col md="12" v-if="getterToCheckProviderAppointments">
                      <v-alert
                        dense
                        outlined
                        type="error"
                        v-if="
                          getterToCheckProviderAppointments.message !=
                          'This Provider Has No appointment At This Time'
                        "
                      >
                        You Have An Appointment At Same Time
                        <strong><v-btn>View</v-btn></strong>
                      </v-alert>
                    </v-col> -->

                    <!-- ///////////////////////////////////////////////////////// -->
                    <v-col md="12" v-if="requestType !== null">
                      <v-autocomplete
                        v-model="subLeaveType"
                        :items="requestType.subTypes"
                        item-text="name"
                        item-value="id"
                        label="choose reason..."
                        color="#194569"
                        dense
                        hide-details
                        outlined
                        return-object
                        :rules="[rules.required]"
                      >
                        <template v-slot:selection="{ item }">
                          {{ getName(item) }}
                        </template>
                        <template v-slot:item="{ item }">
                          {{ getName(item) }}
                        </template>
                      </v-autocomplete>
                    </v-col>
                    <v-col md="12">
                      <v-text-field
                        v-model="reasonFromEmployee"
                        name="reasonFromEmployee"
                        hide-details
                        type="text"
                        dense
                        outlined
                        color="#194569"
                        label="Notes"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
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
                @click="requestLeave"
                :disabled="!isFormValid"
              >
                Request
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-row>
      </v-col>
    </v-dialog>
    <!-- <UploadComponent
      :dmsDialog.sync="dmsDialog"
      :entity_id="nameAndPhone"
      :feature_type="'hr'"
      @testData="testData"
    /> -->
    <v-row v-if="requested">
      <PopupSuccess :dialog2.sync="dialog2" type="leave request" />
    </v-row>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { createNewLeaveService } from "../../../util/services/hrServices";
import PopupSuccess from "../../dialogs/PopupSuccess.vue";
// import UploadComponent from "../../../web.dms.agentsoncloud.com/components/UploadComponent.vue";

export default {
  components: { PopupSuccess },

  props: {
    businessLeaveDialog: {
      type: Boolean,
      default: false,
    },
    /////////////////////////////
    toggle: {
      type: Boolean,
    },
    employeeId: {
      type: String,
    },
  },

  data() {
    return {
      showBusinessLeaveDialog: null,
      dialog2: false,
      //////////////
      dateFromBusinessLeave: null,
      dateToBusinessLeave: null,
      //////////////
      showTimeTextField: true,
      timeFromBusinessLeave: new Date().toLocaleTimeString(),
      timeToBusinessLeave: new Date().toLocaleTimeString(),
      //////////////
      applyDateForRequestLeave: new Date().toISOString().substr(0, 10),
      nowDate: new Date().toISOString().slice(0, 10),
      howManyDaysEmployeeAskForBusinessLeave: null,
      howManyHoursEmployeeAskForBusinessLeave: null,
      howManyHoursEmployeeAskForBusinessLeaveForDb: null,
      howManyHoursEmployeeAskedForUpdateForDb: null,
      //////////////
      settingsData: [],
      requestType: null,
      subLeaveType: null,
      //////////////
      reasonFromEmployee: null,
      requested: false,
      /////////////////
      rules: {
        required: (value) => !!value || "Required.",
      },
      isFormValid: false,
      ///////////////////////
      dmsDialog: false,
      dmsData: null,
      documentName: null,
      nameAndPhone: null,
    };
  },

  computed: {
    ...mapGetters([
      "getterToCheckProviderAppointments",
      "getterForSettingsData",
      "user",
    ]),
    assignDialog() {
      // this.toggle = !this.toggle;
      this.showBusinessLeaveDialog = this.businessLeaveDialog;
    },
    calculateNumberOfDays2() {
      var date1 = new Date(this.dateFromBusinessLeave);
      var date2 = new Date(this.dateToBusinessLeave);

      var Difference_In_Time = date2.getTime() - date1.getTime();
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

      if (
        Difference_In_Days <= 0 &&
        this.dateFromBusinessLeave != this.dateToBusinessLeave
      ) {
        return (this.howManyDaysEmployeeAskForBusinessLeave = null);
      } else if (this.dateFromBusinessLeave == this.dateToBusinessLeave) {
        return (this.howManyDaysEmployeeAskForBusinessLeave = 1);
      } else {
        this.howManyDaysEmployeeAskForBusinessLeave = 1 + Difference_In_Days;
      }
    },
    calculateHoursEmployeeAskedFor() {
      if (this.timeFromBusinessLeave != this.timeToBusinessLeave) {
        // this.timeFromBusinessLeave = new Date().toLocaleTimeString();
        // this.timeToBusinessLeave = new Date().toLocaleTimeString();
        let fromHours = this.timeFromBusinessLeave.slice(0, 2) * 60; //10
        let fromMunites = this.timeFromBusinessLeave.slice(3, 5);
        let finalFromInHours = 1 * fromHours + 1 * fromMunites;
        let toHours = this.timeToBusinessLeave.slice(0, 2) * 60;
        let toMunites = this.timeToBusinessLeave.slice(3, 5);
        // let toMunitesMin =toMunites.toFixed(1)
        let finalToInHours = 1 * toHours + 1 * toMunites;
        let howManyHoursEmployeeAskForBusinessLeave =
          finalToInHours - finalFromInHours;
        this.howManyHoursEmployeeAskForBusinessLeaveForDb =
          howManyHoursEmployeeAskForBusinessLeave;
        let hours = howManyHoursEmployeeAskForBusinessLeave / 60;
        let rhours = Math.floor(hours);
        let minutes = (hours - rhours) * 60;
        let rminutes = Math.round(minutes);
        this.howManyHoursEmployeeAskForBusinessLeave = rhours + ":" + rminutes;
      } else if (this.howManyHoursEmployeeAskedForUpdate) {
        this.howManyHoursEmployeeAskedForUpdateForDb =
          this.howManyHoursEmployeeAskedForUpdate;
        let hours = this.howManyHoursEmployeeAskedForUpdate / 60;
        let rhours = Math.floor(hours);
        let minutes = (hours - rhours) * 60;
        let rminutes = Math.round(minutes);
        this.howManyHoursEmployeeAskedForUpdate = rhours + ":" + rminutes;
      } else {
        this.howManyHoursEmployeeAskForBusinessLeaveForDb = 0;
        this.howManyHoursEmployeeAskForBusinessLeave = 0;
      }
    },
  },
  methods: {
    ...mapActions([
      "actionToCheckProviderAppointments",
      "actionForLeaveRequets",
    ]),
    getName: (item) => `${item.name.en}`,

    resetFields() {
      this.requestType = null;
      this.dateFromBusinessLeave = null;
      this.dateToBusinessLeave = null;
      this.timeFromBusinessLeave = new Date().toLocaleTimeString();
      this.timeToBusinessLeave = new Date().toLocaleTimeString();
      this.subLeaveType = null;
      this.reasonFromEmployee = null;
    },
    async requestLeave(e) {
      try {
        if (
          this.timeToBusinessLeave == this.timeFromBusinessLeave &&
          this.dateFromBusinessLeave != this.dateToBusinessLeave
        ) {
          //here we request leave depending if dates not equals
          await createNewLeaveService({
            employee: {
              id: this.employeeId,
              img: null,
              name: this.user.name,
            },
            applyingDate: this.applyDateForRequestLeave,
            dateFrom: this.dateFromBusinessLeave,
            dateTo: this.dateToBusinessLeave,
            ///////////////
            type: {
              id: this.requestType.id,
              name: this.requestType.name,
            },
            subType: this.subLeaveType,
            //////////////
            totalDays: this.howManyDaysEmployeeAskForBusinessLeave,
            totalHours: this.howManyHoursEmployeeAskForBusinessLeaveForDb,
            ///////////////
            employeeReason: this.reasonFromEmployee,
            createdBy: {
              id: "1",
              user: { ar: "", en: "beshir" },
              system: "agents",
              chanel: "12",
            },
          });
          await this.actionForLeaveRequets({
            employeeId: [this.employeeId],
          });
          this.showBusinessLeaveDialog = !this.showBusinessLeaveDialog;
          this.requested = true;
          //   this.actionForGettingAllLeaveWork({
          //     providerUuid: this.employeeUuid,
          //   });
          this.dialog2 = true;
          this.resetFields();
        } else if (this.dateFromBusinessLeave == this.dateToBusinessLeave) {
          await createNewLeaveService({
            employee: {
              id: this.employeeId,
              img: null,
              name: this.user.name,
            },
            applyingDate: this.applyDateForRequestLeave,
            dateFrom: this.dateFromBusinessLeave,
            dateTo: this.dateToBusinessLeave,
            /////
            timeFrom: this.timeFromBusinessLeave,
            timeTo: this.timeToBusinessLeave,
            ///////////////
            type: {
              id: this.requestType.id,
              name: this.requestType.name,
            },
            subType: this.subLeaveType,

            //////////////
            totalDays: this.howManyDaysEmployeeAskForBusinessLeave,
            totalHours: this.howManyHoursEmployeeAskForBusinessLeaveForDb,
            ///////////////
            employeeReason: this.reasonFromEmployee,
            createdBy: {
              id: "1",
              user: { ar: "", en: "beshir" },
              system: "agents",
              chanel: "12",
            },
          });
          await this.actionForLeaveRequets({
            employeeId: [this.employeeId],
          });

          this.$emit("update:businessLeaveDialog", false);
          this.requested = true;

          this.dialog2 = true;
          this.resetFields();
        }
      } catch (error) {
        console.log(error);
      }
    },
    checkAppointmentForProvider(
      dateToBusinessLeave,
      timeFromBusinessLeave,
      timeToBusinessLeave
    ) {
      this.actionToCheckProviderAppointments({
        date: dateToBusinessLeave,
        timeFrom: timeFromBusinessLeave,
        timeTo: timeToBusinessLeave,
        // providerUuid: this.employeeUuid,
      });
    },
    checkForShowTimeFields(dateFromBusinessLeave, dateToBusinessLeave) {
      if (dateFromBusinessLeave == dateToBusinessLeave) {
        this.showTimeTextField = false;
      } else {
        this.showTimeTextField = true;
      }
    },
    close() {
      this.resetFields();

      this.toggle = !this.toggle;
      this.$emit("update:businessLeaveDialog", false);
    },
    testData(param1) {
      let converting = [...param1];
      this.documentName = converting[1][1].name;
      this.dmsData = param1;
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
