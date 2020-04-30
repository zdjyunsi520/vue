import OSS from "ali-oss";
import Base64 from "@/utils";
import { ossConifg } from "@/api/ossUpload";
const state = {
  client: null,
  path: null
};

function initOSS(state) {
  ossConifg().then(res => {
    //OSS = oss.Wrapper;
    //secure:true
    //data.region = "oss-cn-shenzhen";

    const data = Base64.decode(
      res.data
        .split("")
        .reverse()
        .join("")
    ).split(";");
    state.path = Base64.decode(data[4]);
    const ossPath = state.path;
    const accessKeyId = Base64.decode(data[0]);
    const accessKeySecret = Base64.decode(data[1]);
    const bucket = Base64.decode(data[2]);
    const region = Base64.decode(data[3]).split(".")[0];
    state.client = new OSS({
      ossPath,
      accessKeyId,
      accessKeySecret,
      bucket,
      region
    });
  });
}

function get_suffix(filename) {
  var pos = filename.lastIndexOf(".");
  var suffix = "";
  if (pos != -1) {
    suffix = filename.substring(pos);
  }
  return suffix;
}

const mutations = {};

const actions = {
  ossUpload: ({ state }, { file, accept, processCallBack, fileNameStr }) => {
    var suffix = get_suffix(file.name);
    if (accept) {
      if (accept.indexOf(suffix) == -1) {
        return Promise.reject("上传格式不符合规则");
      }
    }
    var fileName =
      "manager/" + +(Date.parse(new Date()) + Math.floor(Math.random() * 999));
    const fn = fileNameStr || fileName + suffix;

    return new Promise((resolve, reject) => {
      state.client
        .multipartUpload(fn, file, {
          progress: processCallBack
        })
        .then(r => {
          //r.url
          resolve(fn);
        })
        .catch(e => {
          console.log(e);
          reject();
        });
    });
  }
};

const getters = {
  client: state => {
    state.client || initOSS(state);
    return state.client;
  },
  path: state => {
    state.path || initOSS(state);
    return state.path;
  }
};

export default { namespaced: true, state, getters, actions };
