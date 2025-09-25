import { BacktestingEngine } from "@/components/backtesting/BacktestingEngine";

export default function BacktestingPage() {
  return (
    <div className="flex-1 flex items-start justify-center py-8">
      <BacktestingEngine />
    </div>
  );
}
