<template>
  <div class="name-center">
    <v-dialog v-model="addWorkingDayDialog" width="1065" persistent>
      <template>
        <v-stepper v-model="e1">
          <div class="card_title_dialog elevation-2">
            <h2>Add Working Day</h2>
          </div>
          <v-divider></v-divider>
          <v-stepper-header class="elevation-0 d-flex justify-cen ter w-50">
            <v-stepper-step color="blue1" :complete="e1 > 1" step="1">
              Details & Links
            </v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="e1 > 2" step="2" color="blue1">
              Select Hours
            </v-stepper-step>
          </v-stepper-header>
          <v-stepper-items>
            <v-stepper-content step="1">
              <v-card class="mb-12 p-5 elevation-0" height="200px">
                <v-row>
                  <v-col md="6">
                    <v-text-field
                      v-model="name"
                      label="Name"
                      outlined
                      dense
                      class="mt-5"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col md="6">
                    <v-select
                      v-model="establishment"
                      :items="establishments"
                      label="Establishment"
                      outlined
                      dense
                      class="mt-5"
                      :item-text="`name[${activeLanguage}]`"
                      item-value="id"
                      return-object
                    ></v-select>
                  </v-col>
                  <v-col md="6">
                    <v-select
                      v-model="facility"
                      :items="facilities"
                      label="Facility"
                      outlined
                      dense
                      class="mt-5"
                      :item-text="`name[${activeLanguage}]`"
                      return-object
                    ></v-select>
                  </v-col>
                </v-row>
              </v-card>

              <v-btn
                @click="e1 = 2"
                color="blue1"
                :disabled="!name || !establishment || !facility"
                class="white--text d-flex float-end"
              >
                <v-icon>mdi-arrow-right</v-icon>
                Next
              </v-btn>
              <v-btn
                color="#A1A1A1"
                class="d-flex float-end mr-2"
                outlined
                @click="close"
              >
                Cancel
              </v-btn>
            </v-stepper-content>
            <v-stepper-content step="2">
              <v-card class="mb-12 elevation-0">
                <v-row>
                  <v-col md="12">
                    <v-row>
                      <v-col md="6">
                        <v-row>
                          <v-col md="6">
                            <h4 class="blue1--text">Working Hours per Days</h4>
                            <v-radio-group row class="mt-5">
                              <v-radio
                                color="blue1"
                                @change="changeWorkingHoursType(type)"
                                v-for="type in types"
                                :key="type.id"
                                :label="type.name[activeLanguage]"
                                :value="type"
                                :required="true"
                              ></v-radio>
                            </v-radio-group>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col md="12">
                            <h4 class="blue1--text">Select Working Days</h4>
                            <v-chip-group
                              multiple
                              active-class="blue3 white--text"
                            >
                              <v-chip
                                color="blue1"
                                class="white--text"
                                v-for="(day, index) in workingDays"
                                :key="day.id"
                                @click="selectDay(index)"
                              >
                                {{ day.abbreviation[activeLanguage] }}
                              </v-chip>
                            </v-chip-group>
                          </v-col>
                          <v-col md="6"> </v-col>
                        </v-row>
                        <v-row v-if="type.id == 1">
                          <v-col md="12" class="p-4">
                            <v-row
                              v-if="type.id == 1"
                              class="d-flex justify-between align-center flex-row"
                            >
                              <h4 class="ml-3 blue1--text">Hours Per Day</h4>
                              <v-col md="3">
                                <v-text-field
                                  v-model="hoursPerDay"
                                  label="Hours"
                                  outlined
                                  dense
                                  number
                                  :disabled="true"
                                  class="mt-5"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col md="6">
                                <v-menu
                                  ref="menu"
                                  v-model="menu2"
                                  :close-on-content-click="false"
                                  :nudge-right="40"
                                  :return-value.sync="fixedStartHours"
                                  transition="scale-transition"
                                  offset-y
                                  max-width="290px"
                                  min-width="290px"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                      v-model="fixedStartHours"
                                      label="Start Time "
                                      prepend-icon="mdi-clock-time-four-outline"
                                      readonly
                                      v-bind="attrs"
                                      v-on="on"
                                    ></v-text-field>
                                  </template>
                                  <v-time-picker
                                    v-if="menu2"
                                    v-model="fixedStartHours"
                                    full-width
                                    @click:minute="
                                      $refs.menu.save(fixedStartHours)
                                    "
                                  ></v-time-picker>
                                </v-menu>
                              </v-col>
                              <v-col md="6">
                                <v-menu
                                  ref="endHourRef"
                                  v-model="menu3"
                                  :close-on-content-click="false"
                                  :nudge-right="40"
                                  :return-value.sync="endHour"
                                  transition="scale-transition"
                                  offset-y
                                  max-width="290px"
                                  min-width="290px"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                      v-model="endHour"
                                      label="End Time"
                                      prepend-icon="mdi-clock-time-four-outline"
                                      readonly
                                      v-bind="attrs"
                                      v-on="on"
                                    ></v-text-field>
                                  </template>
                                  <v-time-picker
                                    v-if="menu3"
                                    v-model="endHour"
                                    full-width
                                    @click:minute="
                                      $refs.endHourRef.save(endHour)
                                    "
                                  ></v-time-picker>
                                </v-menu>
                              </v-col>
                            </v-row>
                            <v-row>
                              <!--                              add break duration input with time format-->
                              <v-col md="6">
                                <v-text-field
                                  v-model="breakDuration"
                                  label="Break Duration in Minutes"
                                  outlined
                                  :rules="breakDurationRules"
                                  dense
                                  hide-details
                                  single-line
                                  :required="true"
                                  type="number"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col md="6">
                        <h4 class="blue1--text">Working Hours</h4>
                        <v-row>
                          <v-col
                            md="12"
                            v-for="(day, index) in workingDays"
                            class="py-0 my-0"
                          >
                            <v-row
                              v-if="day"
                              class="d-flex justify-between align-center flex-row py-0 my-0"
                            >
                              <TimePicker
                                :day="day"
                                :index="index"
                                :type="type"
                                :hoursPerDay="hoursPerDay"
                                :breakDuration="breakDuration"
                                :fixedStartHours="fixedStartHours"
                                :fixedEndHours="endHour"
                                :activeLanguage="activeLanguage"
                                :selectedDays="selectedDays"
                              />
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card>
              <v-btn @click="e1 = 1" color="blue1" class="white--text">
                Back
              </v-btn>
              <v-btn
                @click="createWorkingHours"
                color="blue1"
                class="white--text d-flex float-end"
              >
                Save
              </v-btn>
              <v-btn
                color="#A1A1A1"
                class="d-flex float-end mr-2"
                outlined
                @click="close"
              >
                Cancel
              </v-btn>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </template>
    </v-dialog>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import {
  getAllEstablishment,
  getAllDays,
  getAllFacilities,
} from "../../../../util/services/sharedServices";

import { addShiftTemplate } from "../../../../util/services/hrServices";
import { mapActions, mapGetters } from "vuex";
import TimePicker from "../TimePicker/TimePicker";
import { mapMutations } from "vuex";

export default {
  name: "AddWorkingDay",
  components: { TimePicker },
  props: {
    addWorkingDayDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      time: null,
      menu2: false,
      menu3: false,
      modal2: false,
      breakDurationRules: [(v) => !!v || "Break Duration is required"],
      e1: 1,
      name: "",
      types: [],
      fixedStartHours: "",
      establishment: "",
      establishments: [],
      facility: "",
      secondMenuStartHour: false,
      facilities: [],
      type: {
        id: 1,
        name: {
          ar: "ثابت",
          en: "fixed",
        },
      },
      allDays: [],
      times: [],
      days: [],
      selectedDays: [],
      hoursPerDay: "",
      startHour: "",
      endHour: "",
      breakDuration: "",
    };
  },
  computed: {
    ...mapGetters({
      activeLanguage: "activeLanguage",
      inactiveLanguage: "inactiveLanguage",
      hrSettings: "getterForSettingsData",
      workingDays: "getterForDays",
      user: "user",
      employeeData: "getterForEmployeeData",
    }),
  },
  methods: {
    ...mapMutations(["CHANGE_DAY_VALUES"]),
    ...mapActions({
      fetchAllShiftTemplates: "actionForGetShiftTemplateApi",
    }),
    changeWorkingHoursType(type) {
      this.type = type;
    },
    async createWorkingHours() {
      try {
        let days = this.workingDays;
        days = days.map((day, index) => {
          if (day.selected) {
            return {
              ...day,
              time: [
                {
                  from: null,
                  to: null,
                },
              ],
            };
          } else {
            return day;
          }
        });
        let shiftTemplateDTO = {
          shiftName: {
            [this.activeLanguage]: this.name,
            [this.inactiveLanguage]: this.name,
          },
          shiftType: this.type,
          facility: {
            id: this.facility.id,
            name: this.facility.name,
          },
          breakDuration: this.breakDuration * 60,
          shiftTemplateDaysDTO: days,
          createdBy: {
            id: this.user.id,
            name: this.user.name,
          },
        };
        console.log(shiftTemplateDTO);
        let alert = Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, save it!",
        });
        if ((await alert).isConfirmed) {
          let shiftTemplate = await addShiftTemplate(shiftTemplateDTO);
          console.log(shiftTemplate);
          let employeeId = this.employeeData.data.response[0].id;
          await this.fetchAllShiftTemplates({
            employee_id: employeeId || null,
          });
          await Swal.fire("Saved!", "Your file has been saved.", "success");
          this.close();
        }
      } catch (e) {
        console.log(e);
        Swal.fire("Error!", "Something went wrong.", `${e}`);
      }
    },
    close() {
      this.$emit("close");
    },
    selectDayLogic(index) {
      try {
        //change the value front end
        let selected = this.workingDays;
        // console.log(selected, "before select");
        selected = selected.map((day, i) => {
          if (i === index) {
            console.log("==========================");
            console.log(day.selected);
            console.log("==========================");
            return {
              ...day,
              selected: !day.selected,
            };
          } else {
            return day;
          }
        });
        console.log(selected, "after select");
        let filter = selected;
        filter = filter.map((day, index) => {
          if (day.selected) {
            console.log("=============================");
            console.log(day.selected, "slected filter");
            console.log("=============================");
            return {
              ...day,
              time: [
                {
                  from: null,
                  to: null,
                },
              ],
            };
          } else {
            return day;
          }
        });
        this.CHANGE_DAY_VALUES(filter);
        // this.days = selected;
        console.log("-------------------------------------");
        console.log(filter, "AFTER SELECT");
        console.log("-------------------------------------");
      } catch (e) {
        console.log(e);
      }
    },
    selectDay(index) {
      try {
        this.selectDayLogic(index);
      } catch (e) {
        console.log(e);
      }
    },
    setHoursPerDay() {
      let endHour = this.endHour.split(":");
      console.log(endHour, "endHour");
      console.log("===============================");
      console.log(this.fixedStartHours, "startHour before");
      console.log("===============================");
      let startHour = this.fixedStartHours.split(":");
      console.log("===============================");
      console.log(startHour, "startHour");
      console.log("===============================");
      let hours = endHour[0] - startHour[0];
      console.log(hours, "hours");
      let minutes = endHour[1] - startHour[1];
      console.log(minutes, "minutes");
      if (minutes < 0) {
        hours--;
        minutes = 60 + minutes;
      }
      //user can't select end hour before start hour
      if (hours < 0) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "End hour can't be before start hour, so we set it to start hour + 1 hour",
        });
        //add 1 hour to start hour and add : 00 to it
        let newStartHour = parseInt(startHour[0]) + 1;
        this.endHour = newStartHour + ":00";
      } else {
        this.hoursPerDay = hours + ":" + minutes;
      }
      //add validation for all workingDaystimes
      if (this.hoursPerDay < 0) {
        this.hoursPerDay = 0;
      }
    },
    async fetchEstablishments() {
      try {
        let response = await getAllEstablishment();
        this.establishments = response.rows;
        let facilities = await getAllFacilities();
        this.facilities = facilities.rows;
        console.log(this.establishments, "establishments");
        console.log(this.facilities, "facilities");
      } catch (e) {
        console.log(e, "error");
      }
    },
    async fetchAllDays() {
      try {
        let daysResponse = await getAllDays();
        //map throw the days and add start and end hour and open time picker and close time picker and value
        let daysResponseAfter = daysResponse.map((day, index) => {
          return {
            ...day,
            time: [
              {
                from: "",
                to: "",
              },
            ],
            selected: false,
          };
        });
        console.log("daysResponse", daysResponseAfter);
        this.CHANGE_DAY_VALUES(daysResponseAfter);
        // this.days = daysResponse;
        // console.log(this.days, "days");
      } catch (e) {
        console.log(e, "error");
      }
    },
  },
  mounted() {
    try {
      this.fetchEstablishments();
      this.fetchAllDays();
      this.types = this.hrSettings?.row?.settings[0]?.shiftType;
    } catch (e) {
      console.log(e, "error");
    }
  },
  watch: {
    endHour() {
      try {
        this.setHoursPerDay();
      } catch (e) {
        console.log(e);
      }
    },
    workingDays() {
      try {
      } catch (e) {}
    },
  },
};
</script>

<style scoped>
/*import roboto font*/
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap");
* {
  font-family: "Roboto", sans-serif;
}
.card_title_dialog {
  font-size: 20px;
  font-weight: bold;
  color: #194569;
  padding: 15px;
}
</style>
