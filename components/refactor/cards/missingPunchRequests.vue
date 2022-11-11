<template>
  <v-card class="pa-5 mt-5 elevation-5">
    <v-row>
      <v-col md="12">
        <v-divider class="mx-4"></v-divider>
        <v-row>
          <v-col md="12">
            <MissingPunchTable :employeeId="employeeId" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import MissingPunchTable from "../tables/missingPunchTable.vue";
export default {
  props: {
    employeeId: {
      type: String,
    },
  },
  components: { MissingPunchTable },
};
</script>

<style scoped></style>
