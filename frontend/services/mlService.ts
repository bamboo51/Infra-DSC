// Service to send the data to Django Backend
import { API_URL } from "@/constants/constant";
import { ApiResponse, PhotoWithResults } from "@/types/api";
import { Coords } from "@/types/coords";
import axios from "axios";

export const ApiService = {
  async predict(imageFile: File, coords: Coords | null): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append("image", imageFile);
    if (coords) {
      formData.append("latitude", coords.latitude.toString());
      formData.append("longitude", coords.longitude.toString());
    }
    console.log(API_URL);

    const response = await axios.post<ApiResponse>(
      `${API_URL}/predict/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },
};

export const fetchPhotoFromDB = async (): Promise<PhotoWithResults[]> => {
  try {
    const response = await axios.get<PhotoWithResults[]>(`${API_URL}/results/`);

    return response.data;
  } catch (error) {
    console.error("Error fetching photo results from the database:", error);
    throw new Error("Could not fetch data from the server.");
  }
};
