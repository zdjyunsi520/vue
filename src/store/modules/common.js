import { fetchList as fetchCommunicationHost } from "@/api/equipmentAccount/maintain/communicationHost";
import { fetchChildList } from "@/api/systemManager/user";
import { fetchDevice } from "@/api/equipmentAccount";
const state = {};

const actions = {
  communicationHost: ({ state }, data) => {
    return new Promise((resolve, reject) => {
      fetchCommunicationHost(data).then(r => {
        resolve(r);
      });
    });
  },
  employee: ({ state }, data) => {
    return new Promise((resolve, reject) => {
      fetchChildList({}).then(r => {
        resolve(r);
      });
    });
  },
  deviceList: ({ state }, data) => {
    return new Promise((resolve, reject) => {
      fetchDevice(data).then(r => {
        resolve(r);
      });
    });
  }
};
export default { namespaced: true, state, actions };
