// Service to send the data to Django Backend
import { API_URL } from "@/constants/constant";
import { ApiResponse } from "@/types/api";
import { Coords } from "@/types/coords";
import axios from "axios";

export const ApiService = {
  async predict(imageFile: File, coords?: Coords): Promise<ApiResponse>{
    const formData = new FormData();
    formData.append("image", imageFile);
    if(coords){
      formData.append("latitude", coords.latitude.toString());
      formData.append("longitude", coords.longitude.toString());
    }
    console.log(API_URL);

    const response = await axios.post<ApiResponse>(
      API_URL,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  }
};