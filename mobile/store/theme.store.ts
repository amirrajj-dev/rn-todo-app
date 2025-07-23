import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ThemeStore {
    theme : "light" | "dark";
    setTheme: (theme: "light" | "dark") => void;
}

export const useTheme = create<ThemeStore>((set , get)=>({
    theme : "dark" ,
    setTheme : async (theme)=>{
        await AsyncStorage.setItem("theme",theme);
        set({theme})
    }
}))