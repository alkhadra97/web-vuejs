<template>
  <div>
    <v-dialog v-model="showUpdateLeaveEmployee" max-width="500px">
      {{ assignDialog }}
      <v-col md="12">
        <v-row class="align-center justify-center">
          <v-card>
            <v-card-title>
              <span class="text-h5">Update Leave Request</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-form v-model="isFormValid">
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        data-cy="cy_employee_name_update_leave_third_hr"
                        v-model="employeeNameLeave"
                        name="employeeNameLeave"
                        readonly
                        hide-details
                        label="Employee Name"
                        color="teal"
                      ></v-text-field>
                    </v-col>
                    <!-- /////////////////////////// -->
                    <v-col
                      md="6"
                      v-if="leaveDateFromForUpdate != leaveDateToForUpdate"
                    >
                      <v-text-field
                        data-cy="cy_date_to_update_from_employee_leave_hr"
                        v-model="leaveDateFromForUpdate"
                        name="leaveDateFromForUpdate"
                        :min="nowDate"
                        type="date"
                        label="Date From"
                        hide-details
                        color="teal"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      md="6"
                      v-if="leaveDateFromForUpdate != leaveDateToForUpdate"
                    >
                      <v-text-field
                        data-cy="cy_date_to_update_from_employee_leave_hr"
                        v-model="leaveDateToForUpdate"
                        name="leaveDateToForUpdate"
                        type="date"
                        :min="leaveDateFromForUpdate"
                        label="Date To"
                        hide-details
                        color="teal"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <!-- ////////////////////////////////// -->

                    <v-col
                      md="6"
                      v-if="leaveDateFromForUpdate == leaveDateToForUpdate"
                    >
                      <v-text-field
                        data-cy="cy_time_from_update_from_employe_leave_hr"
                        v-model="timeFromToUpdateFromEmployee"
                        name="timeFromToUpdateFromEmployee"
                        type="time"
                        label="Time From"
                        hide-details
                        color="teal"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      md="6"
                      v-if="leaveDateFromForUpdate == leaveDateToForUpdate"
                    >
                      <v-text-field
                        data-cy="cy_time_to_update_from_employe_leave_hr"
                        v-model="timeToToUpdateFromEmployee"
                        name="timeToToUpdateFromEmployee"
                        type="time"
                        label="Time To"
                        hide-details
                        color="teal"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>

                    <!-- /////////////////////////////////// -->
                    <v-col md="6">
                      <v-text-field
                        data-cy="cy_apply_date_leave_third_hr"
                        v-model="applyLeaveDateEmployeeUpdate"
                        name="applyLeaveDateEmployeeUpdate"
                        :min="nowDate"
                        readonly
                        hide-details
                        label="Apply Date"
                        color="teal"
                        dense
                      ></v-text-field>
                    </v-col>
                    <!-- /////////////////////////////////////// -->
                    <v-col
                      md="6"
                      v-if="leaveDateFromForUpdate != leaveDateToForUpdate"
                    >
                      <v-text-field
                        data-cy="cy_requested_days_update_from_employee_leave_hr"
                        v-model="howDaysEmployeeAskedForUpdateLeave"
                        name="howDaysEmployeeAskedForUpdateLeave"
                        hide-details
                        label="Requested Days"
                        readonly
                        :value="calculateNumberOfDays2"
                        dense
                      ></v-text-field>
                    </v-col>
                    <!-- ////////////// -->
                    <v-col
                      md="6"
                      v-if="leaveDateFromForUpdate == leaveDateToForUpdate"
                    >
                      <v-text-field
                        data-cy="cy_requested_hours_update_from_employee_leave_hr"
                        v-model="howManyHoursEmployeeAskedForUpdateLeave"
                        name="howManyHoursEmployeeAskedForUpdateLeave"
                        hide-details
                        label="Requested Hours"
                        readonly
                        :value="calculateHoursEmployeeAskedFor"
                        dense
                      ></v-text-field>
                    </v-col>
                    <!-- ///////////////////////////////// -->
                    <v-col md="6">
                      <v-text-field
                        data-cy="cy_leaveType_update_from_employee_leave_hr"
                        v-model="leaveTypeUpdateEmployee"
                        name="leaveTypeUpdateEmployee"
                        readonly
                        hide-details
                        label="Leave Type"
                        color="teal"
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col md="6">
                      <v-text-field
                        data-cy="cy_subLeaveType_update_from_employee_hr"
                        v-model="subLeaveTypeToUpdateFromEmployee"
                        name="subLeaveTypeToUpdateFromEmployee"
                        readonly
                        hide-details
                        color="teal"
                        label="Sub Leave Type"
                        dense
                      ></v-text-field>
                    </v-col>
                    <!-- ////////////////////////////////////// -->

                    <!-- <v-col md="6"> -->
                    <!-- <span style="font-weight: 600; font-size: 1rem"
                        >Status:
                      </span> -->
                    <!-- <span
                        :class="[
                          statusForLeaveUpdate == 'pending'
                            ? 'pending'
                            : 'null',
                        ]"
                        >{{ statusForLeaveUpdate }}</span
                      > -->
                    <!-- </v-col> -->
                    <v-col md="12">
                      <v-text-field
                        data-cy="cy_reason_update_leave_third_hr"
                        v-model="reasonWhyEmployeeWantLeave"
                        readonly
                        hide-details
                        color="teal"
                        label="Reason To On Hold"
                        dense
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="teal" text @click="close"> Close </v-btn>
              <v-btn
                color="#35b5ac"
                class="white--text"
                type="submit"
                :disabled="!isFormValid"
                @click="requestLeave"
              >
                Update
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-row>
      </v-col>
      <!-- / -->
    </v-dialog>
    <v-row v-if="requested">
      <PopupSuccess :dialog2.sync="dialog2" />
    </v-row>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import requestBuilder from "../../requestBuilder";
import PopupSuccess from "./PopupSuccess.vue";
export default {
  props: {
    updateLeaveDialog: {
      type: Boolean,
      default: false,
    },
    leaveId: {
      type: Number,
    },
  },
  data() {
    return {
      showUpdateLeaveEmployee: null,
      dialog2: false,
      idForLeaveUpdate: null,
      employeeId: null,
      providerUuidForEmployeeIn: null,
      ///////////////////////////
      employeeNameLeave: null,
      ////////////////////
      nowDate: new Date().toISOString().slice(0, 10),
      applyLeaveDateEmployeeUpdate: new Date().toISOString().substr(0, 10),
      ///////////////////////////
      leaveDateFromForUpdate: null,
      leaveDateToForUpdate: null,

      ////////////////////////////
      timeFromToUpdateFromEmployee: null,
      timeToToUpdateFromEmployee: null,
      ///////////////////////////
      leaveTypeUpdateEmployee: null,
      subLeaveTypeToUpdateFromEmployee: null,
      ////////////////////////////
      statusForLeaveUpdate: null,
      reasonWhyEmployeeWantLeave: null,
      requested: false,
      /////////////////////////
      howDaysEmployeeAskedForUpdateLeave: null,
      howManyHoursEmployeeAskedForUpdateLeave: null,
      howManyHoursEmployeeAskedForUpdateLeaveForDb: null,

      /////////////////
      rules: {
        required: (value) => !!value || "Required.",
      },
      isFormValid: false,
      ///////////////////////
      allDetailsAboutLeave: [],
    };
  },
  methods: {
    ...mapActions([
      "actionToCheckProviderAppointments",
      "actionToCheckEmployeeVcationsAndLeaves",
      "actionForGettingAllLeaveWork",
    ]),

    requestLeave(e) {
      e.preventDefault();
      {
        let path = this.$axios(
          requestBuilder("hr", "/updateLeaveForEmployee", "put", {
            leaveIdUpdate: this.idForLeaveUpdate,
          })
        ).then((res) => {
          let path = this.$axios(
            requestBuilder("hr", "/leaveApplication", "post", {
              employeeName: this.employeeNameLeave,
              providerUuid: this.providerUuidForEmployeeIn,
              applyDate: this.applyLeaveDateEmployeeUpdate,
              ///////////////

              DateFrom: this.leaveDateFromForUpdate,
              dateTo: this.leaveDateToForUpdate,
              ///////////////

              timeFrom: this.timeFromToUpdateFromEmployee,
              timeTo: this.timeToToUpdateFromEmployee,
              ///////////////
              leaveType: this.leaveTypeUpdateEmployee,
              subLeaveType: this.subLeaveTypeToUpdateFromEmployee,
              isApproved: "updated",
              //////////////

              howManyDaysEmployeeAskForBusinessLeave:
                this.howDaysEmployeeAskedForUpdateLeave,
              howManyHoursEmployeeAskForBusinessLeave:
                this.howManyHoursEmployeeAskedForUpdateLeaveForDb,
              ///////////////
              reasonFromManager: this.reasonWhyEmployeeWantLeave,

              EmployeeId: this.employeeId,
            })
          ).then(() => {
            this.showUpdateLeaveEmployee = !this.showUpdateLeaveEmployee;
            this.requested = true;
            this.$store.dispatch("actionForGettingAllLeaveWork");
          });
          this.dialog2 = true;
        });
      }
    },
    close() {
      this.$emit("update:updateLeaveDialog", false);
    },
  },
  mounted() {
    this.actionForGettingAllLeaveWork({
      providerUuid: null,
      dateFromFiltred: null,
      dateToFiltred: null,
    });
  },
  computed: {
    ...mapGetters(["info", "getAllLeaveForProviders"]),
    assignDialog() {
      this.showUpdateLeaveEmployee = this.updateLeaveDialog;
    },
    // getData() {
    //   const arr = [];
    //   this.getAllLeaveForProviders.data?.resp.reverse().forEach((element) => {
    //     if (element.id == this.leaveId) {
    //       this.idForLeaveUpdate = element.id;
    //       this.providerUuidForEmployeeIn = element.providerUuid;
    //       this.employeeId = element.EmployeeId;
    //       this.employeeNameLeave = element.employeeName;
    //       this.reasonWhyEmployeeWantLeave = element.reasonFromManager;
    //       this.leaveDateFromForUpdate = element.DateFrom;
    //       this.leaveDateToForUpdate = element.dateTo;
    //       this.leaveTypeUpdateEmployee = element.leaveType;
    //       this.subLeaveTypeToUpdateFromEmployee = element.subLeaveType;
    //     }
    //   });

    //   this.allDetailsAboutLeave = arr;
    // },
    calculateNumberOfDays2() {
      var date1 = new Date(this.leaveDateFromForUpdate);
      var date2 = new Date(this.leaveDateToForUpdate);

      var Difference_In_Time = date2.getTime() - date1.getTime();
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      return (this.howDaysEmployeeAskedForUpdateLeave = 1 + Difference_In_Days);
    },
    calculateHoursEmployeeAskedFor() {
      if (this.timeFromToUpdateFromEmployee != null) {
        let fromHours = this.timeFromToUpdateFromEmployee.slice(0, 2) * 60; //10
        let fromMunites = this.timeFromToUpdateFromEmployee.slice(3, 5);
        let finalFromInHours = parseInt(fromHours) + parseInt(fromMunites);
        let toHours = this.timeToToUpdateFromEmployee.slice(0, 2) * 60;
        let toMunites = this.timeToToUpdateFromEmployee.slice(3, 5);
        let finalToInHours = parseInt(toHours) + parseInt(toMunites);
        this.howManyHoursEmployeeAskedForUpdateLeave =
          finalToInHours - finalFromInHours;
        this.howManyHoursEmployeeAskedForUpdateLeaveForDb =
          this.howManyHoursEmployeeAskedForUpdateLeave;
        let hours = this.howManyHoursEmployeeAskedForUpdateLeave / 60;
        let rhours = Math.floor(hours);
        let minutes = (hours - rhours) * 60;
        let rminutes = Math.round(minutes);
        return (this.howManyHoursEmployeeAskedForUpdateLeave =
          rhours + ":" + rminutes);
      }
    },
  },
  watch: {
    getAllLeaveForProviders() {
      const arr = [];
      this.getAllLeaveForProviders.data?.resp.reverse().forEach((element) => {
        if (element.id == this.leaveId) {
          this.idForLeaveUpdate = element.id;
          this.providerUuidForEmployeeIn = element.providerUuid;
          this.employeeId = element.EmployeeId;
          this.employeeNameLeave = element.employeeName;
          this.reasonWhyEmployeeWantLeave = element.reasonFromManager;
          this.timeFromToUpdateFromEmployee = element.timeFrom;
          this.timeToToUpdateFromEmployee = element.timeTo;
          this.leaveDateFromForUpdate = element.DateFrom;
          this.leaveDateToForUpdate = element.dateTo;
          this.leaveTypeUpdateEmployee = element.leaveType;
          this.subLeaveTypeToUpdateFromEmployee = element.subLeaveType;
        }
      });

      this.allDetailsAboutLeave = arr;
    },
  },
  components: { PopupSuccess },
};
</script>
<style>
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
</style>
