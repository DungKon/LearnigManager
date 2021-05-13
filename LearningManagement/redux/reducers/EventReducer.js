import { LIST_EVENT, LIST_EVENT_FAIL, LIST_EVENT_SUCCESS, GET_EVENT_DATE } from "../action/type";
const initialState = {
    data: [],
    dataDate: [],
    isLoading: false,
    error: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case LIST_EVENT:
            {
                return { ...state, isLoading: true, error: null }
            }
        case LIST_EVENT_SUCCESS:
            {
                return {
                    ...state, isLoading: false,
                    data: action.payload.listEvent,
                    dataDate: action.payload.listSelect
                }
            }
        case LIST_EVENT_FAIL:
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
