<template>
  <v-row justify="center">
    <v-dialog v-model="WorkingHoursDialog" max-width="600">
      <v-card v-if="shiftTemplate">
        <v-card-title class="text-h5">
          {{ shiftTemplate.shiftName[activeLanguage] }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col md="6">
              <v-row
                class="d-flex justify-between align-center flex-row py-0 my-0"
              >
                <v-col
                  cols="12"
                  md="12"
                  v-for="(day, index) in shiftTemplate.shiftTemplateDays"
                  class="py-0 my-0"
                >
                  <span class="text-h6 blue2--text">
                    {{ day.day[activeLanguage] }}
                  </span>
                </v-col>
              </v-row>
            </v-col>
            <v-col md="6">
              <v-row
                class="d-flex justify-between align-center flex-row py-0 my-0"
              >
                <v-col
                  cols="12"
                  md="12"
                  v-for="(time, index) in shiftTemplate.shiftTemplateDays"
                  class="py-0 my-0"
                >
                  <!--                 show time as chips -->
                  <v-chip class="mr-2" v-for="hour in time.time">
                    <v-icon left v-if="hour.from"> mdi-alarm-check </v-icon>
                    <template>
                      <span v-if="hour"> {{ hour.from }} - {{ hour.to }} </span>
                    </template>
                  </v-chip>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            depressed
            color="blue1"
            class="white--text"
            @click="closeDialog"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else>
        <v-card-text> No Working Hours Found For This Employee ! </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import { getShiftTemplateService } from "../../../../util/services/hrServices";
export default {
  name: "WorkingHoursDaysForEmployee",
  props: {
    employee: {
      type: Object,
    },
    WorkingHoursDialog: {
      type: Boolean,
    },
  },
  data() {
    return {
      dialog: false,
      shiftTemplate: null,
      allShiftTemplates: [],
      workingHoursDialog: false,
      employeeWorkingHours: [],
      employeeDataValues: [],
      shiftTemplateId: null,
    };
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
  methods: {
    ...mapActions(["actionForGetShiftTemplateApi", "actionForEmployeeDataApi"]),

    closeDialog() {
      this.$emit("close");
    },
    async fetchShiftTemplates() {
      try {
        this.allShiftTemplates = this.shiftTemplates.rows;
      } catch (e) {
        console.log(e, "error");
      }
    },
    async fetchShiftTemplateForEmployee() {
      try {
        //fetch shift template for employee
        let shiftTemplateId = this.shiftTemplateId;
        let shiftTemplate = await getShiftTemplateService({
          id: [shiftTemplateId],
        });
        console.log(shiftTemplate?.rows[0], "shiftTemplate");
        this.shiftTemplate = shiftTemplate?.rows[0];
        console.log(this.shiftTemplate);
      } catch (e) {
        console.log(e, "error");
      }
    },
    async renderData() {
      try {
        console.log(  this.employeeData)
        await this.actionForGetShiftTemplateApi();
        this.shiftTemplateId =
          this.employeeData.data.response[0].contract.shift_template.id;
        console.log("shiftTemplateId", this.shiftTemplateId);
        let employeeId = this.employeeData.data.response[0].id;
        await this.fetchShiftTemplates();
        await this.fetchShiftTemplateForEmployee();
        await this.actionForEmployeeDataApi({
          employee_id: employeeId ? employeeId : null,
        });
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {
    try {
      this.renderData();

    } catch (e) {
      console.log(e, "error");
    }
  },
};
</script>

<style scoped></style>
