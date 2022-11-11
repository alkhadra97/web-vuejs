<template>
  <div>
    <v-dialog v-model="pendingLeaveRequestDialog" persistent max-width="558px">
      {{ assignDialog }}
      <v-col md="12">
        <v-row class="align-center justify-center">
          <v-card>
            <v-card-title>
              <span class="request-title">Pending Request</span>
            </v-card-title>

            <v-divider class="mx-4"></v-divider>
            <v-card-text>
              <v-container>
                <v-form v-model="isFormValid">
                  <v-row>
                    <!-- /////////////////////////////// -->
                    <v-col md="12">
                      <v-text-field
                        name="leaveType"
                        :value="leaveRequestDetails.leaveType"
                        label="Leave Type"
                        type="text"
                        dense
                        outlined
                        hide-details
                        color="#194569"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <template v-if="leaveRequestDetails.duration.length == 6">
                      <v-col md="5">
                        <v-text-field
                          v-model="leaveRequestDetails.from"
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
                          v-model="leaveRequestDetails.to"
                          name="dateToBusinessLeave"
                          type="date"
                          :min="leaveRequestDetails.from"
                          outlined
                          dense
                          label="Date To"
                          hide-details
                          color="#194569"
                          :rules="[rules.required]"
                        ></v-text-field>
                      </v-col>
                      <v-col md="2">
                        <v-text-field
                          v-model="howManyDaysLeaveRequest"
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
                    </template>
                    <!-- ///here we handle text fields for times -->
                    <template v-else>
                      <v-col md="5">
                        <v-text-field
                          v-model="leaveRequestDetails.from"
                          name="timeFromLeave"
                          type="time"
                          outlined
                          dense
                          label="Time From"
                          hide-details
                          color="#194569"
                          :rules="[rules.required]"
                        ></v-text-field>
                      </v-col>
                      <!-- /////////////////////////// -->
                      <v-col md="5">
                        <v-text-field
                          v-model="leaveRequestDetails.to"
                          name="timeToLeave"
                          type="time"
                          :min="leaveRequestDetails.from"
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

                    <v-col md="12">
                      <v-text-field
                        :value="leaveRequestDetails.reason"
                        name="leaveReason"
                        label="Reason"
                        dense
                        outlined
                        hide-details
                        color="#194569"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col md="6">
                      <span
                        :class="[
                          leaveRequestDetails.status == 'on hold'
                            ? 'onHold'
                            : null,
                        ]"
                      >
                        {{ leaveRequestDetails.status }}
                      </span>
                    </v-col>
                    <!-- <v-col md="12">
                          <v-text-field
                            v-model="reasonForleaveRequestDialog"
                            name="reasonForleaveRequestDialog"
                            label="Reason"
                            type="text"
                            dense
                            outlined
                            hide-details
                            color="#194569"
                          ></v-text-field>
                        </v-col> -->

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
                @click="submitPendingRequest"
                :disabled="!isFormValid"
              >
                Submit
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
import { updateLeaveRequestService } from "../../../util/services/hrServices";
import PopupSuccess from "../../dialogs/PopupSuccess.vue";

export default {
  components: { PopupSuccess },

  props: {
    showPendingLeaveRequest: {
      type: Boolean,
      default: false,
    },
    leaveRequestDetails: {
      type: Object,
    },
    employeeId: {
      type: String,
    },
  },
  data() {
    return {
      dialog2: false,
      pendingLeaveRequestDialog: null,
      ////////////
      reasonForleaveRequestDialog: null,
      //////////////////////////
      rules: {
        required: (value) => !!value || "Required.",
      },
      isFormValid: false,
      requested: false,
      ///////////
      nowDate: new Date().toISOString().slice(0, 10),
      howManyDaysLeaveRequest: null,
      howManyHoursEmployeeAskForBusinessLeave: null,
      howManyHoursEmployeeAskForBusinessLeaveForDb: null,
      howManyHoursEmployeeAskedForUpdateForDb: null,
    };
  },
  computed: {
    ...mapGetters(["getterForTimeAttendance", "getterForEmployeesInformation"]),
    assignDialog() {
      this.pendingLeaveRequestDialog = this.showPendingLeaveRequest;
    },
    calculateNumberOfDays2() {
      //here we calculate how many days employee asked for leave if it more than one day ,depending on(date from and date to)

      var date1 = new Date(this.leaveRequestDetails.from);
      var date2 = new Date(this.leaveRequestDetails.to);
      var Difference_In_Time = date2.getTime() - date1.getTime();
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      if (Difference_In_Days <= 0) {
        return (this.howManyDaysLeaveRequest = null);
      } else {
        this.howManyDaysLeaveRequest = 1 + Difference_In_Days;
      }
    },
    calculateHoursEmployeeAskedFor() {
      //here we calculate how many hours employee asked for leave if it only one day ,depending on(time from and time to)
      let fromHours = this.leaveRequestDetails.from.slice(0, 2) * 60; //10
      let fromMunites = this.leaveRequestDetails.from.slice(3, 5);
      let finalFromInHours = 1 * fromHours + 1 * fromMunites;
      let toHours = this.leaveRequestDetails.to.slice(0, 2) * 60;
      let toMunites = this.leaveRequestDetails.to.slice(3, 5);
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
    },
  },
  methods: {
    ...mapActions(["actionForLeaveRequets"]),

    async submitPendingRequest() {
      try {
        //here employee re-request the leave because manager refuse the time or date who already asked for in first request
        console.log(
          this.leaveRequestDetails,
          "this.leaveRequestDetails.duration this.leaveRequestDetails.duration "
        );
        if (this.leaveRequestDetails.duration.length === 6) {
          let res = await updateLeaveRequestService({
            recordId: this.leaveRequestDetails.recordId,
            status: {
              id: "5",
              name: {
                ar: "",
                en: "updated",
              },
            },
            dateFrom: this.leaveRequestDetails.from,
            dateTo: this.leaveRequestDetails.to,
            totalDays: this.howManyDaysLeaveRequest,
            totalHours: this.howManyHoursEmployeeAskForBusinessLeaveForDb,
            createdBy: {
              id: "1",
              user: { ar: "", en: "beshir khaled" },
              system: "agents",
              chanel: "12",
            },
          });
          console.log(res, "ressssssssssss");
          await this.actionForLeaveRequets({
            employeeId: [this.employeeId],
          });
          this.$emit("update:showPendingLeaveRequest", false);
          this.requested = true;

          this.dialog2 = true;
        } else {
          let res = updateLeaveRequestService({
            recordId: this.leaveRequestDetails.recordId,
            status: {
              id: "5",
              name: {
                ar: "",
                en: "updated",
              },
            },
            timeFrom: this.leaveRequestDetails.from,
            timeTo: this.leaveRequestDetails.to,
            totalHours: this.howManyHoursEmployeeAskForBusinessLeaveForDb,
            createdBy: {
              id: "1",
              user: { ar: "", en: "beshir khaled" },
              system: "agents",
              chanel: "12",
            },
          });
        }
        await this.actionForLeaveRequets({
          employeeId: [this.employeeId],
        });
        this.$emit("update:showPendingLeaveRequest", false);
        this.requested = true;

        this.dialog2 = true;
      } catch (error) {
        console.log(error.message, "pending leave request error");
      }

      //   this.resetFields();
    },
    close() {
      this.$emit("update:showPendingLeaveRequest", false);
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

.onHold {
  background: transparent;
  border: orange solid 1px;
  color: orange;
  padding: 5px 8px !important;
  line-height: 1.1rem !important;
  font-weight: 400 !important;
  font-size: 0.8rem !important;
}
</style>
