import { ref } from 'vue'
import { LocalStorageService } from '@/services/localStorageService'
import { UserService } from '@/services/api/userService'
import { getConfig } from '@/config/config'

const username = ref(LocalStorageService.getUsername() ?? '')

export function useUser() {
  const serverUrl = LocalStorageService.getServerUrl() ?? getConfig().defaultServerUrl ?? ''
  const userService = new UserService(serverUrl)

  const setUsername = (newName: string) => {
    const trimmed = newName.trim()
    if (trimmed.length >= 3 && trimmed.length <= 20) {
      username.value = trimmed
      LocalStorageService.setUsername(trimmed)
    }
  }

  const initializeUser = async () => {
    if (!username.value) {
      await userService.generateName((data) => {
        setUsername(data.username)
      })
    }
  }

  return {
    username,
    setUsername,
    initializeUser,
  }
}
