import {ref} from 'vue';
import FsClient from './fs-client';

export const uploadingItems = ref([])
export const showFileUploadProgressDialog = ref(false)

/**
 * Upload file
 * @param files {[File]} selected files
 * @return {[Promise<any>]} promise contain the results
 */
export function uploadFile(files) {
  const uploadProgress = []
  for (const file of files) {
    uploadProgress.push(new Promise((resolve, reject) => {
      showFileUploadProgressDialog.value = true
      uploadingItems.value.push(FsClient.uploadFile(file, {
        uploadCompletedCallback: async response => resolve(response.data),
        uploadProgressCallback: console.log
      }))
    }))
  }
  return uploadProgress;
}

export function clearUploadingItems() {
  uploadingItems.value = []
}

export function cancelAllUploads() {
  uploadingItems.value.forEach(uploadItem => uploadItem.value.cancel())
}

export function cancelUpload(uploadItem) {
  if (isRef(uploadItem))
    uploadItem = uploadItem.value

  const itemIndex = uploadingItems.value.findIndex(item => item.value.key === uploadItem.key)

  if (itemIndex >= 0)
    uploadingItems.value.splice(itemIndex, 1)

  if (uploadItem.inProgress)
    uploadItem.cancel()
}
