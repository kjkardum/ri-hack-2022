import React from 'react';
import { FlatList, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

import { useGlobalStore } from "react-native-global-store"


const UrlContext = React.createContext("");

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

  const [globalState, setGlobalState] = useGlobalStore()

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Route info</Text> */}

      <Text>To open route, scan your admins qr code.</Text>

      <View style={styles.container}>

        <Text>
          {globalState.id || "No route"}
        </Text>

      </View>

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {/* <EditScreenInfo path="/screens/TabOneScreen.tsx" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
