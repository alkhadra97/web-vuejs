const axios = require("axios");

const getEmployeesSalariesService = async (salaryDTO) => {
  try {
    return await window.$nuxt.$axios(
      "/billing/employeesSalaries/getEmployeesSalaries",
      salaryDTO
    );
  } catch (error) {
    throw error;
  }
};

const getAllEstablishment = async (data) => {
  try {
    const response = await window.$nuxt.$axios(`/facility/getFacility`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const getAllDays = async (data) => {
  try {
    const response = await window.$nuxt.$axios(`/lookups/getAllDays`);
    console.log(response, "getDays res");
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const getAllFacilities = async (data) => {
  try {
    const response = await window.$nuxt.$axios(`/facility/getFacility`);
    console.log(response, "getFacility res");
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const getAllGenders = async (data) => {
  try {
    const response = await window.$nuxt.$axios(`/lookups/getAllGenders`);
    console.log(response, "getGenders res");
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const getAllNationalities = async (data) => {
  try {
    const response = await window.$nuxt.$axios(`/lookups/getAllNationalities`);
    console.log(response, "getNationalities res");
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const getAllMaritalStatuses = async (data) => {
  try {
    const response = await window.$nuxt.$axios(
      `/lookups/getAllMaritalStatuses`
    );
    console.log(response, "getMaritalStatus res");
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const getAllIdTypes = async (data) => {
  try {
    const response = await window.$nuxt.$axios(
      `/lookups/getAllIdentifications`
    );
    console.log(response, "getIdTypes res");
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
///lookups/getAllCities

const getAllCities = async (conditions) => {
  try {
    // this to get all cities based on country
    let { data } = await window.$nuxt.$axios(
      "/lookups/getAllCities",
      conditions
    );
    console.log("data getAllCities => ", data);
    return data.map(({ id, name }) => {
      return { id, name };
    });
  } catch (error) {
    throw error;
  }
};

const getAreaByCityAPI = async (conditions) => {
  try {
    // this to get all area By city
    let { data } = await window.$nuxt.$axios(
      "/lookups/getAllAreas",
      conditions
    );
    return data.map(({ id, name }) => {
      return { id, name };
    });
  } catch (error) {
    throw error;
  }
};
///getAllCountries
const getAllCountries = async (conditions) => {
  try {
    let { data } = await window.$nuxt.$axios(
      "/lookups/getAllConutries",
      conditions
    );
    return data.map(({ id, name }) => {
      return { id, name };
    });
  } catch (error) {
    throw error;
  }
};
//==== /lookups/getAllRelations

const getAllRelations = async (conditions) => {
  try {
    let { data } = await window.$nuxt.$axios(
      "/lookups/getAllRelations",
      conditions
    );
    return data.map(({ id, name }) => {
      return { id, name };
    });
  } catch (error) {
    throw error;
  }
};
///lookups/getAllUniversities
const getAllUniversities = async (conditions) => {
  try {
    let { data } = await window.$nuxt.$axios(
      "/lookups/getAllUniversities",
      conditions
    );
    return data.map(({ id, name }) => {
      return { id, name };
    });
  } catch (error) {
    throw error;
  }
};

const moveFileToDMS = async (conditions) => {
  try {
    // const response = await window.$nuxt.$axios(`/dms/moveFile`);
    // console.log(response, "getMaritalStatus res");
    // return response.data;
    const response = await window.$nuxt.$axios(`/dms/moveFile`, conditions);
    console.log(response, "moveFileToDMS res");
    return response.data;
    // const result = await axios.post("http://localhost:50202/dms/moveFile");
    // console.log(result);
    // return result;
  } catch (error) {
    throw error;
  }
};

///lookups/getAllOccupations
const getAllOccupations = async (conditions) => {
  try {
    let { data } = await window.$nuxt.$axios(
      "/lookups/getAllOccupations",
      conditions
    );
    return data.map(({ id, name }) => {
      return { id, name };
    });
  } catch (error) {
    throw error;
  }
};
module.exports = {
  getEmployeesSalariesService,
  getAllEstablishment,
  getAllDays,
  getAllFacilities,
  getAllGenders,
  getAllNationalities,
  getAllMaritalStatuses,
  getAllIdTypes,
  getAllCities,
  getAreaByCityAPI,
  getAllCountries,
  getAllRelations,
  getAllUniversities,
  moveFileToDMS,
  getAllOccupations,
};
