import { LIST_DOCUMENT, LIST_DOCUMENT_FAIL, LIST_DOCUMENT_SUCCESS } from "../action/type";

const initialState = {
    data: [],
    isLoading: false,
    error: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case LIST_DOCUMENT:
            {
                return { ...state, isLoading: true, error: null }
            }
        case LIST_DOCUMENT_SUCCESS:
            {
                return {
                    ...state, isLoading: false,
                    data: action.payload,
                }
            }
        case LIST_DOCUMENT_FAIL:
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
