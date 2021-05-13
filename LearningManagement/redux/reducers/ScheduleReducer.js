import { LIST_SCHEDULE, LIST_SCHEDULE_FAIL, LIST_SCHEDULE_SUCCESS } from "../action/type";


const initialState = {
    data: [],
    dataMor: [],
    dataAfter: [],
    isLoading: false,
    error: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case LIST_SCHEDULE:
            {
                return { ...state, isLoading: true, error: null }
            }
        case LIST_SCHEDULE_SUCCESS:
            {
                return {
                    ...state, isLoading: false,
                    data: action.payload,
                    dataMor: action.payload.slice(0, 42),
                    dataAfter: action.payload.slice(42, 84),
                }
            }
        case LIST_SCHEDULE_FAIL:
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
