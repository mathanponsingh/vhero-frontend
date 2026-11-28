import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet, View } from 'react-native'
import { useRouter } from 'expo-router'
import Post from '@/components/Post'
import TopNavBar from '@/components/TopNavBar'
const HomePage = () => {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.container}>
      <TopNavBar
        imageUrl={`https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D`}
        hasUnreadNotifications
        onProfilePress={() => router.push('/user/profile')}
        onNotificationPress={() => router.push('/user/notificaion')}
        onSettingsPress={() => router.push('/user/settings')}
      />
      <View style={styles.post_content} >
        <Post isHorizontal={true} limit={5}/>
      </View>
      
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827', gap:'5' },
  post_content: {
    margin:'2'
  },
})

export default HomePage