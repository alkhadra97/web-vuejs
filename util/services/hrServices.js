const axios = require("axios");
///HRS_ST_Settings table
const getSettingsDataService = async (data) => {
  try {
    return await window.$nuxt.$axios("/hr/settings/getSettingsData");
  } catch (error) {
    throw error;
  }
};
///HRS_MT_Profile table
const getEmployeesInforamtionService = async (hrDTO) => {
  try {
    let res = await window.$nuxt.$axios("/hr/profile/getEmployees", hrDTO);

    return res;
  } catch (error) {
    throw error;
  }
};
const checkEmailsService = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios("/hr/profile/checkEmail", hrDTO);
  } catch (error) {
    throw error;
  }
};
const checkPhoneNumbers = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios("/hr/profile/checkPhoneNumbers", hrDTO);
  } catch (error) {
    throw error;
  }
};
const getEmployeeFullDataService = async (hrDTO) => {
  try {
    let test = await window.$nuxt.$axios("/hr/profile/getEmployeeData", hrDTO);
    return test;
  } catch (error) {
    throw error;
  }
};
const createNewEmployeeService = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios("/hr/profile/createNewEmployee", hrDTO);
  } catch (error) {
    throw error;
  }
};
const updateEmployeeInformation = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios(
      "/hr/profile/updateEmployeeInformation",
      hrDTO
    );
  } catch (error) {
    throw error;
  }
};
///leave table
const createNewLeaveService = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios("/hr/leaves/createLeave", hrDTO);
  } catch (error) {
    throw error;
  }
};
const getLeaveRequestService = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios("/hr/leaves/getLeaves", hrDTO);
  } catch (error) {
    throw error;
  }
};
const deleteLeaveRequestService = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios("/hr/leaves/deleteLeaveRequest", hrDTO);
  } catch (error) {
    throw error;
  }
};
const updateLeaveRequestService = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios("/hr/leaves/updateLeave", hrDTO);
  } catch (error) {
    throw error;
    ``;
  }
};

//time attendance table
const getTimeAttendanceDataService = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios(
      "/hr/timeAttendance/getTimeAttendanceData",
      hrDTO
    );
  } catch (error) {
    throw error;
  }
};
const createNewMissingService = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios("/hr/timeAttendance/missing", hrDTO);
  } catch (error) {
    throw error;
  }
};
const createNewMissingInService = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios("/hr/timeAttendance/missingIn", hrDTO);
  } catch (error) {
    throw error;
  }
};
const acceptMissingInService = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios(
      "/hr/timeAttendance/acceptMissingIn",
      hrDTO
    );
  } catch (error) {
    throw error;
  }
};
const acceptMissingOutService = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios(
      "/hr/timeAttendance/acceptMissingOut",
      hrDTO
    );
  } catch (error) {
    throw error;
  }
};
const rejectMissingInService = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios(
      "/hr/timeAttendance/rejectMissingIn",
      hrDTO
    );
  } catch (error) {
    throw error;
  }
};
const rejectMissingOutService = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios(
      "/hr/timeAttendance/rejectMissingOut",
      hrDTO
    );
  } catch (error) {
    throw error;
  }
};
const updateTimeAttendanceDataService = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios(
      "/hr/timeAttendance/updateTimeAttendanceData",
      hrDTO
    );
  } catch (error) {
    throw error;
  }
};
const checkInService = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios("/hr/timeAttendance/checkIn", hrDTO);
  } catch (error) {
    throw error;
  }
};
const checkOutService = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios("/hr/timeAttendance/checkOut", hrDTO);
  } catch (error) {
    throw error;
  }
};
const getTimeAttendanceEmployeeService = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios(
      "/hr/timeAttendance/getAllEmployeesWithTimeAttendance",
      hrDTO
    );
  } catch (error) {
    throw error;
  }
};
///HRS_RT_Contracts table

const createNewContractService = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios("/hr/contracts/createContract", hrDTO);
  } catch (error) {
    throw error;
  }
};
const updateContractInformationService = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios(
      "/hr/contracts/updateContractInformation",
      hrDTO
    );
  } catch (error) {
    throw error;
  }
};
///HRS_RT_Working_Hours table
const addWorkingHoursForEmployeeService = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios("/hr/workingHours/addWorkingHours", hrDTO);
  } catch (error) {
    throw error;
  }
};
///HRS_RT_Establishment table
const addNewEstablishment = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios(
      "/hr/establishment/addEstablishment",
      hrDTO
    );
  } catch (error) {
    throw error;
  }
};
//HRS_Rt_Related_Family table
const addNewFamilyMembersService = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios("/hr/family/addRelatedFamily", hrDTO);
  } catch (error) {
    throw error;
  }
};
///HRS_RT_Address
const addNewAddressService = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios("/hr/address/addAddress\n", hrDTO);
  } catch (error) {
    throw error;
  }
};
const updateFamilyInformationService = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios(
      "/hr/family/updateFamilyInformation",
      hrDTO
    );
  } catch (error) {
    throw error;
  }
};
//================================================================================================
const addShiftTemplate = async (shiftTemplateDTO) => {
  try {
    // return await axios.post(
    //   "http://localhost:31602/hr/workingHours/createNewShiftTemplate",
    //   shiftTemplateDTO
    // );
    const response = await window.$nuxt.$axios(
      "/hr/workingHours/createNewShiftTemplate",

      shiftTemplateDTO
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteShiftTemplate = async (shiftTemplateDTO) => {
  try {
    // return await window.$nuxt.$axios(
    //   "/hr/workingHours/deleteShiftTemplate",
    //   shiftTemplateDTO
    // );
    let response = await window.$nuxt.$axios(
      "/hr/workingHours/deleteShiftTemplate",
      shiftTemplateDTO
    );

    return response.data;
    // return await axios.post(
    //   "http://localhost:31602/hr/workingHours/deleteShiftTemplate",
    //   shiftTemplateDTO
    // );
  } catch (error) {
    throw error;
  }
};
const deleteFamilyRecord = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios("/hr/family/deleteFamilyRecord", hrDTO);
  } catch (error) {
    throw error;
  }
};
//HRS_Rt_Emargency_contact table
const addNewEmergencyContact = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios(
      "/hr/emergencyContact/addEmergencyContact",
      hrDTO
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
const deleteEmergenctContactRecordService = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios(
      "/hr/emergencyContact/deleteEmergenctContactRecord",
      hrDTO
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
const updateEmergencyContactInformationService = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios(
      "/hr/emergencyContact/updateEmrgencyContactInformation",
      hrDTO
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
//HRS_Rt_Education table
const addNewEducation = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios("/hr/education/createEducation", hrDTO);
  } catch (error) {
    throw error;
  }
};
const updateEducationInformationService = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios(
      "/hr/education/updateEducationInformation",
      hrDTO
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
const deleteEducationService = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios("/hr/education/deleteEducation", hrDTO);
  } catch (error) {
    throw error;
  }
};
//HRS_Rt_Certification table
const addNewCertification = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios(
      "/hr/certifications/createCertification",
      hrDTO
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
const updateCertificationInformationService = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios(
      "/hr/certifications/updateCertificationInformation",
      hrDTO
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
const deleteCertificationRecordService = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios(
      "/hr/certifications/deleteCertificationRecord",
      hrDTO
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
//HRS_Rt_Experience table
const addNewExperience = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios("/hr/experience/createExperience", hrDTO);
  } catch (error) {
    throw error;
  }
};
const updateExperienceInformationService = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios(
      "/hr/experience/updateExperienceInformation",
      hrDTO
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
const deleteExperienceService = async (hrDTO) => {
  try {
    return await window.$nuxt.$axios(
      "/hr/experience/deleteExperienceRecord",
      hrDTO
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

//================================================================================================

const getShiftTemplateService = async (shiftTemplateDTO) => {
  try {
    const response = await window.$nuxt.$axios(
      "/hr/workingHours/getShiftTemplate",
      shiftTemplateDTO
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

//create attachments

const addAttachment = async (shiftTemplateDTO) => {
  try {
    const response = await window.$nuxt.$axios(
      "/hr/attachment/addAttachment",
      shiftTemplateDTO
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getSettingsDataService,
  getEmployeesInforamtionService,
  getEmployeeFullDataService,
  getLeaveRequestService,
  getTimeAttendanceDataService,
  getTimeAttendanceEmployeeService,
  createNewEmployeeService,
  createNewContractService,
  addWorkingHoursForEmployeeService,
  addNewEstablishment,
  createNewMissingService,
  createNewMissingInService,
  createNewLeaveService,
  acceptMissingInService,
  acceptMissingOutService,
  rejectMissingInService,
  rejectMissingOutService,
  updateLeaveRequestService,
  checkEmailsService,
  checkPhoneNumbers,
  updateEmployeeInformation,
  addNewFamilyMembersService,
  addNewEmergencyContact,
  addNewEducation,
  addNewCertification,
  addNewExperience,
  deleteFamilyRecord,
  deleteEmergenctContactRecordService,
  updateTimeAttendanceDataService,
  deleteCertificationRecordService,
  checkOutService,
  checkInService,
  deleteLeaveRequestService,
  updateExperienceInformationService,
  updateEducationInformationService,
  updateCertificationInformationService,
  updateFamilyInformationService,
  updateEmergencyContactInformationService,
  deleteEducationService,
  deleteExperienceService,
  updateContractInformationService,
  //================================================================================================
  addShiftTemplate,
  getShiftTemplateService,
  addNewAddressService,
  addAttachment,
  deleteShiftTemplate,
};
