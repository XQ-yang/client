import request from '@/libs/request'

export const getFileList = () => {
  return request.get("/aliyunoss/toDownload")
}
