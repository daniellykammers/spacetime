import { TouchableOpacity, View, ScrollView, Text, Image } from 'react-native'
import { useEffect, useState } from 'react'
import { Link, useRouter } from 'expo-router'
import Icon from '@expo/vector-icons/Feather'
import * as SecureStore from 'expo-secure-store'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'
import { api } from '../src/assets/lib/api'

import NlwLogo from '../src/assets/nlw-spacetime-logo.svg'

dayjs.locale(ptBR)

interface Memory {
  createdAt: string
  coverUrl: string
  excerpt: string
  id: string
}

export default function Memories() {
  const router = useRouter()
  const [memories, setMemories] = useState<Memory[]>([])

  async function signOut() {
    console.log('Signing out')
    await SecureStore.deleteItemAsync('token')
    router.push('/')
  }

  async function getMemories() {
    const token = await SecureStore.getItemAsync('token')

    const { data } = await api.get('/memories', {
      headers: { Authorization: `Bearer ${token}` },
    })

    setMemories(data ?? [])
  }

  useEffect(() => {
    getMemories()
  }, [])

  return (
    <ScrollView className="flex-1">
      <View className="my-4 flex-row items-center justify-between px-8">
        <NlwLogo />

        <View className="flex-row gap-2">
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full bg-red-50"
            onPress={signOut}
          >
            <Icon name="log-out" size={16} color="#000" />
          </TouchableOpacity>
          <Link href="/new-memory" asChild>
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-green-500">
              <Icon name="plus" size={16} color="#000" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <View className="my-6 space-y-10">
        {memories.map((memory) => {
          return (
            <View className="space-y-4" key={memory.id}>
              <View className="flex-row items-center gap-2">
                <View className="h-px w-5 bg-gray-50"></View>
                <Text className="font-body text-sm text-gray-200">
                  {dayjs(memory.createdAt).format('D[ de ]MMMM[, ]YYYY')}
                </Text>
              </View>
              <View className="space-y-4 px-8">
                <Image
                  source={{
                    uri: memory.coverUrl,
                  }}
                  className="aspect-video w-full rounded-lg"
                  alt=""
                ></Image>
                <Text className="font-body text-base leading-relaxed text-gray-100">
                  {memory.excerpt}
                </Text>
                <Link href="/memories/id" asChild>
                  <TouchableOpacity className="flex-row items-center gap-2">
                    <Text className="font-body text-sm text-gray-200">
                      Ler mais...
                    </Text>
                    <Icon name="arrow-right" size={16} color="#9e9ea0" />
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          )
        })}
      </View>
    </ScrollView>
  )
}
