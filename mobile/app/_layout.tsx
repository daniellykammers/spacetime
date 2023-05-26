// camel case is disabled because font imports are snake case
/* eslint-disable camelcase */

import { useState, useEffect } from 'react'
import { ImageBackground } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { SplashScreen, Stack } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { useFonts } from 'expo-font'
import { styled } from 'nativewind'
import blurBg from '../src/assets/bg-blur.png'
import Stripes from '../src/assets/stripes.svg'

import { Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto'
import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const StyledStripes = styled(Stripes)

export default function Layout() {
  const { bottom, top } = useSafeAreaInsets()
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<
    null | boolean
  >(null)

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  })

  async function checkIsUserAuthenticated() {
    const token = await SecureStore.getItemAsync('token')
    setIsUserAuthenticated(!!token)
  }

  useEffect(() => {
    checkIsUserAuthenticated()
  }, [])

  if (!hasLoadedFonts) {
    return <SplashScreen />
  }

  return (
    <ImageBackground
      source={blurBg}
      imageStyle={{ position: 'absolute', left: '-100%' }}
      className="relative flex-1 bg-gray-950"
    >
      <StyledStripes className="absolute left-2" />
      <StatusBar style="light" translucent />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: 'transparent',
            paddingBottom: bottom,
            paddingTop: top,
          },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" redirect={isUserAuthenticated} />
        <Stack.Screen name="memories" />
        <Stack.Screen name="new-memory" />
      </Stack>
    </ImageBackground>
  )
}
