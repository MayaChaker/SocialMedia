interface ChoiceRowProps {
  name: string;
  legend: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  /** Optional colour per option, shown as a chip before the label. */
  swatches?: Record<string, string>;
  /** Optional one-line description per option. */
  hints?: Record<string, string>;
}

/** One consultation question: a native radio group styled as a row of hairline chips. */
export default function ChoiceRow({
  name,
  legend,
  options,
  value,
  onChange,
  swatches,
  hints,
}: ChoiceRowProps) {
  return (
    <fieldset className="pgChoices">
      <legend>{legend}</legend>
      <div className="pgChoiceList">
        {options.map((option) => (
          <label key={option} className="pgChoice" title={hints?.[option]}>
            <input
              type="radio"
              name={name}
              value={option}
              checked={option === value}
              onChange={() => onChange(option)}
            />
            <span className="pgChoiceFace">
              {swatches?.[option] && (
                <span className="pgChoiceSwatch" style={{ background: swatches[option] }} />
              )}
              {option}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
