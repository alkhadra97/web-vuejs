<template>
  <div class="tableContainer" v-if="workingHoursTableData">
    <v-data-table
      :headers="headers || []"
      :items="workingHoursTableData"
      class="elevation-1"
      height="600px"
      single-select
      no-data
    >
      <template v-slot:item.shiftName="{ item }">
        <p>
          {{
            item.shiftName[activeLanguage] || item.shiftName[inactiveLanguage]
          }}
        </p>
      </template>
      <template v-slot:item.shiftType="{ item }">
        <p>
          {{ item.shiftType.name[activeLanguage] }}
        </p>
      </template>
      <template v-slot:item.Sunday="{ item }">
        <p v-if="item.Sunday.time[0].from">
          {{ item.Sunday.time[0].from }} - {{ item.Sunday.time[0].to }}
        </p>
        <p v-else>--</p>
      </template>
      <template v-slot:item.Saturday="{ item }">
        <p v-if="item.Saturday.time[0].from">
          {{ item.Sunday.time[0].from }} - {{ item.Saturday.time[0].to }}
        </p>
        <p v-else>--</p>
      </template>
      <template v-slot:item.Monday="{ item }">
        <p v-if="item.Monday.time[0].from">
          {{ item.Monday.time[0].from }} - {{ item.Monday.time[0].to }}
        </p>
        <p v-else>--</p>
      </template>
      <template v-slot:item.Monday="{ item }">
        <p v-if="item.Monday.time[0].from">
          {{ item.Monday.time[0].from }} - {{ item.Monday.time[0].to }}
        </p>
        <p v-else>--</p>
      </template>
      <template v-slot:item.Tuesday="{ item }">
        <p v-if="item.Tuesday.time[0].from">
          {{ item.Tuesday.time[0].from }} - {{ item.Tuesday.time[0].to }}
        </p>
        <p v-else>--</p>
      </template>
      <template v-slot:item.Wednesday="{ item }">
        <p v-if="item.Wednesday.time[0].from">
          {{ item.Wednesday.time[0].from }} - {{ item.Wednesday.time[0].to }}
        </p>
        <p v-else>--</p>
      </template>
      <template v-slot:item.Thursday="{ item }">
        <p v-if="item.Thursday.time[0].from">
          {{ item.Thursday.time[0].from }} - {{ item.Thursday.time[0].to }}
        </p>
        <p v-else>--</p>
      </template>
      <template v-slot:item.Friday="{ item }">
        <p v-if="item.Friday.time[0].from">
          {{ item.Friday.time[0].from }} - {{ item.Friday.time[0].to }}
        </p>
        <p v-else>--</p>
      </template>
      <template v-slot:item.id="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editWorkingHours(item)"
          color="primary"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          class="mr-2"
          @click="deleteWorkingHours(item.id)"
          color="error"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { templatesHeaders } from "../WorkingHoursTable/templateHeaders";
import { deleteShiftTemplate } from "../../../../util/services/hrServices";
import Swal from "sweetalert2";
export default {
  name: "WorkingHoursTable",
  props: {
    shiftTemplates: Array,
  },
  computed: {
    ...mapGetters({
      activeLanguage: "activeLanguage",
      inactiveLanguage: "inactiveLanguage",
      hrSettings: "getterForSettingsData",
      shiftTemplates: "getterForShiftTemplateData",
    }),
  },
  data() {
    return {
      loading: false,
      workingHoursTableData: null,
      headers: [],
      days: "",
    };
  },
  methods: {
    ...mapActions(["actionForGetShiftTemplateApi"]),
    getDayName(day) {
      return day.name[this.activeLanguage] || day.name[this.inactiveLanguage];
    },
    async getData() {
      try {
        console.log(this.shiftTemplates, "shiftTemplatesshiftTemplates");
        const workingHour = this.shiftTemplates?.rows || null;
        console.log(workingHour, "workingHour");
        //loop through workingHour and create a new object
        let workingHoursTableData = [];
        workingHour.forEach((item) => {
          const obj = {
            shiftName: item.shiftName,
            shiftType: item.shiftType,
            Saturday: item.shiftTemplateDays[0],
            Sunday: item.shiftTemplateDays[1],
            Monday: item.shiftTemplateDays[2],
            Tuesday: item.shiftTemplateDays[3],
            Wednesday: item.shiftTemplateDays[4],
            Thursday: item.shiftTemplateDays[5],
            Friday: item.shiftTemplateDays[6],
          };
          workingHoursTableData.push(obj);
        });
        console.log(workingHoursTableData, "workingHoursTableData");
        this.workingHoursTableData = workingHoursTableData;
        this.headers = templatesHeaders;

        // workingHour &&
        //   workingHour.shiftTemplateDays.forEach((ele, i) => {
        //     workingHour[ele.day.en] = ele;
        //   });
        // console.log("hr shift", workingHour);
        // this.workingHoursTableData = [workingHour];
      } catch (e) {
        console.log(e, "working hours table for templates error");
      }
    },
    async deleteWorkingHours(id) {
      try {
        let alert = Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        });
        if ((await alert).isConfirmed) {
          let deleteShift = await deleteShiftTemplate({
            id: id,
          });
          console.log(deleteShift, "deleteShift");
          await Swal.fire({
            icon: "success",
            title: "Deleted",
            text: "Shift Template Deleted Successfully",
            showConfirmButton: false,
            timer: 1500,
          });
          await this.actionForGetShiftTemplateApi();
        }
      } catch (e) {
        console.log(e, "delete working hours error");
      }
      // this.$emit("deleteWorkingHours", id);
    },
    editWorkingHours(id) {
      console.log(id);
    },
  },
  mounted() {
    try {
      this.days = this.shiftTemplates?.rows[0]?.shiftTemplateDays;
      this.getData();
      console.log(this.headers, "headers");
    } catch (e) {
      console.log(e);
    }
  },
  watch: {
    shiftTemplates() {
      this.getData();
    },
  },
};
</script>

<style scoped>
.tableContainer {
  width: 95%;
  margin: auto;
}
</style>
