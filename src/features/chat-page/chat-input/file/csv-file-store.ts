"use client";

import {
  showError,
  showSuccess,
} from "@/features/globals/global-message-store";
import { proxy, useSnapshot } from "valtio";
import { chatStore } from "../../chat-store";

class CsvFileStore {
  public uploadButtonLabel: string = "";

  public async fileUpload(formData: FormData) {
    chatStore.updateLoading("file upload");

    /** @todo change to env variable. */
    fetch("https://foundation-azurechat-api.azurewebsites.net/upload_loss_file", {
      method: "POST",
      body: formData,
      headers: {
        "Accept": "application/json",
      }
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("File upload error");
    })
    .then(data => {
      // console.log("File uploaded successfully:", data);
      showSuccess({
        title: "File upload",
        description: `${data.file} uploaded successfully.`,
      })
    })
    .catch(error => {
      // console.error("Error uploading file:", error);
      showError("Error uploading file.")
    })
    .finally(() => {
      chatStore.updateLoading("idle");
    });
  }

  public async onFileChange(props: {
    formData: FormData;
    chatThreadId?: string;
    completionFn?: () => void;
  }) {
    const { formData, chatThreadId, completionFn } = props;

    try {
      chatStore.updateLoading("file upload");

      this.uploadButtonLabel = "Processing document";

      this.fileUpload(formData);

    } catch (error) {
      showError("" + error);
    } finally {
      completionFn?.();
      this.uploadButtonLabel = "";
      chatStore.updateLoading("idle");
    }
  }
}

export const csvFileStore = proxy(new CsvFileStore());

export function useCsvFileStore() {
  return useSnapshot(csvFileStore);
}
