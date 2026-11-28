import { useState } from 'react'
import { View, Text, Image, FlatList, Pressable, useWindowDimensions } from 'react-native'
import { dummy_post_data } from '@/assets/data/data'

type PostProps = {
  isHorizontal?: boolean
  limit?: number
}

const Description = ({ text, lines = 2, maxChars = 100 }: { text?: string; lines?: number; maxChars?: number }) => {
  const [expanded, setExpanded] = useState(false)

  if (!text) return null
  const isLong = text.length > maxChars

  return (
    <View style={{ marginTop: 4 }}>
      <Text style={{ color: 'white' }} numberOfLines={expanded ? undefined : lines}>
        {text}
      </Text>
      {isLong && (
        <Pressable onPress={() => setExpanded((prev) => !prev)} hitSlop={8}>
          <Text style={{ color: '#60a5fa', marginTop: 2 }}>
            {expanded ? 'Show less' : 'Show more'}
          </Text>
        </Pressable>
      )}
    </View>
  )
}

const Post = ({ isHorizontal = false, limit = 5 }: PostProps) => {
  const { width } = useWindowDimensions()
  const posts = isHorizontal ? dummy_post_data.slice(0, limit) : dummy_post_data

  return (
    <FlatList
      data={posts}
      horizontal={isHorizontal}
      key={isHorizontal ? 'h' : 'v'}
      keyExtractor={(item) => String(item.id)}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ padding: 12, alignItems: isHorizontal ? 'flex-start' : undefined }}
      renderItem={({ item }) =>
        isHorizontal ? (
          // HORIZONTAL: image left, content right
          <View
            style={{
              flexDirection: 'row',
              width: width * 0.85,
              marginRight: 12,
              borderWidth: 1,
              borderColor: 'white',
              padding: 10,
              borderRadius: 8,
            }}
          >
            <Image
              source={{ uri: item.image_url }}
              style={{ width: 110, height: 110, borderRadius: 8 }}
              resizeMode="cover"
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ color: 'white', fontSize: 16 }}>{item.user_name}</Text>
              <Text style={{ color: 'white' }}>{item.postedAt}</Text>
              <Description text={item.description} />
            </View>
          </View>
        ) : (
          // VERTICAL: everything row by row
          <View style={{ width: '100%', marginBottom: 16 }}>
            <Image
              source={{ uri: item.image_url }}
              style={{ width: '100%', height: 200, borderRadius: 8 }}
              resizeMode="cover"
            />
            <Text style={{ color: 'white', fontSize: 16, marginTop: 8 }}>{item.user_name}</Text>
            <Text style={{ color: 'white', marginTop: 2 }}>{item.postedAt}</Text>
            <Description text={item.description} lines={3} maxChars={150} />
          </View>
        )
      }
    />
  )
}

export default Post