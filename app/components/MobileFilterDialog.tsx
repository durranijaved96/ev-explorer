"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
  XMarkIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

type Option = { value: string; label: string };

export default function MobileFiltersDialog({
  values,
  onApply,
  onReset,
  conditionOpts,
  drivetrainOpts,
  sortOpts,
  dirOpts,
}: {
  values: { condition: string; drivetrain: string; sort: string; dir: string };
  onApply: (next: { condition: string; drivetrain: string; sort: string; dir: string }) => void;
  onReset: () => void;
  conditionOpts: Option[];
  drivetrainOpts: Option[];
  sortOpts: Option[];
  dirOpts: Option[];
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(values);

  const setField = (k: keyof typeof form, v: string) =>
    setForm((s) => ({ ...s, [k]: v }));

  // re-sync when dialog re-opens with fresh values
  const onOpenChange = (o: boolean) => {
    setOpen(o);
    if (o) setForm(values);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="
            sm:hidden inline-flex items-center gap-2
            rounded-xl border border-neutral-300/70 dark:border-neutral-700/70
            bg-white/80 dark:bg-neutral-900/80 backdrop-blur
            px-3 h-11 text-sm font-medium
            hover:bg-neutral-100/70 dark:hover:bg-neutral-800/70
            transition
          "
          aria-label="Open filters"
        >
          <AdjustmentsHorizontalIcon className="w-5 h-5" />
          Filters
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay className="fixed inset-0 bg-black/30 data-[state=open]:animate-fadeIn" />

        {/* Content – bottom sheet style on mobile, still centered-friendly */}
        <Dialog.Content
          className="
            fixed inset-x-0 bottom-0 sm:inset-0 sm:m-auto
            sm:max-w-lg
            rounded-t-2xl sm:rounded-2xl
            bg-white dark:bg-neutral-900
            border border-neutral-200 dark:border-neutral-800
            shadow-2xl
            p-4 sm:p-5
            data-[state=open]:animate-slideUp
            max-h-[90vh] overflow-auto
          "
        >
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-base font-semibold">Filters</Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close"
                className="rounded-full p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Form */}
          <div className="mt-3 space-y-4">
            <Field
              label="Condition"
              value={form.condition}
              onChange={(v) => setField("condition", v)}
              options={conditionOpts}
            />
            <Field
              label="Drivetrain"
              value={form.drivetrain}
              onChange={(v) => setField("drivetrain", v)}
              options={drivetrainOpts}
            />
            <Field
              label="Sort"
              value={form.sort}
              onChange={(v) => setField("sort", v)}
              options={sortOpts}
            />
            <Field
              label="Direction"
              value={form.dir}
              onChange={(v) => setField("dir", v)}
              options={dirOpts}
            />
          </div>

          {/* Footer actions */}
          <div className="sticky bottom-0 -mx-4 sm:-mx-5 mt-4 border-t border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur px-4 sm:px-5 py-3 flex gap-2">
            <button
              type="button"
              onClick={() => {
                onReset();
                setOpen(false);
              }}
              className="flex-1 h-11 rounded-xl border border-neutral-300/70 dark:border-neutral-700/70
                         bg-transparent text-sm font-medium
                         hover:bg-neutral-100/70 dark:hover:bg-neutral-800/70 transition"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => {
                onApply(form);
                setOpen(false);
              }}
              className="flex-1 h-11 rounded-xl bg-[#00A5AA] text-white text-sm font-semibold
                         hover:bg-[#009095] transition"
            >
              Apply
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Field({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const id = `mf-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <label htmlFor={id} className="block">
      <div className="text-[11px] leading-4 opacity-70 mb-1">{label}</div>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 rounded-xl border
                   bg-white/70 dark:bg-neutral-900/70 backdrop-blur
                   border-neutral-300/70 dark:border-neutral-700/70
                   px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/60"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
