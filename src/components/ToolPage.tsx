import { useId, type ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { APP_STORE_URL } from '../config';

/** Shared building blocks for the free tools under /tools. */

export type ToolSource = { label: string; url: string };

export function SourceLink({ source, children }: { source: ToolSource; children: ReactNode }) {
  return (
    <a href={source.url} className="link" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export function ToolHero({
  crumb,
  title,
  children,
}: {
  crumb: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="tool-hero-band">
      <div className="tool-hero">
        <nav aria-label="Breadcrumb" className="tool-breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{crumb}</span>
        </nav>
        <div className="tool-eyebrow">Free tool · No signup</div>
        <h1>{title}</h1>
        <p>{children}</p>
      </div>
    </div>
  );
}

export function ToolCta({
  toolName,
  heading,
  children,
  label,
}: {
  /** Analytics identifier, e.g. `water_change_calculator`. */
  toolName: string;
  heading: string;
  children: ReactNode;
  label: string;
}) {
  const headingId = useId();

  return (
    <aside className="tool-cta" aria-labelledby={headingId}>
      <h2 id={headingId}>{heading}</h2>
      <p>{children}</p>
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          window.gtag?.('event', 'tool_cta_click', { tool_name: toolName, cta_type: 'app_store' })
        }
      >
        {label}
      </a>
    </aside>
  );
}

export function ToolSources({
  sources,
  lastReviewed,
  note,
}: {
  sources: ToolSource[];
  lastReviewed: string;
  note?: string;
}) {
  return (
    <>
      <h2>Sources</h2>
      <p className="tool-reviewed">
        Last reviewed{' '}
        <time dateTime={lastReviewed}>
          {new Date(`${lastReviewed}T00:00:00`).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </time>
        .{note && ` ${note}`}
      </p>
      <ol className="tool-sources">
        {sources.map((source) => (
          <li key={source.url}>
            <SourceLink source={source}>{source.label}</SourceLink>
          </li>
        ))}
      </ol>
    </>
  );
}

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  const labelId = useId();

  return (
    <div className="tool-field">
      <span className="tool-label" id={labelId}>
        {label}
      </span>
      <div className="tool-segmented is-block" role="radiogroup" aria-labelledby={labelId}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={value === option.value}
            className={value === option.value ? 'is-active' : undefined}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function NumberField({
  id,
  label,
  value,
  suffix,
  error,
  help,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  suffix: string;
  error?: string;
  help?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="tool-field">
      <label htmlFor={id}>{label}</label>
      <div className={`tool-input${error ? ' has-error' : ''}`}>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={error || help ? `${id}-help` : undefined}
          onChange={(event) => onChange(event.target.value)}
        />
        <span aria-hidden="true">{suffix}</span>
      </div>
      {(error || help) && (
        <small id={`${id}-help`} className={error ? 'is-error' : undefined}>
          {error ?? help}
        </small>
      )}
    </div>
  );
}
