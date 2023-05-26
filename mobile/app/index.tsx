import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { useAuthRequest, makeRedirectUri } from 'expo-auth-session'
import * as SecureStore from 'expo-secure-store'
import { Text, View, TouchableOpacity } from 'react-native'

import NlwLogo from '../src/assets/nlw-spacetime-logo.svg'
import { api } from '../src/assets/lib/api'

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint:
    'https://github.com/settings/connections/applications/a59631c36975a33e481b',
}

export default function App() {
  const router = useRouter()

  const [, response, signInWithGithub] = useAuthRequest(
    {
      clientId: 'a59631c36975a33e481b',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'nlwspacetime',
      }),
    },
    discovery,
  )

  async function handleGithubOAuthCode(code: string) {
    const token = await api
      .post('/register', {
        code,
      })
      .then((response) => response.data.token)

    SecureStore.setItemAsync('token', token)

    router.push('/memories')
  }

  useEffect(() => {
    if (response?.type === 'success') {
      handleGithubOAuthCode(response.params.code)
    }
  }, [response])

  return (
    <View className="flex-1 items-center px-8 py-10">
      <View className="flex-1 items-center justify-center gap-6">
        <NlwLogo />

        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-2"
          onPress={() => signInWithGithub()}
        >
          <Text className="font-alt text-sm uppercase text-black">
            COMEÇAR A CADASTRAR
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW da Rocketseat
      </Text>
    </View>
  )
}
