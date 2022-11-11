<template>
  <v-container>
    <h1 class="blue1--text font-weight-bold mb-5">Employment Details</h1>
    <v-row class="justify-center align-center flex-column pt-10">
      <v-col md="12">
        <v-row>
          <v-col md="4">
            <span>Establishment</span>
            <v-select
              v-model="establishment"
              :items="establishments"
              label="Establishment"
              outlined
              dense
              :item-text="`name[${activeLanguage}]`"
              item-value="id"
              return-object
            ></v-select>
          </v-col>
          <v-col md="4">
            <span>Facility</span>
            <v-select
              v-model="facility"
              :items="facilities"
              label="Facility"
              outlined
              dense
              :item-text="`name[${activeLanguage}]`"
              return-object
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col md="4">
            <span>Joining Date</span>

            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              :return-value.sync="joiningDate"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  class="mt-2"
                  v-model="joiningDate"
                  label="Select date"
                  prepend-icon="mdi-calendar"
                  readonly
                  outlined
                  dense
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="joiningDate"
                no-title
                scrollable
                :min="minJoinDate"
              >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false">
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.menu.save(joiningDate)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-row>
          <v-col md="4">
            <h3 class="blue1--text font-weight-bold">Renewable Contract</h3>
            <v-radio-group v-model="renewableContract" row>
              <v-radio color="blue1" label="Yes" :value="1"></v-radio>
              <v-radio label="No" color="blue1" :value="0"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row>
          <v-col md="3">
            <span>Employment Type</span>
            <v-autocomplete
              v-model="selectedEmploymentType"
              :items="employmentTypes"
              :item-text="`name.${activeLanguage}`"
              label="Employment Type"
              outlined
              dense
              return-object
            ></v-autocomplete>
          </v-col>
          <v-col md="3">
            <span>Role</span>
            <v-autocomplete
              v-model="role"
              :items="roles"
              :item-text="`name.${activeLanguage}`"
              label="Role"
              outlined
              dense
              return-object
            ></v-autocomplete>
          </v-col>
          <v-col md="3">
            <span>Occupation</span>
            <v-autocomplete
              v-model="selectedOccupation"
              :items="occupations"
              :item-text="`name.${activeLanguage}`"
              label="Occupation"
              outlined
              dense
              return-object
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col md="4">
            <span>Period Start</span>
            <v-menu
              ref="periodStartMenu"
              v-model="periodStartMenu"
              :close-on-content-click="false"
              :return-value.sync="periodStartDate"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  class="mt-2"
                  v-model="periodStartDate"
                  label="Select date"
                  prepend-icon="mdi-calendar"
                  readonly
                  outlined
                  dense
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="periodStartDate"
                no-title
                scrollable
                :min="minJoinDate"
              >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="periodStartMenu = false">
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="blue1"
                  @click="$refs.periodStartMenu.save(periodStartDate)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col md="4">
            <span>Period End</span>
            <v-menu
              ref="periodEndMenu"
              v-model="periodEndMenu"
              :close-on-content-click="false"
              :return-value.sync="periodEndDate"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  class="mt-2"
                  v-model="periodEndDate"
                  label="Select date"
                  prepend-icon="mdi-calendar"
                  readonly
                  outlined
                  dense
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="periodEndDate"
                no-title
                scrollable
                :min="minDate"
              >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="periodEndMenu = false">
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="blue1"
                  @click="$refs.periodEndMenu.save(periodEndDate)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="shiftTemplate"
              :items="allShiftTemplates"
              label="Working Days"
              outlined
              dense
              :item-text="`shiftName.${[activeLanguage]}`"
              return-object
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-btn
              depressed
              color="blue1"
              @click="openWorkingDayDialogue"
              class="white--text p-3"
            >
              <v-icon left color="white">mdi-plus-circle</v-icon>
              Add Working Days
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <span class="d-block">Business Leave Balance</span>
            <v-text-field
              dense
              v-model="businessLeaveBalance"
              type="number"
              :rules="leaveBalanceRules"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <span class="d-block">Sick Leave Balance</span>
            <v-text-field
              v-model="sickLeaveBalance"
              label="Sick Leave Balance"
              outlined
              :rules="leaveBalanceRules"
              type="number"
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <span class="d-block">Personal Leave Balance</span>
            <v-text-field
              v-model="personalLeaveBalance"
              label="Personal Leave Balance"
              outlined
              :rules="leaveBalanceRules"
              type="number"
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <h3 class="blue1--text font-weight-bold">Financial Details</h3>
        <v-row class="">
          <v-col cols="12" md="2" v-for="(financial, i) in financialDetails">
            <v-checkbox
              v-model="financial.checked"
              :label="financial.name"
              :value="financial.checked"
              @change="handleFinancial(i, financial.checked)"
              color="blue1"
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <template v-if="workingHoursDialog">
      <AddWorkingDay
        :addWorkingDayDialog="workingHoursDialog"
        @close="closeWorkingDay"
      />
    </template>
    <v-divider class="mb-5"></v-divider>
    <v-btn
      depressed
      color="blue1"
      class="white--text d-flex align-center float-end"
      @click="contractData"
      :loading="savingEmployee"
      :disabled="savingEmployee"
    >
      Save
    </v-btn>
    <v-btn
      depressed
      color="#A1A1A1"
      outlined
      class="d-flex align-center float-end mr-2"
      @click="cancel"
    >
      Cancel
    </v-btn>
    <v-btn
      depressed
      color="blue1"
      class="white--text d-flex align-center float-left mr-2"
      @click="backStep"
    >
      Back
    </v-btn>
  </v-container>
</template>

<script>
import {
  getAllEstablishment,
  getAllFacilities,
  getAllOccupations,
} from "../../../util/services/sharedServices";
import { mapActions, mapGetters, mapMutations } from "vuex";
import AddWorkingDay from "../workingDays/AddWorkingDay/AddWorkingDay";

export default {
  name: "PersonalInformationForm",
  components: { AddWorkingDay },
  data() {
    return {
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      joiningDate: null,

      minDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      //minJoin date should be from the start of the current month and greater than the current date only
      minJoinDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      ).toISOString(),
      menu: false,
      modal: false,
      menu2: false,
      selected: null,
      renewableContract: null,
      establishments: [],
      facilities: [],
      facility: null,
      establishment: null,
      workingHoursDialog: false,
      shiftTemplate: null,
      allShiftTemplates: [],
      leaveTypes: [],
      selectedLeaveType: null,
      financialDetails: [
        {
          id: 1,
          name: "Basic Salary",
          checked: false,
        },
        {
          id: 2,
          name: "Transportation",
          checked: false,
        },
        {
          id: 3,
          name: "Housing",
          checked: false,
        },
        {
          id: 4,
          name: "Commissions",
          checked: false,
        },
        {
          id: 5,
          name: "Service Cut",
          checked: false,
        },
      ],
      roles: [],
      role: null,
      employmentTypes: [],
      selectedEmploymentType: null,
      occupations: [],
      selectedOccupation: null,
      periodStartMenu: false,
      periodEndMenu: false,
      periodEndDate: "",
      periodStartDate: "",
      sickLeaveBalance: "",
      personalLeaveBalance: "",
      businessLeaveBalance: "",
      leaveBalanceRules: [
        (v) => !!v || "Leave Balance is required",
        (v) => v > 0 || "Leave Balance must be greater than 0",
        (v) => v < 100 || "Leave Balance must be less than 100",
        (v) => v % 1 === 0 || "Leave Balance must be an integer",
      ],
    };
  },
  computed: {
    ...mapGetters({
      activeLanguage: "activeLanguage",
      inactiveLanguage: "inactiveLanguage",
      hrSettings: "getterForSettingsData",
      user: "user",
      shiftTemplates: "getterForShiftTemplateData",
      contract: "getContractDetails",
      savingEmployee: "getSaveEmployeeLoadingStatus",
    }),
  },
  methods: {
    ...mapActions(["actionForGetShiftTemplateApi", "createEmployee"]),
    ...mapMutations({
      setContarctInfo: "SET_CONTRACT_DATA",
    }),
    handleFinancial(i, value) {
      console.log(i, value);
      this.financialDetails = this.financialDetails.map((ele, index) => {
        if (index === i) {
          return {
            ...ele,
            checked: value ? value : false,
          };
        } else {
          return ele;
        }
      });
      // console.log(this.financialDetails)
    },
    show() {
      this.modal = true;
    },
    hide() {
      this.modal = false;
    },
    async contractData() {
      try {
        let contractInformation = {
          hrsMtProfileId: null,
          facility: {
            id: this.facility.id,
            name: this.facility.name,
          },
          joiningDate: this.joiningDate,
          renewable: this.renewableContract,
          employmentType: this.selectedEmploymentType,
          role: {
            id: this.role?.id ?? "id",
            name: this.role?.name ?? "name",
          },
          occupation: {
            id: this.selectedOccupation.id,
            name: this.selectedOccupation.name,
          },
          period: {
            from: this.periodStartDate,
            to: this.periodEndDate,
          },
          shiftTemplate: {
            id: this.shiftTemplate?.id,
            name: this.shiftTemplate?.name,
          },
          businessLeaves: +this.businessLeaveBalance,
          sickLeaves: +this.sickLeaveBalance,
          personalLeaves: +this.personalLeaveBalance,
          comession: this.financialDetails[3].checked,
          housing: this.financialDetails[2].checked,
          basicSalary: this.financialDetails[0].checked,
          transportation: this.financialDetails[1].checked,
          serviceCut: this.financialDetails[4].checked,
          createdBy: {
            user: {
              id: this.user.id,
              name: {
                [this.inactiveLanguage]: this.user.name[this.inactiveLanguage],
                [this.activeLanguage]: this.user.name[this.activeLanguage],
              },
            },
            system: "",
            channel: "",
          },
        };
        this.setContarctInfo({
          ...contractInformation,
        });
        await this.createEmployee();
      } catch (e) {
        console.log(e);
      }
    },
    async fetchEstablishments() {
      try {
        let response = await getAllEstablishment();
        let facilities = await getAllFacilities();
        this.occupations = await getAllOccupations();
        this.establishments = response.rows;
        this.facilities = facilities.rows;
        this.allShiftTemplates = this.shiftTemplates.rows;
        this.employmentTypes =
          this.hrSettings?.row?.settings[0]?.employmentType;
        this.roles = this.hrSettings?.row?.settings[0]?.role;
        console.log(this.occupations, "occupations");
        // this.occupations = this.hrSettings?.row?.settings[0]?.occupation;
        console.log(this.contract, "contract");
      } catch (e) {
        console.log(e, "error");
      }
    },
    openWorkingDayDialogue() {
      console.log("hi");
      this.workingHoursDialog = true;
    },
    closeWorkingDay() {
      this.workingHoursDialog = false;
    },
    backStep() {
      this.$emit("nextStep", 1);
    },
    cancel() {
      this.$emit("cancel");
    },
  },
  mounted() {
    try {
      this.fetchEstablishments();
      this.actionForGetShiftTemplateApi();
    } catch (e) {
      console.log(e, "error");
    }
  },
};
</script>

<style scoped></style>
