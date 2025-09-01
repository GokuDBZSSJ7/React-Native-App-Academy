import { View } from 'react-native'
import { baseStyles } from '../styles/mainStyle'

export default function Home() {
    return (
        <View style={[baseStyles.secondaryBg, baseStyles.container]}>
            <h1 style={baseStyles.energy}>Hello World</h1>
        </View>
    )
}