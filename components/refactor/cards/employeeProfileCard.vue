<template>
  <div v-if="employeeDataDynamic.length > 0">
    <v-card class="pa-4 mb-3 elevation-5s" style="width: 100%" height="780">
      <v-card color="#91AEC4" height="40" class="pb-5">
        <div class="d-flex justify-space-around">
          <p class="profile_card_title">My Profile</p>
          <!-- <v-icon>mdi-pencil</v-icon> -->
        </div>
      </v-card>

      <v-col md="12" class="mb-3">
        <div>
          <v-col md="12">
            <v-row class="flex-column justify-center align-center mt-1">
              <img
                v-if="employeeDataDynamic[0].employeeImage != null"
                class="employee-profile-img"
                :src="employeeDataDynamic[0].employeeImage"
                alt="employee image"
                @click="addPhotoStatus = !addPhotoStatus"
              />
              <img
                v-else
                class="employee-profile-img-2"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiCoHLktPNbzYjYcrFoYnlmxX5SfRKCIJQsA&usqp=CAU"
                alt="employee image"
                @click="addPhotoStatus = !addPhotoStatus"
              />
              <v-card class="pa-2" width="100%" v-if="addPhotoStatus">
                <button @click="updateImageDialog = !updateImageDialog">
                  <v-icon>mdi-camera</v-icon> Add Photo
                </button>
              </v-card>

              <h3>{{ employeeDataDynamic[0].employeeName }}</h3>
              <p class="sub_title_occupation">Doctor</p>
              <v-row class="flex-column">
                <div class="d-flex justify-center">
                  <v-icon class="mr-2">mdi-email</v-icon>
                  <p>{{ employeeDataDynamic[0].employeeEmail }}</p>
                </div>
                <div class="d-flex">
                  <v-icon class="mr-2">mdi-phone</v-icon>
                  <p>+962{{ employeeDataDynamic[0].employeePrimaryPhone }}</p>
                </div>
                <div class="d-flex">
                  <v-icon class="mr-2">mdi-home</v-icon>
                  <p>Amman-Jordan</p>
                </div>
              </v-row>
              <v-row>
                <div>
                  <p class="mr-2">Date of join</p>
                  <p
                    v-if="
                      employeeDataDynamic[0].employeeContract &&
                      employeeDataDynamic[0].employeeContract.joiningDate !==
                        null
                    "
                  >
                    {{ employeeDataDynamic[0].employeeContract.joiningDate }}
                  </p>

                  <p v-else>N/A</p>
                </div>
                <v-divider vertical class="mx-2"></v-divider>

                <div v-if="employeeDataDynamic[0].employeeOccupation">
                  <p class="mr-2">Occupation</p>
                  <p>{{ employeeDataDynamic[0].employeeOccupation.name.en }}</p>
                </div>
                <v-divider vertical class="mx-2"></v-divider>

                <div>
                  <p class="mr-2">Working Hours</p>
                  <p v-if="todayWorkingHour">
                    {{ todayWorkingHour[0].from }} -
                    {{ todayWorkingHour[0].to }}
                  </p>
                </div>
              </v-row>
            </v-row>
          </v-col>
        </div>
      </v-col>
      <div class="text-center">
        <v-btn @click="goSalarySlip" color="#194569" class="white--text mt-5">
          Salary Slip
        </v-btn>
      </div>
      <!-- <SalaryPackageForEmployee /> -->
      <!-- <UpdateProfileImageDialog
          :updateImageDialog.sync="updateImageDialog"
          :uuidForProviderIn="employeeId"
        /> -->
      <UpdateImageForEmployeeDialog
        :updateImageDialog.sync="updateImageDialog"
        :uuidForProviderIn="employeeId"
      />
    </v-card>
  </div>
  <div v-else class="load"></div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import UpdateImageForEmployeeDialog from "../../dialogs/UpdateImageForEmployeeDialog.vue";
import SalaryPackageForEmployee from "./salaryPackageForEmployee.vue";
import { getShiftTemplateService } from "../../../util/services/hrServices";
import moment from "moment";
export default {
  components: {
    UpdateImageForEmployeeDialog,

    SalaryPackageForEmployee,
  },

  props: {
    employeeId: {
      type: String,
    },
  },

  data() {
    return {
      dateOfBirth: null,
      seeMoreInfo: false,
      ageForProviderIn: null,
      updateImageDialog: false,
      addPhotoStatus: false,
      contractInfo: null,
      employeeDataFixed: [],
      employeeDataDynamic: [],
      shiftTemplate: null,
      shiftTemplateId: null,
      todayWorkingHour: null,
    };
  },
  methods: {
    ...mapActions(["actionForEmployeeDataApi"]),
    async getData() {
      try {
        this.shiftTemplateId =
          this.getterForEmployeeData.data.response[0].contract.shift_template.id;

        await this.fetchShiftTemplateForEmployee();
        const arr = [];

        await this.getterForEmployeeData.data.response?.forEach((element) => {
          let contract = {};

          //first we add all facility information inside object then we assign this object with origin object that's include all data
          if (element.contract !== null) {
            console.log(element, "hhhhhhhhhhhhhhhhhhhh");
            contract.facility =
              element.contract.facility !== null
                ? element.contract.facility.name.en
                : null;
            contract.joiningDate =
              element.contract.joining_date !== null
                ? element.contract.joining_date
                : null;
          }
          console.log(contract, "contractcontractcontractcontractcontract");
          arr.push({
            employeeId: element.id,
            employeeName: element.name.en,
            employeeBirth: element.dob,
            employeeEmail: element.email,
            employeeImage: element.image != null ? element.image : null,
            employeeOccupation: element.occupation,
            employeePrimaryPhone: element.primary_phone
              ? element.primary_phone.number
              : null,
            employeeSecondaryPhone:
              element.secondary_phone !== null
                ? element.secondary_phone.number
                : null,
            employeeFamily: element.relatedFamily,
            employeeCertifications: element.certifications,
            employeeEducation: element.education,
            employeeContract: contract,
          });
        });
        console.log(arr, "arrrrrrrr");
        this.employeeDataFixed = arr;
        this.employeeDataDynamic = this.employeeDataFixed;
      } catch (error) {
        console.log(error.message);
      }
      //this method for get data from getter then we rearrange the data to fit our page then we save it in state we call it fixed state
    },
    async fetchShiftTemplateForEmployee() {
      try {
        //fetch shift template for employee
        let shiftTemplateId = this.shiftTemplateId;
        let shiftTemplate = await getShiftTemplateService({
          id: [shiftTemplateId],
        });
        console.log(shiftTemplate?.rows[0], "shiftTemplate profile");
        this.shiftTemplate = shiftTemplate?.rows[0];
        console.log(this.shiftTemplate);
        //  get today working hours
        let today = new Date(); //get the name of the day from the date
        const weekDayName = moment(today).format("dddd");
        console.log(weekDayName, "weekDayName");
        console.log(today, "today");
        let todayWorkingHour = this.shiftTemplate.shiftTemplateDays.filter(
          (day) => day.day[this.activeLanguage] === weekDayName
        );
        console.log(todayWorkingHour, "todayTime");
        // console.log(todayWorkingHour, "todayWorkingHour");
        this.todayWorkingHour = todayWorkingHour[0].time;
        console.log(this.todayWorkingHour, "todayWorkingHour");
      } catch (e) {
        console.log(e, "error");
      }
    },

    async renderData() {
      // await this.actionForEmployeeDataApi({
      //   employee_id: "HRS-HRP-JOR-d8b5f446-dda3-41b3-b66d-879cd1ea1e60",
      // });
      await this.getData();
      // this.employeeDataDynamic = this.employeeDataFixed;
    },
    goSalarySlip() {
      this.$router.push("/hrpages/payslip/" + this.employeeId);
    },
  },
  computed: {
    ...mapGetters(["getterForEmployeeData", "getterForProfileLoading"]),
    ...mapGetters({
      activeLanguage: "activeLanguage",
      inactiveLanguage: "inactiveLanguage",
      user: "user",
      shiftTemplates: "getterForShiftTemplateData",
    }),
    formattedAge() {
      let birth = new Date(this.ageForProviderIn);
      let now = new Date();
      let beforeBirth =
        (() => {
          birth.setDate(now.getDate());
          birth.setMonth(now.getMonth());
          return birth.getTime();
        })() < birth.getTime()
          ? 0
          : 1;
      return now.getFullYear() - birth.getFullYear() - beforeBirth;
    },
  },
  mounted() {
    try {
      this.renderData();
    } catch (error) {
      console.log(error);
    }
  },
  watch: {
    getterForEmployeeData() {
      this.getData();
      this.employeeDataDynamic = this.employeeDataFixed;
    },
  },
};
</script>
<style scoped>
.card-header-edit {
  display: flex;
  justify-content: space-between;
}
.profile_card_title {
  font-size: 1.3824rem;
  line-height: 2em;
  color: black;
  margin-top: 1em auto;
}
.sub_title_occupation {
  font-size: 0.96rem;
  line-height: 2em;
  color: black;
  margin-top: 1em auto;
}
.employee-profile-img {
  cursor: pointer;
  height: 15vh;
  border-radius: 50%;
  width: 15vh;
  object-fit: cover;
}
.employee-profile-img-2 {
  cursor: pointer;
  height: 15vh;
  border-radius: 50%;
}
.view-contarct-btn {
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
.card-header-edit {
  display: flex;
  justify-content: space-between;
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
