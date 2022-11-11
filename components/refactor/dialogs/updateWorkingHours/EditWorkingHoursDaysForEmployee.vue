<template>
  <v-row justify="center">
    <v-dialog v-model="editWorkingHoursDialog" persistent max-width="400">
      <v-card>
        <v-card-title class="card_title_dialog elevation-1">
          Edit Working Days
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="p-3">
          <v-col cols="12" md="12">
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
              class="white--text"
            >
              <v-icon left color="white">mdi-plus-circle</v-icon>
              Add Working Days
            </v-btn>
          </v-col>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="#A1A1A1"
            class="d-flex float-end mr-2"
            outlined
            @click="closeDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            @click="saveUpdates"
            color="blue1"
            class="white--text d-flex float-end"
            :loading="saving"
            :disabled="saving || !shiftTemplate"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <template v-if="workingHoursDialog">
      <AddWorkingDay
        :addWorkingDayDialog="workingHoursDialog"
        @close="closeWorkingDay"
      />
    </template>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AddWorkingDay from "../../workingDays/AddWorkingDay/AddWorkingDay";
import {
  getShiftTemplateService,
  updateContractInformationService,
} from "../../../../util/services/hrServices";
import Swal from "sweetalert2";

export default {
  name: "EditWorkingHoursDaysForEmployee",
  components: {
    AddWorkingDay,
  },

  props: {
    employee: {
      type: Object,
    },
    editWorkingHoursDialog: {
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
      saving: false,
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
    openWorkingDayDialogue() {
      console.log("hi");
      this.workingHoursDialog = true;
    },
    closeWorkingDay() {
      console.log("bye");
      this.workingHoursDialog = false;
    },
    async saveUpdates() {
      try {
        let alert = await Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, update it!",
        });
        if (alert.isConfirmed) {
          this.saving = true;
          console.log(this.shiftTemplate, "shiftTemplate");
          let shiftTemplateDTO = {
            recordId: this.employeeData.data.response[0].id,
            shiftTemplate: {
              id: this.shiftTemplate.id,
              name: this.shiftTemplate.shiftName,
            },
          };
          let updateShiftTemplateContract =
            await updateContractInformationService(shiftTemplateDTO);
          console.log(updateShiftTemplateContract, "updated");
          console.log(this.employeeData.data.response[0].id, "id employee");
          this.shiftTemplateId = this.shiftTemplate.id;
          let employeeId = this.employeeData.data.response[0].id;
          await this.actionForEmployeeDataApi({
            employee_id: employeeId ? employeeId : null,
          });
          this.saving = false;
          await Swal.fire({
            icon: "success",
            title: "Updated",
            text: "Working Days Updated Successfully",
            showConfirmButton: false,
            timer: 1500,
          });
          this.$emit("close");
        }
      } catch (e) {
        console.log(e);
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
        console.log(e);
      }
    },
    async renderData() {
      try {
        await this.actionForGetShiftTemplateApi();
        this.shiftTemplateId =
          this.employeeData.data.response[0].contract.shift_template.id;
        console.log("shiftTemplateId", this.shiftTemplateId);
        await this.fetchShiftTemplates();
        await this.fetchShiftTemplateForEmployee();
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

<style scoped>
.card_title_dialog {
  font-size: 20px;
  font-weight: bold;
  color: #194569;
  padding: 15px;
}
</style>
