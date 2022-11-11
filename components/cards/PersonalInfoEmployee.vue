<template>
  <v-row class="justify-center">
    <v-card style="width: 90%">
      <v-row
        class="justify-space-between"
        v-for="(item, index) in info"
        :key="index"
      >
        <v-col md="6">
          <div class="d-flex pa-5 mt-5 pl-5 ml-5">
            <div class="mr-6">
              <img
                v-if="item.profileImg != null"
                class="employee-profile-img"
                :src="item.profileImg"
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
            </div>
            <div>
              <h3>{{ item.firstName }} {{ item.lastName }}</h3>
              <h6
                class="font-weight-light"
                v-if="item.RoleId == 1 || item.RoleId == 2"
              >
                Doctor
              </h6>
              <h6 class="font-weight-light" v-else-if="item.RoleId == 3">
                Specialist
              </h6>
              <h6 class="font-weight-light" v-else-if="item.RoleId == 4">
                Receptionist
              </h6>
              <!-- <small >Dentist</small> -->
              <div class="font-weight-medium">
                Employee Id : {{ item.employeeNumber }}
              </div>
              <div class="font-weight-medium" v-if="contractInfo">
                <p v-if="contractInfo[0]">
                  Date Of Join : {{ contractInfo[0].joiningDate }}
                </p>
                <p v-else>Date Of Join : N/A</p>
              </div>
              <div class="mt-5">
                <v-btn class="view-contarct-btn" @click="viewEmployeeContract"
                  >View Contract
                </v-btn>
              </div>
            </div>
          </div>
        </v-col>

        <v-col md="6">
          <v-row class="mt-5">
            <v-col md="12">
              <v-card class="widget pa-5 ma-5">
                <div class="card-header-edit mb-4">
                  <span class="title">Personal Info</span>
                  <v-icon
                    class="icons-img"
                    v-if="$store.getters.tokenValue.profileType == 'PROVIDER'"
                    >mdi-wrench</v-icon
                  >
                </div>
                <v-row class="mt-4 pl-4">
                  <v-col md="12">
                    <v-row
                      class="justify-space-between"
                      v-for="(item, index) in info"
                      :key="index"
                    >
                      <v-col md="6">
                        <ul style="list-style-type: none">
                          <li class="mb-3">
                            <span class="mr-2 font-weight-medium">
                              Phone:
                            </span>
                            <span>{{ item.phone }}</span>
                          </li>
                          <li class="mb-3">
                            <span class="mr-2 font-weight-medium">
                              Email:
                            </span>
                            <span>{{ item.email }}</span>
                          </li>
                          <li class="mb-3">
                            <span class="mr-2 font-weight-medium"> Age: </span>
                            <span>{{ formattedAge }} years old</span>
                          </li>
                        </ul>
                      </v-col>
                      <v-col md="6">
                        <ul style="list-style-type: none">
                          <li class="mb-3">
                            <span class="mr-2 font-weight-medium">
                              Address:
                            </span>
                            <span>{{ item.cityName }}, Jordan</span>
                          </li>
                          <li class="mb-3">
                            <span class="mr-2 font-weight-medium">
                              Gender:
                            </span>
                            <span>{{ item.gender }}</span>
                          </li>
                        </ul>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <!-- <v-col md="4">
          <v-row class="mt-5">
            <v-col md="12">
              <v-card class="widget pa-5 ma-5">
                <div class="card-header-edit mb-4">
                  <span class="title">About </span>
                  <v-icon class="icons-img">mdi-wrench</v-icon>
                </div>
                <p
                  class="about-content"
                  v-for="(item, index) in info"
                  :key="index"
                >
                  Dr. {{ nameForProviderIn }} {{ item.about }}
                </p>
              </v-card>
            </v-col>
          </v-row>
        </v-col> -->
      </v-row>
      <v-row class="justify-center">
        <!-- <button
          @click="seeMoreInfo = !seeMoreInfo"
          class="toggling-up-down mb-5"
        > -->
        <v-icon
          @click="seeMoreInfo = !seeMoreInfo"
          class="toggling-up-down mb-5"
          v-if="!seeMoreInfo"
          color="white"
          >mdi-arrow-down</v-icon
        >
        <!-- </button> -->
      </v-row>
      <v-divider v-if="seeMoreInfo"></v-divider>
      <v-row v-if="seeMoreInfo" class="justify-space-between">
        <v-col md="6">
          <v-card class="widget pa-5 ma-5" min-height="210">
            <div class="mb-4">
              <span class="title">Family Information </span>
            </div>
            <v-row class="mt-4 pl-4">
              <v-col md="12">
                <v-row class="justify-center align-center">
                  <table
                    class="table-workingHours"
                    v-if="getterForEmployeeFamilyInformation.length != 0"
                  >
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Relationship</th>
                        <th>Date Of Birth</th>
                      </tr>
                    </thead>
                    <tbody
                      v-for="(
                        item, index
                      ) in getterForEmployeeFamilyInformation"
                      :key="index"
                    >
                      <tr>
                        <td data-column="USERNAME">
                          {{ item.nameOfRelative }}
                        </td>
                        <td>{{ item.relativeRelation }}</td>
                        <td data-column="ID">
                          {{ item.dateOfBirthOfRelative }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div v-else>
                    <h3 class="text-center">There's no family information</h3>
                  </div>
                </v-row>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col md="6">
          <v-card class="pa-5 ma-5" max-width="800" min-height="212">
            <div class="card-header-edit mb-4">
              <span class="title">Emergency Contact </span>
              <v-icon
                class="icons-img"
                v-if="$store.getters.tokenValue.profileType == 'PROVIDER'"
                >mdi-wrench</v-icon
              >
            </div>
            <v-row class="mt-4 pl-4">
              <v-col md="12">
                <v-row>
                  <v-row class="mt-2">
                    <div class="mb-4">
                      <span class="title">Primary</span>
                    </div>
                    <ul
                      style="list-style-type: none"
                      v-for="(item, index) in info"
                      :key="index"
                    >
                      <li class="mb-3">
                        <span class="mr-8 font-weight-medium"> Name: </span>
                        <span>{{ item.emergencyContactName1 }}</span>
                      </li>
                      <li class="mb-3">
                        <span class="mr-8 font-weight-medium">
                          Relationship:
                        </span>
                        <span>{{ item.emergencyContactRelationship1 }}</span>
                      </li>
                      <li class="mb-3">
                        <span class="mr-8 font-weight-medium"> Phone: </span>
                        <span>{{ item.emergencyContactNumber1 }}</span>
                      </li>
                    </ul>
                  </v-row>
                  <v-divider vertical class="mt-3"></v-divider>

                  <v-row
                    class="mt-2 ml-5"
                    v-for="(item, index) in info"
                    :key="index"
                  >
                    <template v-if="item.emergencyContactName2">
                      <span class="title">Secondry</span>
                      <ul style="list-style-type: none">
                        <li class="mb-3">
                          <span class="mr-8 font-weight-medium"> Name: </span>
                          <span>{{ item.emergencyContactName2 }}</span>
                        </li>
                        <li class="mb-3">
                          <span class="mr-8 font-weight-medium">
                            Relationship:
                          </span>
                          <span>{{ item.emergencyContactRelationship2 }}</span>
                        </li>
                        <li class="mb-3">
                          <span class="mr-8 font-weight-medium"> Phone: </span>
                          <span>{{ item.emergencyContactNumber2 }}</span>
                        </li>
                      </ul>
                    </template>
                  </v-row>
                </v-row>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col md="4">
          <v-card class="pa-5 ma-5">
            <div class="card-header-edit mb-4">
              <span class="title">Education </span>
              <button>
                <v-icon
                  class="icons-img"
                  v-if="$store.getters.tokenValue.profileType == 'PROVIDER'"
                  >mdi-wrench</v-icon
                >
              </button>
            </div>
            <v-row class="mt-4 pl-4">
              <v-col md="12">
                <v-row v-if="getterForEmployeeEducation.length != 0">
                  <!-- <div class="mr-3">
                    <img
                      class="experience-img"
                      src="https://scontent.famm4-2.fna.fbcdn.net/v/t39.30808-6/242126366_4354082271312437_6381128402262424738_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=i1pHOefFBkwAX-r1VGx&_nc_oc=AQlnJZmCCTLva_hN-78uJAi11TpCVb0KraRd8bQ3axMnJ-eSn8sT6YV3vrzpfEuCYts&_nc_ht=scontent.famm4-2.fna&oh=00_AT87SBIEhkUUs6wdDckz2HeAZwrKxjURlNUIQCvO--mA0w&oe=62A1C553"
                      alt="provider image"
                    />
                  </div> -->
                  <div
                    v-for="(item, index) in getterForEmployeeEducation"
                    :key="index"
                  >
                    <h4 class="experience-title">
                      {{ item.nameOfUniversity }}
                    </h4>
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-title>{{
                          item.departmentInUniversity
                        }}</v-list-item-title>
                        <v-list-item-subtitle
                          >{{ item.startDateOfUniversity }} -
                          {{ item.endDateOfUniversity }}</v-list-item-subtitle
                        >
                        <v-list-item-subtitle>{{
                          item.addressOfUniversity
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </div>
                </v-row>
                <v-row v-else class="justify-center align-center">
                  <h3>There's no education data</h3>
                </v-row>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col md="4">
          <v-card class="pa-5 ma-5">
            <div class="card-header-edit mb-4">
              <span class="title">Experiences </span>
              <button>
                <v-icon
                  class="icons-img"
                  v-if="$store.getters.tokenValue.profileType == 'PROVIDER'"
                  >mdi-wrench</v-icon
                >
              </button>
            </div>
            <v-row class="mt-4 pl-4">
              <v-col md="12">
                <v-row v-if="getterForEmployeeExperiences.length != 0">
                  <div class="mr-3">
                    <!-- <img
                      class="experience-img"
                      src="https://thumbs.dreamstime.com/z/medical-clinic-logo-design-health-medical-clinic-logo-design-health-136404710.jpg"
                      alt="provider image"
                    /> -->
                  </div>
                  <div
                    v-for="(item, index) in getterForEmployeeExperiences"
                    :key="index"
                  >
                    <h4 class="experience-title">
                      {{ item.titleOfExperience }}
                    </h4>
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-title>{{
                          item.companyNameOfExperience
                        }}</v-list-item-title>
                        <v-list-item-subtitle
                          >{{ item.startDateOfExperience }} -
                          {{ item.endDateOfExperience }}</v-list-item-subtitle
                        >
                        <v-list-item-subtitle
                          >{{ item.locationOfExperience }},
                          Jordan</v-list-item-subtitle
                        >
                      </v-list-item-content>
                    </v-list-item>
                  </div>
                </v-row>
                <v-row v-else class="justify-center align-center">
                  <h3>There's no experience data</h3>
                </v-row>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col md="4">
          <v-card class="pa-5 ma-5">
            <div class="card-header-edit mb-4">
              <span class="title">Licenses & certifications </span>
              <button>
                <v-icon
                  class="icons-img"
                  v-if="$store.getters.tokenValue.profileType == 'PROVIDER'"
                  >mdi-wrench</v-icon
                >
              </button>
            </div>
            <v-row class="mt-4 pl-4">
              <v-col md="12">
                <v-row v-if="getterForEmployeeCertifications.length != 0">
                  <div class="mr-3">
                    <!-- <img
                      class="experience-img"
                      src="https://jordantimes.com/sites/default/files/styles/news_inner/public/5-JDA.jpg?itok=6UmZyt9G"
                      alt="provider image"
                    /> -->
                  </div>
                  <div
                    v-for="(item, index) in getterForEmployeeCertifications"
                    :key="index"
                  >
                    <h4 class="experience-title">
                      {{ item.nameOfCertification }}
                    </h4>
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-title>{{
                          item.organizationOfCertification
                        }}</v-list-item-title>
                        <v-list-item-subtitle
                          >{{ item.fromDateOfCertification }} -
                          {{ item.toDateOfCertification }}</v-list-item-subtitle
                        >
                        <v-list-item-subtitle
                          >Amman, Jordan</v-list-item-subtitle
                        >
                      </v-list-item-content>
                    </v-list-item>
                  </div>
                </v-row>
                <v-row v-else class="justify-center align-center">
                  <h3>There's no certification data</h3>
                </v-row>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="justify-center">
        <button
          @click="seeMoreInfo = !seeMoreInfo"
          class="toggling-up-down mb-5"
          v-if="seeMoreInfo"
        >
          <v-icon color="white">mdi-arrow-up</v-icon>
        </button>
      </v-row>
      <!-- <UpdateProfileImageDialog
        :updateImageDialog.sync="updateImageDialog"
        :uuidForProviderIn="employeeUuid"
      /> -->
      <UpdateImageForEmployeeDialog
        :updateImageDialog.sync="updateImageDialog"
        :uuidForProviderIn="employeeUuid"
      />
    </v-card>
  </v-row>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import UpdateImageForEmployeeDialog from "../dialogs/UpdateImageForEmployeeDialog.vue";
// import UpdateProfileImageDialog from "../../../web.providers.agentsoncloud.com/components/dialogue/UpdateProfileImageDialog.vue";

export default {
  props: {
    employeeUuid: {
      type: String,
    },
  },
  created() {
    if (this.info[0]) {
      this.ageForProviderIn = this.info[0].dateOfBirth;
    }
  },
  async mounted() {
    try {
      await this.actionForContractInfo(this.employeeUuid);
      // this.contractInfo = this.getterForContractInfo.resp;
    } catch (error) {
      console.log(error);
    }
  },
  data() {
    return {
      dateOfBirth: null,
      seeMoreInfo: false,
      ageForProviderIn: null,
      updateImageDialog: false,
      addPhotoStatus: false,
      contractInfo: null,
    };
  },
  methods: {
    ...mapActions([
      "actionForGettingSalaryForProvider",
      "actionForContractInfo",
    ]),
    viewEmployeeContract() {
      this.actionForGettingSalaryForProvider(this.employeeUuid);
      this.$router.push("/hrpages/contract/" + this.employeeUuid);
    },
  },
  computed: {
    ...mapGetters([
      "info",
      "getterForEmployeeFamilyInformation",
      "getterForEmployeeEducation",
      "getterForEmployeeExperiences",
      "getterForEmployeeCertifications",
      "getterForContractInfo",
    ]),
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
    computedDate() {
      // if (this.getterForContractInfo.resp[0]) {
      //   return this.getterForContractInfo.resp[0].joiningDate;
      // }
    },
  },
  watch: {
    getterForContractInfo() {
      this.contractInfo = this.getterForContractInfo.resp;
    },
  },
  components: { UpdateImageForEmployeeDialog },
};
</script>
<style scoped>
.card-header-edit {
  display: flex;
  justify-content: space-between;
}
.employee-profile-img {
  cursor: pointer;
  height: 25vh;
  border-radius: 50%;
}
.employee-profile-img-2 {
  cursor: pointer;
  height: 20vh;
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
.toggling-up-down {
  border: 1px solid teal;
  border-radius: 50%;
  background: teal;
  padding: 0.2em;
}
.toggling-up-down:hover {
  transform: scale(1.05);
}
table {
  width: 99%;
  border-collapse: collapse;
}

th {
  background: #35b5ac;
  color: white;
  font-weight: bold;
}

td,
th {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: center;
  font-size: 1.1rem;
}

@media only screen and (max-width: 760px),
  (min-device-width: 768px) and (max-device-width: 1024px) {
  table {
    width: 100%;
  }

  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }

  /* Hide table headers (but not display: none;, for accessibility) */
  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  tr {
    border: 1px solid #ccc;
  }

  td {
    /* Behave  like a "row" */
    border: none;
    border-bottom: 1px solid #eee;
    position: relative;
    padding-left: 50%;
  }

  td:before {
    /* Now like a table header */
    position: absolute;
    /* Top/left values mimic padding */
    top: 6px;
    left: 6px;
    width: 45%;
    padding-right: 10px;
    white-space: nowrap;
    /* Label the data */
    content: attr(data-column);

    color: #000;
    font-weight: bold;
  }
}
</style>
