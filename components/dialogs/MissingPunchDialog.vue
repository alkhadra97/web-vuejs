<template>
  <div>
    <v-dialog v-model="showMissingPunchDialog" persistent max-width="500px">
      {{ assignDialog }}
      <v-col md="12">
        <v-row class="align-center justify-center">
          <v-card>
            <v-card-title>
              <span class="request-title text-h5">Missing Punch Request</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-form v-model="isFormValid">
                  <v-row>
                    <!-- /////////////////////////////// -->
                    <v-col cols="12">
                      <v-text-field
                        data-cy="cy_employee_name_missing_punch_request_hr"
                        v-model="nameForProviderIn"
                        name="employeeNameForMissingPunch"
                        readonly
                        hide-details
                        label="Name"
                        color="teal"
                      ></v-text-field>
                    </v-col>

                    <v-col md="12">
                      <v-select
                        data-cy="cy_type_missing_punch_request_hr"
                        v-model="missingPunchType"
                        :items="missingPunchTypes"
                        label="choose type..."
                        color="teal"
                        dense
                        hide-details
                      >
                      </v-select>
                    </v-col>
                    <v-col md="12">
                      <v-select
                        v-if="missingPunchType == 'Check In'"
                        data-cy="cy_apply_date_missing_punch_request_hr"
                        v-model="applyDateForMissingPunch"
                        :items="missedDaysCheckIn"
                        label="Missing Days"
                        color="teal"
                      >
                      </v-select>
                      <v-select
                        v-else-if="missingPunchType == 'Check Out'"
                        data-cy="cy_apply_date_missing_punch_request_hr"
                        v-model="applyDateForMissingPunch"
                        :items="missedDaysCheckOut"
                        label="Missing Days"
                        color="teal"
                      >
                      </v-select>
                      <v-text-field
                        v-else
                        data-cy="cy_apply_date_missing_punch_request_hr"
                        v-model="applyDateForMissingPunch"
                        name="applyDateForMissingPunch"
                        label="Apply Date"
                        :min="getDateBeforeThirtyDays"
                        :max="getDateOneDay"
                        type="date"
                        dense
                        hide-details
                        color="teal"
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
                        data-cy="cy_time_from_missing_punch_request_hr"
                        v-model="timeFromForMissingPunch"
                        name="timeFromForMissingPunch"
                        label="Time From"
                        type="time"
                        dense
                        hide-details
                        color="teal"
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
                        data-cy="cy_time_to_missing_punch_request_hr"
                        v-model="timeToForMissingPunch"
                        name="timeToForMissingPunch"
                        :min="timeFromForMissingPunch"
                        label="Time To"
                        type="time"
                        dense
                        hide-details
                        color="teal"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <v-col md="12">
                      <v-text-field
                        data-cy="cy_reason_missing_punch_request_hr"
                        v-model="reasonForMissingPunchRequest"
                        name="reasonForMissingPunchRequest"
                        label="Reason"
                        type="text"
                        dense
                        hide-details
                        color="teal"
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
              <v-btn color="teal" text @click="close"> Close </v-btn>
              <v-btn
                color="#35b5ac"
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
import { mapGetters } from "vuex";
import requestBuilder from "../../requestBuilder";
import PopupSuccess from "./PopupSuccess.vue";

export default {
  props: {
    missingPunchDialog: {
      type: Boolean,
      default: false,
    },
    uuidForEmployee: {
      type: String,
    },
    nameForProviderIn: {
      type: String,
    },
    idForProviderIn: {
      type: Number,
    },
  },
  data() {
    return {
      dialog2: false,
      showMissingPunchDialog: null,
      ///////////////////////////////
      employeeNameForMissingPunch: null,
      applyDateForMissingPunch: new Date().toISOString().substr(0, 10),
      ///////////
      timeFromForMissingPunch: null,
      timeToForMissingPunch: null,
      /////////
      missingPunchType: null,
      missingPunchTypes: ["Check In & Check Out", "Check In", "Check Out"],
      ////////////
      reasonForMissingPunchRequest: null,
      //////////////////////////
      rules: {
        required: (value) => !!value || "Required.",
      },
      isFormValid: false,
      requested: false,
      ///////////
    };
  },
  methods: {
    resetFields() {
      (this.timeFromForMissingPunch = null),
        (this.timeToForMissingPunch = null),
        (this.reasonForMissingPunchRequest = null),
        (this.applyDateForMissingPunch = new Date()
          .toISOString()
          .substr(0, 10)),
        (this.missingPunchType = null);
    },
    requestMissingPunchRequest(
      timeFromForMissingPunch,
      timeToForMissingPunch,
      reasonForMissingPunchRequest,
      missingPunchType,
      applyDateForMissingPunch
    ) {
      try {
        if (missingPunchType == "Check In") {
          let path = this.$axios(
            requestBuilder("hr", "/hr/missingPunchRequestCheckIn", "put", {
              providerUuid: this.uuidForEmployee,
              timeFromForMissingPunch: timeFromForMissingPunch,
              reasonForMissingPunchRequest: reasonForMissingPunchRequest,
              applyDateForMissingPunch: applyDateForMissingPunch,
            })
          ).then(() => {
            this.showMissingPunchDialog = !this.showMissingPunchDialog;
            this.requested = true;
            this.dialog2 = !this.dialog2;
            this.resetFields();
          });
        } else if (missingPunchType == "Check In & Check Out") {
          let path = this.$axios(
            requestBuilder("hr", "/hr/missingPunchForBoth", "post", {
              providerUuid: this.uuidForEmployee,
              employeeName: this.nameForProviderIn,
              timeFromForMissingPunch: timeFromForMissingPunch,
              timeToForMissingPunch: timeToForMissingPunch,
              applyDateForMissingPunch: applyDateForMissingPunch,

              reasonForMissingPunchRequest: reasonForMissingPunchRequest,
              EmployeeId: this.idForProviderIn,
            })
          ).then(() => {
            this.showMissingPunchDialog = !this.showMissingPunchDialog;
            this.requested = true;
            this.dialog2 = !this.dialog2;
            this.resetFields();
          });
        } else {
          let path = this.$axios(
            requestBuilder("hr", "/hr/missingPunchRequestCheckOut", "put", {
              timeToForMissingPunch: timeToForMissingPunch,
              reasonForMissingPunchRequest: reasonForMissingPunchRequest,
              providerUuid: this.uuidForEmployee,
              applyDateForMissingPunch: applyDateForMissingPunch,
            })
          ).then(() => {
            this.showMissingPunchDialog = !this.showMissingPunchDialog;
            this.requested = true;
            this.dialog2 = !this.dialog2;
            this.resetFields();
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    close() {
      this.$emit("update:missingPunchDialog", false);
    },
  },
  computed: {
    ...mapGetters(["info", "getAllTimeAttendanceInfo"]),
    assignDialog() {
      this.showMissingPunchDialog = this.missingPunchDialog;
    },
    getDateBeforeThirtyDays() {
      // var dateOffset = 24 * 60 * 60 * 1000 * 30; //5 days
      // var myDate = new Date();
      // myDate.setTime(myDate.getTime() - dateOffset);
      // return myDate.toISOString().slice(0, 10);
      let date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth();
      let firstDay = new Date(y, m, 1);
      return firstDay.toISOString().slice(0, 10);
    },
    getDateOneDay() {
      var dateOffset = 24 * 60 * 60 * 1000; //5 days
      var myDate = new Date();
      myDate.setTime(myDate.getTime() - dateOffset);
      return myDate.toISOString().slice(0, 10);
    },
    missedDaysCheckIn() {
      let arr = [];
      let todayDate = new Date();
      let day = todayDate.getDate();
      let month = todayDate.getMonth() + 1;
      let year = todayDate.getFullYear();

      // This arrangement can be altered based on how we want the date's format to appear.
      let currentDate = `${year}-0${month}-${day}`;
      // let todayDate = new Date().toISOString().slice(0, 10);
      let date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth();
      let firstDay = new Date(y, m, 1);
      let thisMonth = firstDay.toISOString().slice(0, 10);
      // console.log(todayDate, "todayDate");
      this.getAllTimeAttendanceInfo.data.forEach((item) => {
        if (
          item.date >= thisMonth &&
          item.date < currentDate &&
          (item.checkIn === null ||
            item.checkIn == "" ||
            item.checkIn == "null")
        ) {
          arr.push(item.date);
        }
      });
      return arr;
    },
    missedDaysCheckOut() {
      let arr = [];
      let todayDate = new Date();
      let day = todayDate.getDate();
      let month = todayDate.getMonth() + 1;
      let year = todayDate.getFullYear();

      // This arrangement can be altered based on how we want the date's format to appear.
      let currentDate = `${year}-0${month}-${day}`;
      // let todayDate = new Date().toISOString().slice(0, 10);
      let date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth();
      let firstDay = new Date(y, m, 1);
      let thisMonth = firstDay.toISOString().slice(0, 10);
      // console.log(todayDate, "todayDate");
      this.getAllTimeAttendanceInfo.data.forEach((item) => {
        if (
          item.date >= thisMonth &&
          item.date < currentDate &&
          (item.checkOut == null ||
            item.checkOut == "" ||
            item.checkOut == "null")
        ) {
          arr.push(item.date);
        }
      });
      return arr;
    },
  },
  components: { PopupSuccess },
};
</script>

<style scoped>
.request-title {
  font-weight: bold;
  color: rgb(89, 88, 88);
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
</style>
