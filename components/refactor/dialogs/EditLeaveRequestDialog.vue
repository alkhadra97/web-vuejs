<template>
  <div>
    <v-dialog
      v-model="showEditLeaveRequestDialog"
      persistent
      width="782.5"
      height="471.5"
    >
      {{ assignDialog }}
      <v-col md="12">
        <v-row class="align-center justify-center">
          <v-card>
            <v-card-title>
              <span class="request-title">Edit Leave</span>
            </v-card-title>

            <v-divider class="mx-4"></v-divider>
            <v-card-text>
              <v-container>
                <v-form>
                  <v-row>
                    <v-col md="12">
                      <v-autocomplete
                        v-if="settingsData[0]"
                        v-model="newLeaveRequestType"
                        :items="settingsData[0].leaveType"
                        item-text="name"
                        item-value="id"
                        :placeholder="leaveRequestDetails.leaveType2.name.en"
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

                    <v-col md="5">
                      <v-text-field
                        v-model="leaveRequestDetails.dateFrom"
                        name="dateFromBusinessLeave"
                        type="date"
                        :min="nowDate"
                        outlined
                        dense
                        label="Date From"
                        hide-details
                        color="#194569"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <!-- /////////// -->
                    <v-col md="5">
                      <v-text-field
                        v-model="leaveRequestDetails.dateTo"
                        name="dateToBusinessLeave"
                        type="date"
                        :min="leaveRequestDetails.from"
                        outlined
                        dense
                        label="Date To"
                        hide-details
                        color="#194569"
                        :rules="[rules.required]"
                        @change="
                          checkForShowTimeFields(
                            leaveRequestDetails.dateFrom,
                            leaveRequestDetails.dateTo
                          )
                        "
                      ></v-text-field>
                    </v-col>
                    <v-col md="2">
                      <v-text-field
                        v-model="howManyDaysEmployeeAskedForLeave"
                        name="howManyDaysEmployeeAskForLeave"
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
                    <template
                      v-if="
                        leaveRequestDetails.dateFrom ==
                        leaveRequestDetails.dateTo
                      "
                    >
                      <v-col md="5">
                        <v-text-field
                          v-model="leaveRequestDetails.timeFrom"
                          name="timeFromLeave"
                          type="time"
                          outlined
                          dense
                          label="Time From"
                          hide-details
                          color="#194569"
                          :rules="[rules.required]"
                          @change="
                            leaveRequestDetails.timeTo =
                              new Date().toLocaleTimeString()
                          "
                        ></v-text-field>
                      </v-col>
                      <!-- /////////////////////////// -->
                      <v-col md="5">
                        <v-text-field
                          v-model="leaveRequestDetails.timeTo"
                          name="timeToLeave"
                          type="time"
                          label="Time To"
                          outlined
                          dense
                          hide-details
                          color="#194569"
                          :rules="[rules.required]"
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
                    </template>
                    <v-col md="12" v-if="newLeaveRequestType !== null">
                      <v-autocomplete
                        v-model="newSubLeaveType"
                        :items="newLeaveRequestType.subTypes"
                        item-text="name"
                        item-value="id"
                        :placeholder="leaveRequestDetails.reason2.name.en"
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
                        v-model="newNotes"
                        name="notes"
                        type="text"
                        :placeholder="leaveRequestDetails.notes"
                        outlined
                        dense
                        hide-details
                        color="#194569"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <v-col md="6">
                      <span
                        :class="[
                          leaveRequestDetails.status == 'new' ? 'new' : null,
                        ]"
                      >
                        {{ leaveRequestDetails.status }}
                      </span>
                    </v-col>
                  </v-row>
                  <!-- /////////////////////////////// -->
                </v-form>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="secondry-btn" @click="close"> Close </v-btn>
              <v-btn
                @click="saveNewInformation(leaveRequestDetails.leaveType)"
                color="#194569"
                class="white--text"
                type="submit"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-row>
      </v-col>
    </v-dialog>
    <!-- <v-row v-if="requested">
                  <PopupSuccess :dialog2.sync="dialog2" />
                </v-row> -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import PopupSuccess from "../../dialogs/PopupSuccess.vue";
import { updateLeaveRequestService } from "../../../util/services/hrServices";

export default {
  components: { PopupSuccess },

  props: {
    editLeaveRequestDialog: {
      type: Boolean,
      default: false,
    },
    employeeId: {
      type: String,
    },
    leaveRequestDetails: {
      type: Object,
    },
  },
  data() {
    return {
      showEditLeaveRequestDialog: false,
      isFormValid: false,
      settingsData: [],
      showTimeTextField: true,
      howManyDaysEmployeeAskedForLeave: null,
      howManyHoursEmployeeAskForBusinessLeave: null,
      howManyHoursEmployeeAskForBusinessLeaveForDb: null,
      newNotes: null,

      applyDateForRequestLeave: new Date().toISOString().substr(0, 10),

      nowDate: new Date().toISOString().slice(0, 10),

      rules: {
        required: (value) => !!value || "Required.",
      },
      title: [],
      company: null,
      newLeaveRequestType: null,
      newSubLeaveType: null,
    };
  },

  computed: {
    ...mapGetters(["getterForEmployeesInformation", "getterForSettingsData"]),
    assignDialog() {
      this.showEditLeaveRequestDialog = this.editLeaveRequestDialog;
    },
    calculateNumberOfDays2() {
      try {
        var date1 = new Date(this.leaveRequestDetails.dateFrom);
        var date2 = new Date(this.leaveRequestDetails.dateTo);

        var Difference_In_Time = date2.getTime() - date1.getTime();
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

        if (
          Difference_In_Days <= 0 &&
          this.leaveRequestDetails.dateFrom != this.leaveRequestDetails.dateTo
        ) {
          return (this.howManyDaysEmployeeAskedForLeave = null);
        } else if (
          this.leaveRequestDetails.dateFrom == this.leaveRequestDetails.dateTo
        ) {
          return (this.howManyDaysEmployeeAskedForLeave = 1);
        } else {
          this.howManyDaysEmployeeAskedForLeave = 1 + Difference_In_Days;
        }
      } catch (error) {
        console.log(error, "calculate days for editing leave request error");
      }
    },
    calculateHoursEmployeeAskedFor() {
      try {
        console.log(
          this.leaveRequestDetails.timeFrom,
          "   this.leaveRequestDetails.timeFrom    this.leaveRequestDetails.timeFrom "
        );
        if (
          this.leaveRequestDetails.timeFrom != this.leaveRequestDetails.timeTo
        ) {
          let fromHours = this.leaveRequestDetails.timeFrom.slice(0, 2) * 60; //10
          let fromMunites = this.leaveRequestDetails.timeFrom.slice(3, 5);
          let finalFromInHours = 1 * fromHours + 1 * fromMunites;
          let toHours = this.leaveRequestDetails.timeTo.slice(0, 2) * 60;
          let toMunites = this.leaveRequestDetails.timeTo.slice(3, 5);
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
          this.howManyHoursEmployeeAskForBusinessLeave =
            rhours + ":" + rminutes;
        } else {
          this.howManyHoursEmployeeAskForBusinessLeaveForDb = 0;

          this.howManyHoursEmployeeAskForBusinessLeave = 0;
        }
      } catch (error) {
        console.log(error, "calculate hours for editing leave request error");
      }
    },
  },
  methods: {
    ...mapActions(["actionForLeaveRequets"]),

    close() {
      this.$emit("update:editLeaveRequestDialog", false);
    },

    getName: (item) => `${item.name.en}`,
    checkForShowTimeFields(dateFrom, dateTo) {
      if (dateFrom == dateTo) {
        // this.showTimeTextField = false;
      } else {
        // this.showTimeTextField = true;
        this.leaveRequestDetails.timeFrom = "null";
        this.leaveRequestDetails.timeTo = "null";
      }
    },

    async saveNewInformation(type) {
      try {
        if (
          this.leaveRequestDetails.dateFrom != this.leaveRequestDetails.dateTo
        ) {
          await updateLeaveRequestService({
            recordId: this.leaveRequestDetails.recordId,
            applyingDate: this.applyDateForRequestLeave,
            dateFrom: this.leaveRequestDetails.dateFrom,
            dateTo: this.leaveRequestDetails.dateTo,
            timeFrom: this.leaveRequestDetails.timeFrom,
            timeTo: this.leaveRequestDetails.timeTo,
            type:
              this.newLeaveRequestType !== null
                ? {
                    id: this.newLeaveRequestType.id,
                    name: this.newLeaveRequestType.name,
                  }
                : null,
            subType:
              this.newSubLeaveType !== null ? this.newSubLeaveType : null,
            totalDays: this.howManyDaysEmployeeAskedForLeave,
            totalHours: this.howManyHoursEmployeeAskForBusinessLeaveForDb,
            employeeReason: this.newNotes ? this.newNotes : null,

            createdBy: {
              id: "1",
              user: { ar: "", en: "beshir" },
              system: "agents",
              chanel: "12",
            },
          });
        } else {
          await updateLeaveRequestService({
            recordId: this.leaveRequestDetails.recordId,
            applyingDate: this.applyDateForRequestLeave,
            dateFrom: this.leaveRequestDetails.dateFrom,
            dateTo: this.leaveRequestDetails.dateTo,
            timeFrom: this.leaveRequestDetails.timeFrom,
            timeTo: this.leaveRequestDetails.timeTo,
            type:
              this.newLeaveRequestType !== null
                ? {
                    id: this.newLeaveRequestType.id,
                    name: this.newLeaveRequestType.name,
                  }
                : null,
            subType:
              this.newSubLeaveType !== null ? this.newSubLeaveType : null,
            totalDays: this.howManyDaysEmployeeAskedForLeave,
            totalHours: this.howManyHoursEmployeeAskForBusinessLeaveForDb,
            employeeReason: this.newNotes ? this.newNotes : null,

            createdBy: {
              id: "1",
              user: { ar: "", en: "beshir" },
              system: "agents",
              chanel: "12",
            },
          });
        }
        await this.actionForLeaveRequets({
          employeeId: [this.leaveRequestDetails.employeeId],
        });
        this.$emit("update:editLeaveRequestDialog", false);
      } catch (error) {
        console.log(error, "edit leavee request error");
      }
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
.new {
  background: transparent;
  border: #194569 solid 1px;
  color: #194569;
  padding: 5px 8px !important;
  line-height: 1.1rem !important;
  font-weight: 400 !important;
  font-size: 0.8rem !important;
}
</style>
