<template>
  <div>
    <v-dialog v-model="showSickLeaveDialog" persistent max-width="500px">
      {{ assignDialog }}
      <v-col md="12">
        <v-row class="align-center justify-center">
          <v-card>
            <v-card-title>
              <span class="request-title text-h5">Sick Leave</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-form v-model="isFormValid">
                  <v-row>
                    <!-- //////////////////////////////////////////// -->
                    <v-col cols="12">
                      <v-text-field
                        v-if="employeeNameForUpdateSickLeave"
                        data-cy="cy_employee_name_update_sick_leave_hr"
                        v-model="employeeNameForUpdateSickLeave"
                        name="employeeNameForUpdateSickLeave"
                        readonly
                        hide-details
                        color="teal"
                      ></v-text-field>
                      <v-text-field
                        v-else
                        data-cy="cy_employee_name_sick_leave_hr"
                        v-model="nameForProviderIn"
                        name="nameForProviderIn"
                        readonly
                        hide-details
                        color="teal"
                      ></v-text-field>
                    </v-col>
                    <!-- /////////////////////////////////////////// -->
                    <v-col md="6">
                      <v-text-field
                        v-if="dateFromForUpdateSickLeave"
                        data-cy="cy_date_from_update_sick_leave_hr"
                        v-model="dateFromForUpdateSickLeave"
                        name="dateFromForUpdateSickLeave"
                        readonly
                        label="Date From"
                        hide-details
                        color="teal"
                      ></v-text-field>
                      <v-text-field
                        v-else
                        data-cy="cy_date_from_sick_leave_hr"
                        v-model="dateFromSickLeave"
                        name="dateFromSickLeave"
                        type="date"
                        :min="nowDate"
                        label="Date From"
                        hide-details
                        color="teal"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <!-- //////////// -->
                    <v-col md="6">
                      <v-text-field
                        v-if="dateToForUpdateSickLeave"
                        data-cy="cy_date_to_update_sick_leave_hr"
                        v-model="dateToForUpdateSickLeave"
                        name="dateToForUpdateSickLeave"
                        readonly
                        label="Date To"
                        hide-details
                        color="teal"
                      ></v-text-field>
                      <v-text-field
                        v-else
                        data-cy="cy_date_to_sick_leave_hr"
                        v-model="dateToSickLeave"
                        name="dateToSickLeave"
                        type="date"
                        :min="dateFromSickLeave"
                        label="Date To"
                        hide-details
                        color="teal"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <!-- ///////////////////////////////////////////////////////////////// -->
                    <v-col
                      md="6"
                      v-if="
                        dateFromSickLeave == dateToSickLeave &&
                        dateFromForUpdateSickLeave == dateToForUpdateSickLeave
                      "
                    >
                      <v-text-field
                        v-if="timeFromForUpdateBusinessLeave"
                        data-cy="cy_time_from_update_sick_leave_hr"
                        v-model="timeFromForUpdateBusinessLeave"
                        name="timeFromForUpdateBusinessLeave"
                        label="Time From"
                        readonly
                        hide-details
                        color="teal"
                      ></v-text-field>
                      <v-text-field
                        v-else
                        data-cy="cy_time_from_sick_leave_hr"
                        v-model="timeFromSickLeave"
                        name="timeFromSickLeave"
                        type="time"
                        label="Time From"
                        hide-details
                        color="teal"
                      ></v-text-field>
                    </v-col>
                    <!-- ////////////////////// -->
                    <v-col
                      md="6"
                      v-if="
                        dateFromSickLeave == dateToSickLeave &&
                        dateFromForUpdateSickLeave == dateToForUpdateSickLeave
                      "
                    >
                      <v-text-field
                        v-if="timeToForUpdateSickLeave"
                        data-cy="cy_time_to_update_sick_leave_hr"
                        v-model="timeToForUpdateSickLeave"
                        name="timeToForUpdateSickLeave"
                        readonly
                        label="Time To"
                        hide-details
                        color="teal"
                      ></v-text-field>
                      <v-text-field
                        v-else
                        data-cy="cy_time_to_sick_leave_hr"
                        v-model="timeToSickLeave"
                        name="timeToSickLeave"
                        type="time"
                        :min="timeFromSickLeave"
                        label="Time To"
                        hide-details
                        color="teal"
                        @change="
                          checkAppointmentForProvider(
                            dateToSickLeave,
                            timeFromSickLeave,
                            timeToSickLeave
                          )
                        "
                      ></v-text-field>
                    </v-col>
                    <!-- ///////////////////////////////// -->
                    <v-col md="12" v-if="getterToCheckProviderAppointments">
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
                    </v-col>
                    <!-- ////////////////////////////////////////////////////////// -->
                    <v-col md="6">
                      <v-text-field
                        v-if="applyDateForUpdateSickLeave"
                        data-cy="cy_apply_date_update_sick_leave_hr"
                        v-model="applyDateForUpdateSickLeave"
                        name="applyDateForUpdateSickLeave"
                        readonly
                        label="Apply Date"
                        dense
                        hide-details
                        color="teal"
                      ></v-text-field>
                      <v-text-field
                        v-else
                        data-cy="cy_apply_date_sick_leave_hr"
                        v-model="applyDateForSickLeave"
                        name="applyDateForSickLeave"
                        :min="nowDate"
                        readonly
                        label="Apply Date"
                        dense
                        hide-details
                        color="teal"
                      ></v-text-field>
                    </v-col>

                    <!-- /////////////////////////////////////////////// -->
                    <v-col
                      md="6"
                      v-if="
                        dateFromSickLeave != dateToSickLeave ||
                        dateFromForUpdateSickLeave != dateToForUpdateSickLeave
                      "
                    >
                      <v-text-field
                        v-if="howManyDaysEmployeeAskedForUpdate"
                        data-cy="cy_requested_days_update_sick_leave_hr"
                        v-model="howManyDaysEmployeeAskedForUpdate"
                        name="howManyDaysEmployeeAskedForUpdate"
                        hide-details
                        label="Requested Days"
                        readonly
                        dense
                      ></v-text-field>
                      <v-text-field
                        v-else
                        data-cy="cy_requested_days_sick_leave_hr"
                        v-model="howManyDaysEmployeeAskedForSickLeave"
                        name="howManyDaysEmployeeAskedForSickLeave"
                        hide-details
                        label="Requested Days"
                        readonly
                        :value="calculateNumberOfDays2"
                        dense
                      ></v-text-field>
                    </v-col>
                    <!-- ///////////////// -->

                    <v-col
                      md="6"
                      v-if="
                        dateFromSickLeave == dateToSickLeave &&
                        dateFromForUpdateSickLeave == dateToForUpdateSickLeave
                      "
                    >
                      <v-text-field
                        v-if="howManyHoursEmployeeAskedForUpdate"
                        data-cy="cy_requested_hours_update_sick_leave_hr"
                        v-model="howManyHoursEmployeeAskedForUpdate"
                        name="howManyHoursEmployeeAskedForUpdate"
                        hide-details
                        label="Requested Hours"
                        readonly
                        :value="calculateHoursEmployeeAskedFor"
                        dense
                      ></v-text-field>
                      <v-text-field
                        v-else
                        data-cy="cy_requested_hours_sick_leave_hr"
                        v-model="howManyHoursEmployeeAskedForSickLeave"
                        name="howManyHoursEmployeeAskedForSickLeave"
                        hide-details
                        label="Requested Hours"
                        readonly
                        :value="calculateHoursEmployeeAskedFor"
                        dense
                      ></v-text-field>
                    </v-col>
                    <!-- //////////////////////////////////////////// -->
                    <v-col md="12">
                      <v-text-field
                        v-if="sickLeaveTypeForUpdate"
                        data-cy="cy_update_sick_leave_type_hr"
                        v-model="sickLeaveTypeForUpdate"
                        name="sickLeaveTypeForUpdate"
                        hide-details
                        readonly
                        dense
                      ></v-text-field>
                      <v-select
                        v-else
                        data-cy="cy_sick_leave_type_hr"
                        v-model="sickLeaveType"
                        :items="sickLeaveTypes"
                        label="choose type..."
                        color="teal"
                        dense
                        hide-details
                        :rules="[rules.required]"
                      >
                      </v-select>
                    </v-col>
                    <v-col md="12">
                      <v-text-field
                        v-if="reasonFromEmployeeForUpdate"
                        data-cy="cy_reason_from_employee_update_sick_leave_type_hr"
                        v-model="reasonFromEmployeeForUpdate"
                        name="reasonFromEmployeeForUpdate"
                        hide-details
                        dense
                        color="teal"
                        readonly
                        label="Reason"
                      ></v-text-field>
                      <v-text-field
                        v-if="sickLeaveType == 'other'"
                        data-cy="cy_reason_from_employee_sick_leave_type_hr"
                        v-model="reasonFromEmployee"
                        name="reasonFromEmployee"
                        hide-details
                        type="text"
                        dense
                        color="teal"
                        label="Reason"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      md="12"
                      v-if="
                        statusForUpdateSickLeave &&
                        $store.getters.tokenValue.profileType != 'RECEPTIONIST'
                      "
                    >
                      <v-select
                        v-model="selectStatus"
                        :items="statusOptions"
                        label="choose status..."
                        hide-details
                        :rules="[rules.required]"
                      >
                      </v-select>
                    </v-col>
                    <v-col md="6" v-if="statusForUpdateSickLeave">
                      <span style="font-weight: 600; font-size: 1rem"
                        >Status:
                      </span>
                      <span
                        :class="[
                          statusForUpdateSickLeave == 'accepted'
                            ? 'acceptedLeave'
                            : null,
                          statusForUpdateSickLeave == 'on hold'
                            ? 'orginalStatus'
                            : 'null',
                          statusForUpdateSickLeave == 'refused'
                            ? 'refusedLeave'
                            : 'null',
                          statusForUpdateSickLeave == 'New' ? 'New' : 'null',
                        ]"
                        >{{ statusForUpdateSickLeave }}</span
                      >
                    </v-col>
                    <v-col md="12" v-if="selectStatus == 'on hold'">
                      <v-text-field
                        data-cy="cy_reason_update_personal_leave_hr"
                        v-model="reasonWhyManagerWantToUpdateRequest"
                        name="reasonWhyManagerWantToUpdateRequest"
                        label="Reason"
                        type="text"
                        hide-details
                        dense
                      >
                      </v-text-field>
                    </v-col>
                    <!-- //////////////// -->
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <!-- {{ combineBetweenNameAndPhone }} -->
              <!-- <v-icon color="teal" @click="dmsDialog = !dmsDialog"
                >mdi-attachment</v-icon
              > -->
              <v-spacer></v-spacer>
              <v-btn color="teal" text @click="close"> Close </v-btn>
              <v-btn
                color="#35b5ac"
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
    <UploadComponent
      :dmsDialog.sync="dmsDialog"
      :entity_id="nameAndPhone"
      :feature_type="'hr'"
      @testData="testData"
    />
    <v-row v-if="requested">
      <PopupSuccess :dialog2.sync="dialog2" type="leave request" />
    </v-row>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import requestBuilder from "../../requestBuilder";
import PopupSuccess from "./PopupSuccess.vue";
import UploadComponent from "../../../web.dms.agentsoncloud.com/components/UploadComponent.vue";

export default {
  props: {
    sickLeaveDialog: {
      type: Boolean,
      default: false,
    },
    employeeUuid: {
      type: String,
    },
    nameForProviderIn: {
      type: String,
    },
    idForProviderIn: {
      type: Number,
    },
    phoneForEmployee: {
      type: String,
    },
    /////////////////////////////////////////////////
    employeeNameForUpdateSickLeave: {
      type: String,
    },
    applyDateForUpdateSickLeave: {
      type: String,
    },
    dateFromForUpdateSickLeave: {
      type: String,
    },
    dateToForUpdateSickLeave: {
      type: String,
    },
    timeFromForUpdateBusinessLeave: {
      type: String,
    },
    timeToForUpdateSickLeave: {
      type: String,
    },
    howManyDaysEmployeeAskedForUpdate: {
      type: Number,
    },
    howManyHoursEmployeeAskedForUpdate: {
      type: Number,
    },
    sickLeaveTypeForUpdate: {
      type: String,
    },
    reasonFromEmployeeForUpdate: {
      type: String,
    },
    statusForUpdateSickLeave: {
      type: String,
    },
    //////////////////////
    idForUpdateSickLeave: {
      type: Number,
    },
    idForEmployeeUpdate: {
      type: Number,
    },
    employeeUuidForUpdateSickLeave: {
      type: String,
    },
    //////////////////////
  },

  data() {
    return {
      showSickLeaveDialog: null,
      dialog2: false,
      ///////////////
      idForLeaveUpdate: null,
      employeeId: null,
      providerUuidForEmployeeIn: null,
      //////////////
      employeeNameSickLeave: null,
      //////////////
      dateFromSickLeave: null,
      dateToSickLeave: null,
      //////////////

      timeFromSickLeave: new Date().toLocaleTimeString(),
      timeToSickLeave: new Date().toLocaleTimeString(),
      //////////////
      applyDateForSickLeave: new Date().toISOString().substr(0, 10),
      nowDate: new Date().toISOString().slice(0, 10),
      howManyDaysEmployeeAskedForSickLeave: null,
      howManyHoursEmployeeAskedForSickLeave: null,
      howManyHoursEmployeeAskedForSickLeaveForDb: null,
      howManyHoursEmployeeAskedForUpdateForDb: null,
      //////////////
      sickLeaveType: null,
      sickLeaveTypes: [
        "illness",
        "doctor appointment",
        "surgery",
        "hospital admission",
        "recovery",
        "other",
      ],
      //////////////
      selectStatus: null,
      statusOptions: ["Accept", "Refuse", "on hold"],
      ///////////////
      requested: false,
      ///////////////
      reasonFromEmployee: null,
      /////////
      reasonWhyManagerWantToUpdateRequest: null,
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
  methods: {
    ...mapActions([
      "actionForGettingAllLeaveWork",
      "actionToCheckProviderAppointments",
    ]),
    resetFields() {
      this.dateFromSickLeave = null;
      this.dateToSickLeave = null;
      this.timeFromSickLeave = new Date().toLocaleTimeString();
      this.timeToSickLeave = new Date().toLocaleTimeString();
      this.sickLeaveType = null;
    },
    async requestLeave(e) {
      e.preventDefault();
      if (
        this.employeeNameForUpdateSickLeave &&
        this.selectStatus == "on hold"
      ) {
        let path = await this.$axios(
          requestBuilder("hr", "/updateLeaveForEmployee", "put", {
            leaveIdUpdate: this.idForUpdateSickLeave,
          })
        ).then(() => {
          let path = this.$axios(
            requestBuilder("hr", "/leaveApplication", "post", {
              employeeName: this.employeeNameForUpdateSickLeave,
              providerUuid: this.employeeUuidForUpdateSickLeave,
              applyDate: this.applyDateForUpdateSickLeave,
              ///////////////

              DateFrom: this.dateFromForUpdateSickLeave,
              dateTo: this.dateToForUpdateSickLeave,
              ///////////////

              timeFrom: this.timeFromForUpdateBusinessLeave,
              timeTo: this.timeToForUpdateSickLeave,
              ///////////////
              leaveType: "sick",
              subLeaveType: this.sickLeaveTypeForUpdate,
              isApproved: this.selectStatus,
              //////////////

              howManyDaysEmployeeAskForBusinessLeave:
                this.howManyDaysEmployeeAskedForUpdate,
              howManyHoursEmployeeAskForBusinessLeave:
                this.howManyHoursEmployeeAskedForUpdateForDb,
              ///////////////
              reasonFromManager: this.reasonWhyManagerWantToUpdateRequest,
              reasonFromEmployee: this.reasonFromEmployeeForUpdate,

              EmployeeId: this.idForEmployeeUpdate,
            })
          ).then(() => {
            this.showSickLeaveDialog = !this.showSickLeaveDialog;
            this.requested = true;
            this.$store.dispatch("actionForGettingAllLeaveWork");
          });
        });
        this.dialog2 = true;
      }
      ///////////////////////////////////////////////////////////////////////////////////////////accept and reject
      else if (this.selectStatus == "Accept") {
        let path = await this.$axios(
          requestBuilder("hr", "/acceptRejectLeaveRequest", "put", {
            leaveId: this.idForUpdateSickLeave,
            requestedDays: this.howManyDaysEmployeeAskedForUpdate,
            requestedHours: this.howManyHoursEmployeeAskedForUpdateForDb,
            providerUuid: this.employeeUuidForUpdateSickLeave,
            leaveType: "sick",
          })
        ).then((res) => {
          this.showSickLeaveDialog = !this.showSickLeaveDialog;
          this.requested = true;
          this.$store.dispatch("actionForGettingAllLeaveWork");
        });
      }
      /////////////////////////////////////////////////////////////////////
      else if (this.selectStatus == "Refuse") {
        let path = await this.$axios(
          requestBuilder("hr", "/acceptRejectLeaveRequest", "put", {
            leaveIdReject: this.idForUpdateSickLeave,
            typeFromRefused: "sick",
          })
        ).then((res) => {
          this.showSickLeaveDialog = !this.showSickLeaveDialog;
          this.requested = true;
          this.$store.dispatch("actionForGettingAllLeaveWork");
        });
      }

      ////////////////////////////////////////////////////////////////////
      else {
        if (
          this.timeFromSickLeave == this.timeToSickLeave &&
          this.dateFromSickLeave != this.dateToSickLeave
        ) {
          let path = await this.$axios(
            requestBuilder("hr", "/leaveApplication", "post", {
              employeeName: this.nameForProviderIn,
              providerUuid: this.employeeUuid,
              applyDate: this.applyDateForSickLeave,
              ///////////////

              DateFrom: this.dateFromSickLeave,
              dateTo: this.dateToSickLeave,
              ///////////////

              // timeFrom: this.timeFromSickLeave,
              // timeTo: this.timeToSickLeave,
              ///////////////
              leaveType: "sick",
              subLeaveType: this.sickLeaveType,
              //////////////

              howManyDaysEmployeeAskForBusinessLeave:
                this.howManyDaysEmployeeAskedForSickLeave,
              howManyHoursEmployeeAskForBusinessLeave:
                this.howManyHoursEmployeeAskedForSickLeaveForDb,
              ///////////////
              reasonFromEmployee: this.reasonFromEmployee,

              ///////////////

              EmployeeId: this.idForProviderIn,
            })
          );
          if (path.status == 200 && this.dmsData) {
            await this.$store.dispatch("uploadFile", this.dmsData);
            await this.$axios(
              requestBuilder("hr", "/hr/updateAttachementFile", "put", {
                rowId: path.data.resp.id,
                updatedImage:
                  this.$store.getters.getterForSavingResponse.documentLink,
              })
            ).then(() => {
              this.showSickLeaveDialog = !this.showSickLeaveDialog;
              this.requested = true;

              this.actionForGettingAllLeaveWork({
                providerUuid: this.employeeUuid,
              });
              this.dialog2 = true;
              this.resetFields();
            });
          } else {
            this.showSickLeaveDialog = !this.showSickLeaveDialog;
            this.requested = true;

            this.actionForGettingAllLeaveWork({
              providerUuid: this.employeeUuid,
            });
            this.dialog2 = true;
            this.resetFields();
          }
        } else if (this.dateFromSickLeave == this.dateToSickLeave) {
          let path = await this.$axios(
            requestBuilder("hr", "/leaveApplication", "post", {
              employeeName: this.nameForProviderIn,
              providerUuid: this.employeeUuid,
              applyDate: this.applyDateForSickLeave,
              ///////////////

              DateFrom: this.dateFromSickLeave,
              dateTo: this.dateToSickLeave,
              ///////////////

              timeFrom: this.timeFromSickLeave,
              timeTo: this.timeToSickLeave,
              ///////////////
              leaveType: "sick",
              subLeaveType: this.sickLeaveType,
              //////////////

              howManyDaysEmployeeAskForBusinessLeave:
                this.howManyDaysEmployeeAskedForSickLeave,
              howManyHoursEmployeeAskForBusinessLeave:
                this.howManyHoursEmployeeAskedForSickLeaveForDb,
              ///////////////
              reasonFromEmployee: this.reasonFromEmployee,

              ///////////////

              EmployeeId: this.idForProviderIn,
            })
          );
          if (path.status == 200 && this.dmsData) {
            await this.$store.dispatch("uploadFile", this.dmsData);
            await this.$axios(
              requestBuilder("hr", "/hr/updateAttachementFile", "put", {
                rowId: path.data.resp.id,
                updatedImage:
                  this.$store.getters.getterForSavingResponse.documentLink,
              })
            ).then(() => {
              this.showSickLeaveDialog = !this.showSickLeaveDialog;
              this.requested = true;

              this.actionForGettingAllLeaveWork({
                providerUuid: this.employeeUuid,
              });
              this.dialog2 = true;
              this.resetFields();
            });
          } else {
            this.showSickLeaveDialog = !this.showSickLeaveDialog;
            this.requested = true;

            this.actionForGettingAllLeaveWork({
              providerUuid: this.employeeUuid,
            });
            this.dialog2 = true;
            this.resetFields();
          }
        }
      }
    },
    ////////////////////////////////
    checkAppointmentForProvider(
      dateToSickLeave,
      timeFromSickLeave,
      timeToSickLeave
    ) {
      this.actionToCheckProviderAppointments({
        date: dateToSickLeave,
        timeFrom: timeFromSickLeave,
        timeTo: timeToSickLeave,
        providerUuid: this.employeeUuid,
      });
    },
    //////////////////////////////////////////////////////////////////////
    close() {
      this.$emit("update:sickLeaveDialog", false);
    },
    testData(param1) {
      let converting = [...param1];
      this.documentName = converting[1][1].name;
      this.dmsData = param1;
    },
  },
  computed: {
    ...mapGetters(["info", "getterToCheckProviderAppointments"]),
    assignDialog() {
      this.showSickLeaveDialog = this.sickLeaveDialog;
    },
    calculateNumberOfDays2() {
      let date1 = new Date(this.dateFromSickLeave);
      let date2 = new Date(this.dateToSickLeave);

      let Difference_In_Time = date2.getTime() - date1.getTime();
      let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      if (Difference_In_Days <= 0) {
        return (this.howManyDaysEmployeeAskedForSickLeave = null);
      } else {
        return (this.howManyDaysEmployeeAskedForSickLeave =
          1 + Difference_In_Days);
      }
    },
    calculateHoursEmployeeAskedFor() {
      if (
        this.timeFromSickLeave != this.timeToSickLeave &&
        this.howManyHoursEmployeeAskedForUpdate == null
      ) {
        // this.timeFromSickLeave = new Date().toLocaleTimeString();
        // this.timeToSickLeave = new Date().toLocaleTimeString();
        let fromHours = this.timeFromSickLeave.slice(0, 2) * 60; //10
        let fromMunites = this.timeFromSickLeave.slice(3, 5);
        let finalFromInHours = parseInt(fromHours) + parseInt(fromMunites);
        let toHours = this.timeToSickLeave.slice(0, 2) * 60;
        let toMunites = this.timeToSickLeave.slice(3, 5);
        let finalToInHours = parseInt(toHours) + parseInt(toMunites);
        let howManyHoursEmployeeAskedForSickLeave =
          finalToInHours - finalFromInHours;
        this.howManyHoursEmployeeAskedForSickLeaveForDb =
          howManyHoursEmployeeAskedForSickLeave;
        let hours = howManyHoursEmployeeAskedForSickLeave / 60;
        let rhours = Math.floor(hours);
        let minutes = (hours - rhours) * 60;
        let rminutes = Math.round(minutes);
        this.howManyHoursEmployeeAskedForSickLeave = rhours + ":" + rminutes;
      } else if (this.howManyHoursEmployeeAskedForUpdate) {
        this.howManyHoursEmployeeAskedForUpdateForDb =
          this.howManyHoursEmployeeAskedForUpdate;
        let hours = this.howManyHoursEmployeeAskedForUpdate / 60;
        let rhours = Math.floor(hours);
        let minutes = (hours - rhours) * 60;
        let rminutes = Math.round(minutes);
        this.howManyHoursEmployeeAskedForUpdate = rhours + ":" + rminutes;
      } else {
        this.howManyHoursEmployeeAskedForSickLeaveForDb = 0;
        this.howManyHoursEmployeeAskedForSickLeave = 0;
      }
    },
    combineBetweenNameAndPhone() {
      this.nameAndPhone = this.nameForProviderIn + "-" + this.phoneForEmployee;
    },
  },
  watch: {},
  components: { PopupSuccess, UploadComponent },
};
</script>
<style scoped>
.request-title {
  font-weight: bold;
  color: black;
  margin-top: 2em auto;
  padding-bottom: 0.2em;
}
.request-title::after {
  content: "";
  display: block;
  width: 20vw;
  height: 4px;
  background: #059486;
  margin: 0.5rem auto 0;
}
.New {
  background: transparent;
  border: #2196f3 solid 1px !important;
  border-radius: 5px;
  color: #2196f3;
  padding: 5px 8px !important;
  line-height: 1.1rem !important;
  font-weight: 400 !important;
  font-size: 1rem !important;
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
.acceptedLeave {
  background: transparent;
  border: #35b5ac solid 1px !important;
  border-radius: 5px;
  color: #35b5ac;
  padding: 5px 8px !important;
  line-height: 1.1rem !important;
  font-weight: 400 !important;
  font-size: 1rem !important;
}
.refusedLeave {
  background: transparent;
  border: red solid 1px !important;
  border-radius: 5px;
  color: red;
  padding: 5px 8px !important;
  line-height: 1.1rem !important;
  font-weight: 400 !important;
  font-size: 1rem !important;
}
.orginalStatus {
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
