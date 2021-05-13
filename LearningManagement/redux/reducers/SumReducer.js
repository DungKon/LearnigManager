import {
    GET_LIST_SUMMATION,
    GET_LIST_SUMMATION_FAIL,
    GET_LIST_SUMMATION_SUCCESS
} from "../action/type";

const initialState = {
    data: [],
    isLoading: false,
    error: null,
    average: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_LIST_SUMMATION:
            {
                return { ...state, isLoading: true, error: null }
            }
        case GET_LIST_SUMMATION_SUCCESS:
            {
                let total = 0
                let sum = 0
                for (let i = 0; i < (action.payload.length); i++) {
                    if (action.payload[i].score != 0) {
                        total += action.payload[i].score,
                            sum++
                    }
                }
                return {
                    ...state, isLoading: false,
                    data: action.payload,
                    average: total / sum
                }
            }
        case GET_LIST_SUMMATION_FAIL:
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
