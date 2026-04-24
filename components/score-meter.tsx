type ScoreMeterProps = {
  score: number;
};

export function ScoreMeter({ score }: ScoreMeterProps) {
  return (
    <div className="rounded-[2rem] border border-black/8 bg-[#fbfaf8] p-5">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate/80">Score</p>
          <p className="font-serif text-5xl leading-none text-ink">{score}</p>
        </div>
        <p className="pb-1 text-sm text-slate">de 100</p>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-black/7">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#cfc4b3] via-[#a67c52] to-[#111111] transition-all duration-700"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
