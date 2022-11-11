<template>
  <div v-if="getterForSettingsData.row">
    <v-row class="justify-center">
      <v-col md="7">
        <v-card>
          <v-card-title class="header-form-add mb-3">
            <span class="request-title text-h5">Add New Employee</span>
          </v-card-title>
          <v-card-text>
            <!-- <v-container> -->
            <v-form v-model="isFormValid">
              <v-row>
                <!-- ///////////////////////////////////////// -->

                <v-col md="6">
                  <v-text-field
                    data-cy="cy_employee_first_name_new_hr"
                    v-model="employeeFirstName"
                    name="employeeFirstName"
                    type="text"
                    :rules="[rules.required]"
                    label="First Name"
                    hide-details
                    color="#194569"
                  ></v-text-field>
                </v-col>
                <v-col md="6">
                  <v-text-field
                    data-cy="cy_employee_last_name_new_hr"
                    v-model="employeeLastName"
                    name="employeeLastName"
                    type="text"
                    label="Last Name"
                    :rules="[rules.required]"
                    hide-details
                    color="#194569"
                  ></v-text-field>
                </v-col>
                <!-- ////////////////////////////////////////////// -->
                <v-col cols="4">
                  <v-text-field
                    data-cy="cy_employee_phone_new_hr"
                    v-model="employeePhoneNumber"
                    name="employeePhoneNumber"
                    label="Phone"
                    :rules="phoneRules"
                    hide-details
                    color="#194569"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    data-cy="cy_employee_date_new_hr"
                    v-model="dateOfBirth"
                    name="dateOfBirth"
                    label="Date Of Birth"
                    :rules="[rules.required]"
                    :max="getDateOneDay"
                    hide-details
                    color="#194569"
                    type="date"
                  ></v-text-field>
                </v-col>
                <v-col md="4">
                  <v-select
                    v-model="employeeGender"
                    :rules="[rules.required]"
                    :items="genders"
                    label="choose gender..."
                    hide-details
                    color="#194569"
                  >
                  </v-select>
                </v-col>
                <v-col cols="6" v-if="phoneNumberStatus">
                  <v-alert dense outlined type="error">
                    phone number already taken
                  </v-alert>
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="employeeEmail"
                    :items="fakeEmails"
                    :rules="[rules.required]"
                    item-text="email"
                    label="choose email..."
                    hide-details
                    return-object
                    color="#194569"
                  >
                  </v-select>
                </v-col>
                <v-col cols="12" v-if="emailStatus">
                  <v-alert dense outlined type="error">
                    email already taken
                  </v-alert>
                </v-col>

                <!-- <v-col md="6">
                  <v-select
                    v-model="employeeRole"
                    :rules="[rules.required]"
                    :items="roles"
                    item-text="text"
                    label="choose role..."
                    hide-details
                    color="#194569"
                    @change="mutateArray"
                  >
                  </v-select>
                </v-col> -->
                <!-- <v-col md="6">
                  <v-select
                    v-model="employeeOccupation"
                    :rules="[rules.required]"
                    :items="chooseCategory == 'cate1' ? category1 : category2"
                    item-text="text"
                    label="choose occupation..."
                    hide-details
                    color="#194569"
                    return-object
                    :disabled="showCategory"
                  >
                  </v-select>
                </v-col> -->
                <v-col md="12">
                  <v-autocomplete
                    v-model="employeeOccupation"
                    :rules="[rules.required]"
                    :items="category1"
                    item-text="name"
                    label="choose occupation..."
                    hide-details
                    color="#194569"
                    return-object
                  >
                    <template v-slot:selection="{ item }">
                      {{ getText(item) }}
                    </template>
                    <template v-slot:item="{ item }">
                      {{ getText(item) }}
                    </template>
                  </v-autocomplete>
                </v-col>

                <!-- ///////////////////////////////////////////////////// -->
              </v-row>
            </v-form>
            <!-- </v-container> -->
          </v-card-text>
          <v-card-actions class="mt-0">
            <v-spacer></v-spacer>
            <v-btn class="secondry-btn" @click="clearAllFields"> Reset </v-btn>
            <v-btn
              color="#194569"
              class="white--text"
              type="submit"
              :disabled="!isFormValid"
              @click="
                checkEmails(
                  employeeEmail,
                  employeeFirstName,
                  employeeLastName,
                  employeePhoneNumber,
                  employeeEmail,
                  dateOfBirth,
                  employeeGender,

                  employeeOccupation
                )
              "
            >
              Add
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="requested">
      <PopupSuccess :dialog2.sync="dialog2" type="addEmployee" />
    </v-row>
    <!-- <v-row v-if="requested"> -->
    <!-- <PopupSuccess :dialog2.sync="dialog2" type="addNewProviderConfirmation" /> -->
    <!-- <UploadComponent
        v-if="employeeUuid"
        :dmsDialog.sync="dmsDialog"
        :entity_id="employeeUuid"
        :feature_type="'providers'"
        @testData="testData"
      /> -->

    <!-- </v-row> -->
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
// import axios from "axios";
import PopupSuccess from "../../dialogs/PopupSuccess.vue";
// import UploadComponent from "../../../web.dms.agentsoncloud.com/components/UploadComponent.vue";
import { getFormattedDate, dateHelper2 } from "../../../util/dateFormatting";
import {
  createNewEmployeeService,
  createNewContractService,
  addWorkingHoursForEmployeeService,
  addNewEstablishment,
} from "../../../util/services/hrServices";

export default {
  components: { PopupSuccess },

  data() {
    return {
      isFormValid: false,
      //////////////////////////

      emailStatus: false,
      phoneNumberStatus: false,
      getAllEmployeesEmails: [],
      getAllEmployeesPhoneNumbers: [],
      fakeEmails: ["xxx@gmail.com", "yyy@gmail.com", "qqq@gmail.com"],
      /////////////////////////

      chooseCategory: null,
      showCategory: true,
      category1: [],

      employeeGender: null,
      employeeFirstName: null,
      employeeLastName: null,
      employeeEmail: null,
      employeePhoneNumber: null,
      dateOfBirth: null,
      employeeRole: null,
      employeeOccupation: "",
      genders: ["male", "female"],
      phoneRules: [
        (v) =>
          /(^07[9|7|8]{1}[0-9]{7}$)/.test(v) ||
          "Phone number must be 10 numbers",
      ],
      rules: {
        required: (value) => !!value || "Required.",
      },

      requested: false,
      dialog2: false,
    };
  },
  computed: {
    ...mapGetters([
      "getterForCiamUsers",
      "getterForEmployeesInformation",
      "getterForSettingsData",
    ]),
    getDateOneDay() {
      let date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth();
      let firstDay = new Date(2002, 12, 31);
      return firstDay.toISOString().slice(0, 10);
    },
  },
  methods: {
    ...mapActions([
      "actionForCiamUsers",
      "actionForEmployeesInformationApi",
      "actionForGetSettingsDataApi",
    ]),
    getText: (item) => `${item.name.en}`,

    clearAllFields() {
      this.employeeFirstName = null;
      this.employeeLastName = null;
      this.employeeEmail = null;
      this.employeePhoneNumber = null;
      this.employeeGender = null;
      this.dateOfBirth = null;
      this.employeeRole = null;
      this.employeeOccupation = null;
    },
    async bringAllEmails() {
      //here we save all emails and phone number for employees
      this.getterForEmployeesInformation.row.employees.forEach((item) => {
        this.getAllEmployeesEmails.push(item.email);
        this.getAllEmployeesPhoneNumbers.push(item.primaryPhone.number);
      });
    },
    async checkEmails(
      email,
      employeeFirstName,
      employeeLastName,
      employeePhoneNumber,
      employeeEmail,
      dateOfBirth,
      employeeGender,

      employeeOccupation
    ) {
      try {
        //here we check on emails and phone numbers if it condition pass then we call add new employee request
        // let testEmails = this.getAllEmployeesEmails.includes(email.email);
        let testEmails = false;
        let testPhones =
          this.getAllEmployeesPhoneNumbers.includes(employeePhoneNumber);

        if (testEmails === true || testPhones === true) {
          this.emailStatus = testEmails;
          this.phoneNumberStatus = testPhones;
          this.addNewEmployee(
            employeeFirstName,
            employeeLastName,
            employeePhoneNumber,
            employeeEmail,
            dateOfBirth,
            employeeGender,

            employeeOccupation
          );
        } else {
          this.emailStatus = false;
          this.phoneNumberStatus = false;
          this.addNewEmployee(
            employeeFirstName,
            employeeLastName,
            employeePhoneNumber,
            employeeEmail,
            dateOfBirth,
            employeeGender,

            employeeOccupation
          );
        }
      } catch (error) {
        console.log(error);
      }
    },

    async addNewEmployee(
      employeeFirstName,
      employeeLastName,
      employeePhoneNumber,
      employeeEmail,
      dateOfBirth,
      employeeGender,

      employeeOccupation
    ) {
      try {
        if (this.emailStatus || this.phoneNumberStatus) {
          return;
        }

        let path = await createNewEmployeeService({
          ciamMtUserId: employeeEmail.userId,
          name: { ar: "", en: employeeFirstName + employeeLastName },
          primaryPhone: { country_code: +962, number: employeePhoneNumber },
          email: employeeEmail.email,
          dob: dateOfBirth,
          gender: { id: "1", name: { ar: "", en: employeeGender } },
          occupation: employeeOccupation,
          createdBy: {
            id: 1,
            user: `${this.$store.getters.tokenValue.firstName} ${this.$store.getters.tokenValue.lastName}`,
          },
        });

        let path2 = await createNewContractService({
          hrsMtProfileId: path.data.row.response.id,
          facility: { id: 1, name: { ar: "", en: "laser-avenue" } },
          joiningDate: getFormattedDate(new Date()),
          occupation: employeeOccupation,
          period: {
            from: getFormattedDate(new Date()),
            to: dateHelper2(365),
          },
          employmentType: { id: 1, name: { en: "full-time", ar: "" } },
          transactionId: path.data.row.response.transactionId,
          createdBy: path.data.row.response.createdBy,
        });

        if (path2.data.status == "success") {
          let path3 = await addWorkingHoursForEmployeeService({
            hrsMtProfileId: path.data.row.response.id,
            hrsMtWorkingShiftsId:
              "HRS-HWS-JOR-6f048bc1-a4fc-4663-befe-b41f998a4788",
            dayTime: [
              { day: "saturday", time: { from: "09:00", to: "17:00" } },
              { day: "sunday", time: { from: "09:00", to: "17:00" } },
              { day: "monday", time: { from: "09:00", to: "17:00" } },
              { day: "tuesday", time: { from: "09:00", to: "17:00" } },
              { day: "wednesday", time: { from: "09:00", to: "17:00" } },
              { day: "thursday", time: { from: "09:00", to: "17:00" } },
              { day: "friday", time: { from: "", to: "" } },
            ],
            dateFrom: path2.data.data.response.period.from,
            dateTo: path2.data.data.response.period.to,
            transactionId: path.data.row.response.transactionId,
            createdBy: path.data.row.response.createdBy,
          });

          if (path3.status === 201) {
            let path4 = await addNewEstablishment({
              hrsMtProfileId: path.data.row.response.id,
              establishment: path2.data.data.response.facility,
              joiningDate: getFormattedDate(new Date()),
              transactionId: path.data.row.response.transactionId,
              createdBy: path.data.row.response.createdBy,
            });

            if (path4.status === 201) {
              this.requested = true;
              this.dialog2 = true;
              this.clearAllFields();
            }
          }
        }
      } catch (error) {
        console.log(error.toString());
      }
    },
    mutateArray() {
      this.employeeRole.name.en == "doctor" ||
      this.employeeRole.name.en == "assistant" ||
      this.employeeRole.name.en == "specialist"
        ? (this.showCategory = false)
        : (this.showCategory = !this.showCategory);

      this.employeeRole.name.en == "doctor" ||
      this.employeeRole.name.en == "assistant"
        ? (this.chooseCategory = "cate1")
        : (this.chooseCategory = "cate2");
    },
    async renderData() {
      //here we arrange the actions calls and make async then we call this function in mounted cycle method
      await this.actionForGetSettingsDataApi();
      await this.actionForEmployeesInformationApi({});
      await this.actionForCiamUsers();
      this.bringAllEmails();
      this.category1 = this.getterForSettingsData.row.settings[0].occupation;
    },
  },
  async mounted() {
    this.renderData();
  },

  watch: {},
};
</script>

<style scoped>
.header-form-add {
  background: #eeeeee !important;
}
.request-title {
  font-weight: bold;
  color: #000000;
  margin-top: 2em auto;
  padding-bottom: 0.2em;
}
.cursor {
  cursor: pointer;
}
.secondry-btn {
  background: transparent !important;
  border: 1px solid #194569 !important;
}
</style>
