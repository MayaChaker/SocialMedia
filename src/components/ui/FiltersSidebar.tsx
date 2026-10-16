import type { ReactNode } from "react";
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
  /** Radio for single choice, checkbox for several (brands). */
  multiple: boolean;
  onChange: (selected: string[]) => void;
}

interface FiltersSidebarProps {
  groups: FilterGroup[];
  /** Shown above the filters, e.g. the category's types as links. */
  intro?: ReactNode;
  /** Shown when any filter is in use. */
  onClear?: () => void;
}

/**
 * The listing filters: each group is a closed accordion until it is opened or in use, so
 * the column stays short. Beside the grid on desktop; the same component sits in a drawer
 * on phones.
 */
export default function FiltersSidebar({ groups, intro, onClear }: FiltersSidebarProps) {
  const inUse = groups.some((group) => group.selected.length > 0);
  return (
    <div className={styles.sidebar}>
      {intro}
      {groups.map((group) => {
        const options = group.options.filter(
          (option) => option.count > 0 || group.selected.includes(option.value),
        );
        if (!options.length) return null;
        return (
          <details key={group.id} className={styles.group} open={group.selected.length > 0}>
            <summary>
              {group.legend}
              {group.selected.length > 0 && (
                <span className={styles.selected}>{group.selected.length}</span>
              )}
            </summary>
            <fieldset className={styles.options}>
              <legend className="srOnly">{group.legend}</legend>
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
          </details>
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
