// Service to send the data to Django Backend
import { API_URL } from "@/constants/constant";
import {
  PhotoWithResults,
  PaginatedPhotoList,
  ApiResponse,
} from "@/types/api";
import { Coords } from "@/types/coords";
import axios from "axios";

export const ApiService = {
  async predict(
    imageFile: File,
    coords: Coords | null
  ): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append("image", imageFile);
    if (coords) {
      formData.append("latitude", coords.latitude.toString());
      formData.append("longitude", coords.longitude.toString());
    }

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

  async fetchPhotoList(url: string = `${API_URL}/photos/`): Promise<PaginatedPhotoList> {
    try {
      const response = await axios.get<PaginatedPhotoList>(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching photo list:", error);
      throw new Error("Could not fetch photo list");
    }
  },

  async fetchPhotoDetails(photoId: number): Promise<PhotoWithResults> {
    try {
      const response = await axios.get<PhotoWithResults>(`${API_URL}/photos/${photoId}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching photo details:", error);
      throw new Error("Could not fetch photo details");
    }
  },
};
