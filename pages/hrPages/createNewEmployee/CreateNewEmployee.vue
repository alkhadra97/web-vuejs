<template>
  <div>
    <v-container>
      <v-row align="center" justify="center" style="height: 100vh">
        <v-col md="12">
          <AddEmployee />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import AddEmployee from "../../../components/refactor/forms/addEmployee.vue";
export default {
  layout: "dashboard",

  components: { AddEmployee },
};
</script>

<style scoped></style>
