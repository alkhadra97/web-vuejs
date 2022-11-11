<template>
  <v-card class="pa-5 mt-5 elevation-5">
    <v-row>
      <v-col md="12">
        <v-row>
          <v-col md="12">
            <LeaveTable :employeeId="employeeId" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import LeaveTable from "../tables/leaveTable.vue";
export default {
  components: { LeaveTable },
  props: {
    employeeId: {
      type: String,
    },
  },
};
</script>

<style scoped>
.showLeaveBtn {
  font-family: "CircularStd", sans-serif !important;

  background-color: #4dccc6;
  background-image: linear-gradient(315deg, #4dccc6 0%, #96e4df 74%);
  color: white;
  padding: 0.9em 1em !important;
  font-size: 0.7rem !important;
  cursor: pointer;
  outline-style: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
