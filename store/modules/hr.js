import axios from "axios";
import { getFormattedDate } from "../../util/dateFormatting";
import {
  getSettingsDataService,
  getEmployeesInforamtionService,
  getEmployeeFullDataService,
  getLeaveRequestService,
  getTimeAttendanceDataService,
  getTimeAttendanceEmployeeService,
  getShiftTemplateService,
  createNewEmployeeService,
  createNewContractService,
  addNewAddressService,
  updateEmployeeInformation,
  addAttachment,
} from "../../util/services/hrServices";
import {
  getEmployeesSalariesService,
  moveFileToDMS,
} from "../../util/services/sharedServices";
import Swal from "sweetalert2";
import { uploadFile } from "../../../web.dms.agentsoncloud.com/static/services/dmsMethod";
const Hr = {
  state: {
    ////////////////////////////////////////////////////
    ///refactor
    ///////////////////////
    ///get employees information
    getEmployeesInformation: [],
    /// get employee full data
    getEmployeeFullData: [],
    employeeProfileLoading: false,
    ///get all leave request for all employees
    getLeaveRequests: [],
    ///get all time attendance for all employees
    getTimeAttendance: [],
    // employees data and time attendance state for today
    getEmployeesTimeAttendanceData: [],
    timeAttendanceEmployeesLoading: false,
    //data state for settings
    settingsData: [],
    //salaries data
    salariesData: [],
    // shift template data
    shiftTemplateData: [],
    days: [],
    //employee
    //employee
    employee: null,
    personalInformation: null,
    employeeDetails: null,
    contractDetails: null,
    todayWorkingHour: null,
    saveEmployeeDataLoading: false,
    //=======================
    personalFiles: null,
  },

  mutations: {
    ////////////////////////////////////////////
    ///refactor
    //////////////////////////
    ///mutation for employees information
    GET_EMPLOYEES_INFORMATION(state, payload) {
      return (state.getEmployeesInformation = payload);
    },
    ///mutation for employee full data
    GET_EMPLOYEE_FULL_DATA(state, payload) {
      return (state.getEmployeeFullData = payload);
    },
    SET_PROFILE_LOADING(state, payload) {
      return (state.employeeProfileLoading = payload);
    },
    ///mutation for leave requests
    GET_LEAVE_REQUESTS(state, payload) {
      return (state.getLeaveRequests = payload);
    },
    ///mutation for time attendance
    GET_TIME_ATTENDANCE(state, payload) {
      return (state.getTimeAttendance = payload);
    },
    GET_EMPLOYEES_TIME_ATTENDANCE(state, payload) {
      return (state.getEmployeesTimeAttendanceData = payload);
    },
    SET_EMPLOYEES_TIME_LOADING(state, payload) {
      return (state.timeAttendanceEmployeesLoading = payload);
    },
    ///settings mutation
    GET_SETTINGS_DATA(state, payload) {
      return (state.settingsData = payload);
    },
    ///salaries mutation
    GET_SALARIES_DATA(state, payload) {
      return (state.salariesData = payload);
    },
    ///shift template mutation
    GET_SHIFT_TEMPLATE_DATA(state, payload) {
      return (state.shiftTemplateData = payload);
    },
    CHANGE_DAY_VALUES(state, payload) {
      return (state.days = payload);
      // return (state.days = payload);
    },
    SET_EMPLOYEE_DATA(state, payload) {
      return (state.employee = payload);
    },
    SET_PERSONAL_INFO(state, payload) {
      console.log(payload, "SET_PERSONAL_INFO");
      return (state.personalInformation = payload);
    },
    SET_CONTRACT_DATA(state, payload) {
      console.log(payload, "SET_CONTRACT_DATA");
      return (state.contractDetails = payload);
    },
    SET_EMPLOYMENT_INFO(state, payload) {
      return (state.employeeDetails = payload);
    },
    SET_TODAY_TIME_WORKING_HOUR(state, payload) {
      return (state.todayWorkingHour = payload);
    },
    SET_PERSONAL_FILES(state, payload) {
      return (state.personalFiles = payload);
    },
    SET_SAVE_EMPLOYEE_LOADING(state, payload) {
      return (state.saveEmployeeDataLoading = payload);
    },
  },
  actions: {
    ///refactor
    ////////////////
    // actions for employees information
    async actionForEmployeesInformationApi({ commit }, payload) {
      //get employees data from HRS_MT_Profile table depending on payload you sent
      try {
        let path = await getEmployeesInforamtionService({
          limit: payload.limit ? payload.limit : 0,
          offset: payload.offset ? payload.offset : 0,
          arrayId: payload.employeeId ? payload.employeeId : null,
          identification: payload.identification
            ? payload.identification
            : null,
          name: payload.name ? payload.name : null,
          dob: payload.dob ? payload.dob : null,
          primaryPhone: payload.primaryPhone ? payload.primaryPhone : null,
          secondaryPhone: payload.secondaryPhone
            ? payload.secondaryPhone
            : null,
          email: payload.email ? payload.email : null,
          genderId: payload.genderId ? payload.genderId : null,
          nationalityId: payload.nationalityId ? payload.nationalityId : null,
          martialStatusId: payload.martialStatusId
            ? payload.martialStatusId
            : null,
          occupationId: payload.occupationId ? payload.occupationId : null,
        });

        commit("GET_EMPLOYEES_INFORMATION", path.data);
      } catch (error) {
        console.error(error.toString());
      }
    },
    // actions for employee full data
    async actionForEmployeeDataApi({ commit }, payload) {
      //this api to get all employee data from many tables

      try {
        let path = await getEmployeeFullDataService({
          employee_id: payload.employee_id ? payload.employee_id : null,
        });
        await commit("GET_EMPLOYEE_FULL_DATA", path.data);
        commit("SET_PROFILE_LOADING", true);
      } catch (error) {
        console.error(error.toString());
      }
    },
    // actions for leave requets api
    async actionForLeaveRequets({ commit }, payload) {
      //get leave data depending on payload you sent
      try {
        let path = await getLeaveRequestService({
          limit: payload.limit ? payload.limit : 0,
          offset: payload.offset ? payload.offset : 0,
          arrayId: payload.employeeId ? payload.employeeId : null,
          leaveTypeId: payload.leaveTypeId ? payload.leaveTypeId : null,
          subLeaveType: payload.subLeaveType ? payload.subLeaveType : null,
          leaveStatus: payload.leaveStatus ? payload.leaveStatus : null,
        });
        // axios.post(
        //   `http://localhost:31602/hr/leaves/getLeaves`,
        //   {
        //     limit: payload.limit ? payload.limit : 0,
        //     offset: payload.offset ? payload.offset : 0,
        //     arrayId: payload.employeeId ? payload.employeeId : null,
        //     leaveTypeId: payload.leaveTypeId ? payload.leaveTypeId : null,
        //     subLeaveType: payload.subLeaveType ? payload.subLeaveType : null,
        //     leaveStatus: payload.leaveStatus ? payload.leaveStatus : null,
        //   }
        // );
        commit("GET_LEAVE_REQUESTS", path.data);
      } catch (error) {
        console.error(error.toString());
      }
    },
    // actions for time attendance api
    async actionForTimeAttendance({ commit }, payload) {
      //get time attendance data depending on payload you sent
      try {
        let path = await getTimeAttendanceDataService({
          limit: payload.limit ? payload.limit : 0,
          offset: payload.offset ? payload.offset : 0,
          arrayId: payload.employeeId ? payload.employeeId : null,
          inStatus: payload.inStatus ? payload.inStatus : null,
          outStatus: payload.outStatus ? payload.outStatus : null,
          dateFrom: payload.dateFrom ? payload.dateFrom : null,
          dateTo: payload.dateTo ? payload.dateTo : null,
        });
        commit("GET_TIME_ATTENDANCE", path.data);
      } catch (error) {
        console.error(error.toString());
      }
    },

    ///action for get time attendance and employees api
    async actionForTimeAttendanceEmployeesApi({ commit }, payload) {
      //here we get employee data from HRS_MT_Profile and HRS_RT_Time_Attendance tables for today date
      try {
        let path = await getTimeAttendanceEmployeeService({
          today_date: getFormattedDate(new Date()),
        });

        commit("GET_EMPLOYEES_TIME_ATTENDANCE", path.data);
        commit("SET_EMPLOYEES_TIME_LOADING", true);
      } catch (error) {
        console.error(error.toString());
      }
    },

    ///action for get SETTINGS data api
    async actionForGetSettingsDataApi({ commit }, payload) {
      //here we get settings data from HRS_ST_Settings
      try {
        let path = await getSettingsDataService();
        commit("GET_SETTINGS_DATA", path.data);
      } catch (error) {
        console.error(error.toString());
      }
    },
    ///action for get SALARIES data api
    async actionForGetSalariesDataApi({ commit }, payload) {
      //here we get salaries data from HRS_ST_Settings
      try {
        let path = await getEmployeesSalariesService();
        commit("GET_SALARIES_DATA", path.data);
      } catch (error) {
        console.error(error.toString());
      }
    },

    //  =====================  get Shift Template  =====================
    async actionForGetShiftTemplateApi({ commit }, payload) {
      try {
        let path = await getShiftTemplateService(payload);
        console.log("shiftTemplatesshiftTemplates", path);
        commit("GET_SHIFT_TEMPLATE_DATA", path);
      } catch (error) {
        console.error(error.toString());
      }
    },
    //==========================================================================
    async createEmployee({ commit, state }, payload) {
      try {
        state.saveEmployeeDataLoading = true;
        let path = await createNewEmployeeService({
          ...state.personalInformation.personalInfo,
          occupation: state.contractDetails?.occupation || null,
        }); //payload
        state.contractDetails.hrsMtProfileId = path.data.row.response.id;

        state.personalInformation.addressInformation.employee = {
          id: path.data.row.response.id,
          img: "",
        };
        let res2 = await createNewContractService({ ...state.contractDetails });
        let res3 = await addNewAddressService(
          state.personalInformation.addressInformation
        );

        let image = [];
        if (state.personalFiles) {
          let uploadImage = await uploadFile(state.personalFiles);
          image = uploadImage;
          let moveFileToDms = await moveFileToDMS({
            files: uploadImage,
            referenceId: path.data.row.response.id,
            referenceType: "HRS",
            notes: "Nothing",
            sensitivity: "10",
            createdBy: state.createdBy,
          });
          let createAttachmentsForEmployee = await addAttachment({
            hrsMtProfileId: path.data.row.response?.id || null,
            type:
              state.personalInformation.personalInfo?.identification.type ||
              null,
            image: uploadImage[0]?.link || null,
            description: null,
            date: " 2022-08-11",
            transactionId: null,
            createdBy: {
              id: "1",
              user: { ar: "", en: "beshir" },
              system: "agents",
              chanel: "12",
            },
          });
        }

        let updateEmployee = await updateEmployeeInformation({
          recordId: path.data.row.response?.id || null,
          identification: {
            type:
              state.personalInformation.personalInfo?.identification.type ||
              null,
            number: null,
            image: image[0]?.link || null,
          },
        });

        state.saveEmployeeDataLoading = false;
        await Swal.fire({
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
        await this.$router.push({
          path: "/Hrdashboard",
        });
        // commit("SET_EMPLOYEE_DATA", path.data);
      } catch (error) {
        console.error(error.toString());
      }
    },
  },

  getters: {
    ///////////////////////////////////////
    ///refactor
    //////////////
    ///getter for employees information
    getterForEmployeesInformation(state) {
      return state.getEmployeesInformation;
    },
    ///getter for employee data
    getterForEmployeeData(state) {
      return state.getEmployeeFullData;
    },
    getterForProfileLoading(state) {
      return state.employeeProfileLoading;
    },
    ///getter for leave requets
    getterForLeaveRequets(state) {
      return state.getLeaveRequests;
    },
    ///getter for time attendance
    getterForTimeAttendance(state) {
      return state.getTimeAttendance;
    },
    ///getter for employees and time attendance
    getterForTimeAttendanceEmployees(state) {
      return state.getEmployeesTimeAttendanceData;
    },
    getterForTimeAttendanceEmployeesLoading(state) {
      return state.timeAttendanceEmployeesLoading;
    },
    ///getter for settings data
    getterForSettingsData(state) {
      return state.settingsData;
    },
    ///getter for salaries data
    getterForSalariesData(state) {
      return state.salariesData;
    },
    ///getter for shift template data
    getterForShiftTemplateData(state) {
      return state.shiftTemplateData;
    },
    getterForDays(state) {
      return state.days;
    },
    getPersonalInformation(state) {
      return state.personalInformation;
    },
    getContractDetails(state) {
      return state.contractDetails;
    },
    getSaveEmployeeLoadingStatus(state) {
      return state.saveEmployeeDataLoading;
    },
  },
};

export default Hr;
