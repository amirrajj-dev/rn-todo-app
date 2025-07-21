import AsyncStorage from "@react-native-async-storage/async-storage";

// Store tokens in AsyncStorage
const setTokens = async (
  accessToken: string,
  refreshToken: string
): Promise<void> => {
  try {
    await AsyncStorage.setItem("accessToken", accessToken);
    await AsyncStorage.setItem("refreshToken", refreshToken);
  } catch (error) {
    console.error("Error storing tokens:", error);
  }
};

// Clear tokens from AsyncStorage
const clearTokens = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
  } catch (error) {
    console.error("Error clearing tokens:", error);
  }
};

export { setTokens, clearTokens};