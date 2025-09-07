import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Home from './app/pages/Home';
import { AppProvider } from './app/context/AppContext';

export default function App() {
  return (
    <AppProvider>
      <View style={styles.container}>
        <Home/>
        <StatusBar style="light" />
      </View>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
});
