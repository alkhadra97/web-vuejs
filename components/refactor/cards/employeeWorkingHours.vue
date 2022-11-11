<template>
  <div>
    <v-card class="pa-3 mb-3 elevation-5s">
      <v-col md="12" class="mb-3">
        <div>
          <v-row class="flex-column justify-center align-end mt-1">
            <v-icon
              class="edit-icon"
              @click="openEditWorkingHoursDialog"
              color="blue-1 lighten-1"
              >mdi-pencil</v-icon
            >
          </v-row>
          <v-col md="12" @click="openWorkingHoursDialog">
            <v-row class="flex-column justify-center align-center mt-1">
              <img
                class="employee-profile-img"
                src="https://drive.google.com/uc?export=view&id=1dJVJPKztCfeV2pUQZI0nHmkvkY2TbuKw"
                alt="employee image"
              />
              <p class="profile_card_title">Working Hours</p>
            </v-row>
          </v-col>
          <v-col md="12">
            <v-row class="justify-center align-center">
              <v-col md="12">
                <p class="text-center" v-if="todayWorkingHour">
                  <template v-for="(time, i) in todayWorkingHour">
                    {{ time.from }} - {{ time.to }}
                  </template>
                  <!--                  -->
                </p>
              </v-col>
            </v-row>
          </v-col>
        </div>
      </v-col>
    </v-card>
    <template v-if="WorkingHoursDialog">
      <WorkingHoursDaysForEmployee
        :WorkingHoursDialog="WorkingHoursDialog"
        @close="closeWorkingHoursDialog"
      />
    </template>
    <template v-if="editWorkingHoursDialog">
      <EditWorkingHoursDaysForEmployee
        :editWorkingHoursDialog="editWorkingHoursDialog"
        @close="closeEditWorkingHoursDialog"
      />
    </template>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import EditWorkingHoursDaysForEmployee from "../dialogs/updateWorkingHours/EditWorkingHoursDaysForEmployee.vue";
import WorkingHoursDaysForEmployee from "../dialogs/updateWorkingHours/WorkingHoursDaysForEmployee.vue";
export default {
  components: {
    WorkingHoursDaysForEmployee,
    EditWorkingHoursDaysForEmployee,
  },
  name: "employeeWorkingHours",
  props: {
    todayWorkingHour: {
      type: Array,
      default: [],
    },
  },

  data() {
    return {
      editWorkingHoursDialog: false,
      WorkingHoursDialog: false,
    };
  },
  methods: {
    ...mapActions(["actionForEmployeeDataApi"]),

    updateWorkingHours() {
      console.log("update");
    },
    openWorkingHoursDialog() {
      this.WorkingHoursDialog = false;
      setTimeout(() => {
        this.WorkingHoursDialog = true;
      }, 30);
    },
    openEditWorkingHoursDialog() {
      this.editWorkingHoursDialog = false;
      setTimeout(() => {
        this.editWorkingHoursDialog = true;
      }, 30);
    },
    closeWorkingHoursDialog() {
      this.WorkingHoursDialog = false;
    },
    closeEditWorkingHoursDialog() {
      this.editWorkingHoursDialog = false;
    },
    async render() {
      try {
        await this.actionForEmployeeDataApi();
      } catch (e) {
        console.log(e);
      }
    },
  },
  computed: {
    ...mapGetters({
      activeLanguage: "activeLanguage",
      inactiveLanguage: "inactiveLanguage",
      user: "user",
      shiftTemplates: "getterForShiftTemplateData",
      employeeData: "getterForEmployeeData",
    }),
  },

  mounted() {
    try {
      this.render();
    } catch (e) {
      console.log(e);
    }
  },
  watch: {},
};
</script>
<style scoped>
.profile_card_title {
  font-size: 1.3824rem;
  line-height: 2em;
  color: black;
  margin-top: 1em auto;
}

.employee-profile-img {
  cursor: pointer;
  height: 10vh;
  border-radius: 50%;
}
</style>
