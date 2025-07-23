import * as SecureStore from "expo-secure-store";

const setTokens = async (
  accessToken: string,
  refreshToken: string
): Promise<void> => {
  try {
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);
  } catch (error) {
    console.error("Error storing tokens:", error);
  }
};

const clearTokens = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
  } catch (error) {
    console.error("Error clearing tokens:", error);
  }
};

export const getTokens = async (): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  try {
    const accessToken = (await SecureStore.getItemAsync(
      "accessToken"
    )) as string;
    const refreshToken = (await SecureStore.getItemAsync(
      "refreshToken"
    )) as string;
    return { accessToken, refreshToken };
  } catch {
    return { accessToken: "", refreshToken: "" };
  }
};

export { setTokens, clearTokens };
