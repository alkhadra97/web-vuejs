<template>
  <div>
    <v-dialog
      v-model="showEditInformationDialog"
      persistent
      width="782.5"
      height="471.5"
    >
      {{ assignDialog }}
      <v-col md="12" class="pa-0">
        <!-- <v-row class="align-center justify-center"> -->
        <v-card>
          <v-card-title>
            <span class="request-title">Add family Member</span>
          </v-card-title>

          <v-divider class="mx-4"></v-divider>
          <v-card-text>
            <v-container>
              <v-form v-model="isFormValid">
                <!-- /////////////////////////////// -->

                <v-row v-for="(item, index) in family" :key="index">
                  <v-col md="6">
                    <v-text-field
                      v-model="item.name"
                      name="name"
                      type="text"
                      outlined
                      dense
                      label="Name"
                      hide-details
                      color="#194569"
                      :rules="[rules.required]"
                    ></v-text-field>
                  </v-col>
                  <v-col md="6">
                    <v-autocomplete
                      v-model="item.relation"
                      :items="relations"
                      :item-text="`name`"
                      item-value="id"
                      name="relation"
                      type="text"
                      outlined
                      dense
                      label="Relationship"
                      hide-details
                      color="#194569"
                      :rules="[rules.required]"
                      return-object
                    >
                      <template v-slot:selection="{ item }">
                        {{ getName(item) }}
                      </template>
                      <template v-slot:item="{ item }">
                        {{ getName(item) }}
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <v-col md="6">
                    <v-text-field
                      v-model="item.dob"
                      name="dob"
                      type="date"
                      outlined
                      :rules="[rules.required]"
                      :max="nowDate"
                      dense
                      label="Date Of Birth"
                      hide-details
                      color="#194569"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <!-- ////////////////////// -->
                <v-btn
                  color="#194569"
                  class="white--text mt-5"
                  @click="addNewFields"
                >
                  <v-icon>mdi-plus</v-icon>
                  family member
                </v-btn>
                <v-icon
                  v-if="family.length > 1"
                  class="cursor"
                  @click="removeField(index)"
                  color="red"
                >
                  mdi-minus
                </v-icon>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="secondry-btn" @click="close"> Close </v-btn>
            <v-btn
              @click="saveNewInformation()"
              color="#194569"
              :disabled="!isFormValid"
              class="white--text"
              type="submit"
            >
              Add
            </v-btn>
          </v-card-actions>
        </v-card>
        <!-- </v-row> -->
      </v-col>
    </v-dialog>
    <!-- <v-row v-if="requested">
          <PopupSuccess :dialog2.sync="dialog2" />
        </v-row> -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import PopupSuccess from "../../dialogs/PopupSuccess.vue";
import { addNewFamilyMembersService } from "../../../util/services/hrServices";
import { getAllRelations } from "../../../util/services/sharedServices";

export default {
  components: { PopupSuccess },

  props: {
    editFamilyInformationDialog: {
      type: Boolean,
      default: false,
    },
    employeeId: {
      type: String,
    },
  },
  data() {
    return {
      showEditInformationDialog: false,
      isFormValid: false,
      nowDate: new Date().toISOString().slice(0, 10),
      relations: [],
      rules: {
        required: (value) => !!value || "Required.",
      },
      fakeData: [
        { id: 1, name: { ar: "", en: "brother" } },
        { id: 2, name: { ar: "", en: "sister" } },
        { id: 3, name: { ar: "", en: "father" } },
        { id: 4, name: { ar: "", en: "mother" } },
      ],
      family: [
        {
          name: null,
          relation: null,
          dob: null,
        },
      ],
    };
  },

  computed: {
    ...mapGetters(["getterForEmployeesInformation"]),
    assignDialog() {
      this.showEditInformationDialog = this.editFamilyInformationDialog;
    },
    // activeLanguage: "activeLanguage",
    // inactiveLanguage: "inactiveLanguage",
  },
  methods: {
    ...mapActions(["actionForEmployeeDataApi"]),
    resetField() {
      this.family = [
        {
          name: null,
          relation: null,
          dob: null,
        },
      ];
    },
    close() {
      this.resetField();
      this.$emit("update:editFamilyInformationDialog", false);
    },
    addNewFields() {
      this.family.push({
        name: null,
        relation: null,
        dob: null,
      });
    },
    removeField(index) {
      this.family.splice(-1);
    },
    getName: (item) => `${item.name.en}`,

    async saveNewInformation() {
      try {
        let familyArr = [];
        console.log(this.family, " this.family this.family this.family");
        this.family.forEach((element) => {
          familyArr.push({
            name:
              element.name !== null
                ? {
                    ar: "",
                    en: element.name,
                  }
                : null,

            relation: element.relation !== null ? element.relation : null,
            dob: element.dob !== null ? element.dob : null,
          });
        });
        await addNewFamilyMembersService({
          hrsMtProfileId: this.employeeId,
          family: familyArr,
          createdBy: {
            id: "1",
            user: {
              ar: "",
              en: "beshir",
            },
            system: "agents",
            chanel: "12",
          },
        });
        await this.actionForEmployeeDataApi({
          employee_id: [this.employeeId],
        });
        await this.resetField();

        this.$emit("update:editFamilyInformationDialog", false);
      } catch (error) {
        console.log(error, "edit family information error");
      }
    },
    async fetchAllSharedAPIs() {
      try {
        this.relations = await getAllRelations();
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {
    try {
      this.fetchAllSharedAPIs();
    } catch (e) {}
  },
  watch: {},
};
</script>

<style scoped>
.request-title {
  font-size: 1.404rem;
  color: #194569;
  margin-top: 2em auto;
  padding-bottom: 0.2em;
}
.secondry-btn {
  background: transparent !important;
  border: 1px solid #194569 !important;
}
</style>
