import { View, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

type Props = {
  imageUrl?: string | null
  onProfilePress?: () => void
  onNotificationPress?: () => void
  onSettingsPress?: () => void
  hasUnreadNotifications?: boolean
}

const TopNavBar = ({
  imageUrl,
  onProfilePress,
  onNotificationPress,
  onSettingsPress,
  hasUnreadNotifications = false,
}: Props) => {
  return (
    <View style={styles.container}>
      {/* Left: profile image */}
      <TouchableOpacity onPress={onProfilePress} activeOpacity={0.7}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Ionicons name="person" size={20} color="#9CA3AF" />
          </View>
        )}
      </TouchableOpacity>

      {/* Right: notification + settings */}
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={onNotificationPress}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={24} color="white" />
          {hasUnreadNotifications && <View style={styles.badge} />}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSettingsPress}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20, // width/height-oda half = circle
    borderWidth: 1.5,
    borderColor: '#374151',
  },
  avatarFallback: {
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#EF4444',
  },
})

export default TopNavBar