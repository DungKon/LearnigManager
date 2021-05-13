import { put, takeEvery, call } from "redux-saga/effects";
import { Alert } from "react-native";
import { showMessages } from '../../components/Alert'
import {
    GET_USER_INFO_SUCCESS,
    GET_USER_INFO_FAIL,
    GET_USER_INFO,
    REQUEST_LOGIN,
    REQUEST_LOGIN_SUCCESS,
    REQUEST_LOGIN_FAIL,
    GET_LIST_SUMMATION_SUCCESS,
    GET_LIST_SUMMATION_FAIL,
    GET_LIST_SUMMATION,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    REGISTER,
    LIST_POINT_SUCCESS,
    LIST_POINT_FAIL,
    LIST_POINT,
    LIST_SCHEDULE_SUCCESS,
    LIST_SCHEDULE_FAIL,
    LIST_SCHEDULE,
    LIST_EVENT_SUCCESS,
    LIST_EVENT_FAIL,
    LIST_EVENT,
    LIST_DOCUMENT_SUCCESS,
    LIST_DOCUMENT_FAIL,
    LIST_DOCUMENT
} from "../action/type";
import * as API from "../../constants/Api";
import { SCREEN_ROUTER } from "../../constants/Constant";
import NavigationUtil from "../../navigation/NavigationUtil";
import reactotron from "reactotron-react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'

export function* getUserInfo() {
    try {
        const response = yield call(API.getUserInfo);
        yield put({ type: GET_USER_INFO_SUCCESS, payload: response.data });
    } catch (err) {
        yield put({ type: GET_USER_INFO_FAIL, payload: err });
    }
}


export function* getListSum() {
    try {
        const response = yield call(API.getListSum);
        yield put({ type: GET_LIST_SUMMATION_SUCCESS, payload: response.data });
    } catch (err) {
        yield put({ type: GET_LIST_SUMMATION_FAIL, payload: err });
    }
}

export function* requestRegister(action) {
    try {
        const response = yield call(API.requestRegister, action.payload);
        yield put({ type: REGISTER_SUCCESS, payload: response });
        yield* requestLogin(action);
    } catch (err) {
        yield put({ type: REGISTER_FAIL, payload: err });
        showMessages("Thông báo lỗi", "Tài khoản đã tồn tại")
    }
}

export function* requestLogin(action) {
    try {
        const response = yield call(API.requestLogin, action.payload);
        yield put({ type: REQUEST_LOGIN_SUCCESS, payload: response.data });
        yield call(AsyncStorage.setItem, "token", response.token);
        NavigationUtil.navigate('AuthLoading')
    } catch (err) {
        yield put({ type: REQUEST_LOGIN_FAIL, payload: err });
        showMessages("Thông báo lỗi","Xin vui lòng nhập lại tài khoản và mật khẩu !")
    }
}

export function* listPoint(action) {
    try {
        const response = yield call(API.listPoint, action.payload);
        yield put({ type: LIST_POINT_SUCCESS, payload: response.data });
    } catch (err) {
        yield put({ type: LIST_POINT_FAIL, payload: err });
    }
}

export function* getListSchedule() {
    try {
        const response = yield call(API.listSchedule);
        yield put({ type: LIST_SCHEDULE_SUCCESS, payload: response.data });
    } catch (err) {
        yield put({ type: LIST_SCHEDULE_FAIL, payload: err });
    }
}

export function* getListEvent(action) {
    try {
        const response = yield call(API.getListEvent, action.payload);
        yield put({ type: LIST_EVENT_SUCCESS, payload: response.data });
    } catch (err) {
        yield put({ type: LIST_EVENT_FAIL, payload: err });
    }
}

export function* getListDocument() {
    try {
        const response = yield call(API.getListDocument);
        yield put({ type: LIST_DOCUMENT_SUCCESS, payload: response.data });
    } catch (err) {
        yield put({ type: LIST_DOCUMENT_FAIL, payload: err });
    }
}



export const watchGetUserInfo = takeEvery(GET_USER_INFO, getUserInfo);
export const watchGetListSum = takeEvery(GET_LIST_SUMMATION, getListSum);
export const watchRegister = takeEvery(REGISTER, requestRegister);
export const watchLogin = takeEvery(REQUEST_LOGIN, requestLogin);
export const watchListPoint = takeEvery(LIST_POINT, listPoint);
export const watchListSchedule = takeEvery(LIST_SCHEDULE, getListSchedule);
export const watchListEvent = takeEvery(LIST_EVENT, getListEvent);
export const watchListDocument = takeEvery(LIST_DOCUMENT, getListDocument);