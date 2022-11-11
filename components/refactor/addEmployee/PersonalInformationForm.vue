<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-container>
      <h1 class="blue1--text font-weight-bold mb-5">Personal Information</h1>
      <v-row class="justify-center align-center flex-column pt-10">
        <v-col md="12">
          <v-row>
            <v-col md="4">
              <span>First Name</span>
              <v-text-field
                label="First Name"
                outlined
                dense
                v-model="firstName"
                :rules="nameRules"
                :error-messages="firstNameErrorMessage"
              ></v-text-field>
            </v-col>
            <v-col md="4">
              <span>Middle Name</span>
              <v-text-field
                label="Middle Name"
                outlined
                dense
                v-model="middleName"
              ></v-text-field>
            </v-col>
            <v-col md="4">
              <span>Last Name</span>
              <v-text-field
                label="Last Name"
                outlined
                dense
                v-model="lastName"
                :rules="nameRules"
                :error-messages="lastNameErrorMessage"
              ></v-text-field>
            </v-col>
          </v-row>
          <!--        birth date and gender select-->
          <v-row>
            <v-col md="4">
              <span class="blue1--text">Birth Date</span>
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="employeeBirth"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    class="mt-2"
                    v-model="employeeBirth"
                    label="Select date"
                    prepend-icon="mdi-calendar"
                    readonly
                    outlined
                    dense
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="employeeBirth"
                  no-title
                  scrollable
                  :max="minBirth"
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu = false">
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.menu.save(employeeBirth)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col md="4">
              <span class="blue1--text"> Gender </span>
              <v-select
                label="Gender"
                v-model="gender"
                class="mt-2"
                outlined
                :items="genders"
                :item-text="`name.${activeLanguage}`"
                item-value="id"
                dense
                return-object
              >
              </v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="4">
              <span class="blue1--text">Material Status</span>
              <v-select
                label="Marital Status"
                v-model="martialStatus"
                :item-text="`name.${activeLanguage}`"
                class="mt-2"
                outlined
                :items="martialStatuses"
                dense
                return-object
              >
              </v-select>
            </v-col>
            <v-col md="4">
              <span class="blue1--text"> Nationality </span>
              <v-autocomplete
                label="Nationality"
                v-model="nationality"
                :item-text="`name.${activeLanguage}`"
                class="mt-2"
                outlined
                :items="nationalities"
                dense
                return-object
              >
              </v-autocomplete>
            </v-col>
          </v-row>
          <!--        contact-->
          <h2 class="blue1--text font-weight-bold mb-5">Contact</h2>
          <v-row class="justify-start align-center">
            <v-col md="3">
              <span class="blue1--text">Email</span>
              <v-text-field
                label="Email"
                outlined
                dense
                v-model="email"
                :rules="emailRules"
                :error-messages="emailErrorMessage"
              ></v-text-field>
            </v-col>
            <v-col md="3">
              <span class="blue1--text">Identification</span>
              <v-select
                label="Identification"
                v-model="identification"
                :item-text="`name.${activeLanguage}`"
                class="mt-2"
                item-value="id"
                outlined
                :items="identifications"
                dense
                return-object
              >
              </v-select>
            </v-col>
            <v-col md="3">
              <!--            button upload File-->
              <v-btn
                depressed
                color="blue1"
                class="white--text"
                @click="openDMS"
              >
                Upload File
              </v-btn>
            </v-col>
          </v-row>
          <!--        mobile phone primary and secondary-->
          <v-row>
            <v-col md="3">
              <span class="blue1--text">Mobile Phone Primary</span>
              <v-text-field
                label="Mobile Phone Primary"
                outlined
                dense
                v-model="mobilePhonePrimary"
                :rules="mobilePhonePrimaryRules"
              ></v-text-field>
            </v-col>
            <v-col md="3">
              <span class="blue1--text">Mobile Phone Secondary</span>
              <v-text-field
                label="Mobile Phone Secondary"
                outlined
                dense
                v-model="mobilePhoneSecondary"
                :rules="mobilePhoneSecondaryRules"
              ></v-text-field>
            </v-col>
          </v-row>
          <!--        Address component-->
          <h2 class="blue1--text font-weight-bold mb-5">Address</h2>
          <v-row>
            <v-col cols="12" md="3">
              <v-autocomplete
                outlined
                label="Country"
                color="#5F84A2"
                :items="countries"
                :item-text="`name[${activeLanguage}]`"
                v-model="country"
                return-object
                dense
                :error-messages="errorCountryMessages"
                @change="errorCountryMessages = ''"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="3">
              <v-autocomplete
                outlined
                label="City"
                color="#5F84A2"
                :items="citiesItems"
                :item-text="`name[${activeLanguage}]`"
                v-model="city"
                return-object
                dense
                :error-messages="errorCityMessages"
                @change="errorCityMessages = ''"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="3">
              <v-autocomplete
                outlined
                label="Area"
                color="#5F84A2"
                :items="areiesItems"
                :item-text="`name[${activeLanguage}]`"
                v-model="area"
                return-object
                dense
                :error-messages="errorAreaMessages"
                @change="errorAreaMessages = ''"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="3">
              <v-text-field
                label="Landmark"
                outlined
                dense
                color="#5F84A2"
                v-model="landmark"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                label="Street"
                outlined
                dense
                color="#5F84A2"
                v-model="street"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                label="Name of Building"
                outlined
                dense
                color="#5F84A2"
                v-model="nameBuilding"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-divider class="mb-5"></v-divider>
      <v-btn
        depressed
        color="blue1"
        :disabled="
          !valid || !firstName || !lastName || !mobilePhonePrimary || !country
        "
        class="white--text d-flex align-center float-end"
        @click="getInputsData"
      >
        Next
      </v-btn>
    </v-container>
    <template v-if="dmsDialog">
      <uploadComponent
        :show-dms-dialog="dmsDialog"
        @fileData="fileData"
        @close="close"
      />
    </template>
  </v-form>
</template>

<script>
import {
  getAllGenders,
  getAllMaritalStatuses,
  getAllNationalities,
  getAllIdTypes,
  getAllCities,
  getAreaByCityAPI,
  getAllCountries,
} from "../../../util/services/sharedServices";
import uploadComponent from "../../../../web.dms.agentsoncloud.com/components/UploadComponent";
import { mapGetters, mapMutations } from "vuex";
import Swal from "sweetalert2";
export default {
  name: "PersonalInformationForm",
  props: {
    activeLanguage: {
      type: String,
      default: "en",
    },
  },
  components: {
    uploadComponent,
  },
  data() {
    return {
      firstName: "",
      middleName: "",
      lastName: "",
      dmsDialog: false,
      gender: "",
      employeeBirth: "",
      valid: true,
      menu: false,
      minDate: new Date().toISOString().substr(0, 10),
      //birthdate should be more than 18 years only
      minBirth: new Date(new Date().setFullYear(new Date().getFullYear() - 18))
        .toISOString()
        .substr(0, 10),
      genders: [],
      martialStatus: "",
      martialStatuses: ["Single", "Married"],
      email: "",
      validate: false,
      emailErrorMessage: "",
      lastNameErrorMessage: "",
      firstNameErrorMessage: "",
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      identification: "",
      identifications: ["Passport", "ID Card"],
      mobilePhonePrimary: "",
      mobilePhonePrimaryRules: [
        (v) => !!v || "Mobile Phone Primary is required",
        (v) => /^\d{10}$/.test(v) || "Mobile Phone Primary must be valid",
      ],
      mobilePhoneSecondary: "",
      nationality: "",
      nationalities: ["Egyptian", "Other"],
      mobilePhoneSecondaryRules: [
        (v) => /^\d{10}$/.test(v) || "Mobile Phone Secondary must be valid",
        // secondary phone should be different from primary phone
        (v) =>
          v !== this.mobilePhonePrimary ||
          "Mobile Phone Secondary must be different from Mobile Phone Primary",
      ],
      citiesItems: [],
      areiesItems: [],
      country: null,
      city: null,
      area: null,
      landmark: null,
      street: null,
      isPrimary: false,
      numberBuilding: null,
      nameBuilding: null,
      errorCountryMessages: "",
      errorCityMessages: "",
      errorAreaMessages: "",
      countries: [],
      nameRules: [(v) => !!v || "Name is required"],
      //===========
      fileDMS: null,
    };
  },
  computed: {
    ...mapGetters({
      activeLanguage: "activeLanguage",
      inactiveLanguage: "inactiveLanguage",
      user: "user",
      personalInformation: "getPersonalInformation",
    }),
  },
  methods: {
    ...mapMutations({
      setPersonalInfo: "SET_PERSONAL_INFO",
      setImages: "SET_PERSONAL_FILES",
      setLoading:"SET_SAVE_EMPLOYEE_LOADING"
    }),
    openDMS() {
      try {
        this.dmsDialog = true;
      } catch (e) {
        console.log(e);
      }
      console.log("upload file");
    },
    fileData(file) {
      try {
        this.fileDMS = file;
        this.setImages(this.fileDMS);
        this.dmsDialog = false;
      } catch (e) {
        console.log(e);
      }
    },
    close(state) {
      this.dmsDialog = state;
      // this.dmsDialog=f
    },
    async fetchAllSharedAPIs() {
      try {
        this.getOldValue();
        // console.log(this.allGenders, "genders");
        const genders = await getAllGenders();
        this.genders = genders;
        const martialStatuses = await getAllMaritalStatuses();
        this.martialStatuses = martialStatuses;
        const nationalities = await getAllNationalities();
        this.nationalities = nationalities;
        const identifications = await getAllIdTypes();
        this.identifications = identifications;
        console.log(genders, "genders");
        this.countries = await getAllCountries();
        console.log(this.countries, "  getAllCountries");
      } catch (e) {
        console.log(e);
      }
    },
    async getInputsData() {
      try {
        this.$refs.form.validate(); //validate the form
        //mobilePhoneSecondaryRules not required
        if (this.$refs.form.validate() || !this.mobilePhoneSecondary) {
          {
            let personalInformation = {
              name: {
                [this.inactiveLanguage]: `${this.firstName} ${
                  this.middleName ?? ""
                } ${this.lastName}`,
                [this.activeLanguage]: `${this.firstName} ${
                  this.middleName ?? ""
                } ${this.lastName}`,
              },
              dob: this.employeeBirth,
              gender: {
                id: this.gender.id,
                name: this.gender.name,
              },
              martialStatus: {
                id: this.martialStatus.id,
                name: this.martialStatus.name,
              },
              nationality: {
                id: this.nationality.id,
                name: this.nationality.name,
              },
              identification: {
                type: {
                  id: this.identification?.id,
                  name: this.identification?.name,
                },
                number: null,
                image: "",
              },
              primaryPhone: {
                country_code: "962",
                number: this.mobilePhonePrimary,
              },
              secondaryPhone: {
                country_code: "962",
                number: this.mobilePhoneSecondary ?? null,
              },
              email: this.email,
              createdBy: {
                user: {
                  id: this.user?.id,
                  name: this.user.name,
                },
                system: "",
                channel: "",
              },
            };
            let addressInformation = {
              employee: null,
              country: this.country,
              city: this.city,
              area: this.area,
              landmark: this.landmark,
              street: this.street,
              building: this.nameBuilding,
              createdBy: {
                user: {
                  id: this.user.id,
                  name: {
                    [this.inactiveLanguage]:
                      this.user.name[this.inactiveLanguage],
                    [this.activeLanguage]: this.user.name[this.activeLanguage],
                  },
                },
                system: "",
                channel: "",
              },
            };
            await this.setPersonalInfo({
              personalInfo: personalInformation,
              addressInformation: addressInformation,
            }); //personalInformation
            this.$emit("nextStep", 2);
          }
        } else {
          this.$emit("validate", {
            validate: false,
          });
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please fill all required fields",
          });
        }
      } catch (e) {
        console.log(e, "inputs error");
      }
    },
    getOldValue() {
      let first;
      this.firstName = this.personalInformation?.personalInfo?.name?.en || "";
      //split name to first name , middle name , last name
      if (this.firstName) {
        first = this.firstName.split(" ");
        this.firstName = first[0];
        this.middleName = first[1];
        this.lastName = first[2];
      }
      console.log(this.personalInformation?.personalInfo);
      this.employeeBirth = this.personalInformation?.personalInfo?.dob || "";
      this.gender = this.personalInformation?.personalInfo?.gender || "";
      this.martialStatus =
        this.personalInformation?.personalInfo?.martialStatus?.name.en || "";
      this.nationality =
        this.personalInformation?.personalInfo?.nationality?.name.en || "";
      this.email = this.personalInformation?.personalInfo?.email || "";
      this.identification =
        this.personalInformation?.personalInfo?.identification?.type?.name
          ?.en || "";
      this.mobilePhonePrimary =
        this.personalInformation?.personalInfo?.primaryPhone.number || "";
      this.mobilePhoneSecondary =
        this.personalInformation?.personalInfo?.secondaryPhone?.number || "";
      this.country =
        this.personalInformation?.addressInformation?.country?.name?.en || "";
      this.city = this.personalInformation?.addressInformation?.city?.name?.en || "";
      this.area = this.personalInformation?.addressInformation?.area?.name?.en || "";
      this.landmark =
        this.personalInformation?.addressInformation?.landmark || "";
      this.street = this.personalInformation?.addressInformation?.street || "";
      this.nameBuilding =
        this.personalInformation?.addressInformation?.building || "";
      console.log("fffffffff", this.firstName);
    },
  },
  mounted() {
    try {
      this.fetchAllSharedAPIs();
    } catch (e) {
      console.log(e);
    }
  },
  watch: {
    async country() {
      if (!this.country) {
        this.citiesItems = [];
        this.city = null;
      } else {
        this.citiesItems = await getAllCities({ id: [this.country.id] });
        console.log(this.citiesItems, "citiesItems");
      }
    },
    async city() {
      if (!this.city) {
        this.areiesItems = [];
        this.area = null;
      } else {
        this.areiesItems = await getAreaByCityAPI({ id: [this.city.id] });
      }
    },
  },
};
</script>

<style scoped></style>
