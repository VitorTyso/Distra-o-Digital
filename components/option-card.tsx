type OptionCardProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

export function OptionCard({ label, selected, onClick }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group w-full rounded-[1.6rem] border px-5 py-5 text-left transition-all duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20",
        selected
          ? "border-ink bg-ink text-white shadow-soft"
          : "border-black/8 bg-white/70 text-ink hover:-translate-y-0.5 hover:border-black/20 hover:bg-white hover:shadow-soft",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-[15px] leading-6 md:text-base">{label}</span>
        <span
          className={[
            "h-5 w-5 rounded-full border transition-all duration-300",
            selected
              ? "border-white bg-white"
              : "border-black/20 bg-transparent group-hover:border-black/30",
          ].join(" ")}
        />
      </div>
    </button>
  );
}
