import { View } from 'react-native'
import { Image } from 'expo-image'
import Test from './Test'

const App = () => {
    return (
        <>
            <View style={{ width: 400, height: 400, backgroundColor: 'green', display: 'flex' }}>
                <Test />
            </View>
            <Image source={null} />
        </>
    )
}

export default App
