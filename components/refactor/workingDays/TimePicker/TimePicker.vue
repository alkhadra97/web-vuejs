<template>
  <v-container>
    <v-col md="3"> </v-col>
    <v-col md="3" class="py-0 my-0">
      <h4 class="py-0 my-0">
        {{ day.name[activeLanguage] }}
      </h4>
    </v-col>
    <v-row class="mt-2">
      <v-col md="4" class="py-0 my-0">
        <v-menu
          ref="menu"
          v-model="startHourMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="startTime"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
          :disabled="type.id == 1 || disabled"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="startTime"
              prepend-icon="mdi-clock-time-four-outline"
              readonly
              label="Start Time"
              v-bind="attrs"
              :disabled="type.id == 1 || disabled"
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="startHourMenu"
            v-model="startTime"
            full-width
            :disabled="type.id == 1 || disabled"
            @click:minute="$refs.menu.save(startTime)"
          ></v-time-picker>
        </v-menu>
      </v-col>
      <v-col md="4" class="py-0 my-0">
        <v-menu
          ref="endHourMenu"
          v-model="endHourMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="endTime"
          transition="scale-transition"
          offset-y
          :disabled="type.id == 1 || disabled"
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="endTime"
              prepend-icon="mdi-clock-time-four-outline"
              readonly
              v-bind="attrs"
              :disabled="type.id == 1 || disabled"
              label="End Time"
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="endHourMenu"
            v-model="endTime"
            full-width
            :disabled="type.id == 1 || disabled"
            @click:minute="$refs.endHourMenu.save(endTime)"
          ></v-time-picker>
        </v-menu>
      </v-col>
      <v-col md="4" class="d-flex justify-end" v-if="type.id == 2">
        <v-btn class="blue1 white--text" @click="addHours"> Add Hours </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="toggle && type.id !== 1">
      <v-col md="4" class="py-0 my-0">
        <v-menu
          ref="startHourMenuExtra"
          v-model="startHourMenuExtra"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="startTimeExtra"
          transition="scale-transition"
          offset-y
          :disabled="type.id == 1 || disabled"
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="startTimeExtra"
              prepend-icon="mdi-clock-time-four-outline"
              readonly
              v-bind="attrs"
              v-on="on"
              :disabled="type.id == 1 || disabled"
              label="Start Time"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="startHourMenuExtra"
            v-model="startTimeExtra"
            :disabled="type.id == 1 || disabled"
            full-width
            @click:minute="$refs.startHourMenuExtra.save(startTimeExtra)"
          ></v-time-picker>
        </v-menu>
      </v-col>
      <v-col md="4" class="py-0 my-0">
        <v-menu
          ref="endHourMenuExtra"
          v-model="endHourMenuExtra"
          :disabled="type.id == 1 || disabled"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="endTimeExtra"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="endTimeExtra"
              prepend-icon="mdi-clock-time-four-outline"
              readonly
              :disabled="type.id == 1 || disabled"
              v-bind="attrs"
              label="End Time"
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
            v-model="endTimeExtra"
            full-width
            :disabled="type.id == 1 || disabled"
            @click:minute="$refs.endHourMenuExtra.save(endTimeExtra)"
          ></v-time-picker>
        </v-menu>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "TimePicker",
  props: {
    day: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    type: {
      type: Object,
      required: true,
    },
    fixedStartHours: {
      type: String,
      required: true,
    },
    fixedEndHours: {
      type: String,
      required: true,
    },
    hoursPerDay: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      startHourMenu: false,
      endHourMenu: false,
      startTime: "",
      endTime: "",
      toggle: false,
      secondMenuExtra: false,
      thirdMenuExtra: false,
      startHourExtra: "",
      endHourExtra: "",
      startHourMenuExtra: false,
      endHourMenuExtra: false,
      startTimeExtra: "",
      endTimeExtra: "",
      disabled: false,
    };
  },
  computed: {
    ...mapGetters({
      activeLanguage: "activeLanguage",
      inactiveLanguage: "inactiveLanguage",
      hrSettings: "getterForSettingsData",
      days: "getterForDays",
    }),
  },
  mounted() {
    try {
      this.selectDay();
    } catch (e) {
      console.log(e);
    }
  },
  methods: {
    ...mapMutations({
      changeDaysData: "CHANGE_DAY_VALUES",
    }),
    addHours() {
      this.toggle = true;
    },
    selectDay() {
      try {
        if (this.days[this.index]) {
          this.disabled = this.days[this.index].selected;
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
  watch: {
    startTime() {
      console.log(this.startTime, "start time");
      console.log(this.days);
      const afterEdit = this.days.map((ele, i) => {
        console.log("index", this.index);
        if (i === this.index) {
          return {
            ...ele,
            time: [
              {
                from: this.startTime,
                to: this.endTime,
              },
            ],
            selected: this.days[this.index].selected,
          };
        } else {
          return ele;
        }
      });
      console.log("===================================");
      console.log("afterEdit startTime", afterEdit);
      console.log("===================================");
      this.changeDaysData(afterEdit);
      // console.log(this.days, "days after change");
    },
    endTime() {
      const afterEdit = this.days.map((ele, i) => {
        console.log("index", this.index);
        if (i === this.index) {
          return {
            ...ele,
            time: [
              {
                from: this.startTime,
                to: this.endTime,
              },
            ],
            selected: this.days[this.index].selected,
          };
        } else {
          return ele;
        }
      });
      console.log("===================================");

      console.log("afterEdit endTime", afterEdit);
      this.changeDaysData(afterEdit);

      console.log("===================================");
    },
    startTimeExtra() {
      const afterEdit = this.days.map((ele, i) => {
        console.log("index", this.index);
        if (i === this.index) {
          return {
            ...ele,
            time: [
              {
                from: this.startTime,
                to: this.endTime,
              },
              {
                from: this.startTimeExtra,
                to: this.endTimeExtra,
              },
            ],
            selected: this.days[this.index].selected,
          };
        } else {
          return ele;
        }
      });
      console.log("===================================");

      console.log("afterEdit startTimeExtra", afterEdit);
      this.changeDaysData(afterEdit);

      console.log("===================================");
    },
    endTimeExtra() {
      const afterEdit = this.days.map((ele, i) => {
        console.log("index", this.index);
        if (i === this.index) {
          return {
            ...ele,
            time: [
              {
                from: this.startTime,
                to: this.endTime,
              },
              {
                from: this.startTimeExtra,
                to: this.endTimeExtra,
              },
            ],
            selected: this.days[this.index].selected,
          };
        } else {
          return ele;
        }
      });
      console.log("===================================");
      console.log("afterEdit endTimeExtra", afterEdit);
      this.changeDaysData(afterEdit);

      console.log("===================================");
    },
    fixedStartHours() {
      this.startTime = this.fixedStartHours;
    },
    fixedEndHours() {
      this.endTime = this.fixedEndHours;
    },
    days() {
      this.selectDay();
    },
    // type() {
    //   this.selectDay();
    // },
  },
};
</script>

<style scoped></style>
