import { Check } from "@mui/icons-material";

interface ChoiceGroupProps {
  legend: string;
  values: string[];
  selected: string[];
  onToggle: (value: string) => void;
}

/** A fieldset of toggle buttons for picking several values. */
export default function ChoiceGroup({ legend, values, selected, onToggle }: ChoiceGroupProps) {
  return (
    <fieldset>
      <legend>{legend}</legend>
      <div>
        {values.map((value) => (
          <button
            type="button"
            className={selected.includes(value) ? "selected" : ""}
            onClick={() => onToggle(value)}
            key={value}
          >
            {selected.includes(value) && <Check />}
            {value}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
