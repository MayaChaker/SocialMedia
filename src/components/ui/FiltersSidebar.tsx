import { Check } from "./Field";
import styles from "./FiltersSidebar.module.css";

export interface FilterOption {
  value: string;
  label: string;
  /** How many products match; options with none are hidden. */
  count: number;
}

export interface FilterGroup {
  id: string;
  legend: string;
  options: FilterOption[];
  selected: string[];
  /** Radio for single choice (category), checkbox for several (brands). */
  multiple: boolean;
  onChange: (selected: string[]) => void;
}

interface FiltersSidebarProps {
  groups: FilterGroup[];
  /** Shown when any filter is in use. */
  onClear?: () => void;
}

/**
 * The listing filters. A column beside the grid on desktop; the same component is
 * placed in a Drawer on phones, so both always show the same filters.
 */
export default function FiltersSidebar({ groups, onClear }: FiltersSidebarProps) {
  const inUse = groups.some((group) => group.selected.length > 0);
  return (
    <div className={styles.sidebar}>
      {groups.map((group) => {
        const options = group.options.filter(
          (option) => option.count > 0 || group.selected.includes(option.value),
        );
        if (!options.length) return null;
        return (
          <fieldset key={group.id} className={styles.group}>
            <legend className="text-label">{group.legend}</legend>
            {options.map((option) => {
              const checked = group.selected.includes(option.value);
              return (
                <Check
                  key={option.value}
                  type={group.multiple ? "checkbox" : "radio"}
                  name={group.id}
                  value={option.value}
                  label={option.label}
                  count={option.count}
                  checked={checked}
                  onChange={() =>
                    group.onChange(
                      group.multiple
                        ? checked
                          ? group.selected.filter((value) => value !== option.value)
                          : [...group.selected, option.value]
                        : [option.value],
                    )
                  }
                />
              );
            })}
          </fieldset>
        );
      })}
      {inUse && onClear && (
        <button type="button" className={styles.clear} onClick={onClear}>
          Clear all filters
        </button>
      )}
    </div>
  );
}
