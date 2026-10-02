import { PRIVACY_POLICY_URL } from '../config';
import type { ReactNode } from 'react';
import { Nav } from '../components/Nav';
import { MiniFooter } from '../components/Footer';

type Section = {
  title: string;
  content: ReactNode;
};

const updatedDate = 'June 22, 2026';

const pageIntroStyle: React.CSSProperties = {
  fontSize: 18,
  lineHeight: 1.6,
  color: 'var(--text-body)',
  margin: '18px 0 0',
  maxWidth: 680,
};

const noteStyle: React.CSSProperties = {
  fontSize: 14.5,
  lineHeight: 1.6,
  color: 'var(--text-muted)',
  background: 'var(--surface-sunken)',
  border: '1px solid var(--border-divider)',
  borderRadius: 'var(--radius-md)',
  padding: 18,
  margin: '0 0 32px',
};

function LegalPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: Section[];
}) {
  return (
    <>
      <Nav variant="inner" />

      <section style={{ background: 'var(--color-bg-gradient)', borderBottom: '1px solid var(--border-divider)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '72px 28px 56px' }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--teal-600)' }}>
            Legal
          </div>
          <h1 style={{ fontSize: 46, lineHeight: 1.08, fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--ocean-900)', margin: '16px 0 0' }}>
            {title}
          </h1>
          <p style={pageIntroStyle}>{intro}</p>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '18px 0 0' }}>
            Last updated: {updatedDate}
          </p>
        </div>
      </section>

      <main className="prose" style={{ maxWidth: 760, margin: '0 auto', padding: '56px 28px 88px' }}>
        <p style={noteStyle}>
          This page is a plain-English draft for Reef Keeper users. It is provided for
          transparency and should not be read as legal advice.
        </p>
        {sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            {section.content}
          </section>
        ))}
      </main>

      <MiniFooter />
    </>
  );
}

export function Privacy() {
  return <><Nav variant="inner" /><main className="prose" style={{ maxWidth: 760, margin: '0 auto', padding: '72px 28px' }}>
    <h1>Privacy Policy</h1>
    <p>Reef Keeper is covered by the Bear Trail privacy policy.</p>
    <p><a href={PRIVACY_POLICY_URL}>Read the current Bear Trail privacy policy →</a></p>
    <p>The policy includes information about the website and apps, service providers, and your choices.</p>
  </main><MiniFooter /></>;
}

export function Terms() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="These terms describe the rules for using Reef Keeper, including the website, app, and related content."
      sections={termsSections}
    />
  );
}

const termsSections: Section[] = [
  {
    title: 'Using Reef Keeper',
    content: (
      <p>
        Reef Keeper helps aquarists log aquarium readings, reminders, tasks, and related notes.
        You are responsible for the information you enter and for deciding how to act on it.
      </p>
    ),
  },
  {
    title: 'Aquarium care disclaimer',
    content: (
      <p>
        Reef Keeper provides tracking and educational tools, but it is not a substitute for
        professional, veterinary, or expert aquarium advice. Aquarium conditions can change
        quickly, and you are responsible for verifying readings, equipment, treatments, and care
        decisions before taking action.
      </p>
    ),
  },
  {
    title: 'Accounts, devices, and App Store terms',
    content: (
      <p>
        The app is distributed through the Apple App Store. Your download, purchase, device, and
        account relationship with Apple is governed by Apple&apos;s applicable terms. Reef Keeper
        may change, suspend, or discontinue features as the product evolves.
      </p>
    ),
  },
  {
    title: 'Acceptable use',
    content: (
      <p>
        Do not misuse Reef Keeper, interfere with the website or app, attempt unauthorized
        access, copy or reverse engineer parts of the service where prohibited by law, or use the
        service in a way that harms Reef Keeper, other users, or third-party systems.
      </p>
    ),
  },
  {
    title: 'Content and intellectual property',
    content: (
      <p>
        Reef Keeper&apos;s name, logos, design, website, app interface, and related content belong
        to Reef Keeper or its licensors. You keep responsibility for aquarium information and
        notes you enter, and you grant Reef Keeper the limited permission needed to operate the
        app features you choose to use.
      </p>
    ),
  },
  {
    title: 'No warranties and limitation of liability',
    content: (
      <p>
        Reef Keeper is provided as is and as available. To the extent allowed by law, we disclaim
        warranties and are not liable for indirect, incidental, special, consequential, or
        punitive damages, or for aquarium, livestock, equipment, or data losses resulting from
        your use of the service.
      </p>
    ),
  },
  {
    title: 'Changes to these terms',
    content: (
      <p>
        We may update these Terms as Reef Keeper changes. If you continue using the website or
        app after updates take effect, the updated Terms apply.
      </p>
    ),
  },
];
