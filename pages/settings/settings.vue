<template>
  <v-container fluid class="ml-2">
    <v-row>
      <v-col md="12">
        <v-row class="d-flex justify-end align-content-end">
          <v-btn
            class="mr-10 white--text"
            color="blue1"
            @click="openAddWorkingHoursDialog"
          >
            <v-icon class="mr-2">mdi-plus-circle</v-icon>
            Add Working Days
          </v-btn>
        </v-row>
        <v-row>
          <v-col md="2">
            <v-card height="400" width="256" elevation="0">
              <v-navigation-drawer permanent>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="text-h6">
                      Settings
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list dense nav>
                  <v-list-item v-for="item in items" :key="item.title" link>
                    <v-list-item-icon>
                      <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content @click="selectedTab = item.id">
                      <v-list-item-title class="text-h6"
                        >{{ item.title }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-navigation-drawer>
            </v-card>
          </v-col>
          <v-col md="10">
            <!--            show components depends on selected tab-->
            <template v-if="selectedTab === 1">
              <v-container class="mt-10">
                <WorkingHoursTable :shiftTemplates="shiftTemplates.rows" />
              </v-container>
            </template>
            <template v-if="selectedTab === 2">
              <v-container class="mt-10">
                <h2>Holidays Coming Soon</h2>
              </v-container>
            </template>
            <template v-if="selectedTab === 3">
              <v-container class="mt-10">
                <h2>Leaves Coming Soon</h2>
              </v-container>
            </template>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <template v-if="addWorkingDayDialog">
      <AddWorkingDay
        :addWorkingDayDialog="addWorkingDayDialog"
        @close="close"
      />
    </template>
  </v-container>
</template>

<script>
import WorkingHoursTable from "../../components/refactor/workingDays/WorkingHoursTable/WorkingHoursTable";
import AddWorkingDay from "../../components/refactor/workingDays/AddWorkingDay/AddWorkingDay";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "settings",
  components: { AddWorkingDay, WorkingHoursTable },
  layout: "dashboard",
  props: {
    msg: String,
  },
  data() {
    return {
      selectedTab: 1,
      addWorkingDayDialog: false,
      items: [
        {
          id: 1,
          title: "Working Days",
          icon: "mdi-view-dashboard",
          component: "WorkingDays",
        },
        {
          id: 2,
          title: "Holidays",
          icon: "mdi-image",
        },
        { id: 3, title: "Leaves", icon: "mdi-help-box" },
      ],
      right: null,
    };
  },
  computed: {
    ...mapGetters({
      activeLanguage: "activeLanguage",
      inactiveLanguage: "inactiveLanguage",
      hrSettings: "getterForSettingsData",
      shiftTemplates: "getterForShiftTemplateData",
    }),
  },
  methods: {
    ...mapActions([
      "actionForGetSettingsDataApi",
      "actionForGetShiftTemplateApi",
    ]),
    openAddWorkingHoursDialog() {
      this.addWorkingDayDialog = true;
    },
    close() {
      this.addWorkingDayDialog = false;
    },
  },
  mounted() {
    this.actionForGetSettingsDataApi();
    this.actionForGetShiftTemplateApi();
  },
};
</script>

<style scoped></style>
