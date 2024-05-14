import { Paperclip } from "lucide-react";
import { useRef } from "react";
import { Button } from "../../button";

interface AttachFileProps {
  onClick: (formData: FormData) => void;
  icon?: React.ReactNode;
  formDataField?: string;
}

export const AttachFile: React.FC<AttachFileProps> = ({
  onClick,
  icon = <Paperclip size={16} />,
  formDataField = "file",
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    // Trigger the file input click event
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Create a FormData object and append the selected file
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append(formDataField, file);
      onClick(formData);
      event.target.value = "";
    }
  };

  return (
    <>
      <Button size="icon" variant={"ghost"} onClick={handleClick} type="button" aria-label="Attach file to chat">
        {icon}
      </Button>
      {/* This file input is hidden, and opens when the Button is clicked */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </>
  );
};
