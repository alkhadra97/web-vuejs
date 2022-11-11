<template>
  <div v-if="getterForProfileLoading === true && componentStatus === true">
    <v-container>
      <v-row>
        <v-col md="12">
          <v-row>
            <v-col md="6">
              <v-card class="pa-4 mb-3 elevation-5" height="330">
                <v-card-title class="mb-0 py-0 justify-center">
                  <p class="employee-card-title">Employee Information</p>
                  <v-row justify="end">
                    <v-icon
                      @click="editInformationDialog = !editInformationDialog"
                      >mdi-wrench</v-icon
                    >
                  </v-row>
                </v-card-title>
                <v-card-text>
                  <v-row align="center" class="mx-0">
                    <v-col md="4">
                      <v-card class="pa-3 mb-3 elevation-0">
                        <div
                          class="d-flex flex-column justify-center align-center"
                        >
                          <img
                            v-if="employeeDataDynamic[0].employeeImg != null"
                            class="employee-profile-img"
                            :src="employeeDataDynamic[0].employeeImg"
                            alt="employee image"
                          />
                          <img
                            v-else
                            class="employee-profile-img-2"
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiCoHLktPNbzYjYcrFoYnlmxX5SfRKCIJQsA&usqp=CAU"
                            alt="employee image"
                          />
                          <h3>{{ employeeDataDynamic[0].employeeName }}</h3>
                          <p
                            class="sub_title_occupation"
                            v-if="employeeDataDynamic[0].employeeOccupation"
                          >
                            {{
                              employeeDataDynamic[0].employeeOccupation.name.en
                            }}
                          </p>
                        </div>
                      </v-card>
                    </v-col>
                    <v-col md="8">
                      <v-row>
                        <v-col md="6">
                          <v-icon class="mr-2">mdi-email</v-icon
                          >{{ employeeDataDynamic[0].employeeEmail }}</v-col
                        >
                        <v-col md="6">
                          <v-icon class="mr-2">mdi-home</v-icon>
                          <span v-if="employeeDataDynamic[0].employeeAddress">
                            {{ employeeDataDynamic[0].employeeAddress.city }}/
                            {{ employeeDataDynamic[0].employeeAddress.country }}
                          </span>
                          <span v-else> N/A </span>
                        </v-col>
                        <v-col md="6">
                          <v-icon
                            class="mr-2"
                            v-if="
                              employeeDataDynamic[0].employeeGender !== null &&
                              employeeDataDynamic[0].employeeGender == 'male'
                            "
                            >mdi-gender-male</v-icon
                          >
                          <v-icon class="mr-2" v-else>mdi-gender-female</v-icon>
                          <span
                            v-if="
                              employeeDataDynamic[0].employeeGender !== null
                            "
                          >
                            {{ employeeDataDynamic[0].employeeGender }}
                          </span>
                          <span v-else> N/A </span>
                        </v-col>
                        <v-col md="6">
                          <v-icon class="mr-2">mdi-phone</v-icon>
                          {{
                            employeeDataDynamic[0].employeePrimaryPhone
                          }}</v-col
                        >
                        <v-col md="6">
                          <v-icon class="mr-2">mdi-cake-variant</v-icon
                          >{{ employeeDataDynamic[0].employeeBirth }}</v-col
                        >
                        <v-col md="6">
                          <v-icon class="mr-2">mdi-flag-variant</v-icon>
                          <span
                            v-if="
                              employeeDataDynamic[0].employeeNationality.name
                            "
                          >
                            {{
                              employeeDataDynamic[0].employeeNationality.name[
                                activeLanguage
                              ] ||
                              employeeDataDynamic[0].employeeNationality.name[
                                inactiveLanguage
                              ] ||
                              "N/A"
                            }}
                          </span>
                          <span v-else> N/A </span>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col md="3">
              <EmployeeBalanceCard :balance="employeeDataDynamic[0]" />
            </v-col>
            <v-col md="3">
              <!--              Here Working Hours-->
              <employee-working-hours :todayWorkingHour="todayWorkingHour" />
            </v-col>
          </v-row>
        </v-col>
        <v-col md="6">
          <v-card class="py-4 mb-3 elevation-5" height="330">
            <v-card-title class="mb-0 py-0 justify-center">
              <p class="employee-card-title">Family Information</p>
              <v-row justify="end">
                <v-icon
                  @click="
                    editFamilyInformationDialog = !editFamilyInformationDialog
                  "
                  >mdi-plus</v-icon
                >
              </v-row>
            </v-card-title>
            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="employeeFamilyInformation"
                class="elevation-1"
                :options="{
                  itemsPerPage: 3,
                }"
              >
                <template v-slot:item.actions="{ item }">
                  <v-icon
                    small
                    class="mr-2"
                    @click="deleteClickedFamily(item, 'familyInform')"
                  >
                    mdi-delete
                  </v-icon>
                  <v-icon small class="mr-2" @click="editFamily(item)">
                    mdi-pencil
                  </v-icon>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col md="6">
          <v-card class="py-4 mb-3 elevation-5" height="330">
            <v-card-title class="mb-0 py-0 justify-center">
              <p class="employee-card-title">Emergency Contact</p>
              <v-row justify="end">
                <v-icon @click="editEmergencyContact = !editEmergencyContact"
                  >mdi-plus</v-icon
                >
              </v-row>
            </v-card-title>
            <v-card-text>
              <v-data-table
                :headers="emergencyContactsHeaders"
                :items="employeeEmergencyContacts"
                class="elevation-1"
                :options="{
                  itemsPerPage: 3,
                }"
              >
                <template v-slot:item.actions="{ item }">
                  <v-icon
                    small
                    class="mr-2"
                    @click="
                      deleteClickedEmergencyContact(item, 'emergencyContact')
                    "
                  >
                    mdi-delete
                  </v-icon>
                  <v-icon
                    small
                    class="mr-2"
                    @click="editEmergencyContactInform(item)"
                  >
                    mdi-pencil
                  </v-icon>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col md="6">
          <v-card class="widget pa-5 mt-5" height="330">
            <div>
              <v-card-title class="mb-0 py-0">
                <p class="hours-card-title">Education</p>
                <v-row justify="end">
                  <v-icon @click="editEducationDialog = !editEducationDialog"
                    >mdi-plus</v-icon
                  >
                </v-row>
              </v-card-title>
            </div>
            <v-card-text class="overflow-y-auto" style="max-height: 235px">
              <v-row class="mt-4 pl-4">
                <v-col md="12">
                  <div>
                    <div class="mr-3">
                      <!-- <img
                        class="experience-img"
                        src="
                        alt="provider image"
                      /> -->
                    </div>
                    <template v-if="educationArrSorted">
                      <div
                        v-for="(item, index) in educationArrSorted"
                        :key="index"
                      >
                        <div class="d-flex justify-space-between">
                          <h4
                            class="experience-title"
                            v-if="item.universiity !== null"
                          >
                            {{ item.universiity.en }}
                          </h4>
                          <div>
                            <v-icon
                              small
                              class="mr-2"
                              @click="deleteEducation(item, 'education')"
                            >
                              mdi-delete
                            </v-icon>
                            <v-icon
                              small
                              class="mr-2"
                              @click="editEducation(item)"
                            >
                              mdi-pencil
                            </v-icon>
                          </div>
                        </div>

                        <v-list-item two-line>
                          <v-list-item-content>
                            <!-- <v-list-item-title v-if="item.department !== null">{{
                            item.department
                          }}</v-list-item-title>
                          <v-list-item-title v-else>N/A</v-list-item-title> -->
                            <v-list-item-title v-if="item.faculty !== null">{{
                              item.faculty
                            }}</v-list-item-title>
                            <v-list-item-title v-else>N/A</v-list-item-title>
                            <v-list-item-subtitle
                              >{{ item.period.from }} -
                              {{ item.period.to }}</v-list-item-subtitle
                            >
                          </v-list-item-content>
                        </v-list-item>
                      </div>
                    </template>
                    <v-row v-else class="align-center justify-center">
                      <img
                        class="no-data-img"
                        src="../../../assets/img/no-data.png"
                        alt="no data image"
                        style="height: 15rem"
                      />
                    </v-row>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col md="6">
          <v-card class="widget pa-5 mt-5" height="330">
            <div class="card-header-edit">
              <v-card-title class="mb-0 py-0 justify-center">
                <p class="hours-card-title">Experience</p>
                <v-row justify="end">
                  <v-icon @click="editExperienceDialog = true">mdi-plus</v-icon>
                </v-row>
              </v-card-title>
            </div>
            <v-card-text class="overflow-y-auto" style="max-height: 210px">
              <v-row class="mt-4 pl-4">
                <v-col md="12">
                  <v-row class="flex-column">
                    <div class="mr-3">
                      <!-- <img
                        class="experience-img"
                        src="https://jordantimes.com/sites/default/files/styles/news_inner/public/5-JDA.jpg?itok=6UmZyt9G"
                        alt="provider image"
                      /> -->
                    </div>
                    <template v-if="ExperienceArrSorted !== null">
                      <div
                        v-for="(item, index) in ExperienceArrSorted"
                        :key="index"
                      >
                        <div class="d-flex justify-space-between">
                          <p class="experience-title ma-0">
                            {{ item.title.name.en }}
                          </p>
                          <div>
                            <v-icon
                              small
                              class="mr-2"
                              @click="deleteExperience(item, 'experience')"
                            >
                              mdi-delete
                            </v-icon>
                            <v-icon
                              small
                              class="mr-2"
                              @click="editExpInform(item)"
                            >
                              mdi-pencil
                            </v-icon>
                          </div>
                        </div>

                        <v-list-item two-line>
                          <v-list-item-content>
                            <v-list-item-title v-if="item.company">{{
                              item.company.en
                            }}</v-list-item-title>
                            <v-list-item-title v-else>N/A</v-list-item-title>
                            <v-list-item-title v-if="item.period"
                              >{{ item.period.from }}--{{
                                item.period.to
                              }}</v-list-item-title
                            >
                            <v-list-item-title v-else>N/A</v-list-item-title>
                            <!-- <v-list-item-title v-if="item.location != 'N/A'"
                            >{{ item.location.city.name.en }},{{
                              item.location.country.name.en
                            }}</v-list-item-title
                          > -->
                            <!-- <v-list-item-title v-else>N/A</v-list-item-title> -->
                          </v-list-item-content>
                        </v-list-item>
                      </div>
                    </template>
                    <v-row v-else class="align-center justify-center">
                      <img
                        class="no-data-img"
                        src="../../../assets/img/no-data.png"
                        alt="no data image"
                        style="height: 15rem"
                      />
                    </v-row>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col md="6">
          <v-card class="widget pa-5 mt-5" height="330">
            <div class="card-header-edit">
              <v-card-title class="mb-0 py-0 justify-center">
                <p class="hours-card-title">Licenses & certifications</p>
                <v-row justify="end">
                  <v-icon @click="editCerrtificationDialog = true"
                    >mdi-plus</v-icon
                  >
                </v-row>
              </v-card-title>
            </div>
            <v-card-text class="overflow-y-auto" style="max-height: 210px">
              <v-row class="mt-4 pl-4">
                <v-col md="12">
                  <v-row class="flex-column">
                    <div class="mr-3">
                      <!-- <img
                        class="experience-img"
                        src="https://jordantimes.com/sites/default/files/styles/news_inner/public/5-JDA.jpg?itok=6UmZyt9G"
                        alt="provider image"
                      /> -->
                    </div>
                    <template v-if="licenseArrSorted !== null">
                      <div
                        v-for="(item, index) in licenseArrSorted"
                        :key="index"
                      >
                        <div class="d-flex justify-space-between">
                          <h4 class="experience-title">
                            {{ item.name.en }}
                          </h4>
                          <div>
                            <v-icon
                              small
                              class="mr-2"
                              @click="deleteLicense(item, 'certification')"
                            >
                              mdi-delete
                            </v-icon>
                            <v-icon
                              small
                              class="mr-2"
                              @click="editLicense(item)"
                            >
                              mdi-pencil
                            </v-icon>
                          </div>
                        </div>
                        <v-list-item two-line>
                          <v-list-item-content>
                            <v-list-item-title v-if="item.company">{{
                              item.company.en
                            }}</v-list-item-title>
                            <v-list-item-title v-else>N/A</v-list-item-title>
                            <v-list-item-title v-if="item.period"
                              >{{ item.period.from }}-{{
                                item.period.to
                              }}</v-list-item-title
                            >
                            <v-list-item-title v-else>N/A</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </div>
                    </template>
                    <v-row v-else class="align-center justify-center">
                      <img
                        class="no-data-img"
                        src="../../../assets/img/no-data.png"
                        alt="no data image"
                        style="height: 15rem"
                      />
                    </v-row>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <EditInformation
        :editInformationDialog.sync="editInformationDialog"
        :employeeDataDynamic="employeeDataDynamic[0]"
      />
      <editFamilyInformationVue
        :editFamilyInformationDialog.sync="editFamilyInformationDialog"
        :employeeId="employeeId"
      />
      <editEmergencyContactVue
        :editEmergencyContact.sync="editEmergencyContact"
        :employeeId="employeeId"
      />
      <editEducationVue
        :editEducationDialog.sync="editEducationDialog"
        :employeeId="employeeId"
      />
      <editCertificationVue
        :editCerrtificationDialog.sync="editCerrtificationDialog"
        :employeeId="employeeId"
      />
      <editExperienceVue
        :editExperienceDialog.sync="editExperienceDialog"
        :employeeId="employeeId"
      />
      <editExperienceInformationDialogVue
        v-if="editExperienceInformationDialog"
        :experienceObj="experienceObj"
        :editExperienceInformationDialog.sync="editExperienceInformationDialog"
        :employeeId="employeeId"
      />
      <editEducationInformationDialogVue
        v-if="editEducationInformationDialog"
        :educationObj="educationObj"
        :editEducationInformationDialog.sync="editEducationInformationDialog"
        :employeeId="employeeId"
      />
      <editCertificationInformationDialogVue
        v-if="editCerrtificationInformationDialog"
        :licenseObj="licenseObj"
        :editCerrtificationInformationDialog.sync="
          editCerrtificationInformationDialog
        "
        :employeeId="employeeId"
      />
      <editFamilyInformationDialogVue
        v-if="editFamilyInformationDialog2"
        :familyObj="familyObj"
        :editFamilyInformationDialog2.sync="editFamilyInformationDialog2"
        :employeeId="employeeId"
      />
      <editEmergencyContactInformationDialogVue
        v-if="editEmergencyContactInformationDialog"
        :emergencyContactObj="emergencyContactObj"
        :editEmergencyContactInformationDialog.sync="
          editEmergencyContactInformationDialog
        "
        :employeeId="employeeId"
      />
    </v-container>
  </div>
  <div v-else class="load"></div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import EmployeeBalanceCard from "./employeeBalanceCard.vue";
import EditInformation from "../dialogs/editInformation.vue";
import editFamilyInformationVue from "../dialogs/editFamilyInformation.vue";
import editEmergencyContactVue from "../dialogs/editEmergencyContact.vue";
import editEducationVue from "../dialogs/editEducation.vue";
import editCertificationVue from "../dialogs/editCertification.vue";
import editExperienceVue from "../dialogs/editExperience.vue";
import deleteDialog from "../dialogs/deleteDialog.vue";
import editExperienceInformationDialogVue from "../dialogs/editExperienceInformationDialog.vue";
import editEducationInformationDialogVue from "../dialogs/editEducationInformationDialog.vue";
import editCertificationInformationDialogVue from "../dialogs/editCertificationInformationDialog.vue";
import editFamilyInformationDialogVue from "../dialogs/editFamilyInformationDialog.vue";
import editEmergencyContactInformationDialogVue from "../dialogs/editEmergencyContactInformationDialog.vue";
import {
  deleteFamilyRecord,
  deleteEmergenctContactRecordService,
  deleteCertificationRecordService,
  deleteEducationService,
  deleteExperienceService,
  getShiftTemplateService,
} from "../../../util/services/hrServices";
import swal from "sweetalert2";
import EmployeeWorkingHours from "../../../components/refactor/cards/employeeWorkingHours";
import moment from "moment";
export default {
  components: {
    EmployeeWorkingHours,
    EmployeeBalanceCard,
    EditInformation,
    editFamilyInformationVue,
    editEmergencyContactVue,
    editEducationVue,
    editCertificationVue,
    editExperienceVue,
    deleteDialog,
    editExperienceInformationDialogVue,
    editEducationInformationDialogVue,
    editCertificationInformationDialogVue,
    editFamilyInformationDialogVue,
    editEmergencyContactInformationDialogVue,
  },
  props: {
    employeeId: {
      type: String,
    },
  },

  data() {
    return {
      componentStatus: false,
      addPhotoStatus: false,
      editInformationDialog: false,
      /////////////////////
      emergencyContactObj: null,
      editEmergencyContactInformationDialog: false,
      editEmergencyContact: false,
      //////////////////
      familyObj: null,
      editFamilyInformationDialog: false,
      editFamilyInformationDialog2: false,
      //////////////////
      editEducationDialog: false,
      editEducationInformationDialog: false,
      educationObj: null,
      educationArrSorted: null,
      //////////////////
      editCerrtificationDialog: false,
      editCerrtificationInformationDialog: false,
      licenseObj: null,
      licenseArrSorted: null,
      //////////
      editExperienceDialog: false,
      experienceObj: null,
      editExperienceInformationDialog: false,
      ExperienceArrSorted: null,

      /////////////
      deleteDialog: false,
      deleteObject: null,
      deleteType: null,
      /////
      employeeDataFixed: [],
      employeeDataDynamic: [],
      employeeFamilyInformation: [],
      headers: [
        {
          text: "Name",
          align: "start",
          value: "name",
        },
        { text: "Relation", value: "relation" },
        { text: "Date of birth", value: "dob" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      emergencyContactsHeaders: [
        {
          text: "Name",
          align: "start",
          value: "name",
        },
        { text: "Relation", value: "relation" },
        { text: "Phone", value: "phone" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      employeeEmergencyContacts: [],
      shiftTemplateId: null,
      todayWorkingHour: null,
      shiftTemplate: null,
    };
  },
  computed: {
    ...mapGetters([
      "getterForEmployeeData",
      "getterForProfileLoading",
      "getterForShiftTemplateData",
    ]),
    ...mapGetters({
      activeLanguage: "activeLanguage",
      inactiveLanguage: "inactiveLanguage",
      user: "user",
      shiftTemplates: "getterForShiftTemplateData",
    }),
  },
  methods: {
    ...mapActions(["actionForEmployeeDataApi"]),
    async getData() {
      try {
        //this method for get data from getter then we rearrange the data to fit our page then we save it in state we call it fixed state

        const arr = [];

        await this.getterForEmployeeData.data.response?.forEach((element) => {
          let contract = {};
          let address = {};

          //first we add all contract information inside object then we assign this object with origin object that's include all data
          if (element.contract !== null) {
            contract.joiningDate =
              element.contract.joining_date !== null
                ? element.contract.joining_date
                : "N/A";
            contract.facility =
              element.contract.facility !== null
                ? element.contract.facility.name.en
                : "N/A";
            contract.occupation =
              element.contract.occupation !== null
                ? element.contract.occupation.name.en
                : "N/A";

            contract.personalLeaves =
              element.contract.personal_leaves !== null
                ? element.contract.personal_leaves
                : "N/A";
            contract.sickLeaves =
              element.contract.sick_leaves !== null
                ? element.contract.sick_leaves
                : "N/A";
            contract.businessLeaves =
              element.contract.business_leaves !== null
                ? element.contract.business_leaves
                : "N/A";
          }
          if (element.address !== null) {
            address.area =
              element.address[0].area !== null
                ? element.address[0].area.name.en
                : "N/A";
            address.city =
              element.address[0].city !== null
                ? element.address[0].city.name.en
                : "N/A";
            address.country =
              element.address[0].country !== null
                ? element.address[0].country.name.en
                : "N/A";
          }
          arr.push({
            employeeId: element.id,
            employeeName: element.name.en,
            employeeImg: element.image ? element.image : null,
            employeeBirth: element.dob,
            employeeEmail: element.email,
            employeeOccupation: element.occupation,
            employeeGender: element.gender ? element.gender.name.en : null,
            employeeGender2: element.gender ? element.gender : null,
            employeeNationality: element.nationality
              ? element.nationality
              : null,
            employeePrimaryPhone: element.primary_phone
              ? element.primary_phone.number
              : null,
            employeeMaritalStatus: element.martial_status
              ? element.martial_status.name.en
              : null,
            employeeMaritalStatus2: element.martial_status
              ? element.martial_status
              : null,
            employeeSecondaryPhone:
              element.secondary_phone !== null
                ? element.secondary_phone.number
                : null,

            employeeAddress: address,
            employeeFamilyInformation: element.relatedFamily
              ? element.relatedFamily
              : null,
            employeeCertifications: element.certifications,
            employeeExperience: element.experiences,
            employeeEducation: element.education ? element.education : null,
            employeeEmergencyContacts: element.emergencyContacts,
            employeeContract: contract,
          });
        });
        this.employeeDataFixed = arr;
        console.log(
          this.employeeDataFixed,
          "employeeDataDynamic[0].employeeAddress employeeDataDynamic[0].employeeAddress "
        );
      } catch (error) {
        console.log(error, "employee profile error");
      }
    },

    async deleteClickedEmergencyContact(item, type) {
      let result = swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085D6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });
      if ((await result).isConfirmed) {
        await deleteEmergenctContactRecordService({
          recordId: item.recordId,
        });
        await this.actionForEmployeeDataApi({
          employee_id: [this.employeeId],
        });

        swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    },
    async deleteLicense(item, type) {
      // this.deleteObject = item;
      // this.deleteType = type;
      // this.deleteDialog = true;
      let result = await swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      // .then((result) => {
      if ((await result).isConfirmed) {
        await deleteCertificationRecordService({
          recordId: item.id,
        });
        await this.actionForEmployeeDataApi({
          employee_id: [this.employeeId],
        });

        swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
      // });
    },
    async deleteClickedFamily(item, type) {
      let result = await swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });
      // .then((result) => {
      if ((await result).isConfirmed) {
        await deleteFamilyRecord({
          recordId: item.recordId,
        });
        await this.actionForEmployeeDataApi({
          employee_id: [this.employeeId],
        });

        swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
      // })
    },
    async deleteEducation(item, type) {
      let result = await swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });
      // .then((result) => {
      if ((await result).isConfirmed) {
        await deleteEducationService({
          recordId: item.id,
        });
        await this.actionForEmployeeDataApi({
          employee_id: [this.employeeId],
        });

        swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
      // })
    },
    async deleteExperience(item, type) {
      let result = await swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });
      // .then((result) => {
      if ((await result).isConfirmed) {
        await deleteExperienceService({
          recordId: item.id,
        });
        await this.actionForEmployeeDataApi({
          employee_id: [this.employeeId],
        });

        swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
      // })
    },
    async fetchShiftTemplateForEmployee() {
      try {
        //fetch shift template for employee
        let shiftTemplateId = this.shiftTemplateId;
        let shiftTemplate = await getShiftTemplateService({
          id: [shiftTemplateId],
        });
        console.log(shiftTemplate?.rows[0], "shiftTemplate");
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
      try {
        await this.getData();
        this.employeeDataDynamic = this.employeeDataFixed;
        const arr2 = [];
        const arr3 = [];
        await this.employeeDataDynamic[0].employeeFamilyInformation?.forEach(
          (element) => {
            arr2.push({
              recordId: element.id,
              name: element.name.en,
              relation: element.relation.name.en,
              relation2: element.relation ? element.relation : null,
              dob: element.dob,
            });
          }
        );
        this.employeeFamilyInformation = arr2;
        let newSortEducation =
          await this.employeeDataDynamic[0].employeeEducation?.sort(function (
            a,
            b
          ) {
            // sort eduaction data from newest to oldest
            return new Date(b.period.to) - new Date(a.period.from);
          });
        this.educationArrSorted = newSortEducation;

        let newSortExperience =
          await this.employeeDataDynamic[0].employeeExperience?.sort(function (
            a,
            b
          ) {
            // sort experience data from newest to oldest
            return new Date(b.period.to) - new Date(a.period.from);
          });
        this.ExperienceArrSorted = newSortExperience;
        /////////////////
        let newSortCertification =
          await this.employeeDataDynamic[0].employeeCertifications?.sort(
            function (a, b) {
              // sort certification data from newest to oldest
              return new Date(b.period.to) - new Date(a.period.from);
            }
          );
        this.licenseArrSorted = newSortCertification;
        ////////////////////
        await this.employeeDataDynamic[0].employeeEmergencyContacts?.forEach(
          (element) => {
            arr3.push({
              recordId: element.id,

              name: element.name.en,
              relation: element.relation.name.en,
              relation2: element.relation ? element.relation : null,

              phone: element.phone.number ? element.phone.number : null,
            });
          }
        );
        this.employeeEmergencyContacts = arr3;
        this.componentStatus = true;
        this.shiftTemplateId =
          this.getterForEmployeeData.data.response[0].contract.shift_template.id;

        await this.fetchShiftTemplateForEmployee();
      } catch (error) {
        console.log(error);
      }
    },
    editExpInform(item) {
      this.experienceObj = item;
      this.editExperienceInformationDialog = true;
    },
    editEducation(item) {
      this.educationObj = item;
      this.editEducationInformationDialog = true;
    },
    editLicense(item) {
      this.licenseObj = item;
      this.editCerrtificationInformationDialog = true;
    },
    editFamily(item) {
      this.familyObj = item;
      this.editFamilyInformationDialog2 = true;
    },
    editEmergencyContactInform(item) {
      this.emergencyContactObj = item;
      this.editEmergencyContactInformationDialog = true;
    },
  },
  mounted() {
    this.renderData();
  },
  watch: {
    async getterForEmployeeData() {
      try {
        await this.getData();
        this.employeeDataDynamic = this.employeeDataFixed;
        const arr2 = [];
        const arr3 = [];
        await this.employeeDataDynamic[0].employeeFamilyInformation?.forEach(
          (element) => {
            arr2.push({
              recordId: element.id,
              name: element.name.en,
              relation: element.relation.name.en,
              relation2: element.relation ? element.relation : null,

              dob: element.dob,
            });
          }
        );
        this.employeeFamilyInformation = arr2;
        let newSortEducation =
          await this.employeeDataDynamic[0].employeeEducation?.sort(function (
            a,
            b
          ) {
            // sort eduaction data from newest to oldest
            return new Date(b.period.to) - new Date(a.period.from);
          });
        this.educationArrSorted = newSortEducation;
        let newSortExperience =
          await this.employeeDataDynamic[0].employeeExperience?.sort(function (
            a,
            b
          ) {
            // sort experience data from newest to oldest
            return new Date(b.period.to) - new Date(a.period.from);
          });
        this.ExperienceArrSorted = newSortExperience;
        let newSortCertification =
          await this.employeeDataDynamic[0].employeeCertifications?.sort(
            function (a, b) {
              // sort certification data from newest to oldest
              return new Date(b.period.to) - new Date(a.period.from);
            }
          );
        this.licenseArrSorted = newSortCertification;
        await this.employeeDataDynamic[0].employeeEmergencyContacts?.forEach(
          (element) => {
            arr3.push({
              recordId: element.id,

              name: element.name.en,
              relation: element.relation.name.en,
              relation2: element.relation ? element.relation : null,
              phone: element.phone.number ? element.phone.number : null,
            });
          }
        );
        this.employeeEmergencyContacts = arr3;

        this.componentStatus = true;
        this.shiftTemplateId =
          this.getterForEmployeeData.data.response[0].contract.shift_template.id;
        await this.fetchShiftTemplateForEmployee();
      } catch (error) {
        console.log(error, "watch getterForEmployeeData error");
      }
    },
  },
};
</script>

<style scoped>
.employee-card-title {
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
  margin: 0 auto;
  width: 15vh;
  object-fit: cover;
}
.employee-profile-img-2 {
  cursor: pointer;
  height: 15vh;
  border-radius: 50%;
}
.hours-card-title {
  font-size: 1.3824rem;
  line-height: 2em;
  color: black;
  margin-top: 1em auto;
}
.imgStyle {
  background-size: cover !important; /* <------ */
  background-repeat: no-repeat !important;
  background-position: center center !important;
}

/* ///////////////////////////////// */

.experience-img {
  height: 7vh;
  border-radius: 50%;
}
.experience-title {
  font-size: 1.3824rem;
  font-weight: 500;
  color: black;
}

/* ///////////////////////// */

.employee-name {
  font-size: 1.2rem;
  font-weight: 500;
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
