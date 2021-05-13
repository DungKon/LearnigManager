import {
  GET_LIST_SUMMATION,
  GET_USER_INFO,
  REQUEST_LOGIN,
  REGISTER,
  LIST_POINT,
  LIST_SCHEDULE,
  LIST_EVENT,
  GET_EVENT_DATE,
  LIST_DOCUMENT
} from "./type";

export const requestLogin = payload => ({
  type: REQUEST_LOGIN,
  payload: payload
});

export const register = payload => ({
  type: REGISTER,
  payload: payload
});

export const getUserInfo = () => ({
  type: GET_USER_INFO,
  payload: {}
});


export const getListSum = (payload) => ({
  type: GET_LIST_SUMMATION,
  payload: payload
});

export const listPoint = (payload) => ({
  type: LIST_POINT,
  payload: payload
});

export const listSchedule = () => ({
  type: LIST_SCHEDULE,
  payload: {}
});

export const listEvent = (payload) => ({
  type: LIST_EVENT,
  payload: payload
});

export const selectDate = (date) => ({
  type: GET_EVENT_DATE,
  payload: date
});

export const listDocument = () => ({
  type: LIST_DOCUMENT,
  payload: {}
});