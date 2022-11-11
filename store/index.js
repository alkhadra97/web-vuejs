import Vuex from "vuex";
import Hr from "./modules/hr";
import Provider from "./modules/providers";

const createStore = () => {
  return new Vuex.Store({
    modules: {
      Hr,
      Provider,
    },
  });
};

export default createStore;
