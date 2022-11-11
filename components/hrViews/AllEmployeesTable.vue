<template>
  <v-col md="12">
    <v-row
      class="header-time-attendance justify-space-between align-center pb-2"
    >
      <h1 class="categories-title">Our Employees</h1>
      <div>
        <button
          class="filter-btns"
          @click="alllEmployeesFiltred = true"
          v-if="$store.getters.tokenValue.profileType != 'PROVIDER'"
        >
          All Employees
        </button>

        <button
          class="filter-btns"
          @click="alllEmployeesFiltred = false"
          v-if="$store.getters.tokenValue.profileType != 'PROVIDER'"
        >
          Time Attendance
        </button>
        <button
          class="filter-btns"
          @click="viewTimeAttendanceHistory"
          v-if="$store.getters.tokenValue.profileType != 'PROVIDER'"
        >
          View Time Attendance History
        </button>
      </div>
    </v-row>
    <v-row>
      <template v-if="alllEmployeesFiltred === true">
        <v-card
          v-for="(item, index) in info.resp"
          :key="index"
          class="ma-3 pa-3 elevation-5"
        >
          <div class="card-content">
            <v-avatar size="120">
              <v-img
                v-if="item.profileImg != null"
                :src="item.profileImg"
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
            <h4
              class="available-employee-name"
              v-if="item.RoleId == 1 || item.RoleId == 2"
            >
              Dr.{{ item.firstName }} {{ item.lastName }}
            </h4>
            <h4 class="available-employee-name" v-else>
              {{ item.firstName }} {{ item.lastName }}
            </h4>
            <p class="font-weight-light mb-0" v-if="item.RoleId === 1">
              Doctor
            </p>
            <p class="font-weight-light mb-0" v-else-if="item.RoleId == 2">
              Assistant
            </p>
            <p class="font-weight-light mb-0" v-else-if="item.RoleId == 3">
              Specialist
            </p>
            <p class="font-weight-light mb-0" v-else-if="item.RoleId == 4">
              Receptionist
            </p>
            <p class="font-weight-light mb-0" v-else-if="item.RoleId == 5">
              Manager
            </p>

            <button @click="viewContract(item.uuid)" class="contract-btn">
              View Profile
            </button>
          </div>
        </v-card>
      </template>
      <template v-else>
        <div v-for="(item, index) in filteredData" :key="1 + index">
          <v-card class="ma-3 pa-3 elevation-5" v-if="item.status == 'present'">
            <div class="card-content">
              <v-avatar size="120">
                <v-img
                  v-if="item.profileImg != null"
                  :src="item.profileImg"
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
              <h4 class="available-employee-name">
                Dr.{{ item.employeeName }}
              </h4>
              <p class="font-weight-light mb-0">Doctor</p>

              <p class="available-employee-time mb-0">
                {{ item.checkIn }} --
                <span v-if="item.checkOut != 'null'"> {{ item.checkOut }}</span>
              </p>

              <p
                v-if="item.status == 'present' && item.checkIn > '09:10'"
                class="late"
              >
                Late
              </p>
              <p
                v-else-if="item.status == 'present' && item.checkIn < '09:10'"
                class="present"
              >
                On Time
              </p>
              <p v-else class="out">Out</p>
              <button
                @click="viewContract(item.providerUuid)"
                class="contract-btn"
              >
                View Profile
              </button>
            </div>
          </v-card>
        </div>
      </template>
    </v-row>
  </v-col>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  props: {
    type: {
      type: String,
    },
  },
  async mounted() {
    try {
      let dateForToday = new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      );
      await this.getEmployees();
      await this.actionForGettingAllTimeAttendance({
        uuid: null,
        date: dateForToday,
      });
    } catch (e) {
      console.log(e);
    }
  },
  data() {
    return {
      arrayIncludeAllDoctors: [],
      arrayIncludeAllAssistants: [],
      arrayIncludeAllSpecialists: [],
      filteredData: [],
      todayDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      //////////////////////
      alllEmployeesFiltred: true,
    };
  },
  methods: {
    ...mapActions([
      "getEmployees",
      "actionForGettingAllTimeAttendance",
      "actionsForGettingAllBalances",
      "actionForWorkingHours",
      "getEmployees",
    ]),

    viewContract(providerUuid) {
      this.actionsForGettingAllBalances(providerUuid);
      this.actionForWorkingHours(providerUuid);
      this.getEmployees(providerUuid);

      this.$router.push("/hrpages/" + providerUuid);
    },
    // actionForGettingAllTimeAttendance() {
    //   try {
    //     const arr = [];
    //     this.getAllTimeAttendanceInfo.data.forEach((element) => {
    //       if (element.date == this.todayDate) {
    //         arr.push({
    //           employeeName: element.employeeName,
    //           checkIn: element.checkIn,
    //           checkOut: element.checkOut,
    //           status: element.status,
    //           providerUuid: element.providerUuid,
    //         });
    //       }
    //     });
    //     this.data = arr;
    //     this.pages = Math.ceil(this.data.length / 4);
    //     this.filteredData = this.data.slice(0, 4);
    //   } catch (error) {
    //     console.log(error.message);
    //   }
    // },
    viewTimeAttendanceHistory() {
      this.actionForGettingAllTimeAttendance({
        providerUuid: null,
        filtredMonth: null,
      });

      this.$router.push("/hrpages/timeAttendanceHistory/");
    },
  },
  computed: {
    ...mapGetters(["info", "getAllTimeAttendanceInfo"]),
  },
  watch: {
    getAllTimeAttendanceInfo() {
      this.filteredData = this.getAllTimeAttendanceInfo.data;
    },
  },
};
</script>
<style scoped>
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
.contract-btn {
  /* font-family: "CircularStd", sans-serif !important; */
  /* background-color: #3bb78f;
  background-image: linear-gradient(315deg, #3bb78f 0%, #0bab64 74%); */
  background-color: #4dccc6;
  background-image: linear-gradient(315deg, #4dccc6 0%, #96e4df 74%);
  color: white;
  padding: 0.3em 0.7em !important;
  font-size: 1.1rem !important;
  cursor: pointer;
  outline-style: none;
  border-radius: 5px;
  cursor: pointer;
}
.contract-btn:hover {
  background-color: #4dccc6;
  background-image: linear-gradient(315deg, #4dccc6 0%, #51eee3 74%);
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
.out {
  background: transparent;
  border: red solid 1px !important;
  border-radius: 5px;
  color: red;
  padding: 5px 8px !important;
  line-height: 1.1rem !important;
  font-weight: 400 !important;
  font-size: 1rem !important;
}
.late {
  background: transparent;
  border: orange solid 1px !important;
  border-radius: 5px;
  color: orange;
  padding: 5px 8px !important;
  line-height: 1.1rem !important;
  font-weight: 400 !important;
  font-size: 1rem !important;
}
</style>
