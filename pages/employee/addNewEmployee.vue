<template>
  <v-container fluid>
    <!--  add tabs at left with three cols -->
    <v-col cols="12">
      <!--       </v-row>-->
      <v-row>
        <v-col
          style="height: 100vh"
          class="d-flex flex-column justify-center align-center p-10"
          md="3"
        >

          <!--       show vertical tabs -->
          <v-tabs vertical background-color="#DBECF4">
            <h1 class="blue1--text font-weight-bold text-center mt-5">
              Add Employee
            </h1>
            <!-- if the step equal to the item.id make the tabe active -->

            <v-tab
              v-for="item in steps"
              :key="item.id"
              :href="item.href"
              class="mt-12"
              :active="step == item.id"

              @click="step = item.id"
            >
              <v-icon class="mr-2"> {{ item.icon }}</v-icon>
              <span class="title"> {{ item.title }}</span>
            </v-tab>
          </v-tabs>
        </v-col>
        <v-divider vertical light> </v-divider>
        <!--       show tabs content -->
        <v-col md="8" class="ml-10">
          <template v-if="step == 1">
            <PersonalInformationForm @nextStep="nextStep" @cancel="cancel"  @validate=validate />
          </template>
          <template v-if="step == 2">
            <EmploymentDetailsForm @nextStep="nextStep" @cancel="cancel" @validate=validate />
          </template>
        </v-col>
      </v-row>
    </v-col>
    <!--      add card with tab title at right with nine cols-->
  </v-container>
</template>

<script>
import AddEmployeeSteps from "../../components/refactor/addEmployee/addEmployeeSteps";
import EmploymentDetailsForm from "../../components/refactor/addEmployee/EmploymentDetailsForm";
import PersonalInformationForm from "../../components/refactor/addEmployee/PersonalInformationForm";
import { mapActions, mapGetters } from "vuex";
import { validate } from "json-schema";
export default {
  name: "addNewEmployee",
  components: {
    PersonalInformationForm,
    EmploymentDetailsForm,
    AddEmployeeSteps,
  },
  layout: "dashboard",
  data() {
    return {
      step: 1,
      steps: [
        {
          id: 1,
          title: "Personal Information",
          icon: "mdi-account",
          component: "personalInformation",
        },
        {
          id: 2,
          title: "Contact Information",
          icon: "mdi-phone",
          component: "contactInformation",
        },
      ],
      currentStep: 1,
      completedSteps: [],
      valid: false,
    };
  },
  computed: {
    ...mapGetters({
      activeLanguage: "activeLanguage",
      inactiveLanguage: "inactiveLanguage",
      hrSettings: "getterForSettingsData",
      user: "user",
      shiftTemplates: "getterForShiftTemplateData",
    }),
  },
  methods: {
    ...mapActions([
      "actionForGetShiftTemplateApi",
      "actionForGetSettingsDataApi",
    ]),
    nextStep(data) {
      try {
        console.log(data, "step");
        this.step = data;
        //if step equal 2 make the tabe
        console.log(this.step, "ssssss");
      } catch (e) {
        console.log(e);
      }
    },
    validate(state) {
      console.log(state, "state");
      this.valid = state.validate;
    },
    cancel() {
      this.$router.push({
        path: "/Hrdashboard",
      });
    },
  },
  mounted() {
    try {
      this.actionForGetShiftTemplateApi();
      this.actionForGetSettingsDataApi();
    } catch (e) {
      console.log(e);
    }
  },
  watch: {},
};
</script>

<style scoped lang="scss">
.circle {
  display: inline-block;
  width: 1.5em;
  height: 1.5em;
  line-height: 1.5em;
  text-align: center;
  border-radius: 50%;
  background-color: #e30808;
  color: #fff;
  font-size: 1.2em;
  font-weight: 700;
  transition: all 0.3s ease;
}
</style>
