<template>
  <div>
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
                    color="teal"
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
                    color="teal"
                  ></v-text-field>
                </v-col>
                <!-- ////////////////////////////////////////////// -->
                <v-col cols="6">
                  <v-text-field
                    data-cy="cy_employee_phone_new_hr"
                    v-model="employeePhoneNumber"
                    name="employeePhoneNumber"
                    label="Phone"
                    :rules="phoneRules"
                    hide-details
                    color="teal"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    data-cy="cy_employee_date_new_hr"
                    v-model="dateOfBirth"
                    name="dateOfBirth"
                    label="Date Of Birth"
                    :rules="[rules.required]"
                    :max="getDateOneDay"
                    hide-details
                    color="teal"
                    type="date"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-select
                    v-model="employeeEmail"
                    :items="getterForCiamUsers"
                    :rules="[rules.required]"
                    item-text="email"
                    label="choose email..."
                    hide-details
                    return-object
                    color="teal"
                  >
                  </v-select>
                </v-col>
                <v-col md="6">
                  <v-select
                    v-model="employeeGender"
                    :rules="[rules.required]"
                    :items="genders"
                    label="choose gender..."
                    hide-details
                    color="teal"
                  >
                  </v-select>
                </v-col>
                <v-col md="12">
                  <v-select
                    v-model="employeeRole"
                    :rules="[rules.required]"
                    :items="roles"
                    label="choose role..."
                    hide-details
                    color="teal"
                  >
                  </v-select>
                </v-col>

                <!-- ///////////////////////////////////////////////////// -->
              </v-row>
            </v-form>
            <!-- </v-container> -->
          </v-card-text>
          <v-card-actions class="mt-0">
            <v-spacer></v-spacer>
            <v-btn color="teal" text @click="clearAllFields"> Reset </v-btn>
            <v-btn
              color="#35b5ac"
              class="white--text"
              type="submit"
              :disabled="!isFormValid"
              @click="
                addNewEmployee(
                  employeeFirstName,
                  employeeLastName,
                  employeePhoneNumber,
                  employeeEmail,
                  dateOfBirth,
                  employeeGender,
                  employeeRole
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
import requestBuilder from "../../requestBuilder";
import PopupSuccess from "../dialogs/PopupSuccess.vue";
// import UploadComponent from "../../../web.dms.agentsoncloud.com/components/UploadComponent.vue";

export default {
  async mounted() {
    this.actionForCiamUsers();
  },
  data() {
    return {
      isFormValid: false,

      roles: ["doctor", "assistant", "specialist"],
      employeeGender: null,
      employeeFirstName: null,
      employeeLastName: null,
      employeeEmail: null,
      employeePhoneNumber: null,
      dateOfBirth: null,
      employeeRole: null,
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
  methods: {
    ...mapActions(["actionForCiamUsers"]),

    clearAllFields() {
      this.employeeFirstName = null;
      this.employeeLastName = null;
      this.employeeEmail = null;
      this.employeePhoneNumber = null;
      this.employeeGender = null;
      this.dateOfBirth = null;
      this.employeeRole = null;
    },

    async addNewEmployee(
      employeeFirstName,
      employeeLastName,
      employeePhoneNumber,
      employeeEmail,
      dateOfBirth,
      employeeGender,
      employeeRole
    ) {
      console.log(employeeRole, "employeeRole");
      if (employeeRole == "doctor") {
        console.log(employeeRole);
        let path = await this.$axios(
          requestBuilder("hr", "/addNewEmployee", "post", {
            userId: employeeEmail.userId,
            firstName: employeeFirstName,
            lastName: employeeLastName,
            phone: employeePhoneNumber,
            email: employeeEmail.email,
            dateOfBirth: dateOfBirth,
            gender: employeeGender,
            RoleId: 1,
            CreatedId: this.$store.getters.tokenValue.userId,
            CreatedBy: `${this.$store.getters.tokenValue.firstName} ${this.$store.getters.tokenValue.lastName}`,
          })
        );
        if (path.status == 200) {
          this.requested = true;

          this.dialog2 = true;
          this.clearAllFields();
        }
      } else if (employeeRole == "assistant") {
        let path = await this.$axios(
          requestBuilder("hr", "/addNewEmployee", "post", {
            userId: employeeEmail.userId,
            firstName: employeeFirstName,
            lastName: employeeLastName,
            phone: employeePhoneNumber,
            email: employeeEmail.email,
            dateOfBirth: dateOfBirth,
            gender: employeeGender,
            RoleId: 2,
          })
        );
        if (path.status == 200) {
          this.requested = true;

          this.dialog2 = true;
          this.clearAllFields();
        }
      } else {
        let path = await this.$axios(
          requestBuilder("hr", "/addNewEmployee", "post", {
            userId: employeeEmail.userId,
            firstName: employeeFirstName,
            lastName: employeeLastName,
            phone: employeePhoneNumber,
            email: employeeEmail.email,
            dateOfBirth: dateOfBirth,
            gender: employeeGender,
            RoleId: 3,
          })
        );
        if (path.status == 200) {
          this.requested = true;

          this.dialog2 = true;
          this.clearAllFields();
        }
      }
    },
  },
  computed: {
    ...mapGetters(["getterForCiamUsers"]),
    getDateOneDay() {
      // var dateOffset = 24 * 60 * 60 * 1000 * 365 * 20; //5 days
      // var myDate = new Date();
      // myDate.setTime(myDate.getTime() - dateOffset);
      // return myDate.toISOString().slice(0, 10);
      let date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth();
      let firstDay = new Date(2002, 12, 31);
      return firstDay.toISOString().slice(0, 10);
    },
  },
  watch: {},
  components: { PopupSuccess },
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
</style>
