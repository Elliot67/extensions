import { Form, ActionPanel, Action, showToast } from "@raycast/api";
import { useRef, useState } from "react";
import got from "got";
import { extensionPreferences } from "./preferences";
import { CreateDraftValues } from "./types";

const Command = () => {
  const textAreaRef = useRef<Form.TextArea>(null);
  const [shareOptions, setShareOptions] = useState<string>();

  async function handleSubmit(values: CreateDraftValues) {
    showToast({ title: "Submitting to Typefully", message: "We've submitted your draft to Typefully." });

    const data: Record<string, unknown> = {
      content: values.content,
      threadify: values.threadify,
    };

    if (values.share_options == "schedule-share") {
      data["schedule-date"] = values.schedule_date;
    }

    if (values.share_options == "schedule-next-free-slot") {
      data["schedule-date"] = "next-free-slot";
    }

    try {
      await got
        .post("https://api.typefully.com/v1/drafts/", {
          json: data,
          headers: {
            "X-API-KEY": `Bearer ${extensionPreferences.token}`,
          },
        })
        .json();
    } catch (error) {
      showToast({ title: "Whoops!", message: "Something went wrong while submitting to Typefully." });
    }

    textAreaRef.current?.reset();
    showToast({ title: "Submitted to Typefully", message: "Your draft made it to Typefully! 🥳" });
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextArea
        ref={textAreaRef}
        id="content"
        title="Draft 🪶"
        autoFocus={true}
        placeholder="Craft your next communication"
      />
      <Form.Separator />
      <Form.Dropdown id="share_options" title="Schedule" onChange={setShareOptions}>
        <Form.Dropdown.Item value="save-as-draft" title="Save as draft" />
        <Form.Dropdown.Item value="schedule-share" title="Schedule" />
        <Form.Dropdown.Item value="schedule-next-free-slot" title="Schedule to next free slot" />
      </Form.Dropdown>
      <Form.Checkbox id="threadify" title="Threadify?" label="Automatically split long threads into multiple tweets?" />
      {shareOptions == "schedule-share" && (
        <Form.DatePicker type={Form.DatePicker.Type.DateTime} id="schedule_date" title="Date picker" />
      )}
    </Form>
  );
};

export default Command;
