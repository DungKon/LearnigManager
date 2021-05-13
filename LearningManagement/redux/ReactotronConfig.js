import Reactotron from 'reactotron-react-native'
import { reactotronRedux } from 'reactotron-redux'
import sagaPlugin from 'reactotron-redux-saga'

const reactotron = Reactotron
    .configure({ name: 'LearningManager' })
    .use(reactotronRedux())
    .useReactNative({
        networking: {
            ignoreUrls: /symbolicate/,
        }
    })
    .use(sagaPlugin())
    .connect()

console.tron = Reactotron;
export default reactotron