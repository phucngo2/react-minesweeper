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

const getStreakBadge = (streak: number) => {
  if (streak > 0) return "badge-success";
  if (streak < 0) return "badge-error";
  return "badge-ghost";
};

const STAT_CARD = "stat px-4 py-3 rounded-box border-none";
const STAT_TITLE = "stat-title text-base text-inherit opacity-80";
const STAT_VALUE = "stat-value text-3xl";

export const StatsSummary: React.FC<Props> = ({ stats }) => {
  const winRate = stats.played
    ? Math.round((stats.won / stats.played) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className={`${STAT_CARD} bg-neutral text-neutral-content`}>
          <div className={STAT_TITLE}>Played</div>
          <div className={STAT_VALUE}>{stats.played}</div>
        </div>
        <div className={`${STAT_CARD} bg-success text-success-content`}>
          <div className={STAT_TITLE}>Won</div>
          <div className={STAT_VALUE}>{stats.won}</div>
        </div>
        <div className={`${STAT_CARD} bg-error text-error-content`}>
          <div className={STAT_TITLE}>Lost</div>
          <div className={STAT_VALUE}>{stats.played - stats.won}</div>
        </div>
        <div className={`${STAT_CARD} bg-info text-info-content`}>
          <div className={STAT_TITLE}>Win rate</div>
          <div className={STAT_VALUE}>{winRate}%</div>
        </div>
      </div>
      <table className="table table-sm leading-5">
        <thead className="sr-only">
          <tr>
            <th scope="col">Statistic</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row" className="font-normal">
              Current streak
            </th>
            <td className="text-right">
              <span
                className={`badge h-5 font-semibold ${getStreakBadge(stats.currentStreak)}`}
              >
                {formatStreak(stats.currentStreak)}
              </span>
            </td>
          </tr>
          <tr>
            <th scope="row" className="font-normal">
              Longest winning streak
            </th>
            <td className="text-right">
              <span className="h-5 font-semibold badge badge-success">
                {stats.longestWinStreak}
              </span>
            </td>
          </tr>
          <tr>
            <th scope="row" className="font-normal">
              Longest losing streak
            </th>
            <td className="text-right">
              <span className="h-5 font-semibold badge badge-error">
                {stats.longestLossStreak}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div>
        <div className="mb-1 font-semibold">Best times</div>
        {stats.bestTimes.length ? (
          <ol className="pl-6 list-decimal">
            {stats.bestTimes.map(({ time, date }) => (
              <li key={date} className="tabular-nums">
                {formatTime(time)}{" "}
                <span className="text-sm opacity-60">
                  {new Date(date).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm opacity-60">No wins yet.</p>
        )}
      </div>
    </div>
  );
};
