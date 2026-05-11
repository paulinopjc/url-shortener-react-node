import client from './client'
import { Url, ClickStats, CreateUrlInput, ApiResponse } from '../types'

export const fetchUrls = async (): Promise<Url[]> => {
  const { data } = await client.get<ApiResponse<Url[]>>('/urls')
  return data.data
}

export const fetchUrl = async (id: number): Promise<Url> => {
  const { data } = await client.get<ApiResponse<Url>>(`/urls/${id}`)
  return data.data
}

export const createUrl = async (input: CreateUrlInput): Promise<Url> => {
  const { data } = await client.post<ApiResponse<Url>>('/urls', input)
  return data.data
}

export const deleteUrl = async (id: number): Promise<void> => {
  await client.delete(`/urls/${id}`)
}

export const fetchClicks = async (id: number): Promise<ClickStats> => {
  const { data } = await client.get<ApiResponse<ClickStats>>(`/urls/${id}/clicks`)
  return data.data
}
