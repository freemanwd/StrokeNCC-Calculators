import type { ScoreItem } from "../types";

interface Props {
  item: ScoreItem;
  index?: number;
  selected: number | undefined;
  onSelect: (value: number) => void;
}

export function OptionGroup({ item, index, selected, onSelect }: Props) {
  const pointsRange = describeRange(item);
  return (
    <div className="item">
      <div className="item-head">
        <div className="item-title">
          {index != null && <span className="num">{index}.</span>}
          {item.title}
        </div>
        {pointsRange && <div className="item-points">{pointsRange}</div>}
      </div>
      {item.help && <p className="item-help">{item.help}</p>}
      <div
        className={
          item.layout === "horizontal" ? "options horizontal" : "options"
        }
        role="radiogroup"
        aria-label={item.title}
      >
        {item.options.map((opt) => {
          const isSelected = selected === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={isSelected ? "option selected" : "option"}
              onClick={() => onSelect(opt.value)}
            >
              <span className="option-label">
                <span>{opt.label}</span>
                {opt.description && (
                  <span className="option-desc">{opt.description}</span>
                )}
              </span>
              <span className="option-pts">
                {opt.value > 0 ? `+${opt.value}` : opt.value}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function describeRange(item: ScoreItem): string | null {
  const values = item.options.map((o) => o.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) return null;
  return `${min} to ${max} pts`;
}
