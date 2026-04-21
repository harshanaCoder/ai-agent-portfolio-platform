"use client";

import { Activity, Battery, Cpu, Radio, ThermometerSun, TimerReset } from "lucide-react";
import { useEffect, useState } from "react";

import type { TelemetryPreset } from "@/lib/mainData";
import { clamp } from "@/lib/utils";

type TelemetryPanelProps = {
  preset: TelemetryPreset;
};

type TelemetryState = TelemetryPreset;

const telemetryIcons = {
  battery: Battery,
  cpu: Cpu,
  signal: Radio,
  temperature: ThermometerSun,
  latency: TimerReset
} as const;

const telemetryKeys = Object.keys(telemetryIcons) as Array<keyof TelemetryState>;

const telemetryLabels: Record<keyof TelemetryState, string> = {
  battery: "Battery",
  cpu: "CPU load",
  signal: "Signal",
  temperature: "Board temp",
  latency: "Latency"
};

export function TelemetryPanel({ preset }: TelemetryPanelProps) {
  const [telemetry, setTelemetry] = useState<TelemetryState>(preset);

  useEffect(() => {
    setTelemetry(preset);

    const interval = window.setInterval(() => {
      setTelemetry((current: TelemetryState) => ({
        battery: clamp(current.battery + (Math.random() - 0.62) * 2.2, 48, 100),
        cpu: clamp(current.cpu + (Math.random() - 0.5) * 6, 14, 92),
        signal: clamp(current.signal + (Math.random() - 0.5) * 3, 51, 100),
        temperature: clamp(current.temperature + (Math.random() - 0.45) * 1.4, 21, 74),
        latency: clamp(current.latency + (Math.random() - 0.5) * 4, 8, 40)
      }));
    }, 1400);

    return () => window.clearInterval(interval);
  }, [preset]);

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
      {telemetryKeys.map((key) => {
        const Icon = telemetryIcons[key];
        const rawValue = telemetry[key];
        const value = key === "latency" || key === "temperature" ? `${Math.round(rawValue)}` : `${Math.round(rawValue)}%`;
        const meter = key === "latency" ? 100 - rawValue * 2 : rawValue;

        return (
          <div key={key} className="glass-panel panel-highlight rounded-[1.5rem] p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-cyan-200">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">{telemetryLabels[key]}</p>
                  <p className="text-lg font-semibold text-white">{value}{key === "latency" ? " ms" : key === "temperature" ? " C" : ""}</p>
                </div>
              </div>
              <Activity className="h-4 w-4 text-cyan-200/70" />
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 transition-[width] duration-700"
                style={{ width: `${clamp(meter, 8, 100)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}