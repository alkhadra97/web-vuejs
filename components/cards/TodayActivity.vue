<template>
  <div v-if="dataReady">
    <v-card width="280" class="mt-5 elevation-5">
      <v-card-title> Today's Activity </v-card-title>
      <v-card-text>
        <div
          v-for="(item, index) in getAllTimeAttendanceInfo.data.reverse()"
          :key="index"
        >
          <template v-if="item.date == todaysDate">
            <p class="font-weight-black my-0">Check In at</p>
            <p class="font-weight-normal my-0 teal--text">
              {{ item.checkIn }}
            </p>
            <template v-if="item.checkOut != null">
              <p class="font-weight-black my-0">Check Out at</p>
              <p class="font-weight-normal my-0">
                {{ item.checkOut }}
              </p>
            </template>
          </template>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  props: {
    employeeUuid: {
      type: String,
    },
  },
  async mounted() {
    await this.actionForGettingAllTimeAttendance({
      uuid: this.employeeUuid,
      date: null,
    });
    this.dataReady = true;
  },
  data() {
    return {
      dataReady: false,

      todaysDate: new Date().toISOString().slice(0, 10),
    };
  },
  methods: {
    ...mapActions(["actionForGettingAllTimeAttendance"]),
  },
  computed: {
    ...mapGetters(["getAllTimeAttendanceInfo"]),
    // timeAttendanceArrayFiltred() {
    //   return this.getAllTimeAttendanceInfo.data.reverse().map((item) => {
    //     return item;
    //   });
    // },
  },
};
</script>

<style scoped></style>
