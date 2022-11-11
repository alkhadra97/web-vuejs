<template>
  <v-card class="pa-4 mb-3 elevation-5" width="444" height="345">
    <v-card-title class="mb-0 py-0 justify-center">
      <p class="hours-card-title">Mood Tracker</p>
    </v-card-title>
    <v-container style="height: 400px">
      <v-row class="fill-height" align-content="center" justify="center">
        <v-col class="text-subtitle-1 text-center" cols="12">
          <p class="bold">coming soon</p>
        </v-col>
        <v-col cols="6">
          <v-progress-linear
            color="blue darken-2"
            indeterminate
            rounded
            height="6"
          ></v-progress-linear>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {};
</script>

<style scoped>
.hours-card-title {
  font-size: 1.3824rem;
  line-height: 2em;
  color: #194569;
  margin-top: 1em auto;
}
.employee-profile-img {
  cursor: pointer;
  height: 50vh;
  border-radius: 50%;
}
</style>
