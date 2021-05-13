import {
    watchGetUserInfo,
    watchGetListSum,
    watchRegister,
    watchLogin,
    watchListPoint,
    watchListSchedule,
    watchListEvent,
    watchListDocument
} from './NetworkSaga'
import { yellow } from 'ansi-colors';


export default function* rootSaga() {
    yield watchGetUserInfo
    yield watchGetListSum
    yield watchRegister
    yield watchLogin
    yield watchListPoint
    yield watchListSchedule
    yield watchListEvent
    yield watchListDocument
}