import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isSending: boolean;
  error?: string | null;
}

export function ChatInput({ onSendMessage, isSending, error }: ChatInputProps) {
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.trim() === "" || isSending) return;

    try {
      await onSendMessage(newMessage);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <>
      {error && (
        <div className="p-2 text-center text-red-600 bg-red-100 border-b border-red-200">
          {error}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t bg-background flex items-center gap-2"
      >
        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Message"
          className="grow"
          disabled={isSending}
          autoComplete="off"
        />
        <Button
          type="submit"
          size="icon"
          disabled={isSending || newMessage.trim() === ""}
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </>
  );
}
