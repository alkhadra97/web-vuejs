<template>
  <div>
    <v-dialog v-model="showPersonalLeaveDialog" persistent max-width="500px">
      {{ assignDialog }}
      <v-col md="12">
        <v-row class="align-center justify-center">
          <v-card>
            <v-card-title>
              <span class="request-title text-h5">Personal Leave</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-form v-model="isFormValid">
                  <v-row>
                    <!-- ///////////////////////////////////////// -->
                    <v-col cols="12">
                      <v-text-field
                        v-if="employeeNameForUpdatePersonalLeave"
                        data-cy="cy_employee_name_update_personal_leave_hr"
                        v-model="employeeNameForUpdatePersonalLeave"
                        name="employeeNameForUpdatePersonalLeave"
                        readonly
                        hide-details
                        color="teal"
                      ></v-text-field>
                      <v-text-field
                        v-else
                        data-cy="cy_employee_name_personal_leave_hr"
                        v-model="nameForProviderIn"
                        name="nameForProviderIn"
                        readonly
                        hide-details
                        color="teal"
                      ></v-text-field>
                    </v-col>
                    <!-- ////////////////////////////////////////// -->
                    <v-col md="6">
                      <v-text-field
                        v-if="dateFromForUpdatePersonalLeave"
                        data-cy="cy_date_from_update_personal_leave_hr"
                        v-model="dateFromForUpdatePersonalLeave"
                        name="dateFromForUpdatePersonalLeave"
                        readonly
                        label="Date From"
                        hide-details
                        color="teal"
                      ></v-text-field>
                      <v-text-field
                        v-else
                        data-cy="cy_date_from_personal_leave_hr"
                        v-model="dateFromPersonalLeave"
                        name="dateFromPersonalLeave"
                        type="date"
                        :min="nowDate"
                        label="Date From"
                        hide-details
                        color="teal"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <!-- /////////////////////////// -->
                    <v-col md="6">
                      <v-text-field
                        v-if="dateToForUpdatePersonalLeave"
                        data-cy="cy_date_to_personal_leave_hr"
                        v-model="dateToForUpdatePersonalLeave"
                        name="dateToForUpdatePersonalLeave"
                        readonly
                        label="Date To"
                        hide-details
                        color="teal"
                      ></v-text-field>
                      <v-text-field
                        v-else
                        data-cy="cy_date_to_personal_leave_hr"
                        v-model="dateToPersonalLeave"
                        name="dateToPersonalLeave"
                        type="date"
                        :min="dateFromPersonalLeave"
                        label="Date To"
                        hide-details
                        color="teal"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <!-- ////////////////////////////////////////////////////////// -->
                    <v-col
                      md="6"
                      v-if="
                        dateFromPersonalLeave == dateToPersonalLeave &&
                        dateFromForUpdatePersonalLeave ==
                          dateToForUpdatePersonalLeave
                      "
                    >
                      <v-text-field
                        v-if="timeFromForUpdatePersonalLeave"
                        data-cy="cy_time_from_update_personal_leave_hr"
                        v-model="timeFromForUpdatePersonalLeave"
                        name="timeFromForUpdatePersonalLeave"
                        readonly
                        label="Time From"
                        hide-details
                        color="teal"
                      ></v-text-field>
                      <v-text-field
                        v-else
                        data-cy="cy_time_from_personal_leave_hr"
                        v-model="timeFromPersonalLeave"
                        name="timeFromPersonalLeave"
                        type="time"
                        label="Time From"
                        hide-details
                        color="teal"
                      ></v-text-field>
                    </v-col>
                    <!-- /////////////////////// -->
                    <v-col
                      md="6"
                      v-if="
                        dateFromPersonalLeave == dateToPersonalLeave &&
                        dateFromForUpdatePersonalLeave ==
                          dateToForUpdatePersonalLeave
                      "
                    >
                      <v-text-field
                        v-if="timeToForUpdatePersoanlLeave"
                        data-cy="cy_time_to_update_personal_leave_hr"
                        v-model="timeToForUpdatePersoanlLeave"
                        name="timeToForUpdatePersoanlLeave"
                        readonly
                        label="Time To"
                        hide-details
                        color="teal"
                      ></v-text-field>
                      <v-text-field
                        v-else
                        data-cy="cy_time_to_personal_leave_hr"
                        v-model="timeToPersonalLeave"
                        name="timeToPersonalLeave"
                        type="time"
                        :min="timeFromPersonalLeave"
                        label="Time To"
                        hide-details
                        color="teal"
                        @change="
                          checkAppointmentForProvider(
                            dateToPersonalLeave,
                            timeFromPersonalLeave,
                            timeToPersonalLeave
                          )
                        "
                      ></v-text-field>
                    </v-col>
                    <!-- ///////////////////////////////////// -->
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
                    <!-- //////////////////////////////////////////////////////// -->
                    <v-col md="6">
                      <v-text-field
                        v-if="applyDateForUpdatePersonalLeave"
                        data-cy="cy_apply_date_update_personal_leave_hr"
                        v-model="applyDateForUpdatePersonalLeave"
                        name="applyDateForUpdatePersonalLeave"
                        readonly
                        label="Apply Date"
                        dense
                        hide-details
                        color="teal"
                      ></v-text-field>
                      <v-text-field
                        v-else
                        data-cy="cy_apply_date_personal_leave_hr"
                        v-model="applyDateForPersonalLeave"
                        name="applyDateForPersonalLeave"
                        :min="nowDate"
                        readonly
                        label="Apply Date"
                        dense
                        hide-details
                        color="teal"
                      ></v-text-field>
                    </v-col>
                    <!-- /////////////////////////////////////////////////// -->
                    <v-col
                      md="6"
                      v-if="
                        dateFromPersonalLeave !== dateToPersonalLeave ||
                        dateFromForUpdatePersonalLeave !=
                          dateToForUpdatePersonalLeave
                      "
                    >
                      <v-text-field
                        v-if="howManyDaysEmployeeAskedForUpdate"
                        data-cy="cy_requested_days_update_personal_leave_hr"
                        v-model="howManyDaysEmployeeAskedForUpdate"
                        name="howManyDaysEmployeeAskedForUpdate"
                        hide-details
                        label="Requested Days"
                        readonly
                        dense
                      ></v-text-field>
                      <v-text-field
                        v-else
                        data-cy="cy_requested_days_personal_leave_hr"
                        v-model="howManyDaysEmployeeAskedForPersonalLeave"
                        name="howManyDaysEmployeeAskedForPersonalLeave"
                        hide-details
                        label="Requested Days"
                        readonly
                        :value="calculateNumberOfDays2"
                        dense
                      ></v-text-field>
                    </v-col>
                    <!-- ////////////////////////// -->
                    <v-col
                      md="6"
                      v-if="
                        dateFromPersonalLeave == dateToPersonalLeave &&
                        dateFromForUpdatePersonalLeave ==
                          dateToForUpdatePersonalLeave
                      "
                    >
                      <v-text-field
                        v-if="howManyHoursEmployeeAskedForUpdate"
                        data-cy="cy_requested_hours_update_sick_leave_hr"
                        v-model="howManyHoursEmployeeAskedForUpdate"
                        name="howManyHoursEmployeeAskedForUpdate"
                        hide-details
                        label="Requested Hours"
                        :value="calculateHoursEmployeeAskedFor"
                        readonly
                        dense
                      ></v-text-field>
                      <v-text-field
                        v-else
                        data-cy="cy_requested_hours_sick_leave_hr"
                        v-model="howManyHoursEmployeeAskedForPersonalLeave"
                        name="howManyHoursEmployeeAskedForPersonalLeave"
                        hide-details
                        label="Requested Hours"
                        readonly
                        :value="calculateHoursEmployeeAskedFor"
                        dense
                      ></v-text-field>
                    </v-col>
                    <!-- /////////////////////////////////////////////////////////// -->
                    <v-col md="12">
                      <v-text-field
                        v-if="personalLeaveTypeForUpdate"
                        data-cy="cy_update_personal_leave_type_hr"
                        v-model="personalLeaveTypeForUpdate"
                        name="personalLeaveTypeForUpdate"
                        hide-details
                        readonly
                        dense
                      ></v-text-field>

                      <v-select
                        v-else
                        data-cy="cy_sick_leave_type_hr"
                        v-model="personalLeaveType"
                        :items="personalLeaveTypes"
                        label="choose type..."
                        color="teal"
                        dense
                        hide-details
                        :rules="[rules.required]"
                      >
                      </v-select>
                    </v-col>
                    <!-- ////////////////////////// -->
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
                        v-if="personalLeaveType == 'other'"
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
                    <!-- //////////////////// -->
                    <v-col
                      md="12"
                      v-if="
                        statusForUpdatePersonalLeave &&
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

                    <v-col md="6" v-if="statusForUpdatePersonalLeave">
                      <span style="font-weight: 600; font-size: 1rem"
                        >Status:
                      </span>
                      <span
                        :class="[
                          statusForUpdatePersonalLeave == 'accepted'
                            ? 'acceptedLeave'
                            : null,
                          statusForUpdatePersonalLeave == 'on hold'
                            ? 'orginalStatus'
                            : 'null',
                          statusForUpdatePersonalLeave == 'refused'
                            ? 'refusedLeave'
                            : 'null',
                          statusForUpdatePersonalLeave == 'New'
                            ? 'New'
                            : 'null',
                        ]"
                        >{{ statusForUpdatePersonalLeave }}</span
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
                    <!-- ///////////////////////////////////////////////////// -->
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
    personalLeaveDialog: {
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
    /////////////////////////////
    employeeNameForUpdatePersonalLeave: {
      type: String,
    },
    applyDateForUpdatePersonalLeave: {
      type: String,
    },
    dateFromForUpdatePersonalLeave: {
      type: String,
    },
    dateToForUpdatePersonalLeave: {
      type: String,
    },
    timeFromForUpdatePersonalLeave: {
      type: String,
    },
    timeToForUpdatePersoanlLeave: {
      type: String,
    },
    howManyDaysEmployeeAskedForUpdate: {
      type: Number,
    },
    howManyHoursEmployeeAskedForUpdate: {
      type: Number,
    },
    personalLeaveTypeForUpdate: {
      type: String,
    },
    reasonFromEmployeeForUpdate: {
      type: String,
    },
    statusForUpdatePersonalLeave: {
      type: String,
    },
    idForEmployeeUpdate: {
      type: Number,
    },
    idForUpdatePersonalLeave: {
      type: Number,
    },
    employeeUuidForUpdatePersonalLeave: {
      type: String,
    },
    ////////////////////////////
  },

  data() {
    return {
      showPersonalLeaveDialog: null,
      dialog2: false,
      ///////////////
      idForLeaveUpdate: null,
      employeeId: null,
      providerUuidForEmployeeIn: null,
      //////////////
      employeeNamePersonalLeave: null,
      //////////////
      dateFromPersonalLeave: null,
      dateToPersonalLeave: null,
      //////////////

      timeFromPersonalLeave: new Date().toLocaleTimeString(),
      timeToPersonalLeave: new Date().toLocaleTimeString(),
      //////////////
      applyDateForPersonalLeave: new Date().toISOString().substr(0, 10),
      nowDate: new Date().toISOString().slice(0, 10),
      howManyDaysEmployeeAskedForPersonalLeave: null,
      howManyHoursEmployeeAskedForPersonalLeave: null,
      howManyHoursEmployeeAskedForPersonalLeaveForDb: null,
      howManyHoursEmployeeAskedForUpdateForDb: null,
      //////////////
      personalLeaveType: null,
      personalLeaveTypes: [
        "Casual leave",
        "Religious holidays",
        "Maternity leave",
        "Paternity leave",
        "Bereavement leave",
        "other",
      ],
      //////////////

      requested: false,

      /////////////////
      selectStatus: null,
      statusOptions: ["Accept", "Refuse", "on hold"],
      ////////////////
      reasonWhyManagerWantToUpdateRequest: null,
      ///////////////////////
      reasonFromEmployee: null,
      //////////////////////
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
      this.dateFromPersonalLeave = null;
      this.dateToPersonalLeave = null;
      this.timeFromPersonalLeave = new Date().toLocaleTimeString();
      this.timeToPersonalLeave = new Date().toLocaleTimeString();
      this.personalLeaveType = null;
    },
    async requestLeave(e) {
      e.preventDefault();
      if (
        this.employeeNameForUpdatePersonalLeave &&
        this.selectStatus == "on hold"
      ) {
        let path = await this.$axios(
          requestBuilder("hr", "/updateLeaveForEmployee", "put", {
            leaveIdUpdate: this.idForUpdatePersonalLeave,
          })
        ).then(() => {
          let path = this.$axios(
            requestBuilder("hr", "/leaveApplication", "post", {
              employeeName: this.employeeNameForUpdatePersonalLeave,
              providerUuid: this.employeeUuidForUpdatePersonalLeave,
              applyDate: this.applyDateForUpdatePersonalLeave,
              ///////////////

              DateFrom: this.dateFromForUpdatePersonalLeave,
              dateTo: this.dateToForUpdatePersonalLeave,
              ///////////////

              timeFrom: this.timeFromForUpdatePersonalLeave,
              timeTo: this.timeToForUpdatePersoanlLeave,
              ///////////////
              leaveType: "personal",
              subLeaveType: this.personalLeaveTypeForUpdate,
              isApproved: this.selectStatus,
              //////////////

              howManyDaysEmployeeAskForBusinessLeave:
                this.howManyDaysEmployeeAskedForUpdate,
              howManyHoursEmployeeAskForBusinessLeave:
                this.howManyHoursEmployeeAskedForUpdateForDb,
              ///////////////
              reasonFromManager: this.reasonWhyManagerWantToUpdateRequest,
              reasonFromEmployee: this.reasonFromEmployeeForUpdate,
              //////////////

              EmployeeId: this.idForEmployeeUpdate,
            })
          ).then(() => {
            this.showPersonalLeaveDialog = !this.showPersonalLeaveDialog;
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
            leaveId: this.idForUpdatePersonalLeave,
            requestedDays: this.howManyDaysEmployeeAskedForUpdate,
            requestedHours: this.howManyHoursEmployeeAskedForUpdateForDb,
            providerUuid: this.employeeUuidForUpdatePersonalLeave,
            leaveType: "personal",
          })
        )
          // this.$axios
          //   .put("/hr/acceptRejectLeaveRequest", {
          //     leaveId: this.idForUpdatePersonalLeave,
          //     requestedDays: this.howManyDaysEmployeeAskedForUpdate,
          //     requestedHours: this.howManyHoursEmployeeAskedForUpdate,
          //     providerUuid: this.employeeUuidForUpdatePersonalLeave,
          //     leaveType: "personal",
          //   })
          .then((res) => {
            this.showPersonalLeaveDialog = !this.showPersonalLeaveDialog;
            this.requested = true;
            this.$store.dispatch("actionForGettingAllLeaveWork");
          });
      } else if (this.selectStatus == "Refuse") {
        let path = await this.$axios(
          requestBuilder("hr", "/acceptRejectLeaveRequest", "put", {
            leaveIdReject: this.idForUpdatePersonalLeave,
            typeFromRefused: "personal",
          })
        )
          // this.$axios
          //   .put("/hr/acceptRejectLeaveRequest", {
          //     leaveIdReject: this.idForUpdatePersonalLeave,
          //   })
          .then((res) => {
            this.showPersonalLeaveDialog = !this.showPersonalLeaveDialog;
            this.requested = true;
            this.$store.dispatch("actionForGettingAllLeaveWork");
          });
      } else {
        if (
          this.timeFromPersonalLeave == this.timeToPersonalLeave &&
          this.dateFromPersonalLeave != this.dateToPersonalLeave
        ) {
          let path = await this.$axios(
            requestBuilder("hr", "/leaveApplication", "post", {
              employeeName: this.nameForProviderIn,
              providerUuid: this.employeeUuid,
              applyDate: this.applyDateForPersonalLeave,
              ///////////////

              DateFrom: this.dateFromPersonalLeave,
              dateTo: this.dateToPersonalLeave,
              ///////////////

              // timeFrom: this.timeFromPersonalLeave,
              // timeTo: this.timeToPersonalLeave,
              ///////////////
              leaveType: "personal",
              subLeaveType: this.personalLeaveType,
              //////////////

              howManyDaysEmployeeAskForBusinessLeave:
                this.howManyDaysEmployeeAskedForPersonalLeave,
              howManyHoursEmployeeAskForBusinessLeave:
                this.howManyHoursEmployeeAskedForPersonalLeaveForDb,
              ///////////////
              reasonFromEmployee: this.reasonFromEmployee,

              ////////////////

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
              this.showPersonalLeaveDialog = !this.showPersonalLeaveDialog;
              this.requested = true;

              this.actionForGettingAllLeaveWork({
                providerUuid: this.employeeUuid,
              });
              this.dialog2 = true;
              this.resetFields();
            });
          } else {
            this.showPersonalLeaveDialog = !this.showPersonalLeaveDialog;
            this.requested = true;

            this.actionForGettingAllLeaveWork({
              providerUuid: this.employeeUuid,
            });
            this.dialog2 = true;
            this.resetFields();
          }
        } else if (this.dateFromPersonalLeave == this.dateToPersonalLeave) {
          let path = await this.$axios(
            requestBuilder("hr", "/leaveApplication", "post", {
              employeeName: this.nameForProviderIn,
              providerUuid: this.employeeUuid,
              applyDate: this.applyDateForPersonalLeave,
              ///////////////

              DateFrom: this.dateFromPersonalLeave,
              dateTo: this.dateToPersonalLeave,
              ///////////////

              timeFrom: this.timeFromPersonalLeave,
              timeTo: this.timeToPersonalLeave,
              ///////////////
              leaveType: "personal",
              subLeaveType: this.personalLeaveType,
              //////////////

              howManyDaysEmployeeAskForBusinessLeave:
                this.howManyDaysEmployeeAskedForPersonalLeave,
              howManyHoursEmployeeAskForBusinessLeave:
                this.howManyHoursEmployeeAskedForPersonalLeaveForDb,
              ///////////////
              reasonFromEmployee: this.reasonFromEmployee,

              ////////////////

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
              this.showPersonalLeaveDialog = !this.showPersonalLeaveDialog;
              this.requested = true;

              this.actionForGettingAllLeaveWork({
                providerUuid: this.employeeUuid,
              });
              this.dialog2 = true;
            });
          } else {
            this.showPersonalLeaveDialog = !this.showPersonalLeaveDialog;
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
    ///////////////////////////////

    checkAppointmentForProvider(
      dateToPersonalLeave,
      timeFromPersonalLeave,
      timeToPersonalLeave
    ) {
      this.actionToCheckProviderAppointments({
        date: dateToPersonalLeave,
        timeFrom: timeFromPersonalLeave,
        timeTo: timeToPersonalLeave,
        providerUuid: this.employeeUuid,
      });
    },

    close() {
      this.$emit("update:personalLeaveDialog", false);
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
      this.showPersonalLeaveDialog = this.personalLeaveDialog;
    },
    calculateNumberOfDays2() {
      var date1 = new Date(this.dateFromPersonalLeave);
      var date2 = new Date(this.dateToPersonalLeave);

      var Difference_In_Time = date2.getTime() - date1.getTime();
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      if (Difference_In_Days <= 0) {
        return (this.howManyDaysEmployeeAskedForPersonalLeave = null);
      } else {
        return (this.howManyDaysEmployeeAskedForPersonalLeave =
          1 + Difference_In_Days);
      }
    },
    calculateHoursEmployeeAskedFor() {
      if (this.timeFromPersonalLeave != this.timeToPersonalLeave) {
        // this.timeFromPersonalLeave = new Date().toLocaleTimeString();
        // this.timeToPersonalLeave = new Date().toLocaleTimeString();
        let fromHours = this.timeFromPersonalLeave.slice(0, 2) * 60; //10
        let fromMunites = this.timeFromPersonalLeave.slice(3, 5);
        let finalFromInHours = parseInt(fromHours) + parseInt(fromMunites);
        let toHours = this.timeToPersonalLeave.slice(0, 2) * 60;
        let toMunites = this.timeToPersonalLeave.slice(3, 5);
        let finalToInHours = parseInt(toHours) + parseInt(toMunites);
        let howManyHoursEmployeeAskedForPersonalLeave =
          finalToInHours - finalFromInHours;
        this.howManyHoursEmployeeAskedForPersonalLeaveForDb =
          howManyHoursEmployeeAskedForPersonalLeave;
        let hours = howManyHoursEmployeeAskedForPersonalLeave / 60;
        let rhours = Math.floor(hours);
        let minutes = (hours - rhours) * 60;
        let rminutes = Math.round(minutes);
        this.howManyHoursEmployeeAskedForPersonalLeave =
          rhours + ":" + rminutes;
        // return (this.howManyHoursEmployeeAskedForPersonalLeave =
        //   howManyHoursEmployeeAskedForPersonalLeave.toFixed(2));
      } else if (this.howManyHoursEmployeeAskedForUpdate) {
        this.howManyHoursEmployeeAskedForUpdateForDb =
          this.howManyHoursEmployeeAskedForUpdate;
        let hours = this.howManyHoursEmployeeAskedForUpdate / 60;
        let rhours = Math.floor(hours);
        let minutes = (hours - rhours) * 60;
        let rminutes = Math.round(minutes);
        this.howManyHoursEmployeeAskedForUpdate = rhours + ":" + rminutes;
      } else {
        this.howManyHoursEmployeeAskedForPersonalLeaveForDb = 0;
        this.howManyHoursEmployeeAskedForPersonalLeave = 0;
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
