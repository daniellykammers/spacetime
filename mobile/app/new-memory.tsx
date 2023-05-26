import {
  TouchableOpacity,
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
} from 'react-native'
import { Link, useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import * as SecureStore from 'expo-secure-store'
import Icon from '@expo/vector-icons/Feather'

import NlwLogo from '../src/assets/nlw-spacetime-logo.svg'
import { Switch } from 'react-native-gesture-handler'
import { useState } from 'react'
import { api } from '../src/assets/lib/api'

export default function NewMemory() {
  const router = useRouter()

  const [cover, setCover] = useState<null | string>(null)
  const [content, setContent] = useState('')
  const [isPublic, setIsPublic] = useState(false)

  async function openImagePicker() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
      })

      console.log(result)

      if (result.assets[0]) {
        setCover(result.assets[0].uri)
      }
    } catch (e) {
      console.error({ error: 'Code error', message: e })
    }
  }

  async function handleCreateMemory() {
    const token = await SecureStore.getItemAsync('token')

    let coverUrl = ''

    if (cover) {
      const uploadFormData = new FormData()

      uploadFormData.append('file', {
        name: 'image.jpg',
        type: 'image/jpeg',
        uri: cover,
      } as any)

      const uploadResponse = await api.post('/upload', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      coverUrl = uploadResponse.data.fileUrl ?? ''
    }

    await api.post(
      '/memories',
      {
        content,
        isPublic,
        coverUrl,
      },
      { headers: { Authorization: `Bearer ${token}` } },
    )

    router.push('/memories')
  }

  return (
    <ScrollView className="flex-1 px-8">
      <View className="my-4 flex-row items-center justify-between">
        <NlwLogo />

        <Link href="/memories" asChild>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-purple-500">
            <Icon name="arrow-left" size={16} color="#FFF" />
          </TouchableOpacity>
        </Link>
      </View>

      <View className="my-6 space-y-6">
        <View className="flex-row items-center gap-2">
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            thumbColor={isPublic ? '#9b79ea' : '#727275'}
            trackColor={{ false: '#56565a', true: '#372560' }}
          />
          <Text className="font-body text-base text-gray-200">
            Tornar memória pública
          </Text>
        </View>

        <TouchableOpacity
          onPress={openImagePicker}
          className="bg-black-20 h-32 items-center justify-center rounded-lg border border-dashed border-gray-500"
        >
          {cover ? (
            <Image
              source={{ uri: cover }}
              alt="Imagem selecionada"
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <View className="flex-row items-center gap-2">
              <Icon name="image" color="#FFF" />
              <Text className="font-body text-sm text-gray-200">
                Adicionar foto ou vídeo de capa
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          multiline
          className="p-0 font-body text-lg text-gray-50"
          placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
          placeholderTextColor="#56565a"
          onChangeText={setContent}
        ></TextInput>

        <TouchableOpacity
          activeOpacity={0.7}
          className="items-center self-end rounded-full bg-green-500 px-5 py-2"
          onPress={handleCreateMemory}
        >
          <Text className="font-alt text-sm uppercase text-black">SALVAR</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
