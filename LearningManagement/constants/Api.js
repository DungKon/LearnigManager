import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage'
import NavigationUtil from "../navigation/NavigationUtil";
import { Alert } from "react-native";
function createAxios() {
  var axiosInstant = axios.create();
  axiosInstant.defaults.baseURL = "http://192.168.1.3:3000//";
  axiosInstant.defaults.timeout = 20000;
  axiosInstant.defaults.headers = { "Content-Type": "application/json" };

  axiosInstant.interceptors.request.use(
    async config => {
      config.headers.token = await AsyncStorage.getItem("token");
      return config;
    },
    error => Promise.reject(error)
  );

  axiosInstant.interceptors.response.use(async response => {
    if (response.data && response.data.code == 403) {
      setTimeout(() => {
        Alert.alert("Thông báo", "Vui lòng đăng nhập lại");
      }, 100);

      await AsyncStorage.setItem("token", "", () => {
        NavigationUtil.navigate("Auth");
      });
    } else if (response.data && response.data.status != 1) {
      setTimeout(() => {
        Alert.alert("Thông báo", response.data.mess);
      }, 100);
    }
    return response;
  });
  return axiosInstant;
}

export const getAxios = createAxios();

export const requestLogin = payload => {
  return handleResult(
    getAxios.post("user/login", payload)
  );
};

export const requestRegister = payload => {
  return handleResult(
    getAxios.post("user/signup", payload)
  );
};

export const listPoint = payload => {
  return handleResult(
    getAxios.post("point/listPoint", payload)
  )
}

export const getUserInfo = () => {
  return handleResult(
    getAxios.get("user/getUserInfo")
  );
}

export const getListSubject = () => {
  return handleResult(getAxios.get("subject/getlistsubject"));
};

export const getListSum = (payload) => {
  return handleResult(getAxios.get("summary/getListSum"));
};

export const addPoint = (semester, subject, userId, factor, value) => {
  return handleResult(
    getAxios.post("point/addPoint", {
      semester: semester,
      subject: subject,
      userId: userId,
      factor: factor,
      value: value
    })
  );
};

export const deletePoint = (id, userId, semester, subject) => {
  return handleResult(
    getAxios.post("point/deletePoint", {
      semester: semester,
      subject: subject,
      userId: userId,
      id: id
    })
  );
};

export const updatePoint = (id, userId, semester, subject, factor, value) => {
  return handleResult(
    getAxios.post("point/updatePoint", {
      semester: semester,
      subject: subject,
      userId: userId,
      id: id,
      factor: factor,
      value: value
    })
  );
};

export const listSchedule = () => {
  return handleResult(getAxios.get("schedule/listSchedule"));
};

export const updateSchedule = (id, subject) => {
  return handleResult(
    getAxios.post("schedule/update", {
      subject: subject,
      id: id
    })
  );
};

export const addEvent = (payload) => {
  return handleResult(
    getAxios.post("event/add", payload)
  );
};

export const deleteEvent = (id) => {
  return handleResult(
    getAxios.post("event/delete", {
      id
    })
  );
};

export const getListEvent = date => {
  return handleResult(
    getAxios.post("event/listevent", {
      date
    })
  );
};

export const getListDocument = () => {
  return handleResult(getAxios.get("document/listDocument"));
};

export const addDocument = payload => {
  return handleResult(
    getAxios.post("document/add", payload
    )
  );
};

export const updateSemester = (semester_curr) => {
  return handleResult(
    getAxios.post("user/update", {
      semester_curr: semester_curr
    })
  );
};

export const updateAvatar = (image) => {
  return handleResult(
    getAxios.post("user/updateAvatar", {
      image: image
    })
  );
};

export const changePass = (pass, new_pass) => {
  return handleResult(
    getAxios.post("user/changePass", {
      pass, new_pass
    })
  );
};

/* Support function */
function handleResult(api) {
  return api.then(res => {
    if (res.data.status != 1) {
      return Promise.reject(new Error("Có lỗi xảy ra"));
    }
    return Promise.resolve(res.data);
  });
}
