<template>
  <div v-if="getterForTimeAttendanceEmployeesLoading === true">
    <v-card class="pa-4 mb-3 elevation-5" height="722">
      <v-col md="12" class="mb-3 py-3">
        <v-row class="justify-space-between align-center">
          <p class="hours-card-title">Our Employees</p>
          <v-icon @click="navigateToSettings" size="30">mdi-cog</v-icon>
        </v-row>
      </v-col>
      <v-card-title class="mb-0 py-0 justify-center">
        <v-col md="12">
          <v-row class="justify-space-around">
            <v-text-field
              label="Search"
              outlined
              dense
              v-model="searchField"
              append-icon="mdi-magnify"
              prepend-inner-icon="mdi-close"
              @click:append="searchingForEmployee"
              @keyup.enter="searchingForEmployee"
              @click:prepend-inner="restData"
            >
            </v-text-field>

            <v-autocomplete
              v-model="filtredStatus"
              :items="status"
              label="choose type..."
              color="#194569"
              outlined
              return-object
              dense
              class="mx-2"
              @change="filterDependingOnStatus"
            >
            </v-autocomplete>

            <v-btn
              color="#194569"
              class="white--text"
              @click="goAddEmployeePage"
              ><v-icon>mdi-plus</v-icon> Add Employee</v-btn
            >
          </v-row>
        </v-col>
      </v-card-title>
      <v-card-text class="py-5 overflow-y-auto" style="max-height: 500px">
        <!-- {{ allEmployeesDataDynamic }} -->
        <v-row v-if="allEmployeesDataDynamic">
          <v-card
            v-for="(item, index) in allEmployeesDataDynamic"
            :key="index"
            class="ma-3 pa-3 elevation-5"
            height="250"
            width="250"
            @click="viewContract(item.employeeId)"
          >
            <div class="card-content">
              <template
                v-if="
                  item.emplpoyeeAttendance !== null &&
                  item.emplpoyeeAttendance[0].in_status !== null &&
                  (item.emplpoyeeAttendance[0].in_status.id == 1 ||
                    item.emplpoyeeAttendance[0].in_status.id == 4) &&
                  item.emplpoyeeAttendance[0].out_status === null
                "
              >
                <v-badge
                  bordered
                  bottom
                  color="
                   green
                  "
                  dot
                  offset-x="10"
                  offset-y="10"
                >
                  <v-avatar size="120">
                    <v-img
                      v-if="item.employeeImage != null"
                      :src="item.employeeImage"
                      alt=""
                      srcset=""
                    />
                    <v-img
                      v-else
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiCoHLktPNbzYjYcrFoYnlmxX5SfRKCIJQsA&usqp=CAU"
                      alt=""
                      srcset=""
                    />
                  </v-avatar>
                </v-badge>
              </template>
              <template
                v-else-if="
                  item.emplpoyeeAttendance !== null &&
                  item.emplpoyeeAttendance[0].in_status !== null &&
                  item.emplpoyeeAttendance[0].out_status !== null
                "
              >
                <v-badge
                  bordered
                  bottom
                  color="
                   red
                  "
                  dot
                  offset-x="10"
                  offset-y="10"
                >
                  <v-avatar size="120">
                    <v-img
                      v-if="item.employeeImage != null"
                      :src="item.employeeImage"
                      alt=""
                      srcset=""
                    />
                    <v-img
                      v-else
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiCoHLktPNbzYjYcrFoYnlmxX5SfRKCIJQsA&usqp=CAU"
                      alt=""
                      srcset=""
                    />
                  </v-avatar>
                </v-badge>
              </template>

              <template v-else>
                <v-badge
                  bordered
                  bottom
                  color="
                red
                  "
                  dot
                  offset-x="10"
                  offset-y="10"
                >
                  <v-avatar size="120">
                    <v-img
                      v-if="item.employeeImage != null"
                      :src="item.employeeImage"
                      alt=""
                      srcset=""
                    />
                    <v-img
                      v-else
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiCoHLktPNbzYjYcrFoYnlmxX5SfRKCIJQsA&usqp=CAU"
                      alt=""
                      srcset=""
                    />
                  </v-avatar>
                </v-badge>
              </template>
              <h4 class="available-employee-name">
                {{ item.employeeName }}
              </h4>

              <p
                class="font-weight-light mb-0"
                v-if="item.employeeOccupation !== null"
              >
                {{ item.employeeOccupation }}
              </p>
              <p class="font-weight-light mb-0" v-else>N/A</p>
            </div>
          </v-card>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
  <div v-else class="load"></div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  props: {
    type: {
      type: String,
    },
  },

  data() {
    return {
      searchField: "",
      filtredStatus: "",
      status: ["All", "In", "Out"],
      allEmployeesDataFixed: [],
      allEmployeesDataDynamic: [],

      ////////////////////////////////////////////
      filteredData: [],
      //////////////////////
      alllEmployeesFiltred: true,
    };
  },
  methods: {
    async getData() {
      //this method for get data from getter then we rearrange the data to fit our page then we save it in state we call it fixed state
      try {
        const arr = [];

        this.getterForTimeAttendanceEmployees.data.response?.forEach(
          (element) => {
            let test = element.name.en.split(" ");
            let firstName = test[0];
            let secondName = test[1];
            let lastName = test[2];
            arr.push({
              employeeId: element.id,
              employeeName: firstName + " " + secondName + " " + lastName,
              employeeImage: element.image,
              employeeOccupation:
                element.occupation !== null ? element.occupation.name.en : null,
              employeeGender: element.gender ? element.gender.name.en : null,
              emplpoyeeAttendance: element.timeAttendance,
            });
          }
        );
        this.allEmployeesDataFixed = arr;
      } catch (error) {
        console.log(error, "employees cards error");
      }
    },
    filterDependingOnStatus() {
      try {
        if (this.filtredStatus == "In") {
          const arr = [];
          this.getterForTimeAttendanceEmployees.data.response?.forEach(
            (element) => {
              if (
                element.timeAttendance !== null &&
                (element.timeAttendance[0].in_status !== null) &
                  (element.timeAttendance[0].out_status === null)
              ) {
                arr.push({
                  employeeId: element.id,
                  employeeName: element.name.en,
                  employeeImage: element.image,
                  employeeOccupation: element.name.en,
                  employeeGender: element.gender.name.en,
                  emplpoyeeAttendance: element.timeAttendance,
                });
              }
            }
          );
          this.allEmployeesDataFixed = arr;
          this.allEmployeesDataDynamic = this.allEmployeesDataFixed;
        } else if (this.filtredStatus == "Out") {
          const arr = [];
          this.getterForTimeAttendanceEmployees.data.response?.forEach(
            (element) => {
              if (
                (element.timeAttendance !== null &&
                  element.timeAttendance[0].in_status !== null &&
                  element.timeAttendance[0].out_status !== null) ||
                element.timeAttendance === null
              ) {
                arr.push({
                  employeeId: element.id,
                  employeeName: element.name.en,
                  employeeImage: element.image,
                  employeeOccupation: element.name.en,
                  employeeGender: element.gender.name.en,
                  emplpoyeeAttendance: element.timeAttendance,
                });
              }
            }
          );

          this.allEmployeesDataFixed = arr;
          this.allEmployeesDataDynamic = this.allEmployeesDataFixed;
        } else {
          const arr = [];
          this.getterForTimeAttendanceEmployees.data.response?.forEach(
            (element) => {
              arr.push({
                employeeId: element.id,
                employeeName: element.name.en,
                employeeImage: element.image,
                employeeOccupation: element.name.en,
                employeeGender: element.gender.name.en,
                emplpoyeeAttendance: element.timeAttendance,
              });
            }
          );
          this.allEmployeesDataFixed = arr;
          this.allEmployeesDataDynamic = this.allEmployeesDataFixed;
        }
      } catch (error) {
        console.log(error.message);
      }
    },
    searchingForEmployee() {
      try {
        this.allEmployeesDataDynamic = this.allEmployeesDataFixed.filter(
          (employee) =>
            employee.employeeName.toLowerCase().includes(this.searchField)
        );
      } catch (error) {
        console.log(error.message);
      }
    },

    restData() {
      this.allEmployeesDataDynamic = this.allEmployeesDataFixed;
      this.searchField = "";
    },
    goAddEmployeePage() {
      this.$router.push({
        path: "/employee/addNewEmployee",
      });
      // this.$router.push("hrpages/createnewemployee/createnewemployee");
    },
    viewContract(id) {
      this.$router.push("/hrpages/" + id);
    },

    async renderData() {
      await this.getData();
      this.allEmployeesDataDynamic = this.allEmployeesDataFixed;
    },
    navigateToSettings() {
      this.$router.push("/settings/settings");
    },
  },
  computed: {
    ...mapGetters([
      "getterForTimeAttendanceEmployees",
      "getterForTimeAttendanceEmployeesLoading",
    ]),
  },
  mounted() {
    try {
      this.renderData();
    } catch (e) {
      console.log(e);
    }
  },
  watch: {
    getterForTimeAttendanceEmployees() {
      this.getData();
      this.allEmployeesDataDynamic = this.allEmployeesDataFixed;
    },
  },
};
</script>
<style scoped>
.hours-card-title {
  font-size: 1.3824rem;
  line-height: 2em;
  color: #194569;
  margin-top: 1em auto;
}
.header-time-attendance {
  border-bottom: 1px solid #cfcccc;
}
.categories-title {
  font-style: normal;
  font-weight: 450;
  font-size: 1.8rem !important ;
  line-height: 37px;
}
.filter-btns {
  border: 1px solid teal;
  color: teal;
  padding: 0.5em 1em;
  border-radius: 10px;
}
.filter-btns:hover {
  background: teal;
  color: white;
  transition: 0.3s;
}
.clocking-link {
  /* text-decoration: none; */
  color: #009688;
  font-weight: 500;
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.leave-card-content {
  display: flex;
}
.available-employee-name {
  font-style: normal;
  font-weight: 450;
  font-size: 1.1rem !important ;
  line-height: 37px;
  color: #004d40;
}

.available-employee-time {
  font-style: normal;
  font-weight: 350;
  font-size: 1.1rem !important ;
  line-height: 37px;
  color: #35b5ac;
}

.present {
  background: transparent;
  border: #35b5ac solid 1px !important;
  border-radius: 5px;
  color: #35b5ac;
  padding: 5px 8px !important;
  line-height: 1.1rem !important;
  font-weight: 400 !important;
  font-size: 1rem !important;
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes rotate {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}
.load {
  width: 100px;
  height: 100px;
  margin: 110px auto 0;
  border: solid 10px #194569;
  border-radius: 50%;
  border-right-color: transparent;
  border-bottom-color: transparent;
  -webkit-transition: all 0.5s ease-in;
  -webkit-animation-name: rotate;
  -webkit-animation-duration: 1s;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-timing-function: linear;
  transition: all 0.5s ease-in;
  animation-name: rotate;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}
</style>
