import { LIST_POINT, LIST_POINT_FAIL, LIST_POINT_SUCCESS } from "../action/type";

const initialState = {
    data: [],
    isLoading: false,
    error: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case LIST_POINT:
            {
                return { ...state, isLoading: true, error: null }
            }
        case LIST_POINT_SUCCESS:
            {
                return {
                    ...state, isLoading: false,
                    data: action.payload

                }
            }
        case LIST_POINT_FAIL:
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
