<template>
  <div>
    <v-dialog v-model="showBusinessLeaveDialog" persistent max-width="500px">
      {{ assignDialog }}
      <v-col md="12">
        <v-row class="align-center justify-center">
          <v-card>
            <v-card-title>
              <span class="request-title text-h5">Business Leave</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-form v-model="isFormValid">
                  <v-row>
                    <!-- /////////////////////////////// -->
                    <v-col cols="12">
                      <v-text-field
                        v-if="employeeNameForBusinessLeave"
                        data-cy="cy_employee_name_update_business_leave_hr"
                        v-model="employeeNameForBusinessLeave"
                        name="employeeNameBusiness"
                        readonly
                        hide-details
                        color="teal"
                      ></v-text-field>
                      <v-text-field
                        v-else
                        data-cy="cy_employee_name_business_leave_hr"
                        v-model="nameForProviderIn"
                        name="nameForProviderIn"
                        readonly
                        hide-details
                        color="teal"
                      ></v-text-field>
                    </v-col>
                    <!-- //////////////////////////////////////////////////////////////// -->
                    <v-col md="6">
                      <v-text-field
                        v-if="dateFromForUpdateBusinessLeave"
                        data-cy="cy_date_from_update_business_leave_hr"
                        v-model="dateFromForUpdateBusinessLeave"
                        name="dateFromBusinessLeave"
                        readonly
                        hide-details
                        color="teal"
                      ></v-text-field>
                      <v-text-field
                        v-else
                        data-cy="cy_date_from_business_leave_hr"
                        v-model="dateFromBusinessLeave"
                        name="dateFromBusinessLeave"
                        type="date"
                        :min="nowDate"
                        label="Date From"
                        hide-details
                        color="teal"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <!-- /////////// -->
                    <v-col md="6">
                      <v-text-field
                        v-if="dateToForUpdateBusinessLeave"
                        data-cy="cy_date_to_update_business_leave_hr"
                        v-model="dateToForUpdateBusinessLeave"
                        name="dateToBusinessLeave"
                        readonly
                        hide-details
                        color="teal"
                      ></v-text-field>
                      <v-text-field
                        v-else
                        data-cy="cy_date_to_business_leave_hr"
                        v-model="dateToBusinessLeave"
                        name="dateToBusinessLeave"
                        type="date"
                        :min="dateFromBusinessLeave"
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
                        dateFromBusinessLeave == dateToBusinessLeave &&
                        dateFromForUpdateBusinessLeave ==
                          dateToForUpdateBusinessLeave
                      "
                    >
                      <v-text-field
                        v-if="timeFromForUpdateBusinessLeave"
                        data-cy="cy_time_from_business_leave_hr"
                        v-model="timeFromForUpdateBusinessLeave"
                        name="timeFromForUpdateBusinessLeave"
                        readonly
                        label="Time From"
                        hide-details
                        color="teal"
                      ></v-text-field>
                      <v-text-field
                        v-else
                        data-cy="cy_time_from_business_leave_hr"
                        v-model="timeFromBusinessLeave"
                        name="timeFromBusinessLeave"
                        type="time"
                        label="Time From"
                        hide-details
                        color="teal"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <!-- /////////////////////////// -->
                    <v-col
                      md="6"
                      v-if="
                        dateFromBusinessLeave == dateToBusinessLeave &&
                        dateFromForUpdateBusinessLeave ==
                          dateToForUpdateBusinessLeave
                      "
                    >
                      <v-text-field
                        v-if="timeToForUpdateBusinessLeave"
                        data-cy="cy_time_to_update_business_leave_hr"
                        v-model="timeToForUpdateBusinessLeave"
                        name="timeToForUpdateBusinessLeave"
                        readonly
                        label="Time To"
                        hide-details
                        color="teal"
                      ></v-text-field>
                      <v-text-field
                        v-else
                        data-cy="cy_time_to_business_leave_hr"
                        v-model="timeToBusinessLeave"
                        name="timeToBusinessLeave"
                        type="time"
                        :min="timeFromBusinessLeave"
                        label="Time To"
                        hide-details
                        color="teal"
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
                    <!-- //////////////////////////////// -->
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
                    <!-- ////////////////////////.//////////////////////////// -->
                    <v-col md="6">
                      <v-text-field
                        v-if="applyDateForUpdateBusinessLeave"
                        data-cy="cy_apply_date_business_update_leave_hr"
                        v-model="applyDateForBusinessLeave"
                        name="applyDateForBusinessLeave"
                        :min="nowDate"
                        readonly
                        dense
                        hide-details
                        color="teal"
                      ></v-text-field>
                      <v-text-field
                        v-else
                        data-cy="cy_apply_date_business_leave_hr"
                        v-model="applyDateForBusinessLeave"
                        name="applyDateForBusinessLeave"
                        :min="nowDate"
                        readonly
                        dense
                        hide-details
                        color="teal"
                      ></v-text-field>
                    </v-col>
                    <!-- ///////////////////////////////////////////////////// -->
                    <v-col
                      md="6"
                      v-if="
                        dateFromBusinessLeave !== dateToBusinessLeave ||
                        dateFromForUpdateBusinessLeave !=
                          dateToForUpdateBusinessLeave
                      "
                    >
                      <v-text-field
                        v-if="howManyDaysEmployeeAskedForUpdate"
                        data-cy="cy_requested_days_business_update_leave_hr"
                        v-model="howManyDaysEmployeeAskedForUpdate"
                        name="howManyDaysEmployeeAskedForUpdate"
                        label="Requested Days"
                        hide-details
                        readonly
                        dense
                      ></v-text-field>
                      <v-text-field
                        v-else
                        data-cy="cy_requested_days_business_leave_hr"
                        v-model="howManyDaysEmployeeAskForBusinessLeave"
                        name="howManyDaysEmployeeAskForBusinessLeave"
                        label="Requested Days"
                        hide-details
                        readonly
                        :value="calculateNumberOfDays2"
                        dense
                      ></v-text-field>
                    </v-col>
                    <!-- ////////////////////// -->

                    <v-col
                      md="6"
                      v-if="
                        dateFromBusinessLeave == dateToBusinessLeave &&
                        dateFromForUpdateBusinessLeave ==
                          dateToForUpdateBusinessLeave
                      "
                    >
                      <v-text-field
                        v-if="howManyHoursEmployeeAskedForUpdate"
                        data-cy="cy_requested_hours_business_update_leave_hr"
                        v-model="howManyHoursEmployeeAskedForUpdate"
                        name="howManyHoursEmployeeAskedForUpdate"
                        label="Requested Hours"
                        hide-details
                        :value="calculateHoursEmployeeAskedFor"
                        readonly
                        dense
                      ></v-text-field>
                      <v-text-field
                        v-else
                        data-cy="cy_requested_hours_business_leave_hr"
                        v-model="howManyHoursEmployeeAskForBusinessLeave"
                        name="howManyHoursEmployeeAskForBusinessLeave"
                        label="Requested Hours"
                        hide-details
                        readonly
                        :value="calculateHoursEmployeeAskedFor"
                        dense
                      ></v-text-field>
                    </v-col>
                    <!-- ///////////////////////////////////////////////////////// -->
                    <v-col md="12">
                      <v-text-field
                        v-if="businessLeaveTypeUpdate"
                        data-cy="cy_update_business_leave_type_hr"
                        v-model="businessLeaveTypeUpdate"
                        name="businessLeaveTypeUpdate"
                        hide-details
                        readonly
                        dense
                      ></v-text-field>
                      <v-select
                        v-else
                        data-cy="cy_business_leave_type_hr"
                        v-model="businessLeaveType"
                        :items="businessTypes"
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
                        data-cy="cy_reason_from_employee_update_business_leave_type_hr"
                        v-model="reasonFromEmployeeForUpdate"
                        name="reasonFromEmployeeForUpdate"
                        hide-details
                        dense
                        color="teal"
                        readonly
                        label="Reason"
                      ></v-text-field>
                      <v-text-field
                        v-if="businessLeaveType == 'other'"
                        data-cy="cy_reason_from_employee_business_leave_type_hr"
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
                    <!-- ////////////////////////////// -->
                    <v-col
                      md="12"
                      v-if="
                        statusForUpdateBusinessLeave &&
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
                    <v-col md="6" v-if="statusForUpdateBusinessLeave">
                      <span style="font-weight: 600; font-size: 1rem"
                        >Status:
                      </span>
                      <span
                        :class="[
                          statusForUpdateBusinessLeave == 'accepted'
                            ? 'acceptedLeave'
                            : null,
                          statusForUpdateBusinessLeave == 'on hold'
                            ? 'orginalStatus'
                            : 'null',
                          statusForUpdateBusinessLeave == 'refused'
                            ? 'refusedLeave'
                            : 'null',
                          statusForUpdateBusinessLeave == 'New'
                            ? 'New'
                            : 'null',
                        ]"
                        >{{ statusForUpdateBusinessLeave }}</span
                      >
                    </v-col>

                    <v-col md="12" v-if="selectStatus == 'on hold'">
                      <v-text-field
                        data-cy="cy_reason_update_business_leave_hr"
                        v-model="reasonWhyManagerWantToUpdateRequest"
                        name="reasonWhyManagerWantToUpdateRequest"
                        label="Reason"
                        type="text"
                        hide-details
                        dense
                      >
                      </v-text-field>
                    </v-col>
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
                v-if="statusForUpdateBusinessLeave"
                color="#35b5ac"
                class="white--text"
                type="submit"
                @click="requestLeave"
                :disabled="!isFormValid"
              >
                Submit
              </v-btn>
              <v-btn
                v-else
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
    businessLeaveDialog: {
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
    ////////////////////////////////////////////////////////////
    ///update from manager
    employeeNameForBusinessLeave: {
      type: String,
    },
    applyDateForUpdateBusinessLeave: {
      type: String,
    },
    dateFromForUpdateBusinessLeave: {
      type: String,
    },
    dateToForUpdateBusinessLeave: {
      type: String,
    },
    timeFromForUpdateBusinessLeave: {
      type: String,
    },
    timeToForUpdateBusinessLeave: {
      type: String,
    },
    howManyDaysEmployeeAskedForUpdate: {
      type: Number,
    },
    howManyHoursEmployeeAskedForUpdate: {
      type: Number,
    },
    reasonFromEmployeeForUpdate: {
      type: String,
    },
    businessLeaveTypeUpdate: {
      type: String,
    },
    statusForUpdateBusinessLeave: {
      type: String,
    },
    idForEmployeeUpdate: {
      type: Number,
    },
    employeeUuidForUpdateBusinessLeave: {
      type: String,
    },
    idForUpdateBusinessLeaveRequest: {
      type: Number,
    },

    /////////////////////////////
    toggle: {
      type: Boolean,
    },
  },

  data() {
    return {
      showBusinessLeaveDialog: null,
      dialog2: false,
      ///////////////
      employeeId: null,
      providerUuidForEmployeeIn: null,
      employeeId: null,
      //////////////
      employeeNameBusiness: null,
      //////////////
      dateFromBusinessLeave: null,
      dateToBusinessLeave: null,
      //////////////

      timeFromBusinessLeave: new Date().toLocaleTimeString(),
      timeToBusinessLeave: new Date().toLocaleTimeString(),
      //////////////
      applyDateForBusinessLeave: new Date().toISOString().substr(0, 10),
      nowDate: new Date().toISOString().slice(0, 10),
      howManyDaysEmployeeAskForBusinessLeave: null,
      howManyHoursEmployeeAskForBusinessLeave: null,
      howManyHoursEmployeeAskForBusinessLeaveForDb: null,
      howManyHoursEmployeeAskedForUpdateForDb: null,
      //////////////
      businessLeaveType: null,
      testStatus: null,
      businessTypes: [
        "conference",
        "work from another country",
        "outsource patient",
        "other",
      ],
      //////////////
      reasonFromEmployee: null,
      //////////////
      selectStatus: null,
      statusOptions: ["Accept", "Refuse", "on hold"],
      /////////////////

      requested: false,
      //////////////////////
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
      "actionToCheckProviderAppointments",
      "actionToCheckEmployeeVcationsAndLeaves",
      "actionForGettingAllLeaveWork",
    ]),
    resetFields() {
      this.dateFromBusinessLeave = null;
      this.dateToBusinessLeave = null;
      this.timeFromBusinessLeave = new Date().toLocaleTimeString();
      this.timeToBusinessLeave = new Date().toLocaleTimeString();
      this.businessLeaveType = null;
    },
    async requestLeave(e) {
      // console.log(this.timeFromBusinessLeave, this.timeToBusinessLeave);

      if (this.employeeNameForBusinessLeave && this.selectStatus == "on hold") {
        let path = await this.$axios(
          requestBuilder("hr", "/updateLeaveForEmployee", "put", {
            leaveIdUpdate: this.idForUpdateBusinessLeaveRequest,
          })
        ).then(() => {
          let path = this.$axios(
            requestBuilder("hr", "/leaveApplication", "post", {
              employeeName: this.employeeNameForBusinessLeave,
              providerUuid: this.employeeUuidForUpdateBusinessLeave,
              applyDate: this.applyDateForUpdateBusinessLeave,
              ///////////////

              DateFrom: this.dateFromForUpdateBusinessLeave,
              dateTo: this.dateToForUpdateBusinessLeave,
              ///////////////

              timeFrom: this.timeFromForUpdateBusinessLeave,
              timeTo: this.timeToForUpdateBusinessLeave,
              ///////////////
              leaveType: "business",
              subLeaveType: this.businessLeaveTypeUpdate,
              isApproved: this.selectStatus,
              //////////////

              howManyDaysEmployeeAskForBusinessLeave:
                this.howManyDaysEmployeeAskedForUpdate,
              howManyHoursEmployeeAskForBusinessLeave:
                this.howManyHoursEmployeeAskedForUpdateForDb,
              ///////////////
              reasonFromManager: this.reasonWhyManagerWantToUpdateRequest,

              EmployeeId: this.idForEmployeeUpdate,
            })
          ).then(() => {
            this.businessLeaveDialog = !this.businessLeaveDialog;
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
            leaveId: this.idForUpdateBusinessLeaveRequest,
            requestedDays: this.howManyDaysEmployeeAskedForUpdate,
            requestedHours: this.howManyHoursEmployeeAskedForUpdateForDb,
            providerUuid: this.employeeUuidForUpdateBusinessLeave,
            leaveType: "business",
          })
        ).then((res) => {
          this.showBusinessLeaveDialog = !this.showBusinessLeaveDialog;
          this.requested = true;
          this.actionForGettingAllLeaveWork({
            providerUuid: null,
            dateFromFiltred: null,
            dateToFiltred: null,
          });
        });
      }
      /////////////////////////////////////////////////////////////////////
      else if (this.selectStatus == "Refuse") {
        let path = await this.$axios(
          requestBuilder("hr", "/acceptRejectLeaveRequest", "put", {
            leaveIdReject: this.idForUpdateBusinessLeaveRequest,
            typeFromRefused: "business",

            // leaveId: this.idForUpdateBusinessLeaveRequest,
            // requestedDays: this.howManyDaysEmployeeAskedForUpdate,
            // requestedHours: this.howManyHoursEmployeeAskedForUpdate,
            // providerUuid: this.employeeUuidForUpdateBusinessLeave,
            // leaveType: "business",
          })
        ).then((res) => {
          this.showBusinessLeaveDialog = !this.showBusinessLeaveDialog;
          this.requested = true;
          this.actionForGettingAllLeaveWork({
            providerUuid: null,
            dateFromFiltred: null,
            dateToFiltred: null,
          });
        });
      }

      ////////////////////////////////////////////////////////////////////
      else {
        if (
          this.timeToBusinessLeave == this.timeFromBusinessLeave &&
          this.dateFromBusinessLeave != this.dateToBusinessLeave
        ) {
          let path = await this.$axios(
            requestBuilder("hr", "/leaveApplication", "post", {
              employeeName: this.nameForProviderIn,
              providerUuid: this.employeeUuid,
              applyDate: this.applyDateForBusinessLeave,
              ///////////////

              DateFrom: this.dateFromBusinessLeave,
              dateTo: this.dateToBusinessLeave,
              ///////////////

              // timeFrom: this.timeFromBusinessLeave,
              // timeTo: this.timeToBusinessLeave,
              ///////////////
              leaveType: "business",
              subLeaveType: this.businessLeaveType,
              //////////////

              howManyDaysEmployeeAskForBusinessLeave:
                this.howManyDaysEmployeeAskForBusinessLeave,
              howManyHoursEmployeeAskForBusinessLeave:
                this.howManyHoursEmployeeAskForBusinessLeaveForDb,
              ///////////////
              reasonFromEmployee: this.reasonFromEmployee,
              ////////////////

              // attachedFile: this.$store.getters.getterForSavingResponse.documentLink,

              //////////////////
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
              this.showBusinessLeaveDialog = !this.showBusinessLeaveDialog;
              this.requested = true;
              this.actionForGettingAllLeaveWork({
                providerUuid: this.employeeUuid,
              });
              this.dialog2 = true;
            });
          } else {
            this.showBusinessLeaveDialog = !this.showBusinessLeaveDialog;
            this.requested = true;
            this.actionForGettingAllLeaveWork({
              providerUuid: this.employeeUuid,
            });
            this.dialog2 = true;
            this.resetFields();
          }
        } else if (this.dateFromBusinessLeave == this.dateToBusinessLeave) {
          let path = await this.$axios(
            requestBuilder("hr", "/leaveApplication", "post", {
              employeeName: this.nameForProviderIn,
              providerUuid: this.employeeUuid,
              applyDate: this.applyDateForBusinessLeave,
              ///////////////

              DateFrom: this.dateFromBusinessLeave,
              dateTo: this.dateToBusinessLeave,
              ///////////////

              timeFrom: this.timeFromBusinessLeave,
              timeTo: this.timeToBusinessLeave,
              ///////////////
              leaveType: "business",
              subLeaveType: this.businessLeaveType,
              //////////////

              howManyDaysEmployeeAskForBusinessLeave:
                this.howManyDaysEmployeeAskForBusinessLeave,
              howManyHoursEmployeeAskForBusinessLeave:
                this.howManyHoursEmployeeAskForBusinessLeaveForDb,
              ///////////////
              reasonFromEmployee: this.reasonFromEmployee,
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
              this.showBusinessLeaveDialog = !this.showBusinessLeaveDialog;
              this.requested = true;
              this.actionForGettingAllLeaveWork({
                providerUuid: this.employeeUuid,
              });
              this.dialog2 = true;
              this.resetFields();
            });
          } else {
            this.showBusinessLeaveDialog = !this.showBusinessLeaveDialog;
            this.requested = true;
            // this.actionForGettingAllLeaveWork({
            //   providerUuid: this.employeeUuid,
            // });
            this.dialog2 = true;
            this.resetFields();
          }
        }
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
        providerUuid: this.employeeUuid,
      });
    },
    close() {
      this.toggle = !this.toggle;
      this.$emit("update:businessLeaveDialog", false);
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
      // this.toggle = !this.toggle;
      this.showBusinessLeaveDialog = this.businessLeaveDialog;
    },
    calculateNumberOfDays2() {
      var date1 = new Date(this.dateFromBusinessLeave);
      var date2 = new Date(this.dateToBusinessLeave);

      var Difference_In_Time = date2.getTime() - date1.getTime();
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      if (Difference_In_Days <= 0) {
        return (this.howManyDaysEmployeeAskForBusinessLeave = null);
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
