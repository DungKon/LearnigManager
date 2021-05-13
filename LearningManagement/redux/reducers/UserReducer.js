import {
    GET_USER_INFO,
    GET_USER_INFO_FAIL,
    GET_USER_INFO_SUCCESS,
    REQUEST_LOGIN,
    REQUEST_LOGIN_FAIL,
    REQUEST_LOGIN_SUCCESS
} from "../action/type";

const initialState = {
    data: {},
    isLoading: false,
    error: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case REQUEST_LOGIN:
        case GET_USER_INFO:
            {
                return { ...state, isLoading: true, error: null }
            }
        case REQUEST_LOGIN_SUCCESS:
        case GET_USER_INFO_SUCCESS:
            {
                return {
                    ...state, isLoading: false,
                    data: action.payload

                }
            }
        case REQUEST_LOGIN_FAIL:
        case GET_USER_INFO_FAIL:
            {
                return {
                    ...state,
                    isLoading: false,
                    error: action.payload
                }
            }
        default:
            return state
    }
}
