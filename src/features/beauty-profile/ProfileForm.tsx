import { useState } from "react";
import { Check } from "@mui/icons-material";
import { useCustomer } from "../../hooks/useCustomer";
import type { BeautyProfile } from "../../types/customer";
import ChoiceGroup from "./ChoiceGroup";

const SKIN_TYPES = ["Balanced", "Dry", "Combination", "Oily", "Sensitive"];
const CONCERNS = ["Dehydration", "Dullness", "Sensitive skin", "Fine lines"];
const PREFERENCES = [
  "Natural coverage",
  "Fragrance-free feel",
  "Weightless textures",
  "Rich textures",
];

/** Edits a draft of the profile and saves it to the browser on demand. */
export default function ProfileForm() {
  const { profile, saveProfile } = useCustomer();
  const [draft, setDraft] = useState(profile);
  const [saved, setSaved] = useState(false);

  const toggle = (key: "skinGoals" | "preferences", value: string) =>
    setDraft((current: BeautyProfile) => {
      const values = current[key] || [];
      return {
        ...current,
        [key]: values.includes(value)
          ? values.filter((item) => item !== value)
          : [...values, value],
      };
    });

  const save = () => {
    saveProfile(draft);
    setSaved(true);
  };

  return (
    <section className="profileForm">
      <label>
        Skin type
        <select
          value={draft.skinType}
          onChange={(event) => setDraft({ ...draft, skinType: event.target.value })}
        >
          {SKIN_TYPES.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </label>
      <ChoiceGroup
        legend="Skin concerns"
        values={CONCERNS}
        selected={draft.skinGoals || []}
        onToggle={(value) => toggle("skinGoals", value)}
      />
      <ChoiceGroup
        legend="Makeup and texture preferences"
        values={PREFERENCES}
        selected={draft.preferences || []}
        onToggle={(value) => toggle("preferences", value)}
      />
      <button className="button dark" onClick={save}>
        {saved ? (
          <>
            <Check /> Profile saved
          </>
        ) : (
          "Save profile"
        )}
      </button>
      <p className="profileSaveStatus" role="status">
        {saved ? "Your browser-saved preferences are up to date." : ""}
      </p>
    </section>
  );
}
