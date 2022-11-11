<template>
  <div>
    <v-dialog
      v-model="showEditPersonalInformation"
      persistent
      width="1065"
      height="558"
    >
      {{ assignDialog }}
      <v-col md="12">
        <v-row class="align-center justify-center">
          <v-card>
            <v-card-title>
              <span class="request-title">Edit Information</span>
            </v-card-title>

            <v-divider class="mx-4"></v-divider>
            <v-card-text>
              <v-container>
                <v-form v-model="isFormValid">
                  <v-row>
                    <!-- /////////////////////////////// -->

                    <v-col md="4">
                      <v-text-field
                        v-model="newEmail"
                        :placeholder="employeeDataDynamic.employeeEmail"
                        name="email"
                        type="text"
                        outlined
                        dense
                        hide-details
                        color="#194569"
                      ></v-text-field>
                    </v-col>

                    <v-col md="4">
                      <v-text-field
                        v-model="newPhoneNumber"
                        :placeholder="employeeDataDynamic.employeePrimaryPhone"
                        name="phoneNumber"
                        type="text"
                        outlined
                        dense
                        :rules="[rules.phoneRules]"
                        hide-details
                        color="#194569"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="4" v-if="emailStatus">
                      <v-alert dense outlined type="error">
                        email already taken
                      </v-alert>
                    </v-col>
                    <v-col cols="4" v-if="phoneNumberStatus">
                      <v-alert dense outlined type="error">
                        phone number already taken
                      </v-alert>
                    </v-col>
                    <v-col md="4">
                      <v-autocomplete
                        v-model="newNationality"
                        name="nationality"
                        type="text"
                        outlined
                        dense
                        :item-text="`name`"
                        :items="nationalities"
                        item-value="id"
                        label="Nationality"
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
                    <v-col md="4">
                      <v-autocomplete
                        v-model="newMaritalStatus"
                        :item-text="`name`"
                        name="maritalStatus"
                        type="text"
                        :items="maritalStatusData"
                        item-value="id"
                        outlined
                        dense
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
                    <v-col md="4">
                      <v-text-field
                        v-model="employeeDataDynamic.employeeBirth"
                        name="birth"
                        type="date"
                        outlined
                        dense
                        label="Birth Date"
                        :max="getDateOneDay"
                        hide-details
                        color="#194569"
                      ></v-text-field>
                    </v-col>
                    <v-col md="4">
                      <v-autocomplete
                        v-model="newGender"
                        name="gender"
                        :items="genders"
                        item-value="id"
                        type="text"
                        outlined
                        dense
                        hide-details
                        :item-text="`name`"
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
                    <!-- <v-col md="4">
                      <v-text-field
                        v-model="employeeDataDynamic.employeeAddress.area"
                        name="area"
                        type="text"
                        outlined
                        dense
                        label="Area"
                        hide-details
                        color="#194569"
                      ></v-text-field>
                    </v-col>
                    <v-col md="4">
                      <v-text-field
                        v-model="employeeDataDynamic.employeeAddress.city"
                        name="city"
                        type="text"
                        outlined
                        dense
                        label="City"
                        hide-details
                        color="#194569"
                      ></v-text-field>
                    </v-col>
                    <v-col md="4">
                      <v-text-field
                        v-model="employeeDataDynamic.employeeAddress.country"
                        name="country"
                        type="text"
                        outlined
                        dense
                        label="Country"
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
                @click="
                  checkFields(
                    newPhoneNumber,
                    newEmail,
                    employeeDataDynamic.employeeBirth,
                    newMaritalStatus,
                    newGender,
                    newNationality
                  )
                "
                color="#194569"
                class="white--text"
                type="submit"
                :disabled="!isFormValid"
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
import {
  checkEmailsService,
  checkPhoneNumbers,
  updateEmployeeInformation,
} from "../../../util/services/hrServices";
import {
  getAllCountries,
  getAllGenders,
  getAllIdTypes,
  getAllMaritalStatuses,
  getAllNationalities,
} from "../../../util/services/sharedServices";

export default {
  components: { PopupSuccess },

  props: {
    editInformationDialog: {
      type: Boolean,
      default: false,
    },
    employeeDataDynamic: {
      type: Array,
    },
  },
  data() {
    return {
      dialog2: false,
      showEditPersonalInformation: null,
      firstName: "",
      secondName: "",
      lastName: "",
      nationalities: [],
      isFormValid: true,
      newMaritalStatus: null,
      newGender: null,
      newNationality: null,
      genders: [],

      rules: {
        phoneRules: (value) => {
          let testPhone = /(^07[9|7|8]{1}[0-9]{7}$)/.test(value);
          if (testPhone) {
            this.isFormValid = true;
          } else {
            ("Phone number must be 10 numbers");
            this.isFormValid = false;
          }
        },
      },
      emailStatus: false,
      newEmail: null,
      ///////////
      phoneNumberStatus: false,
      newPhoneNumber: null,
      getAllEmployeesEmails: [],
      getAllEmployeesPhoneNumbers: [],
      ///////////////
    };
  },

  computed: {
    ...mapGetters(["getterForEmployeesInformation"]),
    assignDialog() {
      this.showEditPersonalInformation = this.editInformationDialog;
    },
    // formatName() {
    //   let test = this.employeeDataDynamic.employeeName.split(" ");
    //   this.firstName = test[0];
    //   this.secondName = test[1];
    //   this.lastName = test[2];
    // },

    getDateOneDay() {
      let date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth();
      let firstDay = new Date(2002, 12, 31);
      return firstDay.toISOString().slice(0, 10);
    },
  },
  methods: {
    ...mapActions(["actionForEmployeeDataApi"]),
    resetField() {
      this.newMaritalStatus = this.employeeDataDynamic.employeeMaritalStatus2
        ? this.employeeDataDynamic.employeeMaritalStatus2
        : null;
      this.newGender = this.employeeDataDynamic.employeeGender2
        ? this.employeeDataDynamic.employeeGender2
        : null;
      this.newNationality = this.employeeDataDynamic.employeeNationality
        ? this.employeeDataDynamic.employeeNationality
        : null;
    },
    close() {
      this.resetField();
      this.$emit("update:editInformationDialog", false);
    },
    getText: (item) => `${item.name.en}`,

    async checkFields(phone, email, birth, maritalStatus, gender, nationality) {
      try {
        //here we check on emails and phone numbers if it condition pass then we call add new employee request
        let res1 = await checkEmailsService({ email: email });
        let testEmails = res1.data;
        let res2 = await checkPhoneNumbers({ phone: phone });
        let testPhones = res2.data;
        if (testEmails === true || testPhones === true) {
          this.emailStatus = testEmails;
          this.phoneNumberStatus = testPhones;
          this.saveNewInformation(
            phone,
            email,
            birth,
            maritalStatus,
            gender,
            nationality
          );
        } else {
          this.emailStatus = false;
          this.phoneNumberStatus = false;
          this.saveNewInformation(
            phone,
            email,
            birth,
            maritalStatus,
            gender,
            nationality
          );
        }
      } catch (error) {
        console.log(error, "check email and phone error");
      }
    },
    async saveNewInformation(
      phone,
      email,
      birth,
      maritalStatus,
      gender,
      nationality
    ) {
      try {
        if (this.emailStatus || this.phoneNumberStatus) {
          return;
        }

        await updateEmployeeInformation({
          recordId: this.employeeDataDynamic.employeeId,
          email: email ? email : null,
          primaryPhone: phone ? { country_code: +962, number: phone } : null,
          dateOfBirth: birth ? birth : null,
          martialStatus: maritalStatus ? maritalStatus : null,
          gender: gender ? gender : null,
          nationality: nationality ? nationality : null,
        });
        await this.actionForEmployeeDataApi({
          employee_id: [this.employeeDataDynamic.employeeId],
        });
        await this.resetField();
        this.$emit("update:editInformationDialog", false);
      } catch (error) {
        console.log(error, "save new personal information error");
      }
    },
    async fetchAllSharedAPIs() {
      try {
        const genders = await getAllGenders();
        this.genders = genders;
        const martialStatuses = await getAllMaritalStatuses();
        this.maritalStatusData = martialStatuses;
        const nationalities = await getAllNationalities();
        this.nationalities = nationalities;
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {
    try {
      this.fetchAllSharedAPIs();
      this.newMaritalStatus = this.employeeDataDynamic.employeeMaritalStatus2
        ? this.employeeDataDynamic.employeeMaritalStatus2
        : null;
      this.newGender = this.employeeDataDynamic.employeeGender2
        ? this.employeeDataDynamic.employeeGender2
        : null;
      this.newNationality = this.employeeDataDynamic.employeeNationality
        ? this.employeeDataDynamic.employeeNationality
        : null;
    } catch (e) {
      console.log(e);
    }
  },

  watch: {},
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
