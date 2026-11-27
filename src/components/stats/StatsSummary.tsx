import { LevelStats } from "@app/types";
import { formatTime } from "@app/utils";

interface Props {
  stats: LevelStats;
}

const formatStreak = (streak: number) => {
  if (streak > 0) return `${streak} win${streak > 1 ? "s" : ""}`;
  if (streak < 0) return `${-streak} loss${streak < -1 ? "es" : ""}`;
  return "—";
};

const getStreakColor = (streak: number) => {
  if (streak > 0) return "text-success";
  if (streak < 0) return "text-error";
  return "text-(--label-secondary)";
};

const StatTile = ({
  label,
  value,
  color,
}: {
  label: string;
  value: React.ReactNode;
  color?: string;
}) => (
  <div
    className="stat-tile"
    style={color ? ({ "--tile-color": color } as React.CSSProperties) : {}}
  >
    <span className="text-xs font-medium opacity-80">{label}</span>
    <span className="text-3xl font-bold font-rounded tabular-nums">
      {value}
    </span>
  </div>
);

const StatRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="list-row">
    <dt>{label}</dt>
    <dd className="font-semibold font-rounded tabular-nums">{children}</dd>
  </div>
);

export const StatsSummary: React.FC<Props> = ({ stats }) => {
  const winRate = stats.played
    ? Math.round((stats.won / stats.played) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatTile label="Played" value={stats.played} />
        <StatTile
          label="Won"
          value={stats.won}
          color="var(--color-success)"
        />
        <StatTile
          label="Lost"
          value={stats.played - stats.won}
          color="var(--color-error)"
        />
        <StatTile
          label="Win rate"
          value={`${winRate}%`}
          color="var(--color-info)"
        />
      </div>
      <section>
        <h4 className="list-header">Streaks</h4>
        <dl className="list-group">
          <StatRow label="Current streak">
            <span className={getStreakColor(stats.currentStreak)}>
              {formatStreak(stats.currentStreak)}
            </span>
          </StatRow>
          <StatRow label="Longest winning streak">
            <span className="text-success">{stats.longestWinStreak}</span>
          </StatRow>
          <StatRow label="Longest losing streak">
            <span className="text-error">{stats.longestLossStreak}</span>
          </StatRow>
        </dl>
      </section>
      <section>
        <h4 className="list-header">Best times</h4>
        {stats.bestTimes.length ? (
          <ol className="list-group">
            {stats.bestTimes.map(({ time, date }, index) => (
              <li key={date} className="list-row">
                <span className="flex items-baseline gap-3">
                  <span className="w-4 text-sm text-(--label-secondary) tabular-nums">
                    {index + 1}
                  </span>
                  <span className="font-semibold font-rounded tabular-nums">
                    {formatTime(time)}
                  </span>
                </span>
                <span className="text-sm text-(--label-secondary)">
                  {new Date(date).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <div className="list-group">
            <p className="list-row text-(--label-secondary)">No wins yet.</p>
          </div>
        )}
      </section>
    </div>
  );
};
