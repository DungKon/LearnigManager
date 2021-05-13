import { combineReducers } from 'redux'
import userReducer from './UserReducer'
import sumReducer from './SumReducer'
import pointReducer from './PointReducer'
import scheduleReducer from './ScheduleReducer'
import eventReducer from './EventReducer'
import documentReducer from './DocumentReducer'


export default combineReducers({
    userReducer: userReducer,
    sumReducer: sumReducer,
    pointReducer: pointReducer,
    scheduleReducer: scheduleReducer,
    eventReducer: eventReducer,
    documentReducer: documentReducer
})