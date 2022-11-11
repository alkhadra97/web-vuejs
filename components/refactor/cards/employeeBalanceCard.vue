<template>
  <div>
    <v-card class="pa-4 mb-3 elevation-5s">
      <v-col md="12" class="mb-3">
        <div>
          <v-col md="12">
            <v-row class="flex-column justify-center align-center mt-1">
              <img
                class="employee-profile-img"
                src="https://drive.google.com/uc?export=view&id=1PYGAhWqnnbIc3uO4ngMLa5tbxFNiyI6l"
                alt="employee image"
              />
              <p class="profile_card_title">Leave Balance</p>
            </v-row>
          </v-col>
          <v-col md="12">
            <v-row class="justify-center align-center">
              <v-col md="4">
                <p class="text-center">
                  <span
                    class="font-weight-black"
                    v-if="balance.employeeContract.businessLeaves !== null"
                    >{{ balance.employeeContract.businessLeaves }}</span
                  >
                  <span class="font-weight-black" v-else>N/A</span>
                  Business
                </p>
              </v-col>
              <v-col md="4">
                <p class="text-center">
                  <span
                    class="font-weight-black"
                    v-if="balance.employeeContract.personalLeaves !== null"
                    >{{ balance.employeeContract.personalLeaves }}</span
                  >
                  <span class="font-weight-black" v-else>N/A</span>
                  Personal
                </p>
              </v-col>
              <v-col md="4">
                <p class="text-center">
                  <span
                    class="font-weight-black"
                    v-if="balance.employeeContract.sickLeaves !== null"
                    >{{ balance.employeeContract.sickLeaves }}</span
                  >
                  <span class="font-weight-black" v-else>N/A</span>
                  Sick
                </p>
              </v-col>
            </v-row>
          </v-col>
        </div>
      </v-col>
    </v-card>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  components: {},

  props: {
    balance: {
      type: Object,
    },
  },

  data() {
    return {};
  },
  methods: {
    ...mapActions([]),
  },
  computed: {
    ...mapGetters([]),
  },
  mounted() {
    try {
    } catch (error) {
      console.log(error);
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
