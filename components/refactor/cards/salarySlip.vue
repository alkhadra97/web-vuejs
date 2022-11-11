<template>
  <v-container v-if="componentStatus">
    <p class="payslip-title">Payslip</p>
    <v-row class="justify-center">
      <v-col md="12">
        <v-card>
          <div class="payslip-card-body">
            <h4 class="payslip-subtitle">
              PAYSLIP FOR THE MONTH OF {{ getLastMonthName }} 2022
            </h4>
            <v-row>
              <v-col md="6">
                <img
                  style="max-width: 30%"
                  src="../../../assets/img/laser avenue logo.jpg"
                />
                <v-list-item three-line>
                  <v-list-item-content>
                    <v-list-item-title>
                      <span
                        class="employee-name mb-0"
                        v-if="
                          employeeDataDynamic[0] &&
                          employeeDataDynamic[0].employeeContract !== null &&
                          employeeDataDynamic[0].employeeContract.facility !==
                            null
                        "
                        >{{
                          employeeDataDynamic[0].employeeContract.facility
                        }}</span
                      >
                      <span class="employee-name mb-0" v-else>N/A</span>
                    </v-list-item-title>
                    <v-list-item-title
                      >Location:
                      <span class="employee-name mb-0">Amman, Jordan</span>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col md="6">
                <div class="invoice-details mb-20">
                  <h3 class="text-uppercase">Payslip #1111</h3>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Agents On Cloud</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col md="12" class="mb-20">
                <v-list-item four-line>
                  <v-list-item-content>
                    <v-list-item-title>
                      Employee Name:
                      <span
                        class="employee-name mb-0"
                        v-if="employeeDataDynamic[0]"
                      >
                        {{ employeeDataDynamic[0].employeeName }}
                      </span></v-list-item-title
                    >
                    <v-list-item-title
                      >Position:
                      <span
                        class="employee-name"
                        v-if="
                          employeeDataDynamic[0] &&
                          employeeDataDynamic[0].employeeContract !== null &&
                          employeeDataDynamic[0].employeeContract.occupation !==
                            null
                        "
                        >{{
                          employeeDataDynamic[0].employeeContract.occupation
                        }}</span
                      >
                      <span class="employee-name" v-else>N/A</span>
                    </v-list-item-title>

                    <v-list-item-title
                      >Employee ID:
                      <span class="employee-name">
                        <!-- {{ info[0].employeeNumber }} -->
                      </span>
                    </v-list-item-title>
                    <v-list-item-title
                      >Joining Date:
                      <span
                        class="employee-name"
                        v-if="
                          employeeDataDynamic[0] &&
                          employeeDataDynamic[0].employeeContract !== null &&
                          employeeDataDynamic[0].employeeContract
                            .joiningDate !== null
                        "
                      >
                        {{
                          employeeDataDynamic[0].employeeContract.joiningDate
                        }}
                        <!-- {{ info[0].createdAt.substring(0, 10) }} -->
                      </span>
                      <span class="employee-name" v-else> N/A </span>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
            <v-row>
              <v-col md="6">
                <div>
                  <h4 class="mb-10"><strong>Earnings</strong></h4>
                  <table>
                    <tbody>
                      <tr>
                        <td data-column="USERNAME">
                          <strong>Basic Salary</strong>
                          <span
                            class="earnings-span-dollar"
                            v-if="salaryObj.salary !== null"
                            >{{ salaryObj.salary }} JOD</span
                          >
                          <span class="earnings-span-dollar" v-else>N/A</span>
                        </td>
                      </tr>
                      <tr>
                        <td data-column="USERNAME">
                          <strong>Commesion</strong>
                          <span
                            class="earnings-span-dollar"
                            v-if="salaryObj.commission !== null"
                            >{{ salaryObj.commission }} JOD</span
                          >
                          <span class="earnings-span-dollar" v-else>N/A</span>
                        </td>
                      </tr>
                      <tr>
                        <td data-column="USERNAME">
                          <strong>Other</strong>
                          <span
                            class="earnings-span-dollar"
                            v-if="salaryObj.other !== null"
                            >{{ salaryObj.other }} JOD</span
                          >
                          <span class="earnings-span-dollar" v-else>N/A</span>
                        </td>
                      </tr>

                      <tr>
                        <td data-column="USERNAME">
                          <strong>Total Earnings</strong>
                          <!-- <span class="earnings-span-dollar">{{
                                parseInt(getExpensesForEmployee[0].basic_Salary) +
                                parseInt(getExpensesForEmployee[0].incentive) +
                                parseInt(getExpensesForEmployee[0].service_cut)
                              }}</span> -->
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </v-col>
              <v-col md="6">
                <div>
                  <h4 class="mb-10"><strong>Deductions</strong></h4>
                  <table>
                    <tbody>
                      <tr>
                        <td data-column="USERNAME">
                          <strong>Discount </strong>
                          <span
                            class="earnings-span-dollar"
                            v-if="salaryObj.discount !== null"
                            >{{ salaryObj.discount }} JOD</span
                          >
                          <span class="earnings-span-dollar" v-else>N/A</span>
                        </td>
                      </tr>

                      <tr>
                        <td data-column="USERNAME">
                          <strong>Total Deduction</strong>
                          <!-- <span class="earnings-span-dollar">{{
                                parseInt(getExpensesForEmployee[0].discount)
                              }}</span> -->
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </v-col>
              <v-col md="12">
                <p>
                  <!-- <strong
                        >Net Salary:
                        <span class="netsalary"
                          >{{
                            parseInt(getExpensesForEmployee[0].basic_Salary) +
                            parseInt(getExpensesForEmployee[0].incentive) +
                            (parseInt(getExpensesForEmployee[0].service_cut) -
                              parseInt(getExpensesForEmployee[0].discount))
                          }}
                          JOD</span
                        ></strong
                      > -->
                </p>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import GoBack from "../../../components/GoBack.vue";
import { mapGetters, mapActions } from "vuex";
import { getEmployeesSalariesService } from "../../../util/services/sharedServices";
export default {
  data() {
    return {
      total: null,
      employeeDataFixed: [],
      employeeDataDynamic: [],
      employeeFamilyInformation: [],
      employeeEmergencyContacts: [],
      componentStatus: false,
      salaryObj: {},
    };
  },

  methods: {
    ...mapActions([]),
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
            recordId: element.id,
            employeeName: element.name.en,
            employeeBirth: element.dob,
            employeeGender: element.gender ? element.gender.name.en : "N/A",
            employeeMaritalStatus: element.martial_status
              ? element.martial_status.name.en
              : "N/A",
            employeeNationality: element.nationality
              ? element.nationality
              : "N/A",
            employeeEmail: element.email,
            employeeOccupation: element.occupation,
            employeePrimaryPhone: element.primary_phone
              ? element.primary_phone.number
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
            employeeEducation: element.education,
            employeeEmergencyContacts: element.emergencyContacts,
            employeeContract: contract,
          });
        });
        this.employeeDataFixed = arr;
      } catch (error) {
        console.log(error, "employee profile error");
      }
    },
    async renderData() {
      let salaryResponse = await getEmployeesSalariesService({
        employeeId: "HRS-HRP-JOR-d8b5f446-dda3-41b3-b66d-879cd1ea1e60",
      });
      this.salaryObj.salary = salaryResponse.data.rows[0].salary
        ? salaryResponse.data.rows[0].salary
        : null;
      this.salaryObj.commission = salaryResponse.data.rows[0].commission
        ? salaryResponse.data.rows[0].commission
        : null;
      this.salaryObj.other = salaryResponse.data.rows[0].other
        ? salaryResponse.data.rows[0].other
        : null;

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
            dob: element.dob,
          });
        }
      );
      this.employeeFamilyInformation = arr2;
      await this.employeeDataDynamic[0].employeeEmergencyContacts?.forEach(
        (element) => {
          arr3.push({
            recordId: element.id,

            name: element.name.en,
            relation: element.relation.name.en,
            phone:
              "+" + element.phone.country_code + "-" + element.phone.number,
          });
        }
      );
      this.employeeEmergencyContacts = arr3;
      this.componentStatus = true;
    },
  },
  computed: {
    ...mapGetters(["getterForEmployeeData"]),
    getLastMonthName() {
      try {
        let current = new Date();
        current.setMonth(current.getMonth() - 1);
        let previousMonth = current.toLocaleString("default", {
          month: "long",
        });
        return previousMonth;
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    try {
      this.renderData();
    } catch (error) {
      console.log(error);
    }
  },
  watch: {},
  components: { GoBack },
};
</script>
<style scoped>
.payslip-title {
  margin-top: 1em;
  margin-left: 2.9em;
  font-style: normal;
  font-weight: 400;
  font-size: 32px;
  line-height: 37px;
  border-bottom: 1px solid #cfcccc;
  width: 20%;
}
.payslip-card-body {
  flex: 1 1 auto;
  padding: 1rem 1rem;
}
.payslip-subtitle {
  text-align: center;
  text-decoration: underline;
  text-transform: uppercase;
  margin: 0 0 20px;
}
.employee-name {
  font-size: 1.2rem;
  font-weight: 500;
}
.invoice-details {
  float: right;
  text-align: right;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
  color: #212529 !important;
  vertical-align: top;
  border-color: #dee2e6;
}

th {
  background: #35b5ac;
  color: white;
  font-weight: bold;
}
.earnings-span-dollar {
  float: right;
}

td,
th {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: left;
  font-size: 1.1rem;
}
.netsalary {
  font-size: 1.3rem;
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
